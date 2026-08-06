import { PDFDocument } from 'pdf-lib';
import { A4_POINTS } from './constants.js';

export function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`图片加载失败: ${file.name}`));
    };
    img.src = url;
  });
}

export function drawImageToCanvas(img) {
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  return canvas;
}

export function imageToJpegBytes(img, quality = 0.9) {
  const canvas = drawImageToCanvas(img);
  return canvas.toDataURL('image/jpeg', quality);
}

export function canvasToPngBytes(canvas) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('PNG 编码失败'));
        return;
      }
      blob.arrayBuffer().then((buffer) => resolve(new Uint8Array(buffer)));
    }, 'image/png');
  });
}

export function fitPageToA4(width, height) {
  const maxW = A4_POINTS.width;
  const maxH = A4_POINTS.height;
  if (width <= maxW && height <= maxH) {
    return { width, height };
  }
  const scale = Math.min(maxW / width, maxH / height);
  return {
    width: Math.floor(width * scale),
    height: Math.floor(height * scale),
  };
}

export async function embedImageIntoDoc(doc, file) {
  const img = await loadImage(file);
  const { width, height } = fitPageToA4(img.naturalWidth, img.naturalHeight);
  const imageBytes = new Uint8Array(await file.arrayBuffer());
  const embed = file.type === 'image/png' ? doc.embedPng(imageBytes) : doc.embedJpg(imageBytes);
  const image = await embed;
  const page = doc.addPage([width, height]);
  page.drawImage(image, {
    x: 0,
    y: 0,
    width,
    height,
  });
}

export async function embedImageAsPdf(file) {
  const doc = await PDFDocument.create();
  await embedImageIntoDoc(doc, file);
  return doc.save();
}
