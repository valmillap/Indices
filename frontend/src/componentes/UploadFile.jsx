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
    formData.append("fragmentacion-pagefullness", frag);

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

      <button onClick={handleUpload}>
        Analizar
      </button>

    </div>
  );
}

export default UploadFiles;