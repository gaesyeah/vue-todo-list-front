import AuthView from '@/views/AuthView.vue';
import TasksView from '@/views/TasksView.vue';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'tasks', component: TasksView },
    { path: '/auth/signin', name: 'signin', component: AuthView },
    { path: '/auth/signup', name: 'signup', component: AuthView },
  ],
});

router.beforeEach((to) => {
  const token = localStorage.getItem('token');
  if (to.name === 'tasks' && !token) {
    return { name: 'signin' };
  }
});

export default router;
