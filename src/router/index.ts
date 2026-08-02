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
    path: '/guides',
    name: 'guides',
    component: () => import('@/views/GuidesView.vue'),
  },
  {
    path: '/guides/:slug',
    name: 'guide-detail',
    component: () => import('@/views/GuideView.vue'),
  },
  {
    path: '/news',
    name: 'news',
    component: () => import('@/views/NewsView.vue'),
  },
  {
    path: '/news/:slug',
    name: 'news-post',
    component: () => import('@/views/NewsPostView.vue'),
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
  routes,
})

export default router
