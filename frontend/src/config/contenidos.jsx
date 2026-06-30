

  export const contenidosColumnDefs = [
    {checkboxSelection: true, headerCheckboxSelection: true, width: 60},
    {headerName: "Prioridad",flex:1,
    valueGetter: params => getPrioridad(params.data["USED-PAGES"])},

    {field: "TABLA", flex: 1},
    {field: "INDICE", flex: 1},
    {field: "USED-PAGES", flex: 1,hide: true},
    { field: "TYPE_DESC", flex: 1,
        cellClassRules:{
           "celda-punto": params =>
            String(params.data.TYPE_DESC).trim() === "CLUSTERED", 
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
      { headerName:"ACCIÓN",field: "MANTENER",flex: 2,wrapText: true, autoHeight: true,
        cellClassRules: {
            "celda-contenedor": params =>
              String(params.data.MANTENER).startsWith("Contenedor"),
          },
       cellRenderer: params => {
            const valor = String(params.data.MANTENER).trim()
            if (!valor.startsWith("Contenido")) return valor

            const [, ...resto] = valor.split(" ")
            const indice = resto.join(" ")

            return (
                <span className="mantener-wrapper">
                    <span className="mantener-duplica">Contenido </span>
                    <span className="mantener-indice">{indice}</span>
                </span>
            )
        }
    },
      { headerName:"EFECTO DE ELIMINAR",field: "BENEFICIO", flex: 2, wrapText: true,
        autoHeight: true,
          cellClassRules: {
              "celda-interlineado": params =>
              String(params.data.MANTENER).startsWith("Contenidopor")
          }

      },
      {field: "EVALUACION_CONTENIDO", flex: 2}
    
];

const getPrioridad = (usedPages) => {
    if (usedPages > 8)  return "🌟 Alta"
    if (usedPages > 1)  return "🔽 Poco relevante"
    return "⛔ No relevante"
}

export const contenidosRules = {

}
