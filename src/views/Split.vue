<script setup>
import { Scissors } from '@lucide/vue';
import { useSplitStore } from '@/stores/split.js';
import FileDropZone from '@/components/FileDropZone.vue';
import PdfPreview from '@/components/PdfPreview.vue';
import Toast from '@/components/Toast.vue';
import ProgressBar from '@/components/ProgressBar.vue';

const store = useSplitStore();
</script>

<template>
  <section class="space-y-6">
    <div>
      <h1 class="flex items-center gap-2 text-2xl font-bold">
        <Scissors class="h-6 w-6 text-primary-600" />
        PDF 拆分
      </h1>
      <p class="mt-1 text-sm text-slate-500">上传一个 PDF，勾选需要的页面后按模式导出</p>
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

      <div class="flex items-center gap-4 rounded-lg border border-slate-200 bg-white px-4 py-3">
        <span class="text-sm font-medium text-slate-700">导出模式</span>
        <label class="inline-flex items-center gap-2 text-sm text-slate-600">
          <input
            type="radio"
            name="split-mode"
            value="merged"
            :checked="store.mode === 'merged'"
            :disabled="store.busy"
            @change="store.setMode('merged')"
          />
          合并导出
        </label>
        <label class="inline-flex items-center gap-2 text-sm text-slate-600">
          <input
            type="radio"
            name="split-mode"
            value="individual"
            :checked="store.mode === 'individual'"
            :disabled="store.busy"
            @change="store.setMode('individual')"
          />
          独立导出
        </label>
      </div>

      <ProgressBar :show="store.busy" :percent="store.progress" :text="store.statusText" />
      <button
        class="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 py-3 font-medium text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
        :disabled="!store.hasSelection || store.busy"
        @click="store.exportSelected"
      >
        {{ store.mode === 'merged' ? '导出选中页为 PDF' : '导出选中页为独立 PDF' }}
      </button>
    </template>

    <Toast :toasts="store.toasts" />
  </section>
</template>
