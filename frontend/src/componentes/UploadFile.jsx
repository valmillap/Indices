import { useState } from "react";
import { uploadFiles } from "../services/api";

function UploadFiles({ onUploadSuccess }) {

  const [atributos, setAtributos] = useState(null);
  const [uso, setUso] = useState(null);
  const [frag, setFrag] = useState(null);

  const handleUpload = async () => {

    const formData = new FormData();

    formData.append("atributos", atributos);
    formData.append("uso", uso);
    formData.append("frag", frag);

    await uploadFiles(formData);

    onUploadSuccess();
  };
const generarCsv = async () => {

    const response = await fetch(
        "http://localhost:8000/generar-csv",
        {
            method: "POST"
        }
    );

    const data = await response.json();

    alert(data.mensaje);
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
      {/*
      <button onClick={generarCsv}>
        Generar CSV
      </button>*/}

      <button onClick={handleUpload}>
        Analizar
      </button>

    </div>
  );
}

export default UploadFiles;