<script setup>
defineProps({
  to: { type: String, required: true },
  title: { type: String, required: true },
  desc: { type: String, required: true },
  icon: { type: Object, required: true },
});
</script>

<template>
  <RouterLink
    :to="to"
    class="group flex items-start gap-4 rounded-xl bg-white p-6 shadow-sm border border-slate-200 hover:shadow-md hover:-translate-y-0.5 transition-all"
  >
    <span
      class="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-colors"
    >
      <component :is="icon" class="h-6 w-6" />
    </span>
    <span>
      <span class="block font-semibold text-slate-800 group-hover:text-primary-700">{{
        title
      }}</span>
      <span class="mt-1 block text-sm text-slate-500">{{ desc }}</span>
    </span>
  </RouterLink>
</template>
