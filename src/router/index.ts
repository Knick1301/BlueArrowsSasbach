import { createRouter, createWebHistory } from 'vue-router'
import { setPageMeta } from '@/utils/seo'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/Main.vue'),
    },
    {path: '/aktuelles/news/:slug',
      name: 'artikel',
      component: () => import ('@/views/Artikel.vue')
    },
    {
      path:'/aktuelles/news',
      name: 'aktuelles',
      meta: { title: 'News' },
      component: () => import('@/views/News.vue')
    },
    {
      path:'/aktuelles/termine',
      name: 'termine',
      meta: { title: 'Termine' },
      component: () => import('@/views/Termin.vue')
    },
    {
      path:'/skating/laufschule',
      name: 'laufschule',
      meta: { title: 'Laufschule' },
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
      meta: { title: 'Trainingszeiten' },
      component: () => import('@/views/Trainingszeiten.vue')
    },
        {
      path:'/skating/schuleFerien',
      name: 'schuleFerien',
      meta: { title: 'Schule & Ferien' },
      component: () => import('@/views/SchuleFerien.vue')
    },
        {
      path:'/events/burgerista',
      name: 'burgerista',
      meta: { title: 'Burgerista' },
      component: () => import('@/views/Burgerista.vue')
    },
        {
      path:'/events/inlinedisco',
      name: 'inlinedisco',
      meta: { title: 'Inline-Disco' },
      component: () => import('@/views/InlineDisco.vue')
    },
        {
      path:'/verein/mitgliedschaft',
      name: 'mitgliedschaft',
      meta: { title: 'Mitgliedschaft' },
      component: () => import('@/views/Mitgliedschaft.vue')
    },
        {
      path:'/verein/vereinsstaette',
      name: 'vereinsstaette',
      meta: { title: 'Vereinsstätte' },
      component: () => import('@/views/Vereinsstaette.vue')
    },
        {
      path:'/verein/sponsoren',
      name: 'sponsoren',
      meta: { title: 'Sponsoren' },
      component: () => import('@/views/Sponsoren.vue')
    },
        {
      path:'/verein/kontakt',
      name: 'kontakt',
      meta: { title: 'Kontakt' },
      component: () => import('@/views/Kontakt.vue')
    },
        {
      path:'/impressum',
      name: 'impressum',
      meta: { title: 'Impressum' },
      component: () => import('@/views/Impressum.vue')
    },
        {
      path:'/datenschutz',
      name: 'datenschutz',
      meta: { title: 'Datenschutz' },
      component: () => import('@/views/Datenschutz.vue')
    },
        {
      path:'/historie/geschichte',
      name: 'historie',
      meta: { title: 'Geschichte' },
      component: () => import('@/views/Historie.vue')
    },
        {
      path:'/historie/hall-of-fame',
      name: 'hallOfFame',
      meta: { title: 'Hall of Fame' },
      component: () => import('@/views/HallOfFame.vue')
    },

    {
      path: '/:pathMatch(.*)*',
      name: 'notFound',
      meta: { title: 'Seite nicht gefunden' },
      component: () => import('@/views/NotFound.vue'),
    },
  ],
  scrollBehavior: () => ({ top: 0 }),
})


router.afterEach((to) => {
  if (to.name === 'home') setPageMeta()
  else if (typeof to.meta.title === 'string') setPageMeta({ title: to.meta.title })
})

export default router
