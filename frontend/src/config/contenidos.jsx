

  export const contenidosColumnDefs = [
    {checkboxSelection: params => params.data.MANTENER?.startsWith("Contenidopor"), headerCheckboxSelection: true, width: 60,
        headerCheckboxSelectionFilteredOnly: true
    },
    {headerName: "Prioridad",flex: 1,
        valueGetter: params =>
        params.data.MANTENER?.startsWith("Contenidopor")
            ? getPrioridad(params.data["USED-PAGES"])
            : null
    },

    {field: "TABLA", flex: 1},
    {field: "INDICE", flex: 2},
    {field: "USED-PAGES", flex: 1,hide: true},
    {field: "TIPO", flex: 1,
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
      {field: "EVALUACION_CONTENIDO", flex: 1}
    
];

const getPrioridad = (usedPages) => {
    if (usedPages > 8)  return "🌟 Alta"
    if (usedPages > 1)  return "🔽 Poco relevante"
    return "⛔ No relevante"
}

export const contenidosRules = {
    "fila-peso": params =>
        params.data["USED-PAGES"] < 1
}
