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
    },
        {
      path:'/events/burgerista',
      name: 'burgerista',
      component: () => import('@/views/Burgerista.vue')
    },
        {
      path:'/events/inlinedisco',
      name: 'inlinedisco',
      component: () => import('@/views/InlineDisco.vue')
    },
        {
      path:'/verein/mitgliedschaft',
      name: 'mitgliedschaft',
      component: () => import('@/views/Mitgliedschaft.vue')
    },
        {
      path:'/verein/vereinsstaette',
      name: 'vereinsstaette',
      component: () => import('@/views/Vereinsstaette.vue')
    },
        {
      path:'/verein/sponsoren',
      name: 'sponsoren',
      component: () => import('@/views/Sponsoren.vue')
    },

 

  ],
})

export default router
