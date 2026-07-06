const API_URL = "http://localhost:8000";

export async function uploadFiles(formData) {

  const response = await fetch(
    `${API_URL}/upload`,
    {
      method: "POST",
      body: formData
    }
  );

  return response.json();
}

export async function conectarYExportar(form) {
  const res = await fetch("http://localhost:8000/conectar-y-exportar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(form),
  });

  if (!res.ok) {
    throw new Error(`Error HTTP: ${res.status}`);
  }

  return await res.json(); // retorna { ok, mensaje }
}


export async function getCosto() {

  const response = await fetch(
    `${API_URL}/costo-beneficio`
  );

  return response.json();
}

export async function getContenidos() {

  const response = await fetch(
    `${API_URL}/contenidos`
  );

  return response.json();
}

export async function getFrag() {

  const response = await fetch(
    `${API_URL}/frag-pag`
  );

  return response.json();
}

export async function getLookup() {

  const response = await fetch(
    `${API_URL}/heap-lookup`
  );

  return response.json();
}

export async function getDuplicados() {

  const response = await fetch(
    `${API_URL}/duplicados`
  );

  return response.json();
}
export async function getConexionActual() {
  const response = await fetch(`${API_URL}/conexion-actual`);
  return response.json();
}


