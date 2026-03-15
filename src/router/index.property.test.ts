import fc from 'fast-check'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// vi.hoisted でモジュール読み込み前に初期化
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

vi.mock('@/views/SignInPage.vue', () => ({ default: { template: '<div>SignIn</div>' } }))
vi.mock('@/views/MusicListPage.vue', () => ({ default: { template: '<div>Musics</div>' } }))
vi.mock('@/views/ArtistListPage.vue', () => ({ default: { template: '<div>Artists</div>' } }))

import router from './index'

const protectedRoutes = ['/musics', '/artists']

describe('Router Navigation Guard Property Tests', () => {
  beforeEach(() => {
    mockCheckAuth.mockReset()
  })

  // Feature: simple-authentication, Property 1: 未認証時のサインインページリダイレクト
  // Validates: Requirements 1.1, 3.4, 5.2
  describe('Property 1: 未認証時のサインインページリダイレクト', () => {
    it('任意の保護されたルートに未認証でアクセスすると /signin にリダイレクトされる', async () => {
      await fc.assert(
        fc.asyncProperty(fc.constantFrom(...protectedRoutes), async (route) => {
          mockCheckAuth.mockReturnValue(false)

          await router.push('/signin')
          await router.isReady()
          await router.push(route)

          expect(router.currentRoute.value.path).toBe('/signin')
        }),
        { numRuns: 100 }
      )
    })
  })

  // Feature: simple-authentication, Property 6: 認証済みユーザーの保護されたルートアクセス
  // Validates: Requirements 5.3
  describe('Property 6: 認証済みユーザーの保護されたルートアクセス', () => {
    it('任意の保護されたルートに認証済みでアクセスするとリダイレクトされずにページが表示される', async () => {
      await fc.assert(
        fc.asyncProperty(fc.constantFrom(...protectedRoutes), async (route) => {
          mockCheckAuth.mockReturnValue(true)

          await router.push('/musics')
          await router.isReady()
          await router.push(route)

          expect(router.currentRoute.value.path).toBe(route)
        }),
        { numRuns: 100 }
      )
    })
  })
})
