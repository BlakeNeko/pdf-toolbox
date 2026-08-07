<script setup>
import { ref, watch } from 'vue';
import { VueDraggable } from 'vue-draggable-plus';
import { FileText, X } from '@lucide/vue';

const props = defineProps({
  items: { type: Array, required: true },
});

const emit = defineEmits(['reorder', 'remove']);

const localItems = ref([...props.items]);

watch(
  () => props.items,
  (next) => {
    const same =
      next.length === localItems.value.length &&
      next.every((item, i) => item.id === localItems.value[i]?.id);
    if (!same) localItems.value = [...next];
  },
);

function onReorder() {
  emit(
    'reorder',
    localItems.value.map((item) => item.id),
  );
}
</script>

<template>
  <VueDraggable
    v-model="localItems"
    :animation="150"
    :filter="'.no-drag'"
    :prevent-on-filter="true"
    class="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-3"
    @update:modelValue="onReorder"
  >
    <div
      v-for="item in localItems"
      :key="item.id"
      class="group relative cursor-grab overflow-hidden rounded-lg border border-slate-200 bg-white active:cursor-grabbing"
    >
      <button
        class="no-drag absolute right-1.5 top-1.5 z-10 rounded p-1 text-slate-400 opacity-0 transition-opacity hover:bg-danger-50 hover:text-danger-500 group-hover:opacity-100"
        :aria-label="`移除 ${item.name}`"
        @click="emit('remove', item.id)"
      >
        <X class="h-4 w-4" />
      </button>

      <div class="flex aspect-[3/4] items-center justify-center overflow-hidden bg-slate-50">
        <img v-if="item.thumb" :src="item.thumb" alt="" class="h-full w-full object-contain" />
        <FileText v-else class="h-16 w-16 text-slate-300" />
      </div>

      <div class="flex items-center gap-1 border-t border-slate-100 px-2 py-2">
        <div class="min-w-0 flex-1">
          <p class="truncate text-xs text-slate-800">{{ item.name }}</p>
          <p v-if="item.extra" class="text-[11px] text-slate-400">{{ item.extra }}</p>
        </div>
      </div>
    </div>
  </VueDraggable>
</template>
