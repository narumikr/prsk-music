import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import YouTubeModal from './YouTubeModal.vue'

// ============================================================================
// Unit Tests
// ============================================================================

describe('YouTubeModal Unit Tests', () => {
  it('モーダルが表示される', () => {
    // open=trueの場合、モーダルが表示される
    const wrapper = mount(YouTubeModal, {
      props: {
        open: true,
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      },
    })

    // モーダル要素が存在することを確認
    const modal = wrapper.find('[data-testid="youtube-modal"]')
    expect(modal.exists()).toBe(true)

    // role="dialog"属性が設定されていることを確認（アクセシビリティ）
    expect(modal.attributes('role')).toBe('dialog')
  })

  it('open=falseの場合、モーダルが表示されない', () => {
    // open=falseの場合、モーダルが表示されない
    const wrapper = mount(YouTubeModal, {
      props: {
        open: false,
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      },
    })

    // モーダル要素が存在しないことを確認
    const modal = wrapper.find('[data-testid="youtube-modal"]')
    expect(modal.exists()).toBe(false)
  })

  it('YouTube動画が埋め込まれる', () => {
    // YouTube動画のiframeが埋め込まれる
    const videoUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    const wrapper = mount(YouTubeModal, {
      props: {
        open: true,
        videoUrl,
      },
    })

    // iframe要素が存在することを確認
    const iframe = wrapper.find('[data-testid="youtube-iframe"]')
    expect(iframe.exists()).toBe(true)

    // iframeのsrc属性にYouTube埋め込みURLが設定されていることを確認
    const src = iframe.attributes('src')
    expect(src).toContain('youtube.com/embed/')
    expect(src).toContain('dQw4w9WgXcQ')
  })

  it('URLから動画IDが正しく抽出される（標準形式）', () => {
    // 標準形式のYouTube URL: https://www.youtube.com/watch?v=VIDEO_ID
    const videoUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    const wrapper = mount(YouTubeModal, {
      props: {
        open: true,
        videoUrl,
      },
    })

    const iframe = wrapper.find('[data-testid="youtube-iframe"]')
    const src = iframe.attributes('src')
    expect(src).toContain('dQw4w9WgXcQ')
  })

  it('URLから動画IDが正しく抽出される（短縮形式）', () => {
    // 短縮形式のYouTube URL: https://youtu.be/VIDEO_ID
    const videoUrl = 'https://youtu.be/dQw4w9WgXcQ'
    const wrapper = mount(YouTubeModal, {
      props: {
        open: true,
        videoUrl,
      },
    })

    const iframe = wrapper.find('[data-testid="youtube-iframe"]')
    const src = iframe.attributes('src')
    expect(src).toContain('dQw4w9WgXcQ')
  })

  it('URLから動画IDが正しく抽出される（埋め込み形式）', () => {
    // 埋め込み形式のYouTube URL: https://www.youtube.com/embed/VIDEO_ID
    const videoUrl = 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    const wrapper = mount(YouTubeModal, {
      props: {
        open: true,
        videoUrl,
      },
    })

    const iframe = wrapper.find('[data-testid="youtube-iframe"]')
    const src = iframe.attributes('src')
    expect(src).toContain('dQw4w9WgXcQ')
  })

  it('閉じるボタンが表示される', () => {
    // 閉じるボタンが表示される
    const wrapper = mount(YouTubeModal, {
      props: {
        open: true,
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      },
    })

    // 閉じるボタンが存在することを確認
    const closeButton = wrapper.find('[data-testid="close-button"]')
    expect(closeButton.exists()).toBe(true)
  })

  it('閉じるボタンクリック時にcloseイベントが発火される', async () => {
    // 閉じるボタンをクリックすると、closeイベントが発火される
    const wrapper = mount(YouTubeModal, {
      props: {
        open: true,
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      },
    })

    const closeButton = wrapper.find('[data-testid="close-button"]')
    await closeButton.trigger('click')

    // closeイベントが発火されることを確認
    expect(wrapper.emitted('close')).toBeTruthy()
    expect(wrapper.emitted('close')?.length).toBe(1)
  })

  it('背景オーバーレイクリック時にcloseイベントが発火される', async () => {
    // 背景オーバーレイをクリックすると、closeイベントが発火される（モーダルを閉じる）
    const wrapper = mount(YouTubeModal, {
      props: {
        open: true,
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      },
    })

    const overlay = wrapper.find('[data-testid="modal-overlay"]')
    await overlay.trigger('click')

    // closeイベントが発火されることを確認
    expect(wrapper.emitted('close')).toBeTruthy()
    expect(wrapper.emitted('close')?.length).toBe(1)
  })

  it('Escapeキー押下時にcloseイベントが発火される', async () => {
    // Escapeキーを押すと、closeイベントが発火される（モーダルを閉じる）
    const wrapper = mount(YouTubeModal, {
      props: {
        open: true,
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      },
    })

    const modal = wrapper.find('[data-testid="youtube-modal"]')
    await modal.trigger('keydown.escape')

    // closeイベントが発火されることを確認
    expect(wrapper.emitted('close')).toBeTruthy()
    expect(wrapper.emitted('close')?.length).toBe(1)
  })

  it('iframeに適切な属性が設定される', () => {
    // iframeにYouTube埋め込みに必要な属性が設定される
    const wrapper = mount(YouTubeModal, {
      props: {
        open: true,
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      },
    })

    const iframe = wrapper.find('[data-testid="youtube-iframe"]')

    // allow属性が設定されていることを確認
    expect(iframe.attributes('allow')).toContain('accelerometer')
    expect(iframe.attributes('allow')).toContain('autoplay')
    expect(iframe.attributes('allow')).toContain('clipboard-write')
    expect(iframe.attributes('allow')).toContain('encrypted-media')
    expect(iframe.attributes('allow')).toContain('gyroscope')
    expect(iframe.attributes('allow')).toContain('picture-in-picture')

    // allowfullscreen属性が設定されていることを確認
    expect(iframe.attributes('allowfullscreen')).toBeDefined()
  })

  it('無効なURLの場合でもエラーが発生しない', () => {
    // 無効なURLが渡された場合でもエラーが発生せず、モーダルが表示される
    const invalidUrl = 'not-a-valid-url'
    const wrapper = mount(YouTubeModal, {
      props: {
        open: true,
        videoUrl: invalidUrl,
      },
    })

    // モーダルが表示されることを確認
    const modal = wrapper.find('[data-testid="youtube-modal"]')
    expect(modal.exists()).toBe(true)

    // 無効なURLの場合はiframeが描画されないことを確認
    const iframe = wrapper.find('[data-testid="youtube-iframe"]')
    expect(iframe.exists()).toBe(false)
  })
})
