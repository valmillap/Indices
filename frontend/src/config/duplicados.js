
export const duplicadosColumnDefs = [
    { headerName:"PRIORIDAD-TEXTO",field: "USED-PAGES", flex: 1 },
    { field: "INDICE", flex: 1,
        cellClassRules:{
            "pill": params =>
            String(params.data.INDICE).trim() === "aaaRentaEncasillamiento_PK",
        }
     },
    { field: "TYPE_DESC", flex: 2,
        cellClassRules:{
           "celda-punto": params =>
            String(params.data.TYPE_DESC).trim() === "NONCLUSTERED", 
        }
     },
    { field: "TIPO", flex: 1 },
    { headerName:"EFECTO DE ELIMINAR",field: "USED-PAGES", flex: 1 },
    { headerName:"ACCIÓN",field: "MANTENER",flex: 1,
       cellClassRules: {
            "celda-prueba": params =>
            String(params.data.MANTENER).trim() === "Duplica",
        }
    },
];


export const duplicadosRules = {

}
