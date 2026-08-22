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
    {path: '/aktuelles/news/:slug',
      name: 'artikel',
      component: () => import ('@/views/Artikel.vue')
    },
    {
      path:'/aktuelles/news',
      name: 'aktuelles',
      component: () => import('@/views/News.vue')
    },
    {
      path:'/skating/laufschule',
      name: 'laufschule',
      component: () => import('@/views/Laufschule.vue')
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
    },
        {
      path:'/skating/schuleFerien',
      name: 'schuleFerien',
      component: () => import('@/views/SchuleFerien.vue')
    }


  ],
})

export default router
