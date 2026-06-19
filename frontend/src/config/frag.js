
export const fragColumnDefs = [
    {checkboxSelection: true, headerCheckboxSelection: true, width: 60},
    {field: "TABLA", flex: 1},
    {field: "INDICE", flex: 1},
    {field: "PAGES", flex: 1},
    {field: "FRAGMENTACION", flex: 1},
    {field: "PAGE_FULLNESS", flex: 1},
    {field: "USER_SCANS", flex: 1},
    {field: "USER_UPDATES", flex: 1},
    {field: "USED-PAGES", flex: 1},
];

export const fragRules = {
    "fila-pk": params =>
    params.data.PAGES > 1
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