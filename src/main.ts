import './assets/reset.css';
import 'primeicons/primeicons.css';

import App from './App.vue';
import router from './router';
import Aura from '@primevue/themes/aura';
import { ToastService } from 'primevue';
import PrimeVue from 'primevue/config';
import { VueQueryPlugin } from '@tanstack/vue-query';
import { createApp } from 'vue';
import { createPinia } from 'pinia';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(VueQueryPlugin);
app.use(ToastService);
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: false,
    },
  },
});

app.mount('#app');
