import { useState } from "react";
import { getDuplicados } from "../services/api";
import DataTable from "./DataTable";
import { getLoockup } from "../services/api";

function Tabs() {

  const [data, setData] = useState([]);

  const cargarDuplicados = async () => {

    const resultado = await getDuplicados();

    setData(resultado.data);
  };

  const cargarHeap = async () => {

    const resultado = await getLoockup();

    setData(resultado.data);
  };

  return (
    <div>

      <button onClick={cargarDuplicados}>
        Duplicados
      </button>
      <button onClick={cargarHeap}>
        Loockup
      </button>

      <DataTable data={data} />

    </div>
  );
}

export default Tabs;