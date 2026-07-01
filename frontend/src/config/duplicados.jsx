
export const duplicadosColumnDefs = [
    {checkboxSelection: params => params.data.MANTENER?.startsWith("Duplica"), headerCheckboxSelection: true, width: 60,
        headerCheckboxSelectionFilteredOnly: true
    },
    {headerName: "Prioridad",flex:1,
    valueGetter: params => getPrioridad(params.data["USED-PAGES"])
    },
    { field: "TABLA", flex: 1 },
    { field: "INDICE", flex: 1,},
    { headerName:"PESO", field: "USED-PAGES", flex: 1,hide: true,},
    { field: "TYPE_DESC", flex: 1,
        cellClassRules:{
           "celda-punto": params =>
            String(params.data.TYPE_DESC).trim() === "CLUSTERED", 
        }
     },
     { field: "TIPO", flex: 0.7,
        cellRenderer: params => {
        if (params.value === "PK Y UNIQUE") {
            return <span className="pill-a">{params.value}</span>;
        }
         if (params.value === "PK") {
            return <span className="pill-a">{params.value}</span>;
        }
         if (params.value === "UNIQUE") {
            return <span className="pill-c">{params.value}</span>;
        }
         if (params.value === "INDEX") {
            return <span className="pill-b">{params.value}</span>;
        }
        return params.value;
        }
     },
    { headerName:"ACCIÓN",field: "MANTENER",flex: 1,wrapText: true, autoHeight: true,
       cellRenderer: params => {
            const valor = String(params.data.MANTENER).trim()
            if (!valor.startsWith("Duplica")) return valor

            const [, ...resto] = valor.split(" ")
            const indice = resto.join(" ")

            return (
                <span className="mantener-wrapper">
                    <span className="mantener-duplica">Duplica </span>
                    <span className="mantener-indice">{indice}</span>
                </span>
            )
        }
    },
    { headerName:"EFECTO DE ELIMINAR",field: "BENEFICIO", flex: 1.2, wrapText: true,
    autoHeight: true,
        cellClassRules: {
            "celda-interlineado": params =>
            String(params.data.MANTENER).startsWith("Duplica"),
        }
     }
];
const getPrioridad = (usedPages) => {
    if (usedPages > 8)  return "🌟 Alta"
    if (usedPages > 1)  return "🔽 Poco relevante"
    return "⛔ No relevante"
}

export const duplicadosRules = {
    "fila-peso": params =>
        params.data["USED-PAGES"] < 0.015
}
