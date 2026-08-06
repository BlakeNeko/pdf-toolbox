<script setup>
import { ref } from 'vue';
import { GripVertical, X } from '@lucide/vue';

const props = defineProps({
  items: { type: Array, required: true },
  draggable: { type: Boolean, default: true },
});

const emit = defineEmits(['reorder', 'remove']);

const dragIndex = ref(null);
const overIndex = ref(null);

function onDragStart(index) {
  dragIndex.value = index;
}

function onDragOver(event, index) {
  event.preventDefault();
  overIndex.value = index;
}

function onDrop() {
  if (dragIndex.value === null || overIndex.value === null) return;
  if (dragIndex.value !== overIndex.value) {
    const next = [...props.items];
    const [moved] = next.splice(dragIndex.value, 1);
    next.splice(overIndex.value, 0, moved);
    emit('reorder', next.map((item) => item.id));
  }
  dragIndex.value = null;
  overIndex.value = null;
}

function onDragEnd() {
  dragIndex.value = null;
  overIndex.value = null;
}
</script>

<template>
  <ul class="space-y-2">
    <li
      v-for="(item, index) in items"
      :key="item.id"
      class="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 transition-opacity"
      :class="[dragIndex === index ? 'opacity-50' : '', overIndex === index ? 'ring-2 ring-primary-300' : '']"
      :draggable="draggable"
      @dragstart="onDragStart(index)"
      @dragover="onDragOver($event, index)"
      @drop="onDrop"
      @dragend="onDragEnd"
    >
      <GripVertical
        v-if="draggable"
        class="h-4 w-4 shrink-0 cursor-grab text-slate-400 active:cursor-grabbing"
      />
      <img
        v-if="item.thumb"
        :src="item.thumb"
        alt=""
        class="h-10 w-10 shrink-0 rounded object-cover"
      />
      <div class="min-w-0 flex-1">
        <p class="truncate text-sm text-slate-800">{{ item.name }}</p>
        <p v-if="item.extra" class="text-xs text-slate-400">{{ item.extra }}</p>
      </div>
      <button
        class="rounded p-1 text-slate-400 hover:bg-danger-50 hover:text-danger-500"
        :aria-label="`移除 ${item.name}`"
        @click="emit('remove', item.id)"
      >
        <X class="h-4 w-4" />
      </button>
    </li>
  </ul>
</template>
