import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { TEXT } from '@/constants/text'
import SignInForm from './SignInForm.vue'

describe('SignInForm', () => {
  describe('パスワード入力フィールド', () => {
    it('パスワード入力フィールドが存在する', () => {
      const wrapper = mount(SignInForm)
      const input = wrapper.find('[data-testid="password-input"]')
      expect(input.exists()).toBe(true)
    })

    it('type="password"が設定されている', () => {
      const wrapper = mount(SignInForm)
      const input = wrapper.find('[data-testid="password-input"]')
      expect(input.attributes('type')).toBe('password')
    })

    it('ラベルが存在する', () => {
      const wrapper = mount(SignInForm)
      const label = wrapper.find('label[for="password"]')
      expect(label.exists()).toBe(true)
      expect(label.text()).toBe(TEXT.auth.passwordLabel)
    })

    it('プレースホルダーが設定されている', () => {
      const wrapper = mount(SignInForm)
      const input = wrapper.find('[data-testid="password-input"]')
      expect(input.attributes('placeholder')).toBe(TEXT.auth.passwordPlaceholder)
    })
  })

  describe('サインインボタン', () => {
    it('サインインボタンが存在する', () => {
      const wrapper = mount(SignInForm)
      const button = wrapper.find('[data-testid="signin-button"]')
      expect(button.exists()).toBe(true)
      expect(button.text()).toBe(TEXT.auth.signInButton)
    })

    it('パスワードが空の場合はボタンが無効化される', () => {
      const wrapper = mount(SignInForm)
      const button = wrapper.find('[data-testid="signin-button"]')
      expect(button.attributes('disabled')).toBeDefined()
    })

    it('スペースのみの場合もボタンが無効化される', async () => {
      const wrapper = mount(SignInForm)
      const input = wrapper.find('[data-testid="password-input"]')
      await input.setValue('   ')
      const button = wrapper.find('[data-testid="signin-button"]')
      expect(button.attributes('disabled')).toBeDefined()
    })

    it('パスワードを入力するとボタンが有効化される', async () => {
      const wrapper = mount(SignInForm)
      const input = wrapper.find('[data-testid="password-input"]')
      await input.setValue('some-password')
      const button = wrapper.find('[data-testid="signin-button"]')
      expect(button.attributes('disabled')).toBeUndefined()
    })
  })

  describe('フォーム送信', () => {
    it('パスワード入力後にフォーム送信でsubmitイベントが発火する', async () => {
      const wrapper = mount(SignInForm)
      const input = wrapper.find('[data-testid="password-input"]')
      await input.setValue('test-password')

      const form = wrapper.find('[data-testid="signin-form"]')
      await form.trigger('submit.prevent')

      const emitted = wrapper.emitted('submit')
      expect(emitted).toBeTruthy()
      expect(emitted?.[0]).toEqual(['test-password'])
    })

    it('パスワードが空の場合はsubmitイベントが発火しない', async () => {
      const wrapper = mount(SignInForm)
      const form = wrapper.find('[data-testid="signin-form"]')
      await form.trigger('submit.prevent')

      expect(wrapper.emitted('submit')).toBeFalsy()
    })
  })

  describe('ローディング状態', () => {
    it('isLoading=trueの場合にローディングテキストが表示される', () => {
      const wrapper = mount(SignInForm, {
        props: { isLoading: true },
      })
      const indicator = wrapper.find('[data-testid="loading-indicator"]')
      expect(indicator.exists()).toBe(true)
      expect(indicator.text()).toBe(TEXT.common.loading)
    })

    it('isLoading=trueの場合にサインインボタンテキストが非表示になる', () => {
      const wrapper = mount(SignInForm, {
        props: { isLoading: true },
      })
      const button = wrapper.find('[data-testid="signin-button"]')
      expect(button.text()).not.toContain(TEXT.auth.signInButton)
    })

    it('isLoading=trueの場合にボタンが無効化される', () => {
      const wrapper = mount(SignInForm, {
        props: { isLoading: true },
      })
      const button = wrapper.find('[data-testid="signin-button"]')
      expect(button.attributes('disabled')).toBeDefined()
    })

    it('isLoading=trueの場合にパスワード入力が無効化される', () => {
      const wrapper = mount(SignInForm, {
        props: { isLoading: true },
      })
      const input = wrapper.find('[data-testid="password-input"]')
      expect(input.attributes('disabled')).toBeDefined()
    })

    it('isLoading=falseの場合にローディングインジケーターが非表示になる', () => {
      const wrapper = mount(SignInForm, {
        props: { isLoading: false },
      })
      const indicator = wrapper.find('[data-testid="loading-indicator"]')
      expect(indicator.exists()).toBe(false)
    })
  })

  describe('エラーメッセージ', () => {
    it('errorが設定されている場合にエラーメッセージが表示される', () => {
      const wrapper = mount(SignInForm, {
        props: { error: TEXT.auth.authFailed },
      })
      const errorMsg = wrapper.find('[data-testid="error-message"]')
      expect(errorMsg.exists()).toBe(true)
      expect(errorMsg.text()).toBe(TEXT.auth.authFailed)
    })

    it('エラーメッセージにrole="alert"が設定されている', () => {
      const wrapper = mount(SignInForm, {
        props: { error: TEXT.auth.authFailed },
      })
      const errorMsg = wrapper.find('[data-testid="error-message"]')
      expect(errorMsg.attributes('role')).toBe('alert')
    })

    it('errorがnullの場合にエラーメッセージが非表示になる', () => {
      const wrapper = mount(SignInForm, {
        props: { error: null },
      })
      const errorMsg = wrapper.find('[data-testid="error-message"]')
      expect(errorMsg.exists()).toBe(false)
    })

    it('errorが未指定の場合にエラーメッセージが非表示になる', () => {
      const wrapper = mount(SignInForm)
      const errorMsg = wrapper.find('[data-testid="error-message"]')
      expect(errorMsg.exists()).toBe(false)
    })
  })
})
