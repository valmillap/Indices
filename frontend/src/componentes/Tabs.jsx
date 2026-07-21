import { useState, useEffect, useRef } from "react";
import * as XLSX from "xlsx";
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
  const dataTableRef = useRef(null);
  const [exportandoImagenes, setExportandoImagenes] = useState(false);
  const [exportandoExcel, setExportandoExcel] = useState(false);

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

  /**
   * Recorre las 5 pestañas UNA vez, carga sus datos, captura cada tabla
   * como imagen (mostrando todas sus filas) y descarga un PNG por tabla.
   * Evita tener que exportar tabla por tabla a mano.
   */
  const exportarTodoImagenes = async () => {
    if (exportandoImagenes) return;
    setExportandoImagenes(true);

    const tabOriginal = tabActiva;
    const fecha = new Date().toLocaleDateString("es-CL").replaceAll("/", "-");

    try {
      for (let i = 0; i < TABS.length; i++) {
        const tab = TABS[i];

        setTabActiva(tab.id);
        await CARGADORES[tab.id]?.();

        // Esperar a que React monte/actualice el DataTable con los datos
        // recién cargados antes de intentar capturarlo.
        await new Promise((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(resolve))
        );

        const imagen = await dataTableRef.current?.capturarComoImagen();
        if (!imagen) continue;

        const link = document.createElement("a");
        link.href = imagen.dataUrl;
        link.download = `${tab.label}_${fecha}.png`;
        link.click();

        // Pausa breve entre descargas: el navegador puede bloquear varias
        // descargas automáticas seguidas si van todas de golpe.
        await new Promise((resolve) => setTimeout(resolve, 400));
      }
    } finally {
      // Volver a la pestaña que el usuario tenía abierta antes de exportar.
      if (tabOriginal) {
        setTabActiva(tabOriginal);
        await CARGADORES[tabOriginal]?.();
      }
      setExportandoImagenes(false);
    }
  };

  /**
   * Trae los datos crudos (texto real, no imágenes) de las 5 tablas
   * directamente del backend y arma un solo Excel con una hoja por tabla.
   * A diferencia del PDF, no necesita cambiar de pestaña ni esperar a que
   * se dibuje nada: solo pide los datos y los vuelca en el archivo.
   */
  const exportarTodoExcel = async () => {
    if (exportandoExcel) return;
    setExportandoExcel(true);

    try {
      const fuentes = [
        { nombre: "Duplicados", pedir: getDuplicados },
        { nombre: "Heap Lookup", pedir: getLookup },
        { nombre: "Fragmentacion", pedir: getFrag },
        { nombre: "Costo", pedir: getCosto },
        { nombre: "Contenidos", pedir: getContenidos },
      ];

      const libro = XLSX.utils.book_new();

      for (const { nombre, pedir } of fuentes) {
        const resultado = await pedir();
        const filas = resultado?.data ?? [];
        const hoja = XLSX.utils.json_to_sheet(
          filas.length > 0 ? filas : [{ Info: "Sin datos" }]
        );
        XLSX.utils.book_append_sheet(libro, hoja, nombre.slice(0, 31));
      }

      const fecha = new Date().toLocaleDateString("es-CL").replaceAll("/", "-");
      XLSX.writeFile(libro, `Reporte_Indices_${fecha}.xlsx`);
    } finally {
      setExportandoExcel(false);
    }
  };

  // Apenas hay una conexión activa (recién conectado, BD cambiada, o ya
  // estaba conectado al entrar a la app), se selecciona y carga "Duplicados"
  // automáticamente en vez de dejar la pantalla vacía hasta que el usuario
  // haga clic en una pestaña.
  useEffect(() => {
    if (conexion) {
      seleccionarTab(TABS[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conexion]);

  return (
    <div>

      <Navbar
        tabs={TABS}
        tabActiva={tabActiva}
        onSeleccionar={seleccionarTab}
        conexion={conexion}
        onCambiarBD={() => setModalConexionAbierto(true)}
        onCerrarSesion={handleCerrarSesion}
        onExportarTodo={exportarTodoImagenes}
        exportandoTodo={exportandoImagenes}
        onExportarTodoExcel={exportarTodoExcel}
        exportandoExcel={exportandoExcel}
      />

      <div className="tabs-contenido">

      <DataTable
        ref={dataTableRef}
        data={data}
        columnDefs={columnDefs}
        rowClassRules={rowClassRules}
        context={{ abrirModalConFila, abrirModalComparacion }}
        titulo={TABS.find((t) => t.id === tabActiva)?.label}
        tabId={tabActiva}
        filtroExterno={
          tabActiva === "contenidos"
            ? (fila) => !String(fila.MANTENER).startsWith("Contenedor")
            : undefined
        }
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