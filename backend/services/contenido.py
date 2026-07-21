
import pandas as pd
import numpy as np

def buscar_contenido(df):

    df = df[df["ATRIBUTOS"].str.strip() != ""]
    
    def es_prefijo(indice_grande, indice_pequeno):

        cols_grande = [x.strip() for x in indice_grande.split(",")]
        cols_pequeno = [x.strip() for x in indice_pequeno.split(",")]

        if len(cols_pequeno) >= len(cols_grande):
            return False

        return cols_grande[:len(cols_pequeno)] == cols_pequeno

    indices_contenidos = []
    for tabla, grupo in df.groupby("TABLA"):

        registros = grupo.to_dict("records")

        for i in range(len(registros)):
            for j in range(len(registros)):

                if i == j:
                    continue

                atr1 = registros[i]["ATRIBUTOS"].strip()
                atr2 = registros[j]["ATRIBUTOS"].strip()

                if not atr1 or not atr2:
                    continue

                if es_prefijo(atr1, atr2):
                    contenedor = registros[i].copy()
                    contenido = registros[j].copy()

                    largo_contenedor = len([x.strip() for x in atr1.split(",")])
                    largo_contenido = len([x.strip() for x in atr2.split(",")])

                    diferencia = largo_contenedor - largo_contenido

                    contenido["DIFERENCIA_ATRIBUTOS"] = diferencia

                    if (
                        diferencia < 3
                        and str(contenido["IS_PRIMARY_KEY"]) != "1"
                        and str(contenido["IS_UNIQUE"]) != "1"):

                        contenido["EVALUACION_CONTENIDO"] = "CANDIDATO ELIMINAR"
                        contenido["MANTENER"] = f"Contenidopor {contenedor['INDICE']}"

                    elif diferencia >= 3:

                        contenido["EVALUACION_CONTENIDO"] = "REVISAR"
                        contenido["MANTENER"] = f"Contenidopor {contenedor['INDICE']}"

                    else:

                        contenido["EVALUACION_CONTENIDO"] = "CONSERVAR (PK/UNIQUE)"
                        contenido["MANTENER"] = f"Contenidopor{contenedor['INDICE']}"

                    contenedor["DIFERENCIA_ATRIBUTOS"] = ""
                    contenedor["EVALUACION_CONTENIDO"] = "CONTENEDOR"
                    contenedor["MANTENER"] = "Contenedor"

                    indices_contenidos.append(contenedor)
                    indices_contenidos.append(contenido)

    indices_contenidos = pd.DataFrame(indices_contenidos)
    indices_contenidos = indices_contenidos.sort_values(["TABLA", "ATRIBUTOS", "INDICE"])

    #--- TIPO PK Y UNIQUE
    indices_contenidos["IS_PRIMARY_KEY_NUM"] = pd.to_numeric(
        indices_contenidos["IS_PRIMARY_KEY"], errors="coerce"
    ).fillna(0)

    indices_contenidos["IS_UNIQUE_NUM"] = pd.to_numeric(
        indices_contenidos["IS_UNIQUE"], errors="coerce"
    ).fillna(0)
     # COLUMNA PK Y UNIQUE
    def regla(row):
        if row["IS_PRIMARY_KEY_NUM"] == 1 and row["IS_UNIQUE_NUM"] == 1:
            return "PK Y UNIQUE"
        if row["IS_PRIMARY_KEY_NUM"] == 1:
            return "PK"
        if row["IS_UNIQUE_NUM"] == 1:
            return "UNIQUE"
        return "INDEX"

    indices_contenidos["TIPO"] = indices_contenidos.apply(regla, axis=1)

    # --- ORDEN FILAS POR CONTENEDOR
    indices_contenidos["USED-PAGES"] = pd.to_numeric(
        indices_contenidos["USED-PAGES"],
        errors="coerce"
    ).fillna(0)

    # Cantidad de columnas del índice
    indices_contenidos["LARGO_ATRIBUTOS"] = (
        indices_contenidos["ATRIBUTOS"]
        .str.split(",")
        .str.len()
    )
    # Peso del grupo
    indices_contenidos["PESO_GRUPO"] = indices_contenidos.groupby(
        ["TABLA"]
    )["USED-PAGES"].transform("max")

    # Contenedor primero (más columnas)
    indices_contenidos = indices_contenidos.sort_values(
        by=[
            "PESO_GRUPO",
            "TABLA",
            "LARGO_ATRIBUTOS",
            "USED-PAGES"
        ],
        ascending=[
            False,  # tablas más grandes primero
            True,
            False,  # índice más largo primero
            False
        ]
    )
    #---- EFECTO DE ELIMINAR
    indices_contenidos["BENEFICIO"] = np.where(
    indices_contenidos["MANTENER"].str.startswith("Contenidopor"),
    "Liberar " + indices_contenidos["USED-PAGES"].round(2).astype(str) +
    "MB espacio, - " + indices_contenidos["USER_UPDATES"].astype(int).astype(str) + " ops. de escritura", "")
    indices_contenidos.to_csv("indices_contenidos.csv",sep=";",index=False)

    return indices_contenidos

    '''
def main():
    df_1 = pd.read_csv("costo-benefico.csv", sep=";", dtype=str)
    buscar_contenido(df_1)

if __name__ == "__main__":
    main()
    '''