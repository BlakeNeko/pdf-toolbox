<script setup>
import { useRoute } from 'vue-router';

const route = useRoute();
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <header class="bg-white border-b border-slate-200 shadow-sm">
      <div
        class="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between"
      >
        <RouterLink
          to="/"
          class="flex items-center gap-2 font-bold text-lg text-primary-600 hover:text-primary-700"
        >
          PDF工具盒
        </RouterLink>
        <span class="text-xs text-slate-400">所有处理均在本地浏览器完成</span>
      </div>
    </header>

    <main class="flex-1 w-full max-w-5xl mx-auto px-4 py-8">
      <RouterView />
    </main>
  </div>
</template>
