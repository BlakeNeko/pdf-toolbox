<script setup>
import { File } from '@lucide/vue';
import { useImageToPdfStore } from '@/stores/imageToPdf.js';
import FileDropZone from '@/components/FileDropZone.vue';
import FileList from '@/components/FileList.vue';
import Toast from '@/components/Toast.vue';
import ProgressBar from '@/components/ProgressBar.vue';

const store = useImageToPdfStore();
</script>

<template>
  <section class="space-y-6">
    <div>
      <h1 class="flex items-center gap-2 text-2xl font-bold">
        <File class="h-6 w-6 text-primary-600" />
        图片转 PDF
      </h1>
      <p class="mt-1 text-sm text-slate-500">按列表顺序将多张图片转换为一个 PDF，拖拽可调整顺序</p>
    </div>

    <FileDropZone
      accept=".png,.jpg,.jpeg,image/png,image/jpeg"
      multiple
      :disabled="store.busy"
      title="拖拽图片到此处，或点击选择"
      hint="支持 PNG / JPG，单张不超过 100MB"
      @files="store.addFiles"
    />

    <div v-if="store.files.length" class="space-y-4">
      <FileList
        :items="store.files.map((f) => ({ id: f.id, name: f.name, thumb: f.thumb }))"
        @reorder="store.reorder"
        @remove="store.removeFile"
      />
      <ProgressBar :show="store.busy" :percent="store.progress" :text="store.statusText" />
      <button
        class="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 py-3 font-medium text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
        :disabled="!store.canConvert"
        @click="store.convert"
      >
        转换并下载
      </button>
    </div>

    <Toast :toasts="store.toasts" />
  </section>
</template>
