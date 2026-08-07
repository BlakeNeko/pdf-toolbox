import { defineStore } from 'pinia';
import { ref, shallowRef, computed, markRaw } from 'vue';
import { useToast } from '@/composables/useToast.js';
import { validateFiles } from '@/utils/file.js';
import { readPdfBytes, countPages, openPdfDoc, extractPagesToPdf, extractPagesToPdfs } from '@/utils/pdf.js';
import { packZip } from '@/utils/zip.js';
import { downloadBytes, timestamp } from '@/utils/download.js';

export const useSplitStore = defineStore('split', () => {
  const { toasts, pushToast } = useToast();

  const file = ref(null);
  const bytes = ref(null);
  const pdfJsDoc = shallowRef(null);
  const pageCount = ref(0);
  const selected = ref(new Set());
  const mode = ref('merged');
  const busy = ref(false);

  const hasSelection = computed(() => selected.value.size > 0);

  async function setFile(fileList) {
    const single = fileList[0];
    if (!single) return;
    const { valid, errors } = validateFiles([single], 'pdf');
    for (const error of errors) {
      pushToast('error', error);
    }
    if (!valid.length) return;
    try {
      await clearFile();
      const data = await readPdfBytes(valid[0]);
      const count = await countPages(data);
      const doc = await openPdfDoc(data);
      file.value = markRaw(valid[0]);
      bytes.value = data;
      pdfJsDoc.value = doc;
      pageCount.value = count;
      selected.value = new Set(Array.from({ length: count }, (_, i) => i + 1));
    } catch {
      pushToast('error', `"${single.name}" 无法解析，可能已损坏或加密`);
    }
  }

  function togglePage(pageNum) {
    const next = new Set(selected.value);
    if (next.has(pageNum)) next.delete(pageNum);
    else next.add(pageNum);
    selected.value = next;
  }

  function toggleAll(selectAll) {
    selected.value = selectAll
      ? new Set(Array.from({ length: pageCount.value }, (_, i) => i + 1))
      : new Set();
  }

  function setMode(next) {
    mode.value = next;
  }

  async function clearFile() {
    if (pdfJsDoc.value) {
      try {
        await pdfJsDoc.value.destroy();
      } catch {
        // ignore destroy errors
      }
    }
    file.value = null;
    bytes.value = null;
    pdfJsDoc.value = null;
    pageCount.value = 0;
    selected.value = new Set();
  }

  const pageIndices = () => [...selected.value].map((n) => n - 1).sort((a, b) => a - b);

  async function exportSelected() {
    if (!hasSelection.value || busy.value) return;
    busy.value = true;
    try {
      if (mode.value === 'merged') {
        const out = await extractPagesToPdf(bytes.value, pageIndices());
        downloadBytes(out, `split-merged-${timestamp()}.pdf`, 'application/pdf');
      } else {
        const items = await extractPagesToPdfs(bytes.value, pageIndices());
        const blob = await packZip(items);
        downloadBytes(new Uint8Array(await blob.arrayBuffer()), `split-pages-${timestamp()}.zip`, 'application/zip');
      }
      pushToast('success', '导出完成，已开始下载');
    } catch {
      pushToast('error', '导出失败，请重试');
    } finally {
      busy.value = false;
    }
  }

  return {
    toasts,
    file,
    pdfJsDoc,
    pageCount,
    selected,
    mode,
    busy,
    hasSelection,
    setFile,
    togglePage,
    toggleAll,
    setMode,
    clearFile,
    exportSelected,
  };
});
