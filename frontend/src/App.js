import { useState } from "react";

import UploadFiles from "./componentes/UploadFile";
import Tabs from "./componentes/Tabs";



function App() {

  const [uploaded, setUploaded] = useState(false);

  return (
    <div>

      {!uploaded && (
        <UploadFiles
          onUploadSuccess={() => setUploaded(true)}
        />
      )}

      {uploaded && (
        <Tabs />
      )}

    </div>
  );
}

export default App;