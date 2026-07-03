import { useState } from "react";
import {getDuplicados, getLookup, getFrag, getCosto, getContenidos } from "../services/api";
import {duplicadosColumnDefs, duplicadosRules} from "../config/duplicados";
import {lookupColumnDefs, lookupRules} from "../config/lookup";
import { fragColumnDefs, fragRules } from "../config/frag";
import { costoColumnDefs,costoRules } from "../config/costo-beneficio";
import { contenidosColumnDefs, contenidosRules } from "../config/contenidos";
import DataTable from "./DataTable";

function Tabs() {

  const [data, setData] = useState([]);
  const [columnDefs, setColumnDefs] = useState([]);
  const [rowClassRules, setRowClassRules] = useState({});
  const [modalOpen, setModalOpen] = useState(false);

  const abrirModal = () => {
      console.log("CLICK OK");
    setModalOpen(true);
  };

  const cerrarModal = () => {
    setModalOpen(false);
  };

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

  const cargarCosto = async () => {
    const resultado = await getCosto();

    setData(resultado.data);
    setColumnDefs(costoColumnDefs);
  };

  const cargarContenidos = async () => {
    const resultado = await getContenidos();

    setData(resultado.data);
    setColumnDefs(contenidosColumnDefs);
    setRowClassRules(contenidosRules);
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

      <button onClick={cargarCosto}>
        Costo
      </button>

      <button onClick={cargarContenidos}>
        Contenidos
      </button>

      <DataTable
        data={data}
        columnDefs={columnDefs}
        rowClassRules={rowClassRules}
      />
      {modalOpen && (
        <div className="modal">
          <div className="modal-content">

            <h3>Modal</h3>

            <button onClick={cerrarModal}>
              Cerrar
            </button>

          </div>
        </div>
      )}


    </div>
    
  );
}

export default Tabs;