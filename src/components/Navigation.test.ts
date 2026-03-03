import { mount } from '@vue/test-utils'
import fc from 'fast-check'
import { describe, expect, it } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'
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
// Property Tests
// ============================================================================

describe('Navigation - Property Tests', () => {
  /**
   * Property 35: ナビゲーションメニューの現在ページ表示
   * 任意のページに対して、ナビゲーションメニューは現在表示中のページを視覚的に示す必要があります
   *
   * Feature: prsk-music-management-web, Property 35: ナビゲーションメニューの現在ページ表示
   * Validates: Requirements 要件13.4
   */
  it('Property 35: 任意のページに対して現在表示中のページが視覚的に示される', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('/musics', '/artists'), // 有効なパス
        (currentPath) => {
          const router = createTestRouter()
          const wrapper = mount(Navigation, {
            props: {
              currentPath,
            },
            global: {
              plugins: [router],
            },
          })

          // ナビゲーションメニューが表示されることを確認
          const nav = wrapper.find('[data-testid="navigation"]')
          expect(nav.exists()).toBe(true)

          // 現在のページに対応するリンクを取得
          const currentLink =
            currentPath === '/musics'
              ? wrapper.find('[data-testid="nav-link-musics"]')
              : wrapper.find('[data-testid="nav-link-artists"]')

          expect(currentLink.exists()).toBe(true)

          // 現在のページがハイライト表示されることを確認
          // （実装時にはPrimaryカラーのborderやテキストカラーが適用される想定）
          expect(currentLink.classes()).toContain('border-primary')

          // aria-current="page" が設定されていることを確認
          expect(currentLink.attributes('aria-current')).toBe('page')
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 36: 全ページでのナビゲーションメニュー表示
   * 任意のページに対して、一貫したナビゲーションメニューが表示される必要があります
   *
   * Feature: prsk-music-management-web, Property 36: 全ページでのナビゲーションメニュー表示
   * Validates: Requirements 要件13.5
   */
  it('Property 36: 任意のページに対して一貫したナビゲーションメニューが表示される', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('/musics', '/artists'), // 有効なパス
        (currentPath) => {
          const router = createTestRouter()
          const wrapper = mount(Navigation, {
            props: {
              currentPath,
            },
            global: {
              plugins: [router],
            },
          })

          // ナビゲーションメニューが表示されることを確認
          const nav = wrapper.find('[data-testid="navigation"]')
          expect(nav.exists()).toBe(true)

          // 楽曲管理リンクが表示されることを確認
          const musicsLink = wrapper.find('[data-testid="nav-link-musics"]')
          expect(musicsLink.exists()).toBe(true)

          // アーティスト管理リンクが表示されることを確認
          const artistsLink = wrapper.find('[data-testid="nav-link-artists"]')
          expect(artistsLink.exists()).toBe(true)

          // 両方のリンクの存在は個別の assertion で検証済み
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 36 (補足): ナビゲーションメニューのリンクテキスト表示
   * 任意のページに対して、ナビゲーションメニューには適切なリンクテキストが表示される必要があります
   */
  it('Property 36 (補足): 任意のページに対してナビゲーションメニューに適切なリンクテキストが表示される', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('/musics', '/artists'), // 有効なパス
        (currentPath) => {
          const router = createTestRouter()
          const wrapper = mount(Navigation, {
            props: {
              currentPath,
            },
            global: {
              plugins: [router],
            },
          })

          // ナビゲーションメニューのテキストを確認
          const navText = wrapper.text()

          // 楽曲管理のリンクテキストが表示されることを確認
          expect(navText).toContain('楽曲管理')

          // アーティスト管理のリンクテキストが表示されることを確認
          expect(navText).toContain('アーティスト管理')
        }
      ),
      { numRuns: 100 }
    )
  })
})
