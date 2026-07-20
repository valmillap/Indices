
export const duplicadosColumnDefs = [
    {checkboxSelection: params => params.data.MANTENER?.startsWith("Duplica"), headerCheckboxSelection: true, width: 60,
        headerCheckboxSelectionFilteredOnly: true
    },
    {
    headerName: "Prioridad",flex: 1,
    cellRenderer: params => getPrioridad(params.data["USED-PAGES"])
    },
    { field: "TABLA", flex: 1, hide: true},
    { field: "INDICE", flex: 1.6},
    { headerName:"PESO", field: "USED-PAGES", flex: 1,hide: true,},
    { field: "TYPE_DESC", flex: 1,
        cellClassRules:{
           "celda-punto": params =>
            String(params.data.TYPE_DESC).trim() === "CLUSTERED", 
        }
     },
     { field: "TIPO", flex: 0.9,
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

    if (usedPages > 8)
        return (
            <span className="prioridad prioridad-alta">
                <span className="prioridad-barra"></span>
                Alta
            </span>
        );

    if (usedPages > 1)
        return (
            <span className="prioridad prioridad-media">
                <span className="prioridad-barra"></span>
                Media
            </span>
        );

    return (
        <span className="prioridad prioridad-baja">
            <span className="prioridad-barra"></span>
            Baja
        </span>
    );
};
export const duplicadosRules = {
    "fila-peso": params =>
        params.data["USED-PAGES"] < 0.015,
    "celda-borde-rojo": params =>
        params.data["USED-PAGES"] > 8,
    "celda-borde-amarillo": params =>
        params.data["USED-PAGES"] > 1 & params.data["USED-PAGES"] <= 8,
    "celda-borde-verde": params =>
        params.data["USED-PAGES"] <= 1

}
