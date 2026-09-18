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
        {
      path:'/verein/kontakt',
      name: 'kontakt',
      component: () => import('@/views/Kontakt.vue')
    },
        {
      path:'/impressum',
      name: 'impressum',
      component: () => import('@/views/Impressum.vue')
    },
        {
      path:'/datenschutz',
      name: 'datenschutz',
      component: () => import('@/views/Datenschutz.vue')
    },
        {
      path:'/historie/geschichte',
      name: 'historie',
      component: () => import('@/views/Historie.vue')
    },
        {
      path:'/historie/hall-of-fame',
      name: 'hallOfFame',
      component: () => import('@/views/HallOfFame.vue')
    },

  ],
})

export default router
