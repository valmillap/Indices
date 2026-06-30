
export const fragColumnDefs = [
    {headerName: "Prioridad",flex: 1,
        valueGetter: params => getPrioridad(params.data["USED-PAGES"])},
    {field: "TABLA", flex: 1},
    {field: "INDICE", flex: 1},
    {field: "PAGES", flex: 1},
    {field: "FRAGMENTACION", flex: 1,
        cellClassRules: {
            "fila-alerta": params =>
               params.data.FRAGMENTACION < 19,
            "celda-rojo": params =>
               params.data.FRAGMENTACION > 20
          },
    },
    {field: "PAGE_FULLNESS", flex: 1,
        cellClassRules: {
            "fila-alerta": params =>
              params.data["PAGE_FULLNESS"] < 70
          },
    },
    {field: "USED-PAGES", flex: 1},
];

const getPrioridad = (usedPages) => {
    if (usedPages > 8)  return "🌟 Alta"
    if (usedPages > 1)  return "🔽 Poco relevante"
    return "⛔ No relevante"
}


export const fragRules = {
    "fila-peso": params =>
        params.data["USED-PAGES"] < 8
    }


    /*
     "TABLA",
        "INDICE",
        "PAGES",
        "FRAGMENTACION",
        "PAGE_FULLNESS"
        "USER_SEEKS",
        "USER_SCANS",
        "USER_LOOKUPS",
        "USER_UPDATES",
        "USED-PAGES",
        */