import { ref } from 'vue';

let nextId = 1;

export function useToast() {
  const toasts = ref([]);

  function pushToast(type, message, duration = 3000) {
    const id = nextId++;
    toasts.value.push({ id, type, message });
    setTimeout(() => {
      toasts.value = toasts.value.filter((t) => t.id !== id);
    }, duration);
  }

  function dismiss(id) {
    toasts.value = toasts.value.filter((t) => t.id !== id);
  }

  return { toasts, pushToast, dismiss };
}
