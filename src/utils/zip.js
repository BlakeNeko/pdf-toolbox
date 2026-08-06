import JSZip from 'jszip';

export async function packZip(entries, onProgress) {
  const zip = new JSZip();
  for (const { name, bytes } of entries) {
    zip.file(name, bytes);
  }
  return zip.generateAsync(
    { type: 'blob', compression: 'STORE', streamFiles: true },
    onProgress ? (metadata) => onProgress(metadata.percent / 100) : undefined,
  );
}
