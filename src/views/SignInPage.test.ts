import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { TEXT } from '@/constants/text'
import SignInPage from './SignInPage.vue'

const mockPush = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

const mockSignIn = vi.fn()
const mockIsAuthenticated = ref(false)
const mockIsLoading = ref(false)
const mockError = ref<string | null>(null)

vi.mock('@/composables/useAuth', () => ({
  useAuth: () => ({
    isAuthenticated: mockIsAuthenticated,
    isLoading: mockIsLoading,
    error: mockError,
    signIn: mockSignIn,
  }),
}))

describe('SignInPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockIsAuthenticated.value = false
    mockIsLoading.value = false
    mockError.value = null
  })

  describe('レンダリング', () => {
    it('サインインタイトルが表示される', () => {
      const wrapper = mount(SignInPage)
      const title = wrapper.find('h1')
      expect(title.exists()).toBe(true)
      expect(title.text()).toBe(TEXT.auth.signInTitle)
    })

    it('SignInFormコンポーネントがレンダリングされる', () => {
      const wrapper = mount(SignInPage)
      const form = wrapper.find('[data-testid="signin-form"]')
      expect(form.exists()).toBe(true)
    })
  })

  describe('認証成功時のリダイレクト', () => {
    it('認証成功時に/musicsへリダイレクトする', async () => {
      mount(SignInPage)

      mockIsAuthenticated.value = true
      await flushPromises()

      expect(mockPush).toHaveBeenCalledWith('/musics')
    })

    it('mount時に既に認証済みの場合は即座に/musicsへリダイレクトする', async () => {
      mockIsAuthenticated.value = true
      mount(SignInPage)
      await flushPromises()

      expect(mockPush).toHaveBeenCalledWith('/musics')
    })

    it('認証が成功していない場合はリダイレクトしない', async () => {
      mount(SignInPage)

      mockIsAuthenticated.value = false
      await flushPromises()

      expect(mockPush).not.toHaveBeenCalled()
    })
  })

  describe('SignInFormへのprops受け渡し', () => {
    it('isLoadingがSignInFormに渡される', () => {
      mockIsLoading.value = true
      const wrapper = mount(SignInPage)
      const button = wrapper.find('[data-testid="signin-button"]')
      expect(button.attributes('disabled')).toBeDefined()
    })

    it('errorがSignInFormに渡される', () => {
      mockError.value = TEXT.auth.authFailed
      const wrapper = mount(SignInPage)
      const errorMsg = wrapper.find('[data-testid="error-message"]')
      expect(errorMsg.exists()).toBe(true)
      expect(errorMsg.text()).toBe(TEXT.auth.authFailed)
    })

    it('errorがnullの場合はエラーメッセージが表示されない', () => {
      mockError.value = null
      const wrapper = mount(SignInPage)
      const errorMsg = wrapper.find('[data-testid="error-message"]')
      expect(errorMsg.exists()).toBe(false)
    })
  })

  describe('フォーム送信', () => {
    it('フォーム送信時にsignInが呼ばれる', async () => {
      const wrapper = mount(SignInPage)
      const input = wrapper.find('[data-testid="password-input"]')
      await input.setValue('test-password')

      const form = wrapper.find('[data-testid="signin-form"]')
      await form.trigger('submit.prevent')
      await flushPromises()

      expect(mockSignIn).toHaveBeenCalledWith('test-password')
    })
  })
})
