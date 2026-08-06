<script setup>
import { Image } from '@lucide/vue';
import { usePdfToImageStore } from '@/stores/pdfToImage.js';
import FileDropZone from '@/components/FileDropZone.vue';
import PdfPreview from '@/components/PdfPreview.vue';
import Toast from '@/components/Toast.vue';
import ProgressBar from '@/components/ProgressBar.vue';

const store = usePdfToImageStore();
</script>

<template>
  <section class="space-y-6">
    <div>
      <h1 class="flex items-center gap-2 text-2xl font-bold">
        <Image class="h-6 w-6 text-primary-600" />
        PDF 转图片
      </h1>
      <p class="mt-1 text-sm text-slate-500">上传一个 PDF，将选中页面导出为 PNG 图片（ZIP 打包）</p>
    </div>

    <FileDropZone
      v-if="!store.file"
      accept="application/pdf"
      title="拖拽 PDF 文件到此处，或点击选择"
      hint="仅支持单个文件"
      @files="store.setFile"
    />

    <template v-else>
      <div class="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3">
        <span class="truncate text-sm text-slate-800">{{ store.file.name }}</span>
        <button
          class="shrink-0 text-sm text-primary-600 hover:text-primary-700"
          :disabled="store.busy"
          @click="store.clearFile"
        >
          更换文件
        </button>
      </div>

      <PdfPreview
        :pdf-js-doc="store.pdfJsDoc"
        :page-count="store.pageCount"
        :selected="store.selected"
        selectable
        @toggle="store.togglePage"
        @toggle-all="store.toggleAll"
      />

      <ProgressBar :show="store.busy" :percent="store.progress" :text="store.statusText" />
      <button
        class="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 py-3 font-medium text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
        :disabled="!store.hasSelection || store.busy"
        @click="store.exportImages"
      >
        导出选中页为图片
      </button>
    </template>

    <Toast :toasts="store.toasts" />
  </section>
</template>
