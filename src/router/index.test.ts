import { beforeEach, describe, expect, it, vi } from 'vitest'

// useAuth をモック（vi.hoisted でモジュール読み込み前に初期化）
const mockCheckAuth = vi.hoisted(() => vi.fn<() => boolean>())

vi.mock('@/composables/useAuth', () => ({
  useAuth: () => ({
    isAuthenticated: { value: false },
    isLoading: { value: false },
    error: { value: null },
    signIn: vi.fn(),
    signOut: vi.fn(),
    checkAuth: mockCheckAuth,
  }),
}))

// コンポーネントをモック
vi.mock('@/views/SignInPage.vue', () => ({ default: { template: '<div>SignIn</div>' } }))
vi.mock('@/views/MusicListPage.vue', () => ({ default: { template: '<div>Musics</div>' } }))
vi.mock('@/views/ArtistListPage.vue', () => ({ default: { template: '<div>Artists</div>' } }))

import router from './index'

describe('ナビゲーションガード', () => {
  beforeEach(() => {
    mockCheckAuth.mockReset()
  })

  describe('未認証時', () => {
    beforeEach(() => {
      mockCheckAuth.mockReturnValue(false)
    })

    it('/musics にアクセスすると /signin にリダイレクトされる', async () => {
      await router.push('/musics')
      await router.isReady()

      expect(router.currentRoute.value.path).toBe('/signin')
    })

    it('/artists にアクセスすると /signin にリダイレクトされる', async () => {
      await router.push('/artists')
      await router.isReady()

      expect(router.currentRoute.value.path).toBe('/signin')
    })

    it('/signin にアクセスするとそのまま表示される', async () => {
      await router.push('/signin')
      await router.isReady()

      expect(router.currentRoute.value.path).toBe('/signin')
    })
  })

  describe('認証済み時', () => {
    beforeEach(async () => {
      mockCheckAuth.mockReturnValue(true)
      // 認証済みルートに移動して初期位置をリセット
      await router.push('/musics')
    })

    it('/signin にアクセスすると /musics にリダイレクトされる', async () => {
      await router.push('/signin')

      expect(router.currentRoute.value.path).toBe('/musics')
    })

    it('/musics にアクセスするとそのまま表示される', async () => {
      await router.push('/musics')

      expect(router.currentRoute.value.path).toBe('/musics')
    })

    it('/artists にアクセスするとそのまま表示される', async () => {
      await router.push('/artists')

      expect(router.currentRoute.value.path).toBe('/artists')
    })
  })
})
