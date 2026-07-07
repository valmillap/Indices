import { useState } from "react";
import { conectarYExportar, cambiarBD } from "../services/api";
import "./Modal.css";

/**
 * Modal de conexión.
 * - Si no hay conexión activa (conexionActual == null): pide servidor, BD, usuario y password.
 * - Si ya hay una conexión activa: solo pide la BD nueva y reutiliza servidor/usuario/password
 *   guardados en el backend, sin pedirle al usuario que vuelva a escribir todo.
 */
export default function ModalConexion({ onCerrar, onExito, conexionActual }) {
  const yaConectado = Boolean(conexionActual);

  const [form, setForm] = useState({
    server: "", database: "", user: "", password: ""
  });
  const [databaseNueva, setDatabaseNueva] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleConectar = async () => {
    setCargando(true);
    setMensaje("");
    try {
      const data = await conectarYExportar(form);
      setMensaje(data.mensaje);
      if (data.ok) onExito(data.conexion);
    } catch (err) {
      setMensaje("Error al conectar");
    } finally {
      setCargando(false);
    }
  };

  const handleCambiarBD = async () => {
    if (!databaseNueva.trim()) {
      setMensaje("Escribe el nombre de la base de datos");
      return;
    }
    setCargando(true);
    setMensaje("");
    try {
      const data = await cambiarBD(databaseNueva.trim());
      setMensaje(data.mensaje);
      if (data.ok) onExito(data.conexion);
    } catch (err) {
      setMensaje("Error al cambiar de base de datos");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>{yaConectado ? "Cambiar base de datos" : "Datos de conexión"}</h3>

        {yaConectado ? (
          <>
            <p className="modal-conexion-actual">
              Conectado a <strong>{conexionActual.server}</strong> como{" "}
              <strong>{conexionActual.user}</strong>. Solo necesitas indicar
              la nueva base de datos.
            </p>

            <div className="modal-campo">
              <label>Nueva base de datos</label>
              <input
                value={databaseNueva}
                onChange={(e) => setDatabaseNueva(e.target.value)}
                placeholder={conexionActual.database}
                autoFocus
              />
            </div>
          </>
        ) : (
          <>
            {["server", "database", "user"].map((campo) => (
              <div key={campo} className="modal-campo">
                <label>{campo}</label>
                <input
                  name={campo}
                  value={form[campo]}
                  onChange={handleChange}
                  placeholder={campo}
                />
              </div>
            ))}

            <div className="modal-campo">
              <label>password</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="contraseña"
              />
            </div>
          </>
        )}

        {mensaje && <p className="modal-mensaje">{mensaje}</p>}

        <div className="modal-buttons">
          <button onClick={onCerrar}>Cancelar</button>
          <button
            className="modal-btn-primario"
            onClick={yaConectado ? handleCambiarBD : handleConectar}
            disabled={cargando}
          >
            {cargando
              ? (yaConectado ? "Cambiando..." : "Conectando...")
              : (yaConectado ? "Cambiar BD" : "Conectar")}
          </button>
        </div>
      </div>
    </div>
  );
}
