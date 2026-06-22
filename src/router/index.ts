import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior: () => ({ top: 0 }),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    {
      path: '/tournaments',
      name: 'tournaments',
      component: () => import('@/views/TournamentsView.vue'),
    },
    {
      path: '/tournaments/:slug',
      name: 'tournament-detail',
      component: () => import('@/views/TournamentDetailView.vue'),
    },
    {
      path: '/tools/civ-draft',
      name: 'civ-draft',
      component: () => import('@/views/CivDraftView.vue'),
    },
    {
      path: '/tools/random',
      name: 'random-picker',
      component: () => import('@/views/RandomPickerView.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
    },
  ],
})

export default router
