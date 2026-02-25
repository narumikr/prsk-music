import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ConfirmDialog from './ConfirmDialog.vue'

// ============================================================================
// Unit Tests
// ============================================================================

describe('ConfirmDialog Unit Tests', () => {
  it('確認ダイアログが表示される', () => {
    // open=trueの場合、確認ダイアログが表示される
    const wrapper = mount(ConfirmDialog, {
      props: {
        open: true,
        title: '削除確認',
        message: 'この楽曲を削除してもよろしいですか？',
      },
    })

    // ダイアログ要素が存在することを確認
    const dialog = wrapper.find('[data-testid="confirm-dialog"]')
    expect(dialog.exists()).toBe(true)

    // role="dialog"属性が設定されていることを確認（アクセシビリティ）
    expect(dialog.attributes('role')).toBe('dialog')
  })

  it('open=falseの場合、ダイアログが表示されない', () => {
    // open=falseの場合、確認ダイアログが表示されない
    const wrapper = mount(ConfirmDialog, {
      props: {
        open: false,
        title: '削除確認',
        message: 'この楽曲を削除してもよろしいですか？',
      },
    })

    // ダイアログ要素が存在しないことを確認
    const dialog = wrapper.find('[data-testid="confirm-dialog"]')
    expect(dialog.exists()).toBe(false)
  })

  it('タイトルが正しく表示される', () => {
    // propsで渡されたtitleが表示される
    const title = '削除確認'
    const wrapper = mount(ConfirmDialog, {
      props: {
        open: true,
        title,
        message: 'この楽曲を削除してもよろしいですか？',
      },
    })

    // タイトル要素が存在し、正しいテキストが表示されることを確認
    const titleElement = wrapper.find('[data-testid="dialog-title"]')
    expect(titleElement.exists()).toBe(true)
    expect(titleElement.text()).toBe(title)
  })

  it('メッセージが正しく表示される', () => {
    // propsで渡されたmessageが表示される
    const message = 'この楽曲を削除してもよろしいですか？'
    const wrapper = mount(ConfirmDialog, {
      props: {
        open: true,
        title: '削除確認',
        message,
      },
    })

    // メッセージ要素が存在し、正しいテキストが表示されることを確認
    const messageElement = wrapper.find('[data-testid="dialog-message"]')
    expect(messageElement.exists()).toBe(true)
    expect(messageElement.text()).toBe(message)
  })

  it('確認ボタンが表示される', () => {
    // 確認ボタンが表示される
    const wrapper = mount(ConfirmDialog, {
      props: {
        open: true,
        title: '削除確認',
        message: 'この楽曲を削除してもよろしいですか？',
      },
    })

    // 確認ボタンが存在することを確認
    const confirmButton = wrapper.find('[data-testid="confirm-button"]')
    expect(confirmButton.exists()).toBe(true)
  })

  it('キャンセルボタンが表示される', () => {
    // キャンセルボタンが表示される
    const wrapper = mount(ConfirmDialog, {
      props: {
        open: true,
        title: '削除確認',
        message: 'この楽曲を削除してもよろしいですか？',
      },
    })

    // キャンセルボタンが存在することを確認
    const cancelButton = wrapper.find('[data-testid="cancel-button"]')
    expect(cancelButton.exists()).toBe(true)
  })

  it('確認ボタンクリック時にconfirmイベントが発火される', async () => {
    // 確認ボタンをクリックすると、confirmイベントが発火される
    const wrapper = mount(ConfirmDialog, {
      props: {
        open: true,
        title: '削除確認',
        message: 'この楽曲を削除してもよろしいですか？',
      },
    })

    const confirmButton = wrapper.find('[data-testid="confirm-button"]')
    await confirmButton.trigger('click')

    // confirmイベントが発火されることを確認
    expect(wrapper.emitted('confirm')).toBeTruthy()
    expect(wrapper.emitted('confirm')?.length).toBe(1)
  })

  it('キャンセルボタンクリック時にcancelイベントが発火される', async () => {
    // キャンセルボタンをクリックすると、cancelイベントが発火される
    const wrapper = mount(ConfirmDialog, {
      props: {
        open: true,
        title: '削除確認',
        message: 'この楽曲を削除してもよろしいですか？',
      },
    })

    const cancelButton = wrapper.find('[data-testid="cancel-button"]')
    await cancelButton.trigger('click')

    // cancelイベントが発火されることを確認
    expect(wrapper.emitted('cancel')).toBeTruthy()
    expect(wrapper.emitted('cancel')?.length).toBe(1)
  })

  it('背景オーバーレイクリック時にcancelイベントが発火される', async () => {
    // 背景オーバーレイをクリックすると、cancelイベントが発火される（ダイアログを閉じる）
    const wrapper = mount(ConfirmDialog, {
      props: {
        open: true,
        title: '削除確認',
        message: 'この楽曲を削除してもよろしいですか？',
      },
    })

    const overlay = wrapper.find('[data-testid="dialog-overlay"]')
    await overlay.trigger('click')

    // cancelイベントが発火されることを確認
    expect(wrapper.emitted('cancel')).toBeTruthy()
    expect(wrapper.emitted('cancel')?.length).toBe(1)
  })

  it('Escapeキー押下時にcancelイベントが発火される', async () => {
    // Escapeキーを押すと、cancelイベントが発火される（ダイアログを閉じる）
    const wrapper = mount(ConfirmDialog, {
      props: {
        open: true,
        title: '削除確認',
        message: 'この楽曲を削除してもよろしいですか？',
      },
    })

    const dialog = wrapper.find('[data-testid="confirm-dialog"]')
    await dialog.trigger('keydown.escape')

    // cancelイベントが発火されることを確認
    expect(wrapper.emitted('cancel')).toBeTruthy()
    expect(wrapper.emitted('cancel')?.length).toBe(1)
  })

  it('アーティスト削除時の警告メッセージが表示される', () => {
    // アーティスト削除時の警告メッセージが含まれる場合、正しく表示される
    const message =
      'このアーティストを削除すると、楽曲から参照されているアーティストが不明なアーティストとして扱われます。本当に削除してもよろしいですか？'
    const wrapper = mount(ConfirmDialog, {
      props: {
        open: true,
        title: 'アーティスト削除確認',
        message,
      },
    })

    // メッセージ要素が存在し、警告メッセージが表示されることを確認
    const messageElement = wrapper.find('[data-testid="dialog-message"]')
    expect(messageElement.exists()).toBe(true)
    expect(messageElement.text()).toContain('不明なアーティストとして扱われます')
  })
})
