import { useState } from "react";
import { conectarYExportar } from "../services/api";

export default function ModalConexion({ onCerrar, onExito }) {
  const [form, setForm] = useState({
    server: "", database: "", user: "", password: ""
  });
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleConectar = async () => {
    setCargando(true);
    try {
      const data = await conectarYExportar(form);
      setMensaje(data.mensaje);
      if (data.ok) onExito();
    } catch (err) {
      setMensaje("Error al conectar");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2>Datos de Conexión</h2>

        {["server", "database", "user"].map((campo) => (
          <div key={campo} style={styles.campo}>
            <label>{campo}</label>
            <input
              name={campo}
              value={form[campo]}
              onChange={handleChange}
              placeholder={campo}
            />
          </div>
        ))}

        <div style={styles.campo}>
          <label>password</label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="contraseña"
          />
        </div>

        {mensaje && <p>{mensaje}</p>}

        <div style={styles.botones}>
          <button onClick={onCerrar}>Cancelar</button>
          <button onClick={handleConectar} disabled={cargando}>
            {cargando ? "Conectando..." : "Conectar"}
          </button>
        </div>
      </div>
    </div>
  );
}
/*quitar*/
const styles = {
  overlay: {
    position: "fixed", inset: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex", alignItems: "center", justifyContent: "center"
  },
  modal: {
    background: "white", padding: "2rem",
    borderRadius: "8px", minWidth: "320px",
    display: "flex", flexDirection: "column", gap: "1rem"
  },
  campo: { display: "flex", flexDirection: "column", gap: "4px" },
  botones: { display: "flex", justifyContent: "flex-end", gap: "1rem" }
};