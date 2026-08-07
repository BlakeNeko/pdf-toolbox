import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE, MAX_TOTAL_SIZE, PDF_MIME } from './constants.js';

export function isPdf(file) {
  return file.type === PDF_MIME || /\.pdf$/i.test(file.name);
}

export function isImage(file) {
  return ACCEPTED_IMAGE_TYPES.includes(file.type);
}

export function validateFile(file, kind, { totalBytes = 0 } = {}) {
  if (kind === 'pdf' && !isPdf(file)) {
    return { ok: false, error: `"${file.name}" 不是有效的 PDF 文件` };
  }
  if (kind === 'image' && !isImage(file)) {
    return { ok: false, error: `"${file.name}" 仅支持 PNG / JPG 图片` };
  }
  if (file.size > MAX_FILE_SIZE) {
    return { ok: false, error: `"${file.name}" 超过 100MB 大小限制` };
  }
  if (totalBytes + file.size > MAX_TOTAL_SIZE) {
    return { ok: false, error: `文件总大小超过 500MB 限制` };
  }
  return { ok: true, error: null };
}

export function validateFiles(files, kind, { totalBytes = 0 } = {}) {
  const valid = [];
  const errors = [];
  let used = totalBytes;
  for (const file of files) {
    const result = validateFile(file, kind, { totalBytes: used });
    if (result.ok) {
      valid.push(file);
      used += file.size;
    } else {
      errors.push(result.error);
    }
  }
  return { valid, errors };
}
