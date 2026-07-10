
 export const lookupColumnDefs = [
    {field: "TABLA", flex: 1, hide: false,
        cellRenderer: params => {
        if (params.data.TYPE_DESC === "HEAP") return params.value
        const filas = [];
        params.api.forEachNode(node => filas.push(node.data));

        const total = contarNoHeap(params.data.TABLA, filas);

        return total === 1
            ? "Causante lookup"
            : "Posible causante lookup";
    },
     cellClassRules: {
            "celda-heap": params =>
                String(params.data.TYPE_DESC).trim() == "HEAP",
            "celda-borde": params =>
                String(params.data.TYPE_DESC).trim() == "HEAP",
             "celda-italic": params =>
                String(params.data.TYPE_DESC).trim() == "NONCLUSTERED",
        }
    },
    {field: "INDICE", flex: 1,hide: false},
    {field: "TYPE_DESC", flex: 0.7,hide: false,
        cellRenderer: params => {
        if (params.value === "HEAP") {
            return <span className="pill-heap">{params.value}</span>;
            }
         if (params.value === "NONCLUSTERED") {
            return <span className="pill-nonc">{params.value}</span>;
            }
        }
    },
    {headerName:"LOOKUPS",field: "USER_LOOKUPS",flex: 0.5,hide: false,
       cellClassRules: {
            "celda-lookup": params =>
                Number(params.value) > 1000,
        },
        cellRenderer: params => {
        if (params.data["USER_LOOKUPS"] == 0) return ""
        return params.value
        }
    },
    {headerName:"SEEKS",field: "USER_SEEKS", flex: 0.4,hide: false},
    {headerName:"SCANS",field: "USER_SCANS",flex: 0.4,hide: false},
    {headerName: "COLUMNA",flex:1,hide:true,
    valueGetter: params => getColumna(params.data["TYPE_DESC"]),
    cellClassRules: {
            "celda-italic": params =>
                String(params.data.TYPE_DESC).trim() == "NONCLUSTERED",
        }
    },
    {headerName: "Acción", hide:true,
    cellRenderer: (params) => {
      return (
        <button
          onClick={() => {
            params.context.abrirModalConFila(params.data);

          }}
        >
          Click
        </button>
      );
    }
}
    
];
const contarNoHeap = (tabla, datos) => {
    return datos.filter(
        row =>
            row.TABLA === tabla &&
            row.TYPE_DESC !== "HEAP"
    ).length;
};


const getColumna = (type) => {
    if (type.trim() =="NONCLUSTERED")  return "algo"
    return " "
}

export const lookupRules = {
    "fila-heap": params =>
    String(params.data.TYPE_DESC).trim() == "HEAP",

    "fila-no-heap": params =>
    String(params.data.TYPE_DESC).trim() == "NONCLUSTERED" , /*clstered*/

    }

