import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

import "./DataTable.css";

function DataTable({ data }) {

  if (!data || data.length === 0) {
    return <div>Sin datos</div>;
  }

  const columnDefs = [
    {checkboxSelection: true, headerCheckboxSelection: true, width: 60},
    {field: "TABLA", flex: 1},
    {field: "INDICE", flex: 1},
    {field: "ATRIBUTOS", flex: 1},
    {field: "TYPE_DESC", flex: 1},
    {field: "IS_PRIMARY_KEY", flex: 1},
    {field: "IS_UNIQUE", flex: 1},
    {field: "EVALUACION_INDICE", flex: 1},
    {field: "USED-PAGES", flex: 1}
];


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

  <div className="tabla-container">
    
    <div
      className="ag-theme-alpine"
      style={{
        height: "700px",
        width: "80%"
      }}
    >
      <AgGridReact
        rowData={data}
        columnDefs={columnDefs}

        rowSelection="multiple"

        defaultColDef={{
          sortable: true,
          filter: true,
          resizable: true
        }}

        rowClassRules={{
          "fila-pk": params =>
            params.data.IS_PK == 1,

          "fila-duplicado": params =>
            params.data.MANTENER == 0,


          "nada": params =>
            String(params.data.TABLA).trim() ===
            "RentaEncasillamiento"
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

