import { useState } from "react";
import { getDuplicados } from "../services/api";
import DataTable from "./DataTable";

function Tabs() {

  const [data, setData] = useState([]);

  const cargarDuplicados = async () => {

    const resultado = await getDuplicados();

    setData(resultado.data);
  };

  return (
    <div>

      <button onClick={cargarDuplicados}>
        Duplicados
      </button>

      <DataTable data={data} />

    </div>
  );
}

export default Tabs;