import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { createMemoryHistory, createRouter, type Router } from 'vue-router'
import { TEXT } from '@/constants/text'
import Layout from './Layout.vue'
import Navigation from './Navigation.vue'

const mockSignOut = vi.fn()
const mockIsAuthenticated = ref(false)

vi.mock('@/composables/useAuth', () => ({
  useAuth: () => ({
    isAuthenticated: mockIsAuthenticated,
    signOut: mockSignOut,
  }),
}))

function createTestRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', redirect: '/musics' },
      { path: '/musics', component: { template: '<div>Musics</div>' } },
      { path: '/artists', component: { template: '<div>Artists</div>' } },
      { path: '/signin', component: { template: '<div>SignIn</div>' } },
    ],
  })
}

// ============================================================================
// Unit Tests
// ============================================================================

describe('Layout - Unit Tests', () => {
  let router: Router

  beforeEach(() => {
    vi.clearAllMocks()
    mockIsAuthenticated.value = false
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
    expect(main.classes()).toContain('max-w-5xl')
  })

  /**
   * 認証済み時のサインアウトボタン表示テスト
   *
   * Validates: Requirements 4.1
   */
  it('認証済み時にサインアウトボタンが表示される', async () => {
    mockIsAuthenticated.value = true
    await router.push('/musics')
    await router.isReady()

    const wrapper = mount(Layout, {
      global: {
        plugins: [router],
        stubs: { Navigation: true, RouterView: true },
      },
    })

    const button = wrapper.find('[data-testid="sign-out-button"]')
    expect(button.exists()).toBe(true)
    expect(button.text()).toBe(TEXT.auth.signOutButton)
  })

  /**
   * 未認証時のサインアウトボタン非表示テスト
   *
   * Validates: Requirements 4.1
   */
  it('未認証時にサインアウトボタンが表示されない', async () => {
    mockIsAuthenticated.value = false
    await router.push('/musics')
    await router.isReady()

    const wrapper = mount(Layout, {
      global: {
        plugins: [router],
        stubs: { Navigation: true, RouterView: true },
      },
    })

    const button = wrapper.find('[data-testid="sign-out-button"]')
    expect(button.exists()).toBe(false)
  })

  /**
   * サインアウトボタンクリック時の動作テスト
   *
   * Validates: Requirements 4.1
   */
  it('サインアウトボタンクリック時にsignOutが呼ばれサインインページへ遷移する', async () => {
    mockIsAuthenticated.value = true
    await router.push('/musics')
    await router.isReady()

    const wrapper = mount(Layout, {
      global: {
        plugins: [router],
        stubs: { Navigation: true, RouterView: true },
      },
    })

    const button = wrapper.find('[data-testid="sign-out-button"]')
    await button.trigger('click')
    await flushPromises()

    expect(mockSignOut).toHaveBeenCalledOnce()
    expect(router.currentRoute.value.path).toBe('/signin')
  })
})
