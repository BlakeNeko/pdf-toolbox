<script setup>
import { Merge, Split, File, Image } from '@lucide/vue';
import NavCard from '@/components/NavCard.vue';

const features = [
  {
    to: '/merge',
    title: 'PDF 合并',
    desc: '多份 PDF 按序合并为一份',
    icon: Merge,
  },
  {
    to: '/split',
    title: 'PDF 拆分',
    desc: '提取指定页面，合并或独立导出',
    icon: Split,
  },
  {
    to: '/image-to-pdf',
    title: '图片转 PDF',
    desc: '多张图片按序生成 PDF',
    icon: File,
  },
  {
    to: '/pdf-to-image',
    title: 'PDF 转图片',
    desc: '导出指定页为 PNG 图片',
    icon: Image,
  },
];
</script>

<template>
  <section>
    <h1 class="text-2xl font-bold mb-2">功能导航</h1>
    <p class="text-sm text-slate-500 mb-6">选择需要的功能开始处理你的文件</p>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <NavCard
        v-for="feature in features"
        :key="feature.to"
        :to="feature.to"
        :title="feature.title"
        :desc="feature.desc"
        :icon="feature.icon"
      />
    </div>
  </section>
</template>
