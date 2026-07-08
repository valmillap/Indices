import { useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

import "./DataTable.css";

function DataTable({ data, columnDefs, rowClassRules, toolbar, context, titulo }) {

  const gridRef = useRef(null);
  const tablaRef = useRef(null);
  const [exportando, setExportando] = useState(false);

  if (!data || data.length === 0) {
    return <div>Sin datos</div>;
  }

  /**
   * Exporta la tabla a PDF usando html2canvas + jsPDF, tomando el DOM real
   * de ag-grid (con sus reglas de fila/celda y su estilo tal cual se ven en
   * pantalla), mostrando TODAS las filas aunque la tabla tenga paginación.
   *
   * ag-grid solo mantiene en el DOM las filas visibles en su viewport
   * (virtualización), así que no basta con desactivar la paginación: hay
   * que cambiar el layout a "autoHeight" para que el grid crezca y
   * renderice todas las filas de una vez, sin scroll interno.
   */
  const exportarPDF = async () => {
    const api = gridRef.current?.api;
    if (!api || !tablaRef.current) return;

    setExportando(true);
    try {
      // Esperar a que React quite la altura fija del contenedor (ver estilo
      // condicionado por "exportando" más abajo) antes de tocar el grid.
      await new Promise((resolve) => requestAnimationFrame(resolve));

      // 1) Sin paginación y con autoHeight: ag-grid renderiza TODAS las
      // filas en el DOM, sin virtualizar ni recortar por scroll.
      api.setGridOption("pagination", false);
      api.setGridOption("domLayout", "autoHeight");

      // Esperar a que ag-grid vuelva a renderizar con todas las filas.
      await new Promise((resolve) => {
        const listener = () => {
          api.removeEventListener("modelUpdated", listener);
          resolve();
        };
        api.addEventListener("modelUpdated", listener);
        // Por si el evento no llega a dispararse, hay un respaldo con timeout.
        setTimeout(resolve, 500);
      });

      // Dar un par de frames extra al navegador para pintar todas las filas.
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

      // 2) Capturar el DOM de la tabla tal como se ve (clases, colores, pills, etc).
      const canvas = await html2canvas(tablaRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        windowWidth: tablaRef.current.scrollWidth,
        windowHeight: tablaRef.current.scrollHeight,
      });

      // 3) Armar el PDF, partiendo la imagen en varias páginas si es muy alta.
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "pt",
        format: "a4",
      });

      const margin = 24;
      const pageWidth = pdf.internal.pageSize.getWidth() - margin * 2;
      const pageHeight = pdf.internal.pageSize.getHeight() - margin * 2;

      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const imgData = canvas.toDataURL("image/png");

      const nombreTabla = titulo || "tabla";
      const fecha = new Date().toLocaleDateString("es-CL");

      pdf.setFontSize(12);
      pdf.text(`${nombreTabla} - ${fecha}`, margin, margin - 6);

      let heightLeft = imgHeight;
      let position = margin;

      pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft * -1 + margin;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${nombreTabla}_${fecha.replaceAll("/", "-")}.pdf`);
    } catch (err) {
      console.error("Error exportando PDF", err);
    } finally {
      // 4) Restaurar el layout y la paginación originales de la tabla.
      api.setGridOption("domLayout", "normal");
      api.setGridOption("pagination", true);
      setExportando(false);
    }
  };

  return (
    <div className="panel">

  <div className="panel-info-container">
    <div className="panel-info">
      <h3>1</h3>

      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
         incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, 
         quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
      </p>
    </div>

    <div className="panel-info">
      <h3>2</h3>

      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
         incididunt ut labore et dolore magna aliqua.
      </p>
    </div>

  </div>

  <div className="tabla-toolbar">
    <button
      className="btn-exportar-pdf"
      onClick={exportarPDF}
      disabled={exportando}
    >
      {exportando ? "Generando PDF..." : "Exportar PDF"}
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
}

export default DataTable;
