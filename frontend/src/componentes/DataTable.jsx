import { useRef, useState, forwardRef, useImperativeHandle } from "react";
import { AgGridReact } from "ag-grid-react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

import { PANEL_INFO } from "../config/PanelInfo";
import { agregarImagenAjustada } from "./pdfImagen";
import "./DataTable.css";

const DataTable = forwardRef(function DataTable(
  { data, columnDefs, rowClassRules, context, titulo, tabId, filtroExterno },
  ref
) {

  const gridRef = useRef(null);
  const tablaRef = useRef(null);
  const [exportando, setExportando] = useState(false);
  const info = PANEL_INFO[tabId];

  /**
   * Captura el DOM real de ag-grid como imagen, mostrando TODAS las filas
   * aunque la tabla tenga paginación (ver explicación de domLayout más abajo).
   * No arma el PDF acá: solo devuelve la imagen, para que tanto el botón
   * individual como la exportación combinada de las 5 tablas puedan usarla.
   */
  const capturarComoImagen = async () => {
    const api = gridRef.current?.api;
    if (!api || !tablaRef.current || !data || data.length === 0) return null;

    setExportando(true);
    try {
      // Esperar a que React quite la altura fija del contenedor (ver estilo
      // condicionado por "exportando" más abajo) antes de tocar el grid.
      await new Promise((resolve) => requestAnimationFrame(resolve));

      // Sin paginación y con autoHeight: ag-grid renderiza TODAS las filas
      // en el DOM, sin virtualizar ni recortar por scroll.
      api.setGridOption("pagination", false);
      api.setGridOption("domLayout", "autoHeight");

      await new Promise((resolve) => {
        const listener = () => {
          api.removeEventListener("modelUpdated", listener);
          resolve();
        };
        api.addEventListener("modelUpdated", listener);
        setTimeout(resolve, 500);
      });

      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

      const canvas = await html2canvas(tablaRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        windowWidth: tablaRef.current.scrollWidth,
        windowHeight: tablaRef.current.scrollHeight,
      });

      return {
        dataUrl: canvas.toDataURL("image/png"),
        width: canvas.width,
        height: canvas.height,
      };
    } finally {
      api.setGridOption("domLayout", "normal");
      api.setGridOption("pagination", true);
      setExportando(false);
    }
  };

  // Permite que Tabs.jsx dispare la captura de esta tabla desde afuera,
  // para el botón "Exportar todo a PDF" (5 tablas en un solo archivo).
  useImperativeHandle(ref, () => ({
    capturarComoImagen,
  }));

  const exportarPDF = async () => {
    const imagen = await capturarComoImagen();
    if (!imagen) return;

    const pdf = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
    const nombreTabla = titulo || "tabla";
    const fecha = new Date().toLocaleDateString("es-CL");

    agregarImagenAjustada(pdf, imagen.dataUrl, imagen.width, imagen.height, `${nombreTabla} - ${fecha}`);
    pdf.save(`${nombreTabla}_${fecha.replaceAll("/", "-")}.pdf`);
  };

  if (!data || data.length === 0) {
    return <div>Sin datos</div>;
  }

  return (
    <div className="panel">

  {info && (
    <div className="panel-info-container">
      <div className="panel-info">
        <h3>Descripción y ejemplo</h3>

        <p>{info.descripcion}</p>

        {info.ejemplo && info.ejemplo.length > 0 && (
          <table className="panel-info-ejemplo">
            <thead>
              <tr>
                <th>Tabla</th>
                <th>Índice</th>
                <th>Atributos</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {info.ejemplo.map((fila, i) => (
                <tr key={i}>
                  <td>{fila.tabla}</td>
                  <td>{fila.indice}</td>
                  <td>{fila.atributos}</td>
                  <td>{fila.accion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="panel-info">
        <h3>Criterio y beneficio</h3>

        <p className="panel-info-subtitulo">Criterio</p>
        <ul>
          {info.criterio.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>

        <p className="panel-info-subtitulo">Beneficio</p>
        <ul>
          {info.beneficio.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  )}

  <div className="tabla-toolbar">
    <button
      className="btn-exportar-pdf"
      onClick={exportarPDF}
      disabled={exportando}
    >
      {exportando ? "Generando PDF..." : "Exportar esta tabla a PDF"}
    </button>
  </div>

  <div className="tabla-container">

    <div
      ref={tablaRef}
      className="ag-theme-alpine"
      style={{
        height: exportando ? "auto" : "700px",
        width: "90%",
        overflow: exportando ? "visible" : undefined,
      }}
    >
        <AgGridReact
        ref={gridRef}
        rowData={data}
        columnDefs={columnDefs}
        rowClassRules={rowClassRules}
        rowSelection="multiple"
        context={context}

        /*filtro*/
        isExternalFilterPresent={filtroExterno ? () => true : undefined}
        doesExternalFilterPass={filtroExterno ? (node) => filtroExterno(node.data) : undefined}

        defaultColDef={{
            sortable: false,
            filter: false,
            resizable: true
        }}

        pagination={true}
        paginationPageSize={50}
    />
    </div>

  </div>

</div>

  );
});

export default DataTable;
