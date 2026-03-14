import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useAuth } from './useAuth'

const TEST_TOKEN = 'test-secret-token-12345'
const AUTH_STORAGE_KEY = 'auth_token'

describe('useAuth', () => {
  beforeEach(() => {
    // モジュールスコープの共有状態をリセット
    useAuth().signOut()
    localStorage.clear()
    vi.stubEnv('VITE_AUTH_TOKEN', TEST_TOKEN)
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  describe('signIn', () => {
    it('正しいパスワードで認証が成功する', async () => {
      const { signIn, isAuthenticated, error } = useAuth()

      await signIn(TEST_TOKEN)

      expect(isAuthenticated.value).toBe(true)
      expect(error.value).toBeNull()
      expect(localStorage.getItem(AUTH_STORAGE_KEY)).toBe(TEST_TOKEN)
    })

    it('誤ったパスワードで認証が失敗する', async () => {
      const { signIn, isAuthenticated, error } = useAuth()

      await signIn('wrong-password')

      expect(isAuthenticated.value).toBe(false)
      expect(error.value).toBe('認証に失敗しました')
      expect(localStorage.getItem(AUTH_STORAGE_KEY)).toBeNull()
    })

    it('空文字のパスワードで認証が失敗する', async () => {
      const { signIn, isAuthenticated, error } = useAuth()

      await signIn('')

      expect(isAuthenticated.value).toBe(false)
      expect(error.value).toBe('認証に失敗しました')
    })

    it('signIn完了後にisLoadingがfalseになる', async () => {
      const { signIn, isLoading } = useAuth()

      await signIn('wrong-password')

      expect(isLoading.value).toBe(false)
    })

    it('signIn時に前回のエラーがクリアされる', async () => {
      const { signIn, error } = useAuth()

      await signIn('wrong-password')
      expect(error.value).toBe('認証に失敗しました')

      await signIn(TEST_TOKEN)
      expect(error.value).toBeNull()
    })
  })

  describe('signOut', () => {
    it('サインアウトでlocalStorageからトークンが削除される', async () => {
      const { signIn, signOut } = useAuth()

      await signIn(TEST_TOKEN)
      expect(localStorage.getItem(AUTH_STORAGE_KEY)).toBe(TEST_TOKEN)

      signOut()

      expect(localStorage.getItem(AUTH_STORAGE_KEY)).toBeNull()
    })

    it('サインアウトで認証状態がfalseになる', async () => {
      const { signIn, signOut, isAuthenticated } = useAuth()

      await signIn(TEST_TOKEN)
      expect(isAuthenticated.value).toBe(true)

      signOut()

      expect(isAuthenticated.value).toBe(false)
    })

    it('サインアウトでエラー状態がクリアされる', async () => {
      const { signIn, signOut, error } = useAuth()

      await signIn('wrong-password')
      expect(error.value).toBe('認証に失敗しました')

      signOut()

      expect(error.value).toBeNull()
    })
  })

  describe('checkAuth', () => {
    it('localStorageに有効なトークンがある場合はtrueを返す', () => {
      localStorage.setItem(AUTH_STORAGE_KEY, TEST_TOKEN)

      const { checkAuth, isAuthenticated } = useAuth()
      const result = checkAuth()

      expect(result).toBe(true)
      expect(isAuthenticated.value).toBe(true)
    })

    it('localStorageにトークンがない場合はfalseを返す', () => {
      const { checkAuth, isAuthenticated } = useAuth()
      const result = checkAuth()

      expect(result).toBe(false)
      expect(isAuthenticated.value).toBe(false)
    })

    it('localStorageのトークンが環境変数と一致しない場合はfalseを返す', () => {
      localStorage.setItem(AUTH_STORAGE_KEY, 'invalid-token')

      const { checkAuth, isAuthenticated } = useAuth()
      const result = checkAuth()

      expect(result).toBe(false)
      expect(isAuthenticated.value).toBe(false)
    })
  })

  describe('初期化', () => {
    it('localStorageに有効なトークンがある場合、初期化時に認証済みになる', () => {
      localStorage.setItem(AUTH_STORAGE_KEY, TEST_TOKEN)

      const { isAuthenticated } = useAuth()

      expect(isAuthenticated.value).toBe(true)
    })

    it('localStorageにトークンがない場合、初期化時に未認証になる', () => {
      const { isAuthenticated } = useAuth()

      expect(isAuthenticated.value).toBe(false)
    })
  })

  describe('環境変数未設定', () => {
    it('環境変数が未設定の場合、signInでエラーメッセージが表示される', async () => {
      vi.stubEnv('VITE_AUTH_TOKEN', '')

      const { signIn, error, isAuthenticated } = useAuth()
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      await signIn('any-password')

      expect(isAuthenticated.value).toBe(false)
      expect(error.value).toBe('認証に失敗しました')
      expect(consoleSpy).toHaveBeenCalledWith('VITE_AUTH_TOKEN environment variable is not set')

      consoleSpy.mockRestore()
    })

    it('環境変数がundefinedの場合、checkAuthはfalseを返す', () => {
      vi.stubEnv('VITE_AUTH_TOKEN', undefined as unknown as string)

      const { checkAuth } = useAuth()
      const result = checkAuth()

      expect(result).toBe(false)
    })
  })
})
