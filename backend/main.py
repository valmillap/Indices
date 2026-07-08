from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import pandas as pd
import pyodbc, shutil, os

from services.indice_analisis import generar_df_indice_base
from services.costo_beneficio import calcular_costo
from services.duplicado import buscar_duplicado
from services.contenido import buscar_contenido
from services.heap import calcular_lookup
from services.fragmentacion import calcular_fragmentacion
from services.consulta import CONSULTA_USO_TAMAÑO,CONSULTA_ATRIBUTOS,CONSULTA_FRAGMENTACION

from pydantic import BaseModel
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
FILES_DIR = BASE_DIR / "files"

class Conexion(BaseModel):
    server: str
    database: str
    user: str
    password: str

class CambioBD(BaseModel):
    database: str
    password: str


app = FastAPI()
df_costo_global = None

# Datos de la conexión activa, guardados en memoria SOLO para mostrar en el
# frontend y para reutilizar servidor/usuario al cambiar de BD.
# La contraseña NUNCA se guarda: cada operación (conectar o cambiar de BD)
# la recibe en la petición y se descarta apenas termina de usarla.
credenciales_actuales = None  # {server, database, user}
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
    global df_costo_global

     # Crear carpeta si no existe
    os.makedirs("files", exist_ok=True)

    # Guardar csv em carpeta files
    with open(FILES_DIR/"atributos.csv", "wb") as buffer:
        shutil.copyfileobj(atributos.file, buffer)
        
    with open(FILES_DIR/"uso.csv", "wb") as buffer:
        shutil.copyfileobj(uso.file, buffer)

    with open(FILES_DIR/"frag.csv", "wb") as buffer:
        shutil.copyfileobj(frag.file, buffer)

    return cargar()


def cargar():
    global df_costo_global
    df_base = generar_df_indice_base(FILES_DIR/"atributos.csv", FILES_DIR/"uso.csv")
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
    df_uso = pd.read_csv(FILES_DIR/"uso.csv", sep=";",header=None,dtype=str)
    if df_uso is None:
        return {"error": "Debe cargar archivos"}

    df_heap = calcular_lookup(df_uso)
    return {
        "rows": len(df_heap),
        "columns": list(df_heap.columns),
        "data": df_heap.to_dict("records")
    }

@app.get("/frag-pag")
async def fragmentacion():

    df_frag = calcular_fragmentacion(FILES_DIR/"frag.csv",FILES_DIR/"uso.csv")
    return {
        "rows": len(df_frag),
        "columns": list(df_frag.columns),
        "data": df_frag.to_dict("records")
    }

def _conectar_y_exportar(server, database, user, password):
    """Abre conexión, ejecuta las 3 consultas y guarda los CSV. Lanza excepción si falla."""
    conn = pyodbc.connect(
        f"DRIVER={{ODBC Driver 17 for SQL Server}};"
        f"SERVER={server};"
        f"DATABASE={database};"
        f"UID={user};"
        f"PWD={password}"
    )

    consultas = [
        {"sql": CONSULTA_ATRIBUTOS, "archivo": "atributos.csv"},
        {"sql": CONSULTA_USO_TAMAÑO,   "archivo": "uso.csv"},
        {"sql": CONSULTA_FRAGMENTACION, "archivo": "frag.csv"},
    ]

    for item in consultas:
        df = pd.read_sql(item["sql"], conn)
        df.to_csv(FILES_DIR / item["archivo"], sep=";", index=False)

    conn.close()
    cargar()


@app.post("/conectar-y-exportar")
def conectar_y_exportar(data: Conexion):
    global credenciales_actuales
    try:
        _conectar_y_exportar(data.server, data.database, data.user, data.password)

        # Guardamos únicamente servidor/BD/usuario para mostrar la conexión
        # activa y para reutilizarlos al cambiar de BD. La contraseña no se
        # guarda en ningún momento.
        credenciales_actuales = {
            "server": data.server,
            "database": data.database,
            "user": data.user,
        }

        return {
            "ok": True,
            "mensaje": "Archivo generado correctamente",
            "conexion": _conexion_publica(),
        }
    except Exception as e:
        return {"ok": False, "mensaje": str(e)}


@app.post("/cambiar-bd")
def cambiar_bd(data: CambioBD):
    """Cambia solo la base de datos"""
    global credenciales_actuales

    if credenciales_actuales is None:
        return {"ok": False, "mensaje": "No hay una conexión activa. Conéctate primero."}

    try:
        _conectar_y_exportar(
            credenciales_actuales["server"],
            data.database,
            credenciales_actuales["user"],
            data.password,
        )

        credenciales_actuales["database"] = data.database

        return {
            "ok": True,
            "mensaje": "Base de datos cambiada correctamente",
            "conexion": _conexion_publica(),
        }
    except Exception as e:
        return {"ok": False, "mensaje": str(e)}


@app.post("/cerrar-sesion")
def cerrar_sesion():
    """Cierra la sesión activa: olvida la conexión (servidor/BD/usuario) y los
    datos ya cargados. La contraseña nunca estuvo guardada, así que basta con
    limpiar esta información en memoria."""
    global credenciales_actuales, df_costo_global
    credenciales_actuales = None
    df_costo_global = None
    return {"ok": True, "mensaje": "Sesión cerrada"}


def _conexion_publica():
    """Versión de las credenciales sin password, segura para exponer al frontend."""
    if credenciales_actuales is None:
        return None
    return {
        "server": credenciales_actuales["server"],
        "database": credenciales_actuales["database"],
        "user": credenciales_actuales["user"],
    }


@app.get("/conexion-actual")
def obtener_conexion_actual():
    """Devuelve la BD/servidor actualmente conectados (o conectado=False si no hay ninguno)."""
    conexion = _conexion_publica()
    if conexion is None:
        return {"conectado": False}
    return {"conectado": True, **conexion}