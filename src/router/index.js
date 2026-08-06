import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/merge',
      name: 'merge',
      component: () => import('@/views/Merge.vue'),
    },
    {
      path: '/split',
      name: 'split',
      component: () => import('@/views/Split.vue'),
    },
    {
      path: '/image-to-pdf',
      name: 'image-to-pdf',
      component: () => import('@/views/ImageToPdf.vue'),
    },
    {
      path: '/pdf-to-image',
      name: 'pdf-to-image',
      component: () => import('@/views/PdfToImage.vue'),
    },
  ],
});

export default router;
