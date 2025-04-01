import { createRouter, createWebHashHistory } from 'vue-router';
import { SESSIONSTORAGE_KEYS, getSession } from '@src/utils/sessionstorage';

const routes = [
  {
    path: '/',
    redirect: '/workflow-list',
    component: () => import('@src/layout/default-layout.vue'),
    children: [
      {
        path: '/workflow-list',
        name: 'workflow-list',
        component: () => import('@src/pages/workflow-list/workflow-list.vue'),
      },
      {
        path: '/share-node-list',
        name: 'share-node-list',
        component: () =>
          import('@src/pages/share-node-list/share-node-list.vue'),
      },
    ],
  },
  {
    path: '/workflow',
    name: 'workflow',
    component: () => import('@src/pages/workflow/workflow.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@src/pages/login/login.vue'),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = getSession(SESSIONSTORAGE_KEYS.TOKEN);
  if (token) {
    if (to.path === '/login') {
      next(from);
    } else {
      next();
    }
  } else {
    if (to.path !== '/login') {
      next('/login');
    } else {
      next();
    }
  }
});

export default router;
