import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";


import "./DataTable.css";
function DataTable({ data, columnDefs, rowClassRules}) {

  if (!data || data.length === 0) {
    return <div>Sin datos</div>;
  }

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
        rowClassRules={rowClassRules}

        defaultColDef={{
            sortable: true,
            filter: true,
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

