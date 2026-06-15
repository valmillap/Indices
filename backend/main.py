from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware

from services.indice_analisis import generar_df_indice_base
from services.costo_beneficio import calcular_costo
from services.duplicado import buscar_duplicado
from services.contenido import buscar_contenido


app = FastAPI()
df_costo_global = None

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
    uso: UploadFile = File(...)
):

    global df_costo_global

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