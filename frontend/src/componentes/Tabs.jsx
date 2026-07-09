import { useState, useEffect } from "react";
import { getDuplicados, getLookup, getFrag, getCosto, getContenidos, getConexionActual, cerrarSesion } from "../services/api";
import { duplicadosColumnDefs, duplicadosRules } from "../config/duplicados";
import { lookupColumnDefs, lookupRules } from "../config/lookup";
import { fragColumnDefs, fragRules } from "../config/frag";
import { costoColumnDefs, costoRules } from "../config/costo-beneficio";
import { contenidosColumnDefs, contenidosRules } from "../config/contenidos";
import DataTable from "./DataTable";
import ModalConexion from "./ModalConexion";
import Navbar from "./Navbar";
import "./Modal.css";

const TABS = [
  { id: "duplicados", label: "Duplicados" },
  { id: "lookup", label: "Heap Lookup" },
  { id: "frag", label: "Fragmentación - pagefullness" },
  { id: "costo", label: "Costo" },
  { id: "contenidos", label: "Contenidos" },
];

function Tabs() {

  const [data, setData] = useState([]);
  const [columnDefs, setColumnDefs] = useState([]);
  const [rowClassRules, setRowClassRules] = useState({});
  const [tabActiva, setTabActiva] = useState(null);

  // Modal genérico que muestra los datos de una fila (por ejemplo, desde
  // el botón "Acción" de lookup)
  const [modalOpen, setModalOpen] = useState(false);
  const [modalFila, setModalFila] = useState(null);

  // Modal de comparación contenedor vs contenido (índices redundantes)
  const [comparacion, setComparacion] = useState(null);

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

  const handleCerrarSesion = async () => {
    try {
      await cerrarSesion();
    } catch (err) {
      console.error("No se pudo cerrar la sesión en el backend", err);
    } finally {
      // La sesión se limpia igual en el frontend aunque falle la llamada,
      // para que la BD nunca quede accesible "abierta" en pantalla.
      setConexion(null);
      setData([]);
      setColumnDefs([]);
      setRowClassRules({});
      setTabActiva(null);
    }
  };

  const abrirModalConFila = (fila) => {
    setModalFila(fila);
    setModalOpen(true);
  };

  const abrirModalComparacion = ({ contenido, contenedor }) => {
    setComparacion({ contenido, contenedor });
  };

  const cerrarModalComparacion = () => {
    setComparacion(null);
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

  const CARGADORES = {
    duplicados: cargarDuplicados,
    lookup: cargarHeap,
    frag: cargarFrag,
    costo: cargarCosto,
    contenidos: cargarContenidos,
  };

  const seleccionarTab = (tab) => {
    setTabActiva(tab.id);
    CARGADORES[tab.id]?.();
  };

  return (
    <div>

      <Navbar
        tabs={TABS}
        tabActiva={tabActiva}
        onSeleccionar={seleccionarTab}
        conexion={conexion}
        onCambiarBD={() => setModalConexionAbierto(true)}
        onCerrarSesion={handleCerrarSesion}
      />

      <div className="tabs-contenido">

      <DataTable
        data={data}
        columnDefs={columnDefs}
        rowClassRules={rowClassRules}
        context={{ abrirModalConFila, abrirModalComparacion }}
        titulo={TABS.find((t) => t.id === tabActiva)?.label}
        tabId={tabActiva}
      />

      </div>

      {modalOpen && modalFila && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Detalle de la fila</h3>
            <div className="modal-detalle">
              {Object.entries(modalFila).map(([campo, valor]) => (
                <div key={campo} className="modal-detalle-fila">
                  <span className="modal-detalle-campo">{campo}</span>
                  <span className="modal-detalle-valor">{String(valor)}</span>
                </div>
              ))}
            </div>
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
          conexionActual={conexion}
          onCerrar={() => setModalConexionAbierto(false)}
          onExito={(nuevaConexion) => {
            setModalConexionAbierto(false);
            if (nuevaConexion) setConexion(nuevaConexion);
          }}
        />
      )}

      {comparacion && (
        <div className="modal-overlay">
          <div className="modal modal-comparacion">
            <h3>Contenedor vs Contenido</h3>

            <div className="comparacion-columnas">
              <div className="comparacion-col">
                <span className="comparacion-etiqueta">Contenedor</span>
                <strong>{comparacion.contenedor?.INDICE ?? "—"}</strong>
                <span className="comparacion-atributos">
                  {comparacion.contenedor?.ATRIBUTOS ?? "—"}
                </span>
              </div>

              <div className="comparacion-col">
                <span className="comparacion-etiqueta">Contenido</span>
                <strong>{comparacion.contenido?.INDICE ?? "—"}</strong>
                <span className="comparacion-atributos">
                  {comparacion.contenido?.ATRIBUTOS ?? "—"}
                </span>
              </div>
            </div>

            <div className="comparacion-resumen">
              <div className="comparacion-resumen-item">
                <span>Diferencia de tamaño</span>
                <strong>
                  {(
                    (Number(comparacion.contenedor?.["TAMANO-TOTAL"]) || 0) -
                    (Number(comparacion.contenido?.["TAMANO-TOTAL"]) || 0)
                  ).toFixed(2)} MB
                </strong>
              </div>
              <div className="comparacion-resumen-item">
                <span>Seeks del índice contenido</span>
                <strong>{comparacion.contenido?.USER_SEEKS ?? 0}</strong>
              </div>
              <div className="comparacion-resumen-item">
                <span>Scans del índice contenido</span>
                <strong>{comparacion.contenido?.USER_SCANS ?? 0}</strong>
              </div>
              <div className="comparacion-resumen-item">
                <span>Updates del índice contenido</span>
                <strong>{comparacion.contenido?.USER_UPDATES ?? 0}</strong>
              </div>
            </div>

            <div className="modal-buttons">
              <button onClick={cerrarModalComparacion}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>

  );
}

export default Tabs;
