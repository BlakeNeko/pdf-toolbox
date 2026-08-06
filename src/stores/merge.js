import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useToast } from '@/composables/useToast.js';
import { validateFiles } from '@/utils/file.js';
import { readPdfBytes, countPages, mergePdfs } from '@/utils/pdf.js';
import { downloadBytes, timestamp } from '@/utils/download.js';

let nextId = 1;

export const useMergeStore = defineStore('merge', () => {
  const { toasts, pushToast } = useToast();

  const files = ref([]);
  const busy = ref(false);
  const progress = ref(0);
  const statusText = ref('');

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
        files.value.push({ id: nextId++, name: file.name, size: file.size, bytes, pageCount });
      } catch {
        pushToast('error', `"${file.name}" 读取失败，可能已损坏或加密`);
      }
    }
  }

  function removeFile(id) {
    files.value = files.value.filter((f) => f.id !== id);
  }

  function reorder(newItems) {
    files.value = newItems;
  }

  async function merge() {
    if (!canMerge.value) return;
    busy.value = true;
    progress.value = 0;
    statusText.value = '正在合并…';
    try {
      const bytes = await mergePdfs(
        files.value.map((f) => f.bytes),
        (done, total) => {
          progress.value = (done / total) * 100;
        },
      );
      downloadBytes(bytes, `merged-${timestamp()}.pdf`, 'application/pdf');
      pushToast('success', '合并完成，已开始下载');
    } catch {
      pushToast('error', '合并失败，请检查文件是否有效');
    } finally {
      busy.value = false;
      progress.value = 0;
      statusText.value = '';
    }
  }

  return { toasts, files, busy, progress, statusText, canMerge, addFiles, removeFile, reorder, merge };
});
