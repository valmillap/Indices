import pandas as pd

# --------- CAMBIAR LOGICA UPDATE>BUSQUEDAS POR RATIO 
def calcular_costo(df_costo):
    # Convertir NULL y vacíos a 0
    for col in ["USER_SEEKS", "USER_SCANS", "USER_LOOKUPS", "USER_UPDATES"]:
        df_costo[col] = pd.to_numeric(
            df_costo[col].replace(["NULL", ""], "0"),
            errors="coerce"
        ).fillna(0)

    # TOTAL BUSQUEDA, NO SCAN
    df_costo["BUSQUEDAS"] = (
        df_costo["USER_SEEKS"]
        + df_costo["USER_LOOKUPS"]
    )

    def clasificar(row):
        busquedas = row["BUSQUEDAS"]
        updates = row["USER_UPDATES"]
        ratio = updates/ busquedas

        if busquedas == 0 and updates == 0:
            return "NO USO"

        if ratio <= 1:
            return "Beneficio Busqueda"
        
        if 1 <ratio <1.5:
            return "Aceptable"
        
        if 1.5 <ratio <3:
            return "Costo de mantenimiento"
        
        if ratio < 3:
            return "Relevante costo de mantenimiento"
        
        if ratio < 10:
            return "Trascendental costo de mantenimiento"


        if busquedas >= updates:
            return "BENEFICIO EN BUSQUEDA"

        return "EQUILIBRADO"

    df_costo["EVALUACION_INDICE"] = df_costo.apply(clasificar, axis=1)

    df_costo.to_csv("costo-benefico.csv",sep=";",index=False)
    return df_costo