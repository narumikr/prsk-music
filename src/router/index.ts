import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import ArtistListPage from '@/views/ArtistListPage.vue'
import MusicListPage from '@/views/MusicListPage.vue'
import SignInPage from '@/views/SignInPage.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/signin',
    name: 'signin',
    component: SignInPage,
    meta: { requiresAuth: false },
  },
  {
    path: '/',
    redirect: '/musics',
  },
  {
    path: '/musics',
    name: 'musics',
    component: MusicListPage,
    meta: { requiresAuth: true },
  },
  {
    path: '/artists',
    name: 'artists',
    component: ArtistListPage,
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

/**
 * ナビゲーションガード
 * 未認証時は保護されたルートへのアクセスをサインインページにリダイレクト
 * 認証済み時はサインインページへのアクセスを楽曲一覧ページにリダイレクト
 * Requirements: 3.4, 5.1, 5.2, 5.3, 5.4
 */
router.beforeEach((to) => {
  const { checkAuth } = useAuth()
  const isAuthenticated = checkAuth()

  if (!to.meta.requiresAuth) {
    if (isAuthenticated) {
      return '/musics'
    }
    return true
  }

  if (!isAuthenticated) {
    return '/signin'
  }

  return true
})

export default router
