import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'home', component: Home },
  {
    path: '/pickup',
    name: 'pickup',
    component: () => import('../views/Pickup.vue')
  },
  {
    path: '/yun',
    name: 'yun',
    component: () => import('../views/Yun.vue')
  },
  {
    path: '/k1',
    name: 'k1',
    component: () => import('../views/K1.vue')
  },
  {
    path: '/k2',
    name: 'k2',
    component: () => import('../views/K2.vue')
  },
  {
    path: '/anna',
    name: 'anna',
    component: () => import('../views/Anna.vue')
  },
  // 404 兜底
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router