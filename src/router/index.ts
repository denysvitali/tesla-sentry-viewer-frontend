import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/clips',
      name: 'clips',
      component: () => import('../views/ClipsView.vue')
    },
    {
      path: '/clips/:id',
      name: 'clip',
      component: () => import('../views/SingleClipView.vue')
    }
  ]
})

export default router
