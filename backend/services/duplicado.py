import pandas as pd

def buscar_duplicado(df):
     # Ignorar filas sin ATRIBUTOS
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

    duplicado.drop( columns=["IS_PRIMARY_KEY_NUM"], inplace=True)


    print(f"Encontrados {len(duplicado)} registros")
    return duplicado