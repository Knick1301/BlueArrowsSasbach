import { createRouter, createWebHistory } from 'vue-router'
import MainView from '@/views/Main.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: MainView,
    },
    {
      path:'/hockey',
      name: 'hockey',
      component: () => import('@/views/Hockey.vue')
    },
    {
      path:'/aktuelles',
      name: 'aktuelles',
      component: () => import('@/views/Aktuelles.vue')
    },
    {
      path:'/inlineSkating',
      name: 'inlineSkating',
      component: () => import('@/views/InlineSkating.vue')
    },
    {
      path:'/events',
      name: 'events',
      component: () => import('@/views/Events.vue')
    },
    {
      path:'/verein',
      name: 'verein',
      component: () => import('@/views/Verein.vue')
    },
    {
      path:'/fanzone',
      name: 'fanzone',
      component: () => import('@/views/Fanzone.vue')
    },
    {
      path:'/teams/:teamName',
      name: 'teams',
      component: () => import('@/views/Teams.vue')
    },
    {
      path:'/training/trainings',
      name: 'training',
      component: () => import('@/views/Trainingszeiten.vue')
    }

  ],
})

export default router
