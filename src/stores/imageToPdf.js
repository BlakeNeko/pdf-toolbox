import { defineStore } from 'pinia';
import { ref, computed, markRaw } from 'vue';
import { useToast } from '@/composables/useToast.js';
import { validateFiles } from '@/utils/file.js';
import { loadImage, drawImageToCanvas, embedImageIntoDoc } from '@/utils/image.js';
import { PDFDocument } from 'pdf-lib';
import { downloadBytes, timestamp } from '@/utils/download.js';

let nextId = 1;

export const useImageToPdfStore = defineStore('imageToPdf', () => {
  const { toasts, pushToast } = useToast();

  const files = ref([]);
  const busy = ref(false);

  const canConvert = computed(() => files.value.length > 0 && !busy.value);

  async function addFiles(fileList) {
    const { valid, errors } = validateFiles(fileList, 'image', {
      totalBytes: files.value.reduce((sum, f) => sum + f.size, 0),
    });
    for (const error of errors) {
      pushToast('error', error);
    }
    for (const file of valid) {
      try {
        const img = await loadImage(file);
        const thumb = drawImageToCanvas(img).toDataURL('image/jpeg', 0.6);
        files.value.push({ id: nextId++, name: file.name, size: file.size, file: markRaw(file), thumb });
      } catch {
        pushToast('error', `"${file.name}" 加载失败`);
      }
    }
  }

  function removeFile(id) {
    files.value = files.value.filter((f) => f.id !== id);
  }

  function reorder(ids) {
    const byId = new Map(files.value.map((f) => [f.id, f]));
    files.value = ids.map((id) => byId.get(id)).filter(Boolean);
  }

  async function convert() {
    if (!canConvert.value) return;
    busy.value = true;
    const total = files.value.length;
    let skipped = 0;
    try {
      const doc = await PDFDocument.create();
      for (let i = 0; i < total; i++) {
        try {
          await embedImageIntoDoc(doc, files.value[i].file);
        } catch {
          skipped++;
          pushToast('error', `"${files.value[i].name}" 转换失败，已跳过`);
        }
      }
      if (doc.getPageCount() === 0) {
        pushToast('error', '没有可转换的图片');
        return;
      }
      const bytes = await doc.save();
      downloadBytes(bytes, `images-${timestamp()}.pdf`, 'application/pdf');
      pushToast('success', skipped ? `转换完成，跳过 ${skipped} 张` : '转换完成，已开始下载');
    } catch {
      pushToast('error', '转换失败，请重试');
    } finally {
      busy.value = false;
    }
  }

  return { toasts, files, busy, canConvert, addFiles, removeFile, reorder, convert };
});
