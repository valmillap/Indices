import pandas as pd

def buscar_duplicado(df):
     # Ignorar filas sin ATRIBUTOS
     #Dilmah454+Fr
    df = df[df["ATRIBUTOS"].str.strip() != ""]

    # Buscar duplicados por TABLA + ATRIBUTOS
    duplicado = df[df.duplicated(subset=["TABLA", "ATRIBUTOS"],keep=False)]

    duplicado = duplicado.sort_values(["TABLA", "ATRIBUTOS", "INDICE"])

    # --- ORDEN FILAS POR PK- used pages
    duplicado["IS_PRIMARY_KEY_NUM"] = pd.to_numeric(duplicado["IS_PRIMARY_KEY"],errors="coerce").fillna(0)

    duplicado["USED-PAGES"] = pd.to_numeric(duplicado["USED-PAGES"],errors="coerce").fillna(0)

    duplicado["PESO_GRUPO"] = duplicado.groupby(["TABLA", "ATRIBUTOS"])["USED-PAGES"].transform("max")

    duplicado = duplicado.sort_values(by=["PESO_GRUPO", "TABLA", "ATRIBUTOS", "IS_PRIMARY_KEY"],
        ascending=[False,True,True,False])

    #duplicado.drop( columns=["IS_PRIMARY_KEY_NUM"], inplace=True)
    
    # COLUMNA
        # Convertir a numérico
    duplicado["IS_PRIMARY_KEY_NUM"] = pd.to_numeric(
        duplicado["IS_PRIMARY_KEY"], errors="coerce"
    ).fillna(0)

    duplicado["IS_UNIQUE_NUM"] = pd.to_numeric(
        duplicado["IS_UNIQUE"], errors="coerce"
    ).fillna(0)

    # Cantidad de índices UNIQUE por grupo
    duplicado["UNIQUE_COUNT"] = (
        duplicado.groupby(["TABLA", "ATRIBUTOS"])["IS_UNIQUE_NUM"]
        .transform("sum")
    )

    # Valor por defecto
    duplicado["MANTENER"] = 0

    # PK siempre se mantiene
    duplicado.loc[
        duplicado["IS_PRIMARY_KEY_NUM"] == 1,
        "MANTENER"
    ] = 1

    # UNIQUE se mantiene sólo si es el único UNIQUE del grupo
    duplicado.loc[
        (duplicado["IS_PRIMARY_KEY_NUM"] == 0)
        & (duplicado["IS_UNIQUE_NUM"] == 1)
        & (duplicado["UNIQUE_COUNT"] == 1),
        "MANTENER"
    ] = 1

    duplicado.drop(columns=["UNIQUE_COUNT", "IS_UNIQUE_NUM", "PESO_GRUPO"], inplace=True)

    #duplicado.to_csv("duplicado3.csv",sep=";",index=False)
    return duplicado
'''
def main():
    df_1 = pd.read_csv("costo-benefico.csv", sep=";", dtype=str)
    buscar_duplicado(df_1)

if __name__ == "__main__":
    main()
'''