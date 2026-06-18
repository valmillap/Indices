export const fragColumnDefs = [
    {checkboxSelection: true, headerCheckboxSelection: true, width: 60},
    {field: "TABLA", flex: 1},
    {field: "INDICE", flex: 1},
    {field: "PAGES", flex: 1}
    
];

export const fragRules = {
    "fila-pk": params =>
    params.data.PAGES > 1
    }
