<script setup>
import { CheckCircle2, Info, AlertCircle } from '@lucide/vue';

defineProps({
  toasts: { type: Array, required: true },
});

const emit = defineEmits(['dismiss']);

const typeConfig = {
  info: { icon: Info, cls: 'text-primary-500' },
  success: { icon: CheckCircle2, cls: 'text-success-500' },
  error: { icon: AlertCircle, cls: 'text-danger-500' },
};
</script>

<template>
  <Teleport to="body">
    <div class="fixed right-4 top-4 z-50 flex flex-col gap-2">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="flex items-center gap-2 rounded-lg bg-white px-4 py-3 shadow-lg border border-slate-200"
        >
          <component :is="typeConfig[toast.type].icon" class="h-5 w-5 shrink-0" :class="typeConfig[toast.type].cls" />
          <span class="text-sm text-slate-700">{{ toast.message }}</span>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.2s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(1rem);
}
</style>
