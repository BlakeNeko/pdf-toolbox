<script setup>
import { Merge } from '@lucide/vue';
import { useMergeStore } from '@/stores/merge.js';
import FileDropZone from '@/components/FileDropZone.vue';
import FileList from '@/components/FileList.vue';
import Toast from '@/components/Toast.vue';

const store = useMergeStore();

function onFiles(files) {
  store.addFiles(files);
}
</script>

<template>
  <section class="space-y-6">
    <header class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 class="flex items-center gap-2 text-2xl font-bold">
          <Merge class="h-6 w-6 text-primary-600" />
          PDF 合并
        </h1>
        <p class="mt-1 text-sm text-slate-500">按列表顺序将多个 PDF 合并为一份，拖拽可调整顺序</p>
      </div>
      <button
        v-if="store.files.length"
        class="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 py-3 font-medium text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
        :disabled="!store.canMerge"
        @click="store.merge"
      >
        {{ store.busy ? '合并处理中…' : '合并并下载' }}
      </button>
    </header>

    <FileDropZone
      accept="application/pdf"
      multiple
      :disabled="store.busy"
      title="拖拽 PDF 文件到此处，或点击选择"
      hint="支持多个文件，每个文件不超过 100MB"
      @files="onFiles"
    />

    <div v-if="store.files.length" class="space-y-4">
      <FileList
        :items="
          store.files.map((f) => ({
            id: f.id,
            name: f.name,
            extra: `${f.pageCount} 页`,
            thumb: f.thumb,
          }))
        "
        @reorder="store.reorder"
        @remove="store.removeFile"
      />
    </div>

    <Toast :toasts="store.toasts" />
  </section>
</template>
