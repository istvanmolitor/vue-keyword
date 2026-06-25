import type { RouteRecordRaw } from 'vue-router'

const keywordRoutes: RouteRecordRaw[] = [
  {
    path: '/admin/keyword',
    name: 'keyword-keywords',
    component: () => import('../views/keyword/KeywordIndex.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/keyword/create',
    name: 'keyword-keyword-create',
    component: () => import('../views/keyword/KeywordCreate.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/keyword/:id/edit',
    name: 'keyword-keyword-edit',
    component: () => import('../views/keyword/KeywordEdit.vue'),
    meta: { requiresAuth: true }
  },
]

export default keywordRoutes
