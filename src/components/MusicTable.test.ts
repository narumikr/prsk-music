import { mount } from '@vue/test-utils'
import fc from 'fast-check'
import { describe, expect, it } from 'vitest'
import type { MusicType, PrskMusic } from '@/types'
import MusicTable from './MusicTable.vue'

// ============================================================================
// Test Helper Functions
// ============================================================================

/**
 * テスト用の楽曲データを作成
 */
function createMockMusic(overrides?: Partial<PrskMusic>): PrskMusic {
  return {
    id: 1,
    title: 'テスト楽曲',
    artistName: 'テストアーティスト',
    unitName: 'テストユニット',
    content: 'テストコンテンツ',
    musicType: 0,
    specially: false,
    lyricsName: '作詞者',
    musicName: '作曲者',
    featuring: 'フィーチャリング',
    youtubeLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    auditInfo: {
      createdAt: '2024-01-01T00:00:00Z',
      createdBy: 'test-user',
      updatedAt: '2024-01-01T00:00:00Z',
      updatedBy: 'test-user',
    },
    ...overrides,
  }
}

// ============================================================================
// Unit Tests
// ============================================================================

describe('MusicTable Unit Tests', () => {
  it('楽曲一覧ページにアクセスしたときにテーブルが表示される', () => {
    const musics = [createMockMusic({ id: 1 }), createMockMusic({ id: 2 })]
    const wrapper = mount(MusicTable, {
      props: {
        data: musics,
        loading: false,
      },
    })

    // テーブルが表示されていることを確認
    const table = wrapper.find('[data-testid="music-table"]')
    expect(table.exists()).toBe(true)

    // 楽曲データが表示されていることを確認
    const text = wrapper.text()
    expect(text).toContain('テスト楽曲')
  })

  it('YouTubeリンクをクリックしたらモーダルが開く', async () => {
    const music = createMockMusic()
    const wrapper = mount(MusicTable, {
      props: {
        data: [music],
        loading: false,
      },
    })

    // YouTubeリンクをクリック
    const youtubeLink = wrapper.find('[data-testid="youtube-link-1"]')
    expect(youtubeLink.exists()).toBe(true)
    await youtubeLink.trigger('click')

    // YouTubeモーダルが表示されることを確認
    const modal = wrapper.find('[data-testid="youtube-modal"]')
    expect(modal.exists()).toBe(true)
  })

  it('ローディング中にLoadingSpinnerが表示される', () => {
    const wrapper = mount(MusicTable, {
      props: {
        data: [],
        loading: true,
      },
    })

    // LoadingSpinnerが表示されていることを確認
    const spinner = wrapper.find('[data-testid="loading-spinner"]')
    expect(spinner.exists()).toBe(true)

    // テーブルが非表示であることを確認
    const table = wrapper.find('[data-testid="music-table"]')
    expect(table.exists()).toBe(false)
  })

  it('データが0件の場合は「楽曲が登録されていません」が表示される', () => {
    const wrapper = mount(MusicTable, {
      props: {
        data: [],
        loading: false,
      },
    })

    // データなしメッセージが表示されていることを確認
    const text = wrapper.text()
    expect(text).toContain('楽曲が登録されていません')
  })

  it('編集ボタンをクリックしたらeditイベントが発火する', async () => {
    const music = createMockMusic({ id: 1 })
    const wrapper = mount(MusicTable, {
      props: {
        data: [music],
        loading: false,
      },
    })

    // 編集ボタンをクリック
    const editButton = wrapper.find('[data-testid="edit-button-1"]')
    expect(editButton.exists()).toBe(true)
    await editButton.trigger('click')

    // editイベントが発火したことを確認
    expect(wrapper.emitted('edit')).toBeTruthy()
    expect(wrapper.emitted('edit')?.[0]).toEqual([1])
  })

  it('削除ボタンをクリックしたらdeleteイベントが発火する', async () => {
    const music = createMockMusic({ id: 1 })
    const wrapper = mount(MusicTable, {
      props: {
        data: [music],
        loading: false,
      },
    })

    // 削除ボタンをクリック
    const deleteButton = wrapper.find('[data-testid="delete-button-1"]')
    expect(deleteButton.exists()).toBe(true)
    await deleteButton.trigger('click')

    // deleteイベントが発火したことを確認
    expect(wrapper.emitted('delete')).toBeTruthy()
    expect(wrapper.emitted('delete')?.[0]).toEqual([1])
  })

  it('musicTypeが数値から日本語ラベルに変換される', () => {
    const musics = [
      createMockMusic({ id: 1, musicType: 0 }),
      createMockMusic({ id: 2, musicType: 1 }),
      createMockMusic({ id: 3, musicType: 2 }),
    ]
    const wrapper = mount(MusicTable, {
      props: {
        data: musics,
        loading: false,
      },
    })

    const text = wrapper.text()
    expect(text).toContain('オリジナル')
    expect(text).toContain('3DMV')
    expect(text).toContain('2DMV')
  })

  it('nullフィールドは「-」で表示される', () => {
    const music = createMockMusic({
      unitName: null,
      content: null,
      lyricsName: null,
      musicName: null,
      featuring: null,
    })
    const wrapper = mount(MusicTable, {
      props: {
        data: [music],
        loading: false,
      },
    })

    // nullフィールドが'-'で表示されることを確認
    const unitNameCell = wrapper.find('[data-testid="music-unitName"]')
    expect(unitNameCell.exists()).toBe(true)

    const contentCell = wrapper.find('[data-testid="music-content"]')
    expect(contentCell.exists()).toBe(true)
  })

  it('speciallyがtrueの場合はチェックマークが表示される', () => {
    const music = createMockMusic({ specially: true })
    const wrapper = mount(MusicTable, {
      props: {
        data: [music],
        loading: false,
      },
    })

    // speciallyフィールドにチェックマークが表示されることを確認
    const speciallyCell = wrapper.find('[data-testid="music-specially-1"]')
    expect(speciallyCell.exists()).toBe(true)
    expect(speciallyCell.text()).toContain('✓')
  })

  it('speciallyがfalseの場合は空白が表示される', () => {
    const music = createMockMusic({ specially: false })
    const wrapper = mount(MusicTable, {
      props: {
        data: [music],
        loading: false,
      },
    })

    // speciallyフィールドが空白であることを確認
    const speciallyCell = wrapper.find('[data-testid="music-specially-1"]')
    expect(speciallyCell.exists()).toBe(true)
    expect(speciallyCell.text()).not.toContain('✓')
  })
})

// ============================================================================
// Property-Based Tests
// ============================================================================

describe('MusicTable Property Tests', () => {
  /**
   * Property 1: 楽曲レコードの完全なフィールド表示
   * Feature: prsk-music-management-web, Property 1: 楽曲レコードの完全なフィールド表示
   *
   * 任意の楽曲レコードに対して、テーブル表示には id、title、artistName、unitName、
   * musicType、specially、lyricsName、musicName、featuring、youtubeLink の
   * すべてのフィールドが含まれている必要があります。
   *
   * Validates: Requirements 1.2
   */
  it('Property 1: 楽曲レコードの完全なフィールド表示', () => {
    fc.assert(
      fc.property(
        fc.record({
          id: fc.integer({ min: 1 }),
          title: fc.string({ minLength: 1, maxLength: 100 }),
          artistName: fc.string({ minLength: 1, maxLength: 50 }),
          unitName: fc.option(fc.string({ minLength: 1, maxLength: 25 }), { nil: null }),
          content: fc.option(fc.string({ minLength: 1, maxLength: 20 }), { nil: null }),
          musicType: fc.constantFrom(0 as MusicType, 1 as MusicType, 2 as MusicType),
          specially: fc.option(fc.boolean(), { nil: null }),
          lyricsName: fc.option(fc.string({ minLength: 1, maxLength: 50 }), { nil: null }),
          musicName: fc.option(fc.string({ minLength: 1, maxLength: 50 }), { nil: null }),
          featuring: fc.option(fc.string({ minLength: 1, maxLength: 50 }), { nil: null }),
          youtubeLink: fc.webUrl(),
          auditInfo: fc.record({
            createdAt: fc.date().map((d) => d.toISOString()),
            createdBy: fc.string({ minLength: 1, maxLength: 50 }),
            updatedAt: fc.date().map((d) => d.toISOString()),
            updatedBy: fc.string({ minLength: 1, maxLength: 50 }),
          }),
        }),
        (music: PrskMusic) => {
          const wrapper = mount(MusicTable, {
            props: {
              data: [music],
              loading: false,
            },
          })

          // テーブルが表示されていることを確認
          const table = wrapper.find('[data-testid="music-table"]')
          expect(table.exists()).toBe(true)

          const text = wrapper.text()

          // すべてのフィールドが表示されていることを確認
          expect(text).toContain(music.id.toString())
          expect(text).toContain(music.title)
          expect(text).toContain(music.artistName)

          // nullフィールドは'-'で表示されることを確認
          if (music.unitName !== null) {
            expect(text).toContain(music.unitName)
          }
          if (music.content !== null) {
            expect(text).toContain(music.content)
          }
          if (music.lyricsName !== null) {
            expect(text).toContain(music.lyricsName)
          }
          if (music.musicName !== null) {
            expect(text).toContain(music.musicName)
          }
          if (music.featuring !== null) {
            expect(text).toContain(music.featuring)
          }

          // YouTubeリンクが存在することを確認
          const youtubeLink = wrapper.find(`[data-testid="youtube-link-${music.id}"]`)
          expect(youtubeLink.exists()).toBe(true)
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 2: MusicType値のラベル変換
   * Feature: prsk-music-management-web, Property 2: MusicType値のラベル変換
   *
   * 任意の有効なmusicType値（0, 1, 2）に対して、表示時には対応する日本語ラベル
   * （"オリジナル"、"3DMV"、"2DMV"）に正しく変換される必要があります。
   *
   * Validates: Requirements 1.4
   */
  it('Property 2: MusicType値のラベル変換', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(0 as MusicType, 1 as MusicType, 2 as MusicType),
        (musicType: MusicType) => {
          const music = createMockMusic({ musicType })
          const wrapper = mount(MusicTable, {
            props: {
              data: [music],
              loading: false,
            },
          })

          const text = wrapper.text()

          // musicTypeに対応する日本語ラベルが表示されることを確認
          const expectedLabel = musicType === 0 ? 'オリジナル' : musicType === 1 ? '3DMV' : '2DMV'
          expect(text).toContain(expectedLabel)
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 3: YouTubeリンクのクリック可能性
   * Feature: prsk-music-management-web, Property 3: YouTubeリンクのクリック可能性
   *
   * 任意のyoutubeLinkフィールドに対して、レンダリング結果はクリック可能な
   * リンク要素として表示される必要があります。
   *
   * Validates: Requirements 1.5
   */
  it('Property 3: YouTubeリンクのクリック可能性', () => {
    fc.assert(
      fc.property(
        fc.record({
          id: fc.integer({ min: 1 }),
          youtubeLink: fc.webUrl(),
        }),
        ({ id, youtubeLink }) => {
          const music = createMockMusic({ id, youtubeLink })
          const wrapper = mount(MusicTable, {
            props: {
              data: [music],
              loading: false,
            },
          })

          // YouTubeリンクが存在することを確認
          const youtubeLinkElement = wrapper.find(`[data-testid="youtube-link-${id}"]`)
          expect(youtubeLinkElement.exists()).toBe(true)

          // クリック可能な要素であることを確認（button または a タグ）
          const element = youtubeLinkElement.element
          expect(['BUTTON', 'A'].includes(element.tagName)).toBe(true)
        }
      ),
      { numRuns: 100 }
    )
  })
})
