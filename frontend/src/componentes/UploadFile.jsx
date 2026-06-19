import { useState } from "react";
import { uploadFiles, conectarYExportar } from "../services/api";
import ModalConexion from "./ModalConexion";


function UploadFiles({ onUploadSuccess }) {

  const [atributos, setAtributos] = useState(null);
  const [uso, setUso] = useState(null);
  const [frag, setFrag] = useState(null);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [mensaje, setMensaje] = useState("");
  
  const handleUpload = async () => {

    const formData = new FormData();

    formData.append("atributos", atributos);
    formData.append("uso", uso);
    formData.append("frag", frag);

    await uploadFiles(formData);

    onUploadSuccess();
  };

  return (
    <div>

      <input
        type="file"
        onChange={(e) =>
          setAtributos(e.target.files[0])
        }
      />

      <input
        type="file"
        onChange={(e) =>
          setUso(e.target.files[0])
        }
      />

      <input
        type="file"
        onChange={(e) =>
          setFrag(e.target.files[0])
        }
      />
      <button onClick={() => setModalAbierto(true)}>
        Conectar 
      </button>

      {mensaje && <p>{mensaje}</p>}

      {modalAbierto && (
        <ModalConexion
          onCerrar={() => setModalAbierto(false)}
          onExito={() => {
            setModalAbierto(false);
            setMensaje("Archivo exportado correctamente");
          }}
        />
      )}

      <button onClick={handleUpload}>
        Analizar
      </button>


    </div>
  );
}

export default UploadFiles;