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

export async function getLoockup() {

  const response = await fetch(
    `${API_URL}/heap-loockup`
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