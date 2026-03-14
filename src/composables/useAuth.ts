import { type Ref, ref } from 'vue'
import { TEXT } from '@/constants/text'

const AUTH_STORAGE_KEY = 'auth_token'

// モジュールスコープで状態を定義することで、複数コンポーネント間で状態を共有する
const isAuthenticated = ref(false)
const isLoading = ref(false)
const error = ref<string | null>(null)

/**
 * useAuthの戻り値の型定義
 */
export interface UseAuthReturn {
  isAuthenticated: Ref<boolean>
  isLoading: Ref<boolean>
  error: Ref<string | null>
  signIn: (password: string) => Promise<void>
  signOut: () => void
  checkAuth: () => boolean
}

/**
 * 認証ロジックを管理するComposable
 *
 * 環境変数で管理される固定トークンとlocalStorageによるセッション管理を提供する
 *
 * Requirements: 2.1, 2.2, 3.1, 3.2, 3.3, 4.2, 6.1, 6.2
 */
export function useAuth(): UseAuthReturn {
  const AUTH_TOKEN = import.meta.env.VITE_AUTH_TOKEN || undefined

  /**
   * localStorageの認証トークンと環境変数のトークンを比較して認証状態を確認する
   * Requirements: 3.2, 3.3
   */
  const checkAuth = (): boolean => {
    const storedToken = localStorage.getItem(AUTH_STORAGE_KEY)
    const authenticated = !!storedToken && storedToken === AUTH_TOKEN
    isAuthenticated.value = authenticated
    return authenticated
  }

  /**
   * パスワードを環境変数のトークンと比較してサインインする
   * Requirements: 2.1, 2.2, 3.1, 6.1, 6.2
   */
  const signIn = async (password: string): Promise<void> => {
    error.value = null
    isLoading.value = true

    try {
      if (!AUTH_TOKEN) {
        console.error('VITE_AUTH_TOKEN environment variable is not set')
        error.value = TEXT.auth.authFailed
        return
      }

      if (password === AUTH_TOKEN) {
        localStorage.setItem(AUTH_STORAGE_KEY, password)
        isAuthenticated.value = true
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY)
        isAuthenticated.value = false
        error.value = TEXT.auth.authFailed
      }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * サインアウトしてlocalStorageからトークンを削除する
   * Requirements: 4.2
   */
  const signOut = (): void => {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    isAuthenticated.value = false
    error.value = null
  }

  // 初期化時に認証状態を確認
  checkAuth()

  return {
    isAuthenticated,
    isLoading,
    error,
    signIn,
    signOut,
    checkAuth,
  }
}
