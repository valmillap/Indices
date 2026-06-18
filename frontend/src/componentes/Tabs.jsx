import { useState } from "react";
import {getDuplicados,getLookup} from "../services/api";
import {duplicadosColumnDefs,duplicadosRules} from "../config/duplicados";
import {lookupColumnDefs,lookupRules} from "../config/lookup";
import DataTable from "./DataTable";

function Tabs() {

  const [data, setData] = useState([]);
  const [columnDefs, setColumnDefs] = useState([]);
  const [rowClassRules, setRowClassRules] = useState({});
  const cargarDuplicados = async () => {

    const resultado = await getDuplicados();

    setData(resultado.data);
    setColumnDefs(duplicadosColumnDefs);
    setRowClassRules(duplicadosRules);
  };

  const cargarHeap = async () => {

    const resultado = await getLookup();

    setData(resultado.data);
    setColumnDefs(lookupColumnDefs);
    setRowClassRules(lookupRules);
  };

  return (
    <div>

      <button onClick={cargarDuplicados}>
        Duplicados
      </button>
      <button onClick={cargarHeap}>
        Heap Lookup
      </button>

      <DataTable
        data={data}
        columnDefs={columnDefs}
        rowClassRules={rowClassRules}
      />

    </div>
  );
}

export default Tabs;