import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import NotificationDialog from './NotificationDialog.vue'

describe('NotificationDialog', () => {
  it('成功メッセージが表示される', () => {
    const wrapper = mount(NotificationDialog, {
      props: {
        message: '操作が成功しました',
        type: 'success',
        visible: true,
      },
    })

    expect(wrapper.text()).toContain('操作が成功しました')
    expect(wrapper.find('[data-testid="notification-dialog"]').exists()).toBe(true)
  })

  it('エラーメッセージが表示される', () => {
    const wrapper = mount(NotificationDialog, {
      props: {
        message: 'エラーが発生しました',
        type: 'error',
        visible: true,
      },
    })

    expect(wrapper.text()).toContain('エラーが発生しました')
    expect(wrapper.find('[data-testid="notification-dialog"]').exists()).toBe(true)
  })

  it('情報メッセージが表示される', () => {
    const wrapper = mount(NotificationDialog, {
      props: {
        message: '情報をお知らせします',
        type: 'info',
        visible: true,
      },
    })

    expect(wrapper.text()).toContain('情報をお知らせします')
    expect(wrapper.find('[data-testid="notification-dialog"]').exists()).toBe(true)
  })

  it('非表示時にコンテンツが表示されない', () => {
    const wrapper = mount(NotificationDialog, {
      props: {
        message: 'このメッセージは表示されない',
        type: 'info',
        visible: false,
      },
    })

    expect(wrapper.find('[data-testid="notification-dialog"]').exists()).toBe(false)
    expect(wrapper.text()).not.toContain('このメッセージは表示されない')
  })

  it('successタイプの場合、成功スタイルが適用される', () => {
    const wrapper = mount(NotificationDialog, {
      props: {
        message: '成功',
        type: 'success',
        visible: true,
      },
    })

    const dialog = wrapper.find('[data-testid="notification-dialog"]')
    expect(dialog.classes()).toContain('border-[#bbdd22]')
  })

  it('errorタイプの場合、エラースタイルが適用される', () => {
    const wrapper = mount(NotificationDialog, {
      props: {
        message: 'エラー',
        type: 'error',
        visible: true,
      },
    })

    const dialog = wrapper.find('[data-testid="notification-dialog"]')
    expect(dialog.classes()).toContain('border-[#ff6699]')
  })

  it('infoタイプの場合、情報スタイルが適用される', () => {
    const wrapper = mount(NotificationDialog, {
      props: {
        message: '情報',
        type: 'info',
        visible: true,
      },
    })

    const dialog = wrapper.find('[data-testid="notification-dialog"]')
    expect(dialog.classes()).toContain('border-[#33aaee]')
  })
})
