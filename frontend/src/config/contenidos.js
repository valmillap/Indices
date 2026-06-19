

  export const contenidosColumnDefs = [
    {checkboxSelection: true, headerCheckboxSelection: true, width: 60},
    {field: "TABLA", flex: 1},
    {field: "INDICE", flex: 1},
    {field: "ATRIBUTOS", flex: 1},
    {field: "TYPE_DESC", flex: 1},
    {field: "IS_PRIMARY_KEY", flex: 1},
    {field: "IS_UNIQUE", flex: 1},
    {field: "EVALUACION_INDICE", flex: 1},
    {field: "USED-PAGES", flex: 1}
];

export const contenidosRules = {
    "fila-pk": params =>
    params.data.IS_PK == 1,

    "fila-duplicado": params =>
    params.data.MANTENER == 0,

    "nada": params =>
    String(params.data.TABLA).trim() ===
    "RentaEncasillamiento"
}
