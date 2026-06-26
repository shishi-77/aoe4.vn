import { createRouter, createWebHistory, createMemoryHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

export const routes: RouteRecordRaw[] = [
  { path: '/', name: 'home', component: HomeView },
  {
    path: '/faq',
    name: 'faq',
    component: () => import('@/views/FAQView.vue'),
  },
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
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
  },
]

const history =
  typeof window !== 'undefined'
    ? createWebHistory(import.meta.env.BASE_URL)
    : createMemoryHistory(import.meta.env.BASE_URL)

const router = createRouter({
  history,
  scrollBehavior: () => ({ top: 0 }),
  routes,
})

export default router
