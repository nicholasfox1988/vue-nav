import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/pickup',
      name: 'pickup',
      component: () => import('../views/pickup.vue')
    },
    {
      path: '/solutions',
      name: 'Solutions',
      component: () => import('../views/SolutionsView.vue')
    },
    {
      path: '/cases',
      name: 'Cases',
      component: () => import('../views/CasesView.vue')
    },
    {
      path: '/news',
      name: 'News',
      component: () => import('../views/NewsView.vue')
    },
    {
      path: '/support',
      name: 'Support',
      component: () => import('../views/SupportView.vue')
    },
    {
      path: '/about',
      name: 'About',
      component: () => import('../views/AboutView.vue')
    }
  ]
})

export default router