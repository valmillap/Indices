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

export async function getContenidos() {

  const response = await fetch(
    `${API_URL}/contenidos`
  );

  return response.json();
}

export async function getCostoBeneficio() {

  const response = await fetch(
    `${API_URL}/costo-beneficio`
  );

  return response.json();
}