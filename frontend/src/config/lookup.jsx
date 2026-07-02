

  export const lookupColumnDefs = [
    {field: "TABLA", flex: 1.1,
        
        cellRenderer: params => {
        if (params.data.TYPE_DESC !== "HEAP") return "Posible causante lookup"
        return params.value
    },
        cellClassRules: {
            "celda-heap": params =>
                String(params.data.TYPE_DESC).trim() == "HEAP",
            "celda-borde": params =>
                String(params.data.TYPE_DESC).trim() == "HEAP",
             "celda-italic": params =>
                String(params.data.TYPE_DESC).trim() == "NONCLUSTERED",
        }
    },
    {field: "INDICE", flex: 1},
    {field: "TYPE_DESC", flex: 0.7,
        cellRenderer: params => {
        if (params.value === "HEAP") {
            return <span className="pill-heap">{params.value}</span>;
            }
         if (params.value === "NONCLUSTERED") {
            return <span className="pill-nonc">{params.value}</span>;
            }
        }
    },
    {headerName:"LOOKUPS",field: "USER_LOOKUPS",flex: 0.5,
       cellClassRules: {
            "celda-lookup": params =>
                Number(params.value) > 1000,
        },
        cellRenderer: params => {
        if (params.data["USER_LOOKUPS"] == 0) return ""
        return params.value
        }
    },
    {headerName:"SEEKS",field: "USER_SEEKS", flex: 0.4},
    {headerName:"SCANS",field: "USER_SCANS",flex: 0.4},
    {field: "USED-PAGES", flex: 1},
    {headerName: "COLUMNA",flex:1,
    valueGetter: params => getColumna(params.data["TYPE_DESC"]),
    cellClassRules: {
            "celda-italic": params =>
                String(params.data.TYPE_DESC).trim() == "NONCLUSTERED",
        },
    },
    
];

const getColumna = (type) => {
    if (type.trim() =="NONCLUSTERED")  return "algo"
    return " "
}

export const lookupRules = {
    "fila-heap": params =>
    String(params.data.TYPE_DESC).trim() == "HEAP",

    "fila-no-heap": params =>
    String(params.data.TYPE_DESC).trim() == "NONCLUSTERED" , /*clstered*/

    }

