from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import pandas as pd

from services.indice_analisis import generar_df_indice_base
from services.costo_beneficio import calcular_costo
from services.duplicado import buscar_duplicado
from services.contenido import buscar_contenido
from services.heap import calcular_lookup
from services.fragmentacion import calcular_fragmentacion
from services.consulta import exportar_csv, ejecutar_consulta_sql


app = FastAPI()
df_costo_global = None
df_uso_global = None
df_frag_global = None

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload")
async def upload(
    atributos: UploadFile = File(...),
    uso: UploadFile = File(...),
    frag: UploadFile = File(...)
):
    global df_uso_global
    global df_costo_global
    global df_frag_global

    df_uso_global = pd.read_csv(uso.file, sep=";",header=None,dtype=str)
    df_frag_global = pd.read_csv(frag.file, sep=";",header=None,dtype=str)
    frag.file.seek(0)
    uso.file.seek(0)

    df_base = generar_df_indice_base(
        atributos.file,
        uso.file
    )

    df_costo_global = calcular_costo(df_base)

    return {
        "rows": len(df_costo_global)
    }

@app.get("/costo-beneficio")
async def costo_beneficio():

    global df_costo_global

    if df_costo_global is None:
        return {"error": "Debe cargar archivos"}

    return {
        "rows": len(df_costo_global),
        "data": df_costo_global.to_dict("records")
    }

@app.get("/duplicados")
async def duplicado():

    global df_costo_global

    if df_costo_global is None:
        return {"error": "Debe cargar archivos"}

    df_duplicado = buscar_duplicado(df_costo_global)

    return {
        "rows": len(df_duplicado),
        "columns": list(df_duplicado.columns),
        "data": df_duplicado.to_dict("records")
    }

@app.get("/contenidos")
async def contenido():

    global df_costo_global

    if df_costo_global is None:
        return {"error": "Debe cargar archivos"}

    df_contenido = buscar_contenido(df_costo_global)

    return {
        "rows": len(df_contenido),
        "data": df_contenido.to_dict("records")
    }

@app.get("/heap-lookup")
async def lookup():
    global df_uso_global
    if df_uso_global is None:
        return {"error": "Debe cargar archivos"}

    df_heap = calcular_lookup(df_uso_global)
    return {
        "rows": len(df_heap),
        "columns": list(df_heap.columns),
        "data": df_heap.to_dict("records")
    }

@app.get("/frag-pag")
async def fragmentacion():
    global df_frag_global
    global df_uso_global
    if df_frag_global is None:
        return {"error": "Debe cargar archivos"}

    df_frag = calcular_fragmentacion(df_frag_global,df_uso_global)
    return {
        "rows": len(df_frag),
        "columns": list(df_frag.columns),
        "data": df_frag.to_dict("records")
    }


@app.post("/generar-csv")
async def generar_csv():

    conn = pyodbc.connect(
        "DRIVER={ODBC Driver 17 for SQL Server};"
        "SERVER=localhost;"
        "DATABASE=TuBase;"
        "Trusted_Connection=yes;"
    )

    sql = """
    SELECT *
    FROM TuTabla
    """

    df = pd.read_sql(sql, conn)

    df.to_csv(
        "resultado.csv",
        sep=";",
        index=False
    )

    conn.close()

    return {
        "mensaje": "resultado.csv generado",
        "rows": len(df)
    }