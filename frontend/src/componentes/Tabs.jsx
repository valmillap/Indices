import { useState } from "react";
import {getDuplicados, getLookup, getFrag } from "../services/api";
import {duplicadosColumnDefs, duplicadosRules} from "../config/duplicados";
import {lookupColumnDefs, lookupRules} from "../config/lookup";
import { fragColumnDefs, fragRules } from "../config/frag";
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

  const cargarFrag = async () => {
    const resultado = await getFrag();

    setData(resultado.data);
    setColumnDefs(fragColumnDefs);
    setRowClassRules(fragRules);
  };

  return (
    <div>

      <button onClick={cargarDuplicados}>
        Duplicados
      </button>

      <button onClick={cargarHeap}>
        Heap Lookup
      </button>

      <button onClick={cargarFrag}>
        Fragmentacion- pagefullness
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