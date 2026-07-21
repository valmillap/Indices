import pandas as pd
import numpy as np

def _a_binario(serie):
    numerico = pd.to_numeric(serie, errors="coerce")
    texto = serie.astype(str).str.strip().str.lower().map({"true": 1, "false": 0})
    return numerico.where(numerico.notna(), texto).fillna(0).astype(int)

def buscar_duplicado(df):
     # Ignorar filas sin ATRIBUTOS
    df = df[df["ATRIBUTOS"].fillna("").str.strip() != ""]

    # Buscar duplicados por TABLA + ATRIBUTOS
    duplicado = df[df.duplicated(subset=["TABLA", "ATRIBUTOS"],keep=False)]
    duplicado = duplicado.sort_values(["TABLA", "ATRIBUTOS", "INDICE"])

    # --- ORDEN FILAS POR PK- used pages
    duplicado["IS_PRIMARY_KEY_NUM"] = _a_binario(duplicado["IS_PRIMARY_KEY"])

    duplicado["USED-PAGES"] = pd.to_numeric(duplicado["USED-PAGES"],errors="coerce").fillna(0)

    duplicado["PESO_GRUPO"] = duplicado.groupby(["TABLA", "ATRIBUTOS"])["USED-PAGES"].transform("max")

    duplicado = duplicado.sort_values(by=["PESO_GRUPO", "TABLA", "ATRIBUTOS", "IS_PRIMARY_KEY"],
        ascending=[False,True,True,False])

    #duplicado.drop( columns=["IS_PRIMARY_KEY_NUM"], inplace=True)
    
    # COLUMNA
        # Convertir a numérico
    duplicado["IS_PRIMARY_KEY_NUM"] = _a_binario(duplicado["IS_PRIMARY_KEY"])

    duplicado["IS_UNIQUE_NUM"] = _a_binario(duplicado["IS_UNIQUE"])

    #----------
    # Cantidad de índices UNIQUE por grupo
    duplicado["UNIQUE_COUNT"] = (
        duplicado.groupby(["TABLA", "ATRIBUTOS"])["IS_UNIQUE_NUM"]
        .transform("sum")
    )
        # COLUMNA PK Y UNIQUE
    def regla(row):
        if row["IS_PRIMARY_KEY_NUM"] == 1 and row["IS_UNIQUE_NUM"] == 1:
            return "PK Y UNIQUE"
        if row["IS_PRIMARY_KEY_NUM"] == 1:
            return "PK"
        if row["IS_UNIQUE_NUM"] == 1:
            return "UNIQUE"
        return "INDEX"

    duplicado["TIPO"] = duplicado.apply(regla, axis=1)
    #----------

    # Valor por defecto
    duplicado["MANTENER"] = "Duplica"

    # PK siempre se mantiene
    duplicado.loc[
        duplicado["IS_PRIMARY_KEY_NUM"] == 1,
        "MANTENER"
    ] = "Unico"

    # UNIQUE se mantiene sólo si es el único UNIQUE del grupo
    duplicado.loc[
        (duplicado["IS_PRIMARY_KEY_NUM"] == 0)
        & (duplicado["IS_UNIQUE_NUM"] == 1)
        & (duplicado["UNIQUE_COUNT"] == 1),
        "MANTENER"
    ] = "Unico"
     # --- Nombre del índice que se mantiene por grupo ---
    # Si NINGÚN índice del grupo es PK ni UNIQUE (ej. dos índices NONCLUSTERED
    # comunes sobre las mismas columnas), hasta acá nadie quedó marcado
    # "Unico" y el join de abajo dejaría INDICE_REFERENCIA en NaN real para
    # todo el grupo -> rompe la respuesta JSON. En ese caso se usa el primer
    # índice del grupo (según el orden ya aplicado más arriba) como
    # referencia de respaldo, para que siempre haya un "ganador".
    tiene_unico = (
        duplicado.groupby(["TABLA", "ATRIBUTOS"])["MANTENER"]
        .transform(lambda s: (s == "Unico").any())
    )
    primero_del_grupo = ~duplicado.duplicated(subset=["TABLA", "ATRIBUTOS"], keep="first")
    duplicado.loc[~tiene_unico & primero_del_grupo, "MANTENER"] = "Unico"

    idx_unico = (
        duplicado[duplicado["MANTENER"] == "Unico"]
        .groupby(["TABLA", "ATRIBUTOS"])["INDICE"]
        .first()
        .rename("INDICE_REFERENCIA")
    )

    duplicado = duplicado.join(idx_unico, on=["TABLA", "ATRIBUTOS"])

    # --- MANTENER con nombre del índice que duplica ---
    duplicado["MANTENER"] = np.where(
        duplicado["MANTENER"] == "Duplica",
        "Duplica " + duplicado["INDICE_REFERENCIA"].fillna("").astype(str),
        duplicado["MANTENER"]
    )

    duplicado.drop(columns=["UNIQUE_COUNT", "IS_UNIQUE_NUM", "PESO_GRUPO"], inplace=True)


    duplicado["BENEFICIO"] = np.where(
    duplicado["MANTENER"].str.startswith("Duplica"),
    "Liberar " + duplicado["USED-PAGES"].round(2).astype(str) +
    "MB, - " + duplicado["USER_UPDATES"].astype(int).astype(str) + " ops. de escritura", "")
    
    duplicado.to_csv("AAAAduplicado.csv",sep=";",index=False)
    return duplicado
'''
def main():
    df_1 = pd.read_csv("costo-benefico.csv", sep=";", dtype=str)
    buscar_duplicado(df_1)

if __name__ == "__main__":
    main()

'''