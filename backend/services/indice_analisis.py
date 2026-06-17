# AGRUPAR ATRIBUTO --***ELIMINAR HEAP uso_tamaño*** 
import pandas as pd

def generar_df_indice_base(atributos_file, uso_file):
    atributos = pd.read_csv(atributos_file, sep=";",header=None,dtype=str)

    # Agrupar por TABLA + INDICE
    df_agrupado = (
        atributos.groupby([0, 1], dropna=False)
        .agg({
            2: 'first',  # TYPE_DESC
            3: 'first',  # IS_PRIMARY_KEY
            4: 'first',  # IS_UNIQUE
            8: lambda x: ','.join(x.astype(str))
        })
        .reset_index()
    )

    df_agrupado.columns = [
        'TABLA',
        'INDICE',
        'TYPE_DESC',
        'IS_PRIMARY_KEY',
        'IS_UNIQUE',
        'ATRIBUTOS'
    ]

    #---------------
    # ATRIBUTO X USO
    uso = pd.read_csv(uso_file, sep=";", header=None, skiprows=1, dtype=str, na_filter=False)
    uso = uso.drop(uso.columns[13], axis=1)

    uso.columns = [
        "TABLA",
        "INDICE",
        "TYPE_DESC",
        "IS_PRIMARY_KEY",
        "IS_UNIQUE",
        "USER_SEEKS",
        "USER_SCANS",
        "USER_LOOKUPS",
        "USER_UPDATES",
        "LAST_USER_SEEK",
        "LAST_USER_SCAN",
        "TAMANO-TOTAL",
        "USED-PAGES"
    ]
        # Eliminar HEAP
    uso = uso[uso["TYPE_DESC"] != "HEAP"]


    # Limpiar espacios
    for df in [uso, df_agrupado]:
        df["TABLA"] = df["TABLA"].fillna("").str.strip()
        df["INDICE"] = df["INDICE"].fillna("").str.strip()

    # NULL textual -> vacío
    uso["INDICE"] = uso["INDICE"].replace("NULL", "")
    df_agrupado["INDICE"] = df_agrupado["INDICE"].replace("NULL", "")

    df_uso = uso.merge(
        df_agrupado[["TABLA", "INDICE", "ATRIBUTOS"]],
        on=["TABLA", "INDICE"],
        how="left"
    )
    #df_uso.to_csv("index-base.csv",sep=";",index=False)
    return df_uso
'''
def main():
    #df_1 = pd.read_csv("1.csv", sep=";",header=None,dtype=str)
    #df_2 = pd.read_csv("2.csv", sep=";",header=None,dtype=str)
    generar_df_indice_base("1.csv", "2.csv")

if __name__ == "__main__":
    main()
'''

    