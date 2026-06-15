
import pandas as pd

def calcular_fragmentacion(fragmentacion, uso):
    #fragmentacion = pd.read_csv(fragmentacion_file, sep=";",header=None,dtype=str)
    #uso = pd.read_csv(uso_file, sep=";", header=None, skiprows=1, dtype=str, na_filter=False)
    '''
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
    fragmentacion = fragmentacion[[1, 2, 6, 7, 8]]
    fragmentacion.columns = [
        "TABLA",
        "INDICE",
        "PAGES",
        "FRAGMENTACION",
        "PAGE_FULLNESS"
        ]

    uso = uso[[0,1, 2, 5, 6, 7, 8]]
    uso.columns = [
        "TABLA",
        "INDICE",
        "USER_SEEKS",
        "USER_SCANS",
        "USER_LOOKUPS",
        "USER_UPDATES",
        "USED-PAGES",
    ]

    df = fragmentacion.merge(
    uso,
    on=["TABLA", "INDICE"],
    how="left")
    df.to_csv("index-fragmetacion2.csv",sep=";",index=False)
    #return df

def main():
    df_1 = pd.read_csv("1.csv", sep=";",header=None,dtype=str)
    df_2 = pd.read_csv("2.csv", sep=";", header=None, skiprows=1, dtype=str, na_filter=False)
    calcular_fragmentacion(df_1,df_2)

if __name__ == "__main__":
    main()
