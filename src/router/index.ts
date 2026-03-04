import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import ArtistListPage from '@/views/ArtistListPage.vue'
import MusicListPage from '@/views/MusicListPage.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/musics',
  },
  {
    path: '/musics',
    name: 'musics',
    component: MusicListPage,
  },
  {
    path: '/artists',
    name: 'artists',
    component: ArtistListPage,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
