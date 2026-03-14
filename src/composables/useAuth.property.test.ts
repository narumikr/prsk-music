import fc from 'fast-check'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useAuth } from './useAuth'

const AUTH_STORAGE_KEY = 'auth_token'

describe('useAuth Property Tests', () => {
  beforeEach(() => {
    // モジュールスコープの共有状態をリセット
    useAuth().signOut()
    localStorage.clear()
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  // Feature: simple-authentication, Property 2: 認証トークン比較の正確性
  // Validates: Requirements 2.1
  describe('Property 2: 認証トークン比較の正確性', () => {
    it('任意のパスワードに対して、環境変数のトークンと一致する場合のみ認証成功する', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 1, maxLength: 100 }),
          fc.string({ minLength: 1, maxLength: 100 }),
          async (authToken, password) => {
            useAuth().signOut()
            localStorage.clear()
            vi.stubEnv('VITE_AUTH_TOKEN', authToken)

            const { signIn, isAuthenticated } = useAuth()
            await signIn(password)

            if (password === authToken) {
              expect(isAuthenticated.value).toBe(true)
            } else {
              expect(isAuthenticated.value).toBe(false)
            }

            vi.unstubAllEnvs()
          }
        ),
        { numRuns: 100 }
      )
    })

    it('正しいトークンでのサインインは常に成功する', async () => {
      await fc.assert(
        fc.asyncProperty(fc.string({ minLength: 1, maxLength: 100 }), async (token) => {
          useAuth().signOut()
          localStorage.clear()
          vi.stubEnv('VITE_AUTH_TOKEN', token)

          const { signIn, isAuthenticated, error } = useAuth()
          await signIn(token)

          expect(isAuthenticated.value).toBe(true)
          expect(error.value).toBeNull()

          vi.unstubAllEnvs()
        }),
        { numRuns: 100 }
      )
    })
  })

  // Feature: simple-authentication, Property 3: 認証成功時のセッション永続化
  // Validates: Requirements 2.2, 3.1
  describe('Property 3: 認証成功時のセッション永続化', () => {
    it('正しいパスワードでサインイン後、トークンがlocalStorageに保存されcheckAuthがtrueを返す', async () => {
      await fc.assert(
        fc.asyncProperty(fc.string({ minLength: 1, maxLength: 100 }), async (token) => {
          useAuth().signOut()
          localStorage.clear()
          vi.stubEnv('VITE_AUTH_TOKEN', token)

          const { signIn, checkAuth } = useAuth()
          await signIn(token)

          expect(localStorage.getItem(AUTH_STORAGE_KEY)).toBe(token)
          expect(checkAuth()).toBe(true)

          vi.unstubAllEnvs()
        }),
        { numRuns: 100 }
      )
    })

    it('誤ったパスワードではlocalStorageにトークンが保存されない', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 1, maxLength: 100 }),
          fc.string({ minLength: 1, maxLength: 100 }),
          async (token, password) => {
            fc.pre(token !== password)
            useAuth().signOut()
            localStorage.clear()
            vi.stubEnv('VITE_AUTH_TOKEN', token)

            const { signIn } = useAuth()
            await signIn(password)

            expect(localStorage.getItem(AUTH_STORAGE_KEY)).toBeNull()

            vi.unstubAllEnvs()
          }
        ),
        { numRuns: 100 }
      )
    })
  })

  // Feature: simple-authentication, Property 4: 認証状態の復元
  // Validates: Requirements 3.2, 3.3
  describe('Property 4: 認証状態の復元', () => {
    it('localStorageに有効なトークンがある場合、初期化時に認証済みになる', () => {
      fc.assert(
        fc.property(fc.string({ minLength: 1, maxLength: 100 }), (token) => {
          useAuth().signOut()
          localStorage.clear()
          vi.stubEnv('VITE_AUTH_TOKEN', token)
          localStorage.setItem(AUTH_STORAGE_KEY, token)

          const { isAuthenticated, checkAuth } = useAuth()

          expect(isAuthenticated.value).toBe(true)
          expect(checkAuth()).toBe(true)

          vi.unstubAllEnvs()
        }),
        { numRuns: 100 }
      )
    })

    it('localStorageのトークンが環境変数と異なる場合、未認証になる', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 100 }),
          fc.string({ minLength: 1, maxLength: 100 }),
          (token, storedToken) => {
            fc.pre(token !== storedToken)
            useAuth().signOut()
            localStorage.clear()
            vi.stubEnv('VITE_AUTH_TOKEN', token)
            localStorage.setItem(AUTH_STORAGE_KEY, storedToken)

            const { isAuthenticated, checkAuth } = useAuth()

            expect(isAuthenticated.value).toBe(false)
            expect(checkAuth()).toBe(false)

            vi.unstubAllEnvs()
          }
        ),
        { numRuns: 100 }
      )
    })
  })

  // Feature: simple-authentication, Property 5: サインアウト時のセッション削除
  // Validates: Requirements 4.2
  describe('Property 5: サインアウト時のセッション削除', () => {
    it('認証済み状態からサインアウトすると、localStorageからトークンが削除されcheckAuthがfalseを返す', async () => {
      await fc.assert(
        fc.asyncProperty(fc.string({ minLength: 1, maxLength: 100 }), async (token) => {
          useAuth().signOut()
          localStorage.clear()
          vi.stubEnv('VITE_AUTH_TOKEN', token)

          const { signIn, signOut, checkAuth, isAuthenticated } = useAuth()
          await signIn(token)

          expect(isAuthenticated.value).toBe(true)

          signOut()

          expect(localStorage.getItem(AUTH_STORAGE_KEY)).toBeNull()
          expect(checkAuth()).toBe(false)
          expect(isAuthenticated.value).toBe(false)

          vi.unstubAllEnvs()
        }),
        { numRuns: 100 }
      )
    })
  })
})
