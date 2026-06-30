
import pandas as pd
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
FILES_DIR = BASE_DIR / "files"

def calcular_fragmentacion(fragmentacion, uso):
    fragmentacion = pd.read_csv(fragmentacion, sep=";",header=None,dtype=str)
    uso = pd.read_csv(uso, sep=";", header=None, skiprows=1, dtype=str, na_filter=False)
 
    fragmentacion = fragmentacion[[1, 2, 6, 7, 8]]
    fragmentacion.columns = [
        "TABLA",
        "INDICE",
        "PAGES",
        "FRAGMENTACION",
        "PAGE_FULLNESS"
        ]
    

    uso = uso[[0,1, 5, 6, 7, 8,12]]
    uso.columns = [
        "TABLA",
        "INDICE",
        "USER_SEEKS",
        "USER_SCANS",
        "USER_LOOKUPS",
        "USER_UPDATES",
        "USED-PAGES",
    ]


    df = fragmentacion.merge(uso, on=["TABLA", "INDICE"], how="left")

    for col in ["PAGES","FRAGMENTACION", "PAGE_FULLNESS","USER_SEEKS", "USER_SCANS", "USER_LOOKUPS", "USER_UPDATES","USED-PAGES"]:
        df[col] = pd.to_numeric(
        df[col].replace(["NULL", ""], "0"),
        errors="coerce"
    ).fillna(0)
        

    df = df[~(df["PAGES"] < 10)]

    df = df[~((df["FRAGMENTACION"] < 10) & (df["PAGE_FULLNESS"] > 75) )]
    # Eliminar filas donde FRAGMENTACION == 0 Y PAGE_FULLNESS == 0
    df = df[~((df["FRAGMENTACION"] == 0) & (df["PAGE_FULLNESS"] == 0))]

    df = df.sort_values(
    by=["PAGES", "FRAGMENTACION", "PAGE_FULLNESS"],
    ascending=[False, False, True]
)

    #df.to_csv("index-fragmetacion2.csv",sep=";",index=False)
    return df
'''
def main():
    calcular_fragmentacion(FILES_DIR/"frag.csv",FILES_DIR/"uso.csv")

if __name__ == "__main__":
    main()

    fragmentacion.columns = [
        "ESQUEMA",0
        "TABLA",1
        "INDICE",2 
        "TYPE_DESC",3
        "IS_PRIMARY_KEY",4
        "IS_UNIQUE",5
        "PAGES",6
        "FRAGMENTACION",7
        "PAGE_FULLNESS"8
        ]

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
        "USED-PAGES",
        "DATA-PAGES"
    ]
    '''
