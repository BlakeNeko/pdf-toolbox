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
    <div class="pointer-events-none fixed left-1/2 top-[15vh] z-50 flex -translate-x-1/2 flex-col items-center gap-2">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="pointer-events-auto flex items-center gap-3 rounded-xl bg-white px-6 py-4 shadow-xl border border-slate-200"
        >
          <component :is="typeConfig[toast.type].icon" class="h-6 w-6 shrink-0" :class="typeConfig[toast.type].cls" />
          <span class="text-base text-slate-700">{{ toast.message }}</span>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.25s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(0.5rem) scale(0.95);
}
</style>
