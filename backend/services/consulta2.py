import pyodbc
import pandas as pd

CONSULTA_ATRIBUTOS = """
    SELECT * from NivelEducativo;

"""

CONSULTA_USO_TAMAÑO = """
    SELECT * from TipoInstitucionesAVP;
"""

CONSULTA_FRAGMENTACION = """
    SELECT * from Isapres;   

"""