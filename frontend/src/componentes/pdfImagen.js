// Inserta una imagen (captura de una tabla) en la página actual del PDF,
// ajustada COMPLETA dentro de la hoja (ancho y alto), centrada, con un
// título arriba. Evita que la tabla salga más grande que la página o
// cortada entre varias hojas.
export function agregarImagenAjustada(pdf, dataUrl, imgWidthPx, imgHeightPx, titulo) {
  const margin = 24;
  const tituloAlto = 26;

  const pageWidth = pdf.internal.pageSize.getWidth() - margin * 2;
  const pageHeight = pdf.internal.pageSize.getHeight() - margin * 2 - tituloAlto;

  // Escala única (la más restrictiva entre ancho y alto) para que la imagen
  // quepa completa en la página, sin recortarse ni desbordar.
  const escala = Math.min(pageWidth / imgWidthPx, pageHeight / imgHeightPx);
  const width = imgWidthPx * escala;
  const height = imgHeightPx * escala;

  const x = margin + (pageWidth - width) / 2;
  const y = margin + tituloAlto;

  pdf.setFontSize(12);
  pdf.text(titulo, margin, margin + 12);
  pdf.addImage(dataUrl, "PNG", x, y, width, height);
}
