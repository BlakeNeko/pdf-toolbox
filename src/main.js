import { createApp } from 'vue';
import { createPinia } from 'pinia';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

import App from './App.vue';
import router from './router';
import './styles/index.css';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount('#app');
