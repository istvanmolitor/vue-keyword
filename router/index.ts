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
  {
    path: '/admin/keyword-group',
    name: 'keyword-keyword-groups',
    component: () => import('../views/keywordGroup/KeywordGroupIndex.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/keyword-group/create',
    name: 'keyword-keyword-group-create',
    component: () => import('../views/keywordGroup/KeywordGroupCreate.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/keyword-group/:id/edit',
    name: 'keyword-keyword-group-edit',
    component: () => import('../views/keywordGroup/KeywordGroupEdit.vue'),
    meta: { requiresAuth: true }
  },
]

export default keywordRoutes
