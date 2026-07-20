

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
    {field: "TAMANO-TOTAL", flex: 1,hide: false},
    {field: "TABLA", flex: 1,hide: true},
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
                    <span className="mantener-duplica">Contenido por </span>
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
      {field: "EVALUACION_CONTENIDO", flex: 1},
      { headerName: "", width: 90,
        cellRenderer: params => {
            const esContenido = String(params.data.MANTENER).startsWith("Contenidopor")
            if (!esContenido) return null

            const nombreContenedor = String(params.data.MANTENER).trim().split(" ").slice(1).join(" ")

            return (
                <button
                    onClick={() => {
                        let contenedor = null
                        params.api.forEachNode(node => {
                            if (
                                node.data.TABLA === params.data.TABLA &&
                                node.data.INDICE === nombreContenedor
                            ) {
                                contenedor = node.data
                            }
                        })
                        params.context.abrirModalComparacion({
                            contenido: params.data,
                            contenedor,
                        })
                    }}
                >
                    Comparar
                </button>
            )
        }
      }
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
