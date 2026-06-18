import { useState } from "react";
import {getDuplicados,getLoockup} from "../services/api";
import {duplicadosColumnDefs,duplicadosRules} from "../config/duplicados";
import {loockupColumnDefs,loockupRules} from "../config/loockup";
import DataTable from "./DataTable";
import { getLoockup } from "../services/api";

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

    const resultado = await getLoockup();

    setData(resultado.data);
    setColumnDefs(loockupColumnDefs);
    setRowClassRules(loockupRules);
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