<script setup>
defineProps({
  percent: { type: Number, required: true },
  show: { type: Boolean, default: false },
  text: { type: String, default: '' },
});
</script>

<template>
  <div v-if="show" class="w-full">
    <div class="mb-1 flex items-center justify-between text-xs text-slate-500">
      <span>{{ text || '处理中…' }}</span>
      <span>{{ Math.round(percent) }}%</span>
    </div>
    <div class="h-2 w-full overflow-hidden rounded-full bg-slate-200">
      <div
        class="h-full rounded-full bg-primary-500 transition-all duration-150"
        :style="{ width: `${percent}%` }"
      />
    </div>
  </div>
</template>
