

  export const lookupColumnDefs = [
    {field: "TABLA", flex: 1.1,
        cellRenderer: params => {
        if (params.data.TYPE_DESC !== "HEAP") return ""
        return params.value
    },
        cellClassRules: {
            "celda-heap": params =>
                String(params.data.TYPE_DESC).trim() == "HEAP",
            "celda-borde": params =>
                String(params.data.TYPE_DESC).trim() == "HEAP",
        }
    },
    {field: "INDICE", flex: 1},
    {field: "TYPE_DESC", flex: 1,
        cellRenderer: params => {
        if (params.value === "HEAP") {
            return <span className="pill-heap">{params.value}</span>;
            }
         if (params.value === "NONCLUSTERED") {
            return <span className="pill-nonc">{params.value}</span>;
            }
        }
    },
    {field: "USER_LOOKUPS",flex: 1,
       cellClassRules: {
            "celda-lookup": params =>
                Number(params.value) > 1000,
        }
    },
    {field: "USER_SEEKS", flex: 1},
    {field: "USER_SCANS", flex: 1},
    {field: "USED-PAGES", flex: 1}
    
];


export const lookupRules = {
    "fila-heap": params =>
    String(params.data.TYPE_DESC).trim() == "HEAP",

    "fila-no-heap": params =>
    String(params.data.TYPE_DESC).trim() == "NONCLUSTERED" , /*clstered*/

    }

