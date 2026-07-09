// Contenido de los dos paneles informativos que aparecen sobre cada tabla:
// izquierdo = Descripción y ejemplo, derecho = Criterio y beneficio.
// Se indexa por el mismo "id" de pestaña usado en Tabs.jsx (TABS).
export const PANEL_INFO= {
  duplicados: {
    descripcion:
      "Corresponden a índices que poseen exactamente los mismos atributos (columnas), por lo que cumplen la misma función dentro de una tabla.",
    ejemplo: [
      { tabla: "tabla1", indice: "indiceA", atributos: "col1, col2", accion: "—" },
      { tabla: "tabla1", indice: "indiceB", atributos: "col1, col2", accion: "Duplica a indiceA" },
    ],
    criterio: [
      "Se priorizan los índices Primary Key y Unique.",
      "Se considera duplicado el índice que no es Primary Key ni Unique cuando existe otro equivalente.",
    ],
    beneficio: [
      "Liberar espacio ocupado por índices redundantes.",
      "Reducir el costo de mantenimiento durante INSERT, UPDATE y DELETE.",
    ],
  },

  contenidos: {
    descripcion:
      "Un índice está contenido cuando existe otro índice que puede satisfacer las mismas búsquedas. El índice contenido posee un subconjunto de las columnas del índice contenedor.",
    ejemplo: [
      { tabla: "tabla1", indice: "indiceA", atributos: "col1, col2, col3, col4", accion: "Contenedor" },
      { tabla: "tabla1", indice: "indiceB", atributos: "col1, col2", accion: "Contenido por indiceA" },
    ],
    criterio: [
      "El índice contenido debe compartir las columnas iniciales del índice contenedor.",
      "El índice contenedor posee todas las columnas del contenido y una o más columnas adicionales.",
    ],
    beneficio: [
      "Disminuir la cantidad de índices redundantes.",
      "Reducir el espacio utilizado y el costo de mantenimiento sin afectar las búsquedas.",
    ],
  },

  // Solo RID Lookup: no es una comparación entre dos índices, sino el caso
  // en que un índice no-clustered obliga a volver a la tabla (HEAP) a
  // buscar el resto de las columnas usando el Row ID.
  lookup: {
    descripcion:
      "Ocurre en tablas HEAP (sin índice clustered): cuando una búsqueda usa un índice no-clustered que no tiene todas las columnas pedidas, SQL Server debe volver a la tabla usando el Row ID (RID) para completar la fila.",
    ejemplo: [
      { tabla: "tabla1", indice: "indiceA (no-clustered)", atributos: "col1", accion: "RID Lookup a tabla1" },
    ],
    criterio: [
      "La tabla es de tipo HEAP (no tiene índice clustered).",
      "El índice no-clustered utilizado no incluye todas las columnas que necesita la consulta.",
    ],
    beneficio: [
      "Reducir lecturas lógicas adicionales por cada fila devuelta.",
      "Evaluar agregar columnas INCLUDE al índice o crear un índice clustered para evitar el lookup.",
    ],
  },
};