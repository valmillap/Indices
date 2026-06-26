
export const duplicadosColumnDefs = [
    { field: "TABLA", flex: 1 },
    { field: "INDICE", flex: 1,},
    { field: "TYPE_DESC", flex: 1,
        cellClassRules:{
           "celda-punto": params =>
            String(params.data.TYPE_DESC).trim() === "NONCLUSTERED", 
        }
     },
     { field: "TIPO", flex: 1,
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
    { headerName:"ACCIÓN",field: "MANTENER",flex: 1,
       cellClassRules: {
            "celda-texto": params =>
            String(params.data.MANTENER).trim() === "Duplica",
        }
    },
    { headerName:"EFECTO DE ELIMINAR",field: "BENEFICIO", flex: 2,
        cellClassRules: {
            "celda-inactivo": params =>
            String(params.data.MANTENER).trim() === "Duplica",
        }
     }
];

export const duplicadosRules = {

}
