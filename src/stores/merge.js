import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useToast } from '@/composables/useToast.js';
import { validateFiles } from '@/utils/file.js';
import {
  readPdfBytes,
  countPages,
  openPdfDoc,
  renderPageToCanvas,
  mergePdfs,
} from '@/utils/pdf.js';
import { THUMB_SCALE } from '@/utils/constants.js';
import { downloadBytes, timestamp } from '@/utils/download.js';

let nextId = 1;

export const useMergeStore = defineStore('merge', () => {
  const { toasts, pushToast } = useToast();

  const files = ref([]);
  const busy = ref(false);

  const canMerge = computed(() => files.value.length >= 2 && !busy.value);

  async function addFiles(fileList) {
    const { valid, errors } = validateFiles(fileList, 'pdf', {
      totalBytes: files.value.reduce((sum, f) => sum + f.size, 0),
    });
    for (const error of errors) {
      pushToast('error', error);
    }
    for (const file of valid) {
      try {
        const bytes = await readPdfBytes(file);
        const pageCount = await countPages(bytes);
        const thumb = await renderFirstPageThumb(bytes);
        files.value.push({
          id: nextId++,
          name: file.name,
          size: file.size,
          bytes,
          pageCount,
          thumb,
        });
      } catch {
        pushToast('error', `"${file.name}" 读取失败，可能已损坏或加密`);
      }
    }
  }

  async function renderFirstPageThumb(bytes) {
    try {
      const doc = await openPdfDoc(bytes);
      try {
        const canvas = document.createElement('canvas');
        await renderPageToCanvas(doc, 1, THUMB_SCALE, canvas);
        return canvas.toDataURL('image/jpeg', 0.6);
      } finally {
        try {
          await doc.destroy();
        } catch {
          // ignore destroy errors
        }
      }
    } catch {
      return null;
    }
  }

  function removeFile(id) {
    files.value = files.value.filter((f) => f.id !== id);
  }

  function reorder(ids) {
    const byId = new Map(files.value.map((f) => [f.id, f]));
    files.value = ids.map((id) => byId.get(id)).filter(Boolean);
  }

  async function merge() {
    if (!canMerge.value) return;
    busy.value = true;
    try {
      const bytes = await mergePdfs(files.value.map((f) => f.bytes));
      downloadBytes(bytes, `merged-${timestamp()}.pdf`, 'application/pdf');
      pushToast('success', '合并完成，已开始下载');
    } catch {
      pushToast('error', '合并失败，请检查文件是否有效');
    } finally {
      busy.value = false;
    }
  }

  return { toasts, files, busy, canMerge, addFiles, removeFile, reorder, merge };
});
