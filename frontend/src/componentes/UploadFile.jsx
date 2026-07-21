import { useState } from "react";
import { uploadFiles } from "../services/api";
import ModalConexion from "./ModalConexion";
import "./UploadFile.css";


function UploadFiles({ onUploadSuccess }) {

  const [atributos, setAtributos] = useState(null);
  const [uso, setUso] = useState(null);
  const [frag, setFrag] = useState(null);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  const archivosCompletos = atributos && uso && frag;

  const handleUpload = async () => {
    if (!archivosCompletos) return;

    setCargando(true);
    setMensaje("");
    try {
      const formData = new FormData();
      formData.append("atributos", atributos);
      formData.append("uso", uso);
      formData.append("frag", frag);

      await uploadFiles(formData);
      onUploadSuccess();
    } catch (err) {
      setMensaje("No se pudo analizar los archivos");
    } finally {
      setCargando(false);
    }
  };

  const SelectorArchivo = ({ etiqueta, archivo, onChange }) => (
    <label className="upload-campo">
      <span className="upload-campo-etiqueta">{etiqueta}</span>
      <span className="upload-campo-input">
        <span className="upload-campo-nombre">
          {archivo ? archivo.name : "Ningún archivo seleccionado"}
        </span>
        <span className="upload-campo-boton">Elegir archivo</span>
      </span>
      <input type="file" onChange={(e) => onChange(e.target.files[0])} />
    </label>
  );

  return (
    <div className="upload-pantalla">
      <div className="upload-card">
        <h2>Analizador de índices</h2>
        <p className="upload-subtitulo">
          Sube los 3 archivos exportados o conéctate directo a la base de datos.
        </p>

        <div className="upload-campos">
          <SelectorArchivo etiqueta="Atributos" archivo={atributos} onChange={setAtributos} />
          <SelectorArchivo etiqueta="Uso / tamaño" archivo={uso} onChange={setUso} />
          <SelectorArchivo etiqueta="Fragmentación" archivo={frag} onChange={setFrag} />
        </div>

        {mensaje && <p className="upload-mensaje">{mensaje}</p>}

        <div className="upload-botones">
          <button className="upload-btn-secundario" onClick={() => setModalAbierto(true)}>
            Conectar a BD
          </button>
          <button
            className="upload-btn-primario"
            onClick={handleUpload}
            disabled={!archivosCompletos || cargando}
          >
            {cargando ? "Analizando..." : "Analizar archivos"}
          </button>
        </div>
      </div>

      {modalAbierto && (
        <ModalConexion
          onCerrar={() => setModalAbierto(false)}
          onExito={() => {
            setModalAbierto(false);
            setMensaje("Archivo exportado correctamente");
            onUploadSuccess();
          }}
        />
      )}
    </div>
  );
}

export default UploadFiles;