<script setup>
import { ref } from 'vue';
import { CloudUpload } from '@lucide/vue';

const props = defineProps({
  accept: { type: String, default: '' },
  multiple: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  title: { type: String, default: '拖拽文件到此处，或点击选择' },
  hint: { type: String, default: '' },
});

const emit = defineEmits(['files']);

const inputRef = ref(null);
const dragging = ref(false);

function onDrop(event) {
  dragging.value = false;
  if (props.disabled) return;
  const files = Array.from(event.dataTransfer.files || []);
  if (files.length) emit('files', files);
}

function onClick() {
  if (props.disabled) return;
  inputRef.value?.click();
}

function onChange(event) {
  const files = Array.from(event.target.files || []);
  if (files.length) emit('files', files);
  event.target.value = '';
}
</script>

<template>
  <div
    class="relative rounded-xl border-2 border-dashed transition-colors cursor-pointer"
    :class="[
      dragging ? 'border-primary-500 bg-primary-50' : 'border-slate-300 bg-white',
      disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary-400',
    ]"
    @click="onClick"
    @dragover.prevent="dragging = true"
    @dragleave.prevent="dragging = false"
    @drop.prevent="onDrop"
  >
    <div class="flex flex-col items-center justify-center gap-2 py-12 px-4 text-center">
      <CloudUpload class="h-10 w-10 text-slate-400" />
      <p class="text-sm text-slate-600">{{ title }}</p>
      <p v-if="hint" class="text-xs text-slate-400">{{ hint }}</p>
    </div>
    <input
      ref="inputRef"
      type="file"
      class="hidden"
      :accept="accept"
      :multiple="multiple"
      @change="onChange"
    />
  </div>
</template>
