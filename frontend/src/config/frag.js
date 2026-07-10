
export const fragColumnDefs = [
    {headerName: "Prioridad",flex: 1,
        valueGetter: params => getPrioridad(params.data["USED-PAGES"])},
    {field: "TABLA", flex: 1},
    {field: "INDICE", flex: 1},
    {field: "PAGES", flex: 1},
    {field: "FRAGMENTACION", flex: 1,
        cellRenderer: params => {
            /**>30 reconstruir. 5 y 30 reorganizar */
        if (params.data.FRAGMENTACION >= 30) {
            return <span className="pill-frag-alta">{params.value}</span>;
            }
        if (params.data.FRAGMENTACION < 30 & params.data.FRAGMENTACION > 15) {
            return <span className="pill-frag-medio">{params.value}</span>;
            }
        if (params.data["FRAGMENTACION"] <= 15) {
            return <span className="pill-frag-verde">{params.value}</span>;
            }   
        }
    },
    {field: "PAGE_FULLNESS", flex: 1,
        cellRenderer: params => {
        if (params.data["PAGE_FULLNESS"] < 70) {
            return <span className="pill-frag-alta">{params.value}</span>;
            }
        if (params.data["PAGE_FULLNESS"] > 70) {
            return <span className="pill-frag-verde">{params.value}</span>;
            }
        }
    },
    {field: "USER_SEEKS", flex: 1, hide:true},
    {field: "USER_SCANS", flex: 1, hide:true},
    {field: "USER_UPDATES", flex: 1, hide:true},
    {field: "USED-PAGES", flex: 1},
    {headerName: "PAGINAS MALGASTADAS",flex:1,
    valueGetter: params => getPaginas(params.data["USED-PAGES"], params.data["PAGE_FULLNESS"],params.data["FRAGMENTACION"],
         params.data["USER_SEEKS"],params.data["USER_SCANS"])
    }
];

const getPaginas = (usedPages, pageFullness, fragmentacion,seeks,scans) => {
    if ( pageFullness < 70)
        return usedPages * (100 - pageFullness) / 100 + " paginas desaprovechadas"

    if ( fragmentacion > 20)
        return seeks + scans + " busquedas"
    return ""
}

const getPrioridad = (usedPages) => {
    if (usedPages > 8)  return "🌟 🟨 ❏ Alta"
    if (usedPages > 1)  return "🔽 Poco relevante"
    return "⛔ No relevante"
}


export const fragRules = {
    "fila-peso": params =>
        params.data["USED-PAGES"] < 8
    }


    /*


    pill-frag-alta
    
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