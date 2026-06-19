
export const costoColumnDefs = [
    {checkboxSelection: true, headerCheckboxSelection: true, width: 60},
    {field: "TABLA", flex: 1},
    {field: "INDICE", flex: 1},
    {field: "TYPE_DESC", flex: 1},
    {field: "USER_SEEKS", flex: 1},
    {field: "USER_SCANS", flex: 1},
    {field: "USER_LOOKUPS", flex: 1},
    {field: "USED-PAGES", flex: 1},
    {field: "EVALUACION_INDICE", flex: 1}
    
];

export const costoRules = {
    "fila-alto": params =>
    String(params.data.EVALUACION_INDICE).trim() == "HEAP"
    }

