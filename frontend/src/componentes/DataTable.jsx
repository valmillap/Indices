import { useRef, useState, forwardRef, useImperativeHandle } from "react";
import { AgGridReact } from "ag-grid-react";
import html2canvas from "html2canvas";
import * as XLSX from "xlsx";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

import { PANEL_INFO } from "../config/PanelInfo";
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
      api.setGridOption("suppressColumnVirtualisation", true);  

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
      api.setGridOption("suppressColumnVirtualisation", false);
      setExportando(false);
    }
  };

  // Permite que Tabs.jsx dispare la captura de esta tabla desde afuera,
  // para el botón "Exportar todo a PDF" (5 tablas en un solo archivo).
  useImperativeHandle(ref, () => ({
    capturarComoImagen,
  }));

  const descargarImagen = async () => {
    const imagen = await capturarComoImagen();
    if (!imagen) return;

    const nombreTabla = titulo || "tabla";
    const fecha = new Date().toLocaleDateString("es-CL").replaceAll("/", "-");

    const link = document.createElement("a");
    link.href = imagen.dataUrl;
    link.download = `${nombreTabla}_${fecha}.png`;
    link.click();
  };

  // Exporta los datos tal cual (texto real, no una imagen) a un archivo
  // Excel: se puede copiar, filtrar y editar en Excel/Sheets normalmente.
  const exportarExcel = () => {
    if (!data || data.length === 0) return;

    const nombreTabla = titulo || "tabla";
    const fecha = new Date().toLocaleDateString("es-CL");

    const hoja = XLSX.utils.json_to_sheet(data);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, nombreTabla.slice(0, 31));
    XLSX.writeFile(libro, `${nombreTabla}_${fecha.replaceAll("/", "-")}.xlsx`);
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
      className="btn-exportar-excel"
      onClick={exportarExcel}
    >
      Exportar a Excel
    </button>
    <button
      className="btn-descargar-imagen"
      onClick={descargarImagen}
      disabled={exportando}
    >
      {exportando ? "Generando imagen..." : "Descargar imagen (PNG)"}
    </button>
  </div>

  <div className="tabla-container">

    <div
      ref={tablaRef}
      className="ag-theme-alpine"
      style={{
        height: exportando ? "auto" : "700px",
        width: "100%",
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

        // Filtro opcional que oculta ciertas filas de la vista/paginación
        // sin sacarlas del modelo de datos (api.forEachNode las sigue
        // encontrando, útil para el botón "Comparar" en Contenidos).
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