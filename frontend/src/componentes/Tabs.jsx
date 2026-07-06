import { useState, useEffect } from "react";
import { getDuplicados, getLookup, getFrag, getCosto, getContenidos, getConexionActual } from "../services/api";
import { duplicadosColumnDefs, duplicadosRules } from "../config/duplicados";
import { lookupColumnDefs, lookupRules } from "../config/lookup";
import { fragColumnDefs, fragRules } from "../config/frag";
import { costoColumnDefs, costoRules } from "../config/costo-beneficio";
import { contenidosColumnDefs, contenidosRules } from "../config/contenidos";
import DataTable from "./DataTable";
import ModalConexion from "./ModalConexion";
import "./Modal.css";

function Tabs() {

  const [data, setData] = useState([]);
  const [columnDefs, setColumnDefs] = useState([]);
  const [rowClassRules, setRowClassRules] = useState({});

  // Modal genérico de texto (usado por ejemplo desde el botón "Acción" de lookup)
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTexto, setModalTexto] = useState("");

  // Conexión activa (servidor / BD) y modal para cambiarla
  const [conexion, setConexion] = useState(null);
  const [modalConexionAbierto, setModalConexionAbierto] = useState(false);

  useEffect(() => {
    cargarConexionActual();
  }, []);

  const cargarConexionActual = async () => {
    try {
      const resultado = await getConexionActual();
      if (resultado.conectado) {
        setConexion(resultado);
      }
    } catch (err) {
      console.error("No se pudo obtener la conexión actual", err);
    }
  };

  const abrirModalConTexto = (texto) => {
    setModalTexto(texto);
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

      {conexion && (
        <div className="conexion-banner">
          <span>
            Conectado a: <strong>{conexion.database}</strong> ({conexion.server})
          </span>
          <button onClick={() => setModalConexionAbierto(true)}>
            Cambiar base de datos
          </button>
        </div>
      )}

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
        context={{ abrirModalConTexto }}
      />

      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Modal</h3>
            <p>{modalTexto}</p>
            <div className="modal-buttons">
              <button onClick={cerrarModal}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cambiar de BD sin salir de la pantalla ni perder los datos ya cargados */}
      {modalConexionAbierto && (
        <ModalConexion
          onCerrar={() => setModalConexionAbierto(false)}
          onExito={async () => {
            setModalConexionAbierto(false);
            await cargarConexionActual();
          }}
        />
      )}

    </div>

  );
}

export default Tabs;
