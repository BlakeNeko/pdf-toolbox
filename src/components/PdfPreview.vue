<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { ImageOff, Square, SquareCheck } from '@lucide/vue';
import { renderPageToCanvas } from '@/utils/pdf.js';

const props = defineProps({
  pdfJsDoc: { type: Object, required: true },
  pageCount: { type: Number, required: true },
  selectable: { type: Boolean, default: false },
  selected: { type: Set, default: () => new Set() },
  scale: { type: Number, default: 0.5 },
});

const emit = defineEmits(['toggle', 'toggleAll']);

const rootRef = ref(null);
const rendered = new Set();
const failed = new Set();
let observer = null;

const pageNumbers = computed(() =>
  Array.from({ length: props.pageCount }, (_, i) => i + 1),
);

function observeCanvases() {
  if (!rootRef.value || !observer) return;
  for (const el of rootRef.value.querySelectorAll('canvas[data-page]')) {
    observer.observe(el);
  }
}

function renderThumb(pageNumber, canvas) {
  if (rendered.has(pageNumber) || failed.has(pageNumber)) return;
  rendered.add(pageNumber);
  renderPageToCanvas(props.pdfJsDoc, pageNumber, props.scale, canvas).catch(() => {
    rendered.delete(pageNumber);
    failed.add(pageNumber);
  });
}

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const pageNumber = Number(entry.target.dataset.page);
          renderThumb(pageNumber, entry.target);
          observer.unobserve(entry.target);
        }
      }
    },
    { rootMargin: '200px' },
  );
});

watch(
  pageNumbers,
  async () => {
    rendered.clear();
    failed.clear();
    await nextTick();
    observeCanvases();
  },
  { immediate: true },
);

onBeforeUnmount(() => {
  observer?.disconnect();
});

const allSelected = () => props.pageCount > 0 && props.selected.size === props.pageCount;

function toggleAll() {
  emit('toggleAll', !allSelected());
}
</script>

<template>
  <div ref="rootRef">
    <div v-if="selectable" class="mb-3 flex items-center justify-between">
      <button
        class="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100"
        @click="toggleAll"
      >
        <component :is="allSelected() ? SquareCheck : Square" class="h-4 w-4" />
        {{ allSelected() ? '取消全选' : '全选' }}
      </button>
      <span class="text-xs text-slate-400">已选 {{ selected.size }} / {{ pageCount }} 页</span>
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      <div
        v-for="page in pageNumbers"
        :key="page"
        class="group relative rounded-lg border border-slate-200 bg-white p-2"
      >
        <div
          v-if="selectable"
          class="absolute left-2 top-2 z-10 cursor-pointer rounded bg-white/90 p-1"
          @click="emit('toggle', page)"
        >
          <component
            :is="selected.has(page) ? SquareCheck : Square"
            class="h-5 w-5"
            :class="selected.has(page) ? 'text-primary-600' : 'text-slate-400'"
          />
        </div>

        <div class="flex h-40 items-center justify-center overflow-hidden">
          <canvas :data-page="page" class="max-h-full max-w-full object-contain" />
          <div v-if="failed.has(page)" class="flex flex-col items-center gap-1 text-slate-300">
            <ImageOff class="h-8 w-8" />
            <span class="text-xs">渲染失败</span>
          </div>
        </div>
        <p class="mt-1 text-center text-xs text-slate-500">第 {{ page }} 页</p>
      </div>
    </div>
  </div>
</template>
