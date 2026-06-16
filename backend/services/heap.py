import pandas as pd

def calcular_loockup(heap):
    #heap = pd.read_csv(uso_file, sep=";", header=None, skiprows=1, dtype=str, na_filter=False)
    heap = heap[[0, 1, 2, 5, 6, 7, 8, 12]]

    heap.columns = [
        "TABLA",
        "INDICE",
        "TYPE_DESC",
        "USER_SEEKS",
        "USER_SCANS",
        "USER_LOOKUPS",
        "USER_UPDATES",
        "USED-PAGES"
    ]
    heap = heap[heap["TYPE_DESC"] == "HEAP"]
    #heap.to_csv("heap.csv",sep=";",index=False)
    return heap

def main():
    df_1 = pd.read_csv("2.csv", sep=";",header=None,dtype=str)
    calcular_loockup(df_1)

if __name__ == "__main__":
    main()
