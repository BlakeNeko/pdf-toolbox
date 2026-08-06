import { PDFDocument } from 'pdf-lib';
import { getDocument } from 'pdfjs-dist';

export async function readPdfBytes(file) {
  const buffer = await file.arrayBuffer();
  return new Uint8Array(buffer);
}

export async function openPdfDoc(data) {
  return getDocument({ data: data.slice() }).promise;
}

export async function countPages(bytes) {
  const doc = await PDFDocument.load(bytes);
  return doc.getPageCount();
}

export async function mergePdfs(pdfBytesList, onProgress) {
  const merged = await PDFDocument.create();
  const total = pdfBytesList.length;
  for (let i = 0; i < total; i++) {
    const src = await PDFDocument.load(pdfBytesList[i]);
    const pages = await merged.copyPages(src, src.getPageIndices());
    pages.forEach((page) => merged.addPage(page));
    onProgress?.(i + 1, total);
  }
  return merged.save();
}

export async function extractPagesToPdf(bytes, pageNumbers, onProgress) {
  const src = await PDFDocument.load(bytes);
  const out = await PDFDocument.create();
  const total = pageNumbers.length;
  for (let i = 0; i < total; i++) {
    const [page] = await out.copyPages(src, [pageNumbers[i]]);
    out.addPage(page);
    onProgress?.(i + 1, total);
  }
  return out.save();
}

export async function extractPagesToPdfs(bytes, pageNumbers, onProgress) {
  const src = await PDFDocument.load(bytes);
  const total = pageNumbers.length;
  const results = [];
  for (let i = 0; i < total; i++) {
    const out = await PDFDocument.create();
    const [page] = await out.copyPages(src, [pageNumbers[i]]);
    out.addPage(page);
    results.push({
      name: `page-${pageNumbers[i] + 1}.pdf`,
      bytes: await out.save(),
    });
    onProgress?.(i + 1, total);
  }
  return results;
}

export async function renderPageToCanvas(pdfJsDoc, pageNumber, scale, canvas) {
  const page = await pdfJsDoc.getPage(pageNumber);
  const viewport = page.getViewport({ scale });
  canvas.width = Math.floor(viewport.width);
  canvas.height = Math.floor(viewport.height);
  const ctx = canvas.getContext('2d');
  await page.render({ canvasContext: ctx, viewport }).promise;
}
