

  export const lookupColumnDefs = [
    {checkboxSelection: true, headerCheckboxSelection: true, width: 60},
    {field: "TABLA", flex: 1},
    {field: "INDICE", flex: 1},
    {field: "TYPE_DESC", flex: 1},
    {field: "USER_SEEKS", flex: 1},
    {field: "USER_SCANS", flex: 1},
    {field: "USER_LOOKUPS",flex: 1,
       cellClassRules: {
            "celda-lookup": params =>
                Number(params.value) > 1000,
        }
    },
    {field: "USER_UPDATES", flex: 1},
    {field: "USED-PAGES", flex: 1}
    
];

export const lookupRules = {
    "fila-heap": params =>
    String(params.data.TYPE_DESC).trim() == "HEAP",

    "fila-no-heap": params =>
    String(params.data.TYPE_DESC).trim() == "NONCLUSTERED" , /*clstered*/

    }

