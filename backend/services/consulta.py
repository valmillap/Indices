import pyodbc
import pandas as pd

CONN_STR = (
    "DRIVER={ODBC Driver 17 for SQL Server};"
    "SERVER=localhost;"
    "DATABASE=master;"
    "Trusted_Connection=yes;"
)

def exportar_csv(sql, archivo):

    conn = pyodbc.connect(CONN_STR)

    df = pd.read_sql(sql, conn)

    df.to_csv(
        archivo,
        sep=";",
        index=False
    )

    conn.close()

    return len(df)