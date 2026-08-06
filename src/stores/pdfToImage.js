import { defineStore } from 'pinia';
import { ref, shallowRef, computed, markRaw } from 'vue';
import { useToast } from '@/composables/useToast.js';
import { validateFiles } from '@/utils/file.js';
import { readPdfBytes, countPages, openPdfDoc, renderPageToCanvas } from '@/utils/pdf.js';
import { canvasToPngBytes } from '@/utils/image.js';
import { packZip } from '@/utils/zip.js';
import { downloadBytes, timestamp } from '@/utils/download.js';
import { EXPORT_DPI } from '@/utils/constants.js';

export const usePdfToImageStore = defineStore('pdfToImage', () => {
  const { toasts, pushToast } = useToast();

  const file = ref(null);
  const pdfJsDoc = shallowRef(null);
  const pageCount = ref(0);
  const selected = ref(new Set());
  const busy = ref(false);
  const progress = ref(0);
  const statusText = ref('');

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

  async function clearFile() {
    if (pdfJsDoc.value) {
      try {
        await pdfJsDoc.value.destroy();
      } catch {
        // ignore destroy errors
      }
    }
    file.value = null;
    pdfJsDoc.value = null;
    pageCount.value = 0;
    selected.value = new Set();
  }

  async function exportImages() {
    if (!hasSelection.value || busy.value) return;
    busy.value = true;
    progress.value = 0;
    const pages = [...selected.value].sort((a, b) => a - b);
    const total = pages.length;
    const entries = [];
    try {
      for (let i = 0; i < total; i++) {
        const pageNum = pages[i];
        statusText.value = `正在渲染第 ${pageNum} 页…`;
        try {
          const canvas = document.createElement('canvas');
          await renderPageToCanvas(pdfJsDoc.value, pageNum, EXPORT_DPI, canvas);
          const bytes = await canvasToPngBytes(canvas);
          entries.push({ name: `page-${pageNum}.png`, bytes });
        } catch {
          pushToast('error', `第 ${pageNum} 页渲染失败，已跳过`);
        }
        progress.value = ((i + 1) / total) * 100;
      }
      if (!entries.length) {
        pushToast('error', '没有可导出的页面');
        return;
      }
      statusText.value = '正在打包 ZIP…';
      const blob = await packZip(entries);
      downloadBytes(new Uint8Array(await blob.arrayBuffer()), `pdf-images-${timestamp()}.zip`, 'application/zip');
      pushToast('success', `导出完成，已开始下载（${entries.length} 张）`);
    } catch {
      pushToast('error', '导出失败，请重试');
    } finally {
      busy.value = false;
      progress.value = 0;
      statusText.value = '';
    }
  }

  return {
    toasts,
    file,
    pdfJsDoc,
    pageCount,
    selected,
    busy,
    progress,
    statusText,
    hasSelection,
    setFile,
    togglePage,
    toggleAll,
    clearFile,
    exportImages,
  };
});
