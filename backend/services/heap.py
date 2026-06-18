import pandas as pd

def calcular_loockup(uso):
    uso = uso[[0, 1, 2, 5, 6, 7, 8, 12]]

    uso.columns = [
        "TABLA",
        "INDICE",
        "TYPE_DESC",
        "USER_SEEKS",
        "USER_SCANS",
        "USER_LOOKUPS",
        "USER_UPDATES",
        "USED-PAGES"
    ]
    heap = uso[uso["TYPE_DESC"] == "HEAP"]
    #heap.to_csv("heap.csv",sep=";",index=False)
    heap["USED-PAGES"] = pd.to_numeric(heap["USED-PAGES"], errors="coerce")
    heap["USER_LOOKUPS"] = pd.to_numeric(heap["USER_LOOKUPS"], errors="coerce")

    relevante = heap[(heap["USED-PAGES"] > 8) & (heap["USED-PAGES"] * heap["USER_LOOKUPS"] > 100000)]
    nombre_tabla = relevante["TABLA"].unique()
    print(nombre_tabla)

    uso["USER_SCANS"] = pd.to_numeric(uso["USER_SCANS"], errors="coerce")
    uso["USER_SEEKS"] = pd.to_numeric(uso["USER_SEEKS"], errors="coerce")

    uso = uso[uso["TABLA"].isin(nombre_tabla)]
    uso = uso[(uso["USER_SEEKS"] > 0) | (uso["USER_SCANS"] > 0) | (uso["TYPE_DESC"] == "HEAP")]
    uso.to_csv("heap_filtro.csv",sep=";",index=False)

    return uso

    #AGREGAR SCAN> en cost-beneficio
'''
def main():
    df_1 = pd.read_csv("2.csv", sep=";",header=None,dtype=str)
    calcular_loockup(df_1)

if __name__ == "__main__":
    main()
'''
