import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { createMemoryHistory, createRouter, type Router } from 'vue-router'
import Layout from './Layout.vue'
import Navigation from './Navigation.vue'

function createTestRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', redirect: '/musics' },
      { path: '/musics', component: { template: '<div>Musics</div>' } },
      { path: '/artists', component: { template: '<div>Artists</div>' } },
    ],
  })
}

// ============================================================================
// Unit Tests
// ============================================================================

describe('Layout - Unit Tests', () => {
  let router: Router

  beforeEach(() => {
    router = createTestRouter()
  })

  /**
   * ヘッダー表示のテスト
   * Layout.vueにはヘッダーが表示される必要があります
   *
   * Validates: Requirements 要件13
   */
  it('ヘッダーが表示される', async () => {
    await router.push('/musics')
    await router.isReady()

    const wrapper = mount(Layout, {
      global: {
        plugins: [router],
        stubs: {
          Navigation: true,
          RouterView: true,
        },
      },
    })

    const header = wrapper.find('[data-testid="layout-header"]')
    expect(header.exists()).toBe(true)
  })

  /**
   * ナビゲーション表示のテスト
   * Layout.vueにはNavigationコンポーネントが表示される必要があります
   *
   * Validates: Requirements 要件13.5
   */
  it('ナビゲーションが表示される', async () => {
    await router.push('/musics')
    await router.isReady()

    const wrapper = mount(Layout, {
      global: {
        plugins: [router],
        components: {
          Navigation,
        },
        stubs: {
          RouterView: true,
        },
      },
    })

    const navigation = wrapper.findComponent(Navigation)
    expect(navigation.exists()).toBe(true)
  })

  /**
   * router-view表示のテスト
   * Layout.vueにはrouter-viewが配置される必要があります
   *
   * Validates: Requirements 要件13
   */
  it('router-viewが配置される', async () => {
    await router.push('/musics')
    await router.isReady()

    const wrapper = mount(Layout, {
      global: {
        plugins: [router],
        stubs: {
          Navigation: true,
          RouterView: true,
        },
      },
    })

    const routerView = wrapper.find('[data-testid="layout-content"]')
    expect(routerView.exists()).toBe(true)
  })

  /**
   * メインコンテンツエリアの表示テスト
   * Layout.vueにはメインコンテンツエリアが表示される必要があります
   *
   * Validates: Requirements 要件13
   */
  it('メインコンテンツエリアが表示される', async () => {
    await router.push('/musics')
    await router.isReady()

    const wrapper = mount(Layout, {
      global: {
        plugins: [router],
        stubs: {
          Navigation: true,
          RouterView: true,
        },
      },
    })

    const main = wrapper.find('main')
    expect(main.exists()).toBe(true)
  })

  /**
   * レイアウト構造のテスト
   * Layout.vueはヘッダー、ナビゲーション、メインコンテンツの順で配置される必要があります
   *
   * Validates: Requirements 要件13
   */
  it('レイアウト構造が正しい順序で配置される', async () => {
    await router.push('/musics')
    await router.isReady()

    const wrapper = mount(Layout, {
      global: {
        plugins: [router],
        stubs: {
          Navigation: true,
          RouterView: true,
        },
      },
    })

    // ヘッダーが存在することを確認
    const header = wrapper.find('[data-testid="layout-header"]')
    expect(header.exists()).toBe(true)

    // メインコンテンツが存在することを確認
    const main = wrapper.find('main')
    expect(main.exists()).toBe(true)

    // ヘッダーがメインコンテンツより前に配置されていることを確認
    const html = wrapper.html()
    const headerIndex = html.indexOf('data-testid="layout-header"')
    const mainIndex = html.indexOf('<main')
    expect(headerIndex).toBeLessThan(mainIndex)
  })

  /**
   * NavigationコンポーネントへのcurrentPath propsの渡しテスト
   * NavigationコンポーネントにcurrentPathが正しく渡される必要があります
   *
   * Validates: Requirements 要件13.4
   */
  it('NavigationコンポーネントにcurrentPathが渡される', async () => {
    await router.push('/musics')
    await router.isReady()

    const wrapper = mount(Layout, {
      global: {
        plugins: [router],
        components: {
          Navigation,
        },
        stubs: {
          RouterView: true,
        },
      },
    })

    const navigation = wrapper.findComponent(Navigation)
    expect(navigation.exists()).toBe(true)
    expect(navigation.props('currentPath')).toBe('/musics')
  })

  /**
   * レスポンシブレイアウトのテスト
   * Layout.vueはレスポンシブなレイアウトを提供する必要があります
   *
   * Validates: Requirements 要件7.1
   */
  it('レスポンシブなレイアウトが適用される', async () => {
    await router.push('/musics')
    await router.isReady()

    const wrapper = mount(Layout, {
      global: {
        plugins: [router],
        stubs: {
          Navigation: true,
          RouterView: true,
        },
      },
    })

    // コンテナに最大幅が設定されていることを確認
    const main = wrapper.find('main')
    expect(main.classes()).toContain('max-w-screen-lg')
  })
})
