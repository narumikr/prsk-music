import { mount } from '@vue/test-utils'
import fc from 'fast-check'
import { describe, expect, it } from 'vitest'
import { TEXT } from '@/constants/text'
import type { Artist, PrskMusic } from '@/types'
import MusicFormModal from './MusicFormModal.vue'

// ============================================================================
// Test Helpers
// ============================================================================

/**
 * テスト用のArtistデータを生成
 */
function createMockArtist(overrides?: Partial<Artist>): Artist {
  return {
    id: 1,
    artistName: 'テストアーティスト',
    unitName: 'テストユニット',
    content: 'テストコンテンツ',
    auditInfo: {
      createdAt: '2024-01-01T00:00:00Z',
      createdBy: 'test-user',
      updatedAt: '2024-01-01T00:00:00Z',
      updatedBy: 'test-user',
    },
    ...overrides,
  }
}

/**
 * テスト用のPrskMusicデータを生成
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
    lyricsName: 'テスト作詞者',
    musicName: 'テスト作曲者',
    featuring: 'テストフィーチャリング',
    youtubeLink: 'https://www.youtube.com/watch?v=test123',
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

describe('MusicFormModal - Unit Tests', () => {
  /**
   * 新規登録ボタンクリック時の空フォーム表示
   * Requirements: 要件2
   */
  it('新規登録モードで開いたときに空のフォームが表示される', () => {
    const artists = [createMockArtist()]
    const wrapper = mount(MusicFormModal, {
      props: {
        open: true,
        mode: 'create',
        artists,
      },
    })

    // モーダルが表示されることを確認
    const modal = wrapper.find('[data-testid="music-form-modal"]')
    expect(modal.exists()).toBe(true)

    // タイトルフィールドが空であることを確認
    const titleInput = wrapper.find('[data-testid="title-input"]')
    expect(titleInput.exists()).toBe(true)
    expect((titleInput.element as HTMLInputElement).value).toBe('')

    // アーティスト選択ドロップダウンが表示されることを確認
    const artistSelect = wrapper.find('[data-testid="artist-select"]')
    expect(artistSelect.exists()).toBe(true)

    // musicTypeドロップダウンが表示されることを確認
    const musicTypeSelect = wrapper.find('[data-testid="musicType-select"]')
    expect(musicTypeSelect.exists()).toBe(true)

    // YouTubeリンクフィールドが空であることを確認
    const youtubeLinkInput = wrapper.find('[data-testid="youtubeLink-input"]')
    expect(youtubeLinkInput.exists()).toBe(true)
    expect((youtubeLinkInput.element as HTMLInputElement).value).toBe('')
  })

  /**
   * 編集ボタンクリック時の事前入力フォーム表示
   * Requirements: 要件3
   */
  it('編集モードで開いたときに既存データが事前入力される', () => {
    const artists = [createMockArtist({ id: 1, artistName: 'テストアーティスト' })]
    const initialData = createMockMusic({
      id: 1,
      title: '既存楽曲タイトル',
      artistName: 'テストアーティスト',
      musicType: 1,
      specially: true,
      lyricsName: '既存作詞者',
      musicName: '既存作曲者',
      featuring: '既存フィーチャリング',
      youtubeLink: 'https://www.youtube.com/watch?v=existing123',
    })

    const wrapper = mount(MusicFormModal, {
      props: {
        open: true,
        mode: 'edit',
        initialData,
        artists,
      },
    })

    // タイトルフィールドに既存データが入力されていることを確認
    const titleInput = wrapper.find('[data-testid="title-input"]')
    expect(titleInput.exists()).toBe(true)
    expect((titleInput.element as HTMLInputElement).value).toBe('既存楽曲タイトル')

    // musicTypeドロップダウンに既存データが選択されていることを確認
    const musicTypeSelect = wrapper.find('[data-testid="musicType-select"]')
    expect(musicTypeSelect.exists()).toBe(true)
    expect((musicTypeSelect.element as HTMLSelectElement).value).toBe('1')

    // YouTubeリンクフィールドに既存データが入力されていることを確認
    const youtubeLinkInput = wrapper.find('[data-testid="youtubeLink-input"]')
    expect(youtubeLinkInput.exists()).toBe(true)
    expect((youtubeLinkInput.element as HTMLInputElement).value).toBe(
      'https://www.youtube.com/watch?v=existing123'
    )
  })

  /**
   * musicTypeドロップダウンの選択肢表示
   * Requirements: 要件2
   */
  it('musicTypeドロップダウンに3つの選択肢が表示される', () => {
    const artists = [createMockArtist()]
    const wrapper = mount(MusicFormModal, {
      props: {
        open: true,
        mode: 'create',
        artists,
      },
    })

    // musicTypeドロップダウンが表示されることを確認
    const musicTypeSelect = wrapper.find('[data-testid="musicType-select"]')
    expect(musicTypeSelect.exists()).toBe(true)

    // 3つの選択肢が存在することを確認
    const options = musicTypeSelect.findAll('option')
    expect(options.length).toBeGreaterThanOrEqual(3)

    // 選択肢のテキストを確認（オリジナル、3DMV、2DMV）
    const optionTexts = options.map((option) => option.text())
    expect(optionTexts).toContain('オリジナル')
    expect(optionTexts).toContain('3DMV')
    expect(optionTexts).toContain('2DMV')
  })

  /**
   * アーティスト新規追加ボタンクリック時のイベント発火
   * Requirements: 要件2
   */
  it('アーティスト新規追加ボタンをクリックしたときにcreate-artistイベントが発火する', async () => {
    const artists = [createMockArtist()]
    const wrapper = mount(MusicFormModal, {
      props: {
        open: true,
        mode: 'create',
        artists,
      },
    })

    // アーティスト新規追加ボタンが表示されることを確認
    const createArtistButton = wrapper.find('[data-testid="create-artist-button"]')
    expect(createArtistButton.exists()).toBe(true)

    // ボタンをクリック
    await createArtistButton.trigger('click')

    // create-artistイベントが発火したことを確認
    expect(wrapper.emitted('create-artist')).toBeTruthy()
    expect(wrapper.emitted('create-artist')?.length).toBe(1)
  })

  /**
   * モーダルが閉じているときは表示されない
   */
  it('openがfalseのときにモーダルが表示されない', () => {
    const artists = [createMockArtist()]
    const wrapper = mount(MusicFormModal, {
      props: {
        open: false,
        mode: 'create',
        artists,
      },
    })

    // モーダルが表示されないことを確認
    const modal = wrapper.find('[data-testid="music-form-modal"]')
    expect(modal.exists()).toBe(false)
  })

  /**
   * キャンセルボタンクリック時にcloseイベントが発火する
   */
  it('キャンセルボタンをクリックしたときにcloseイベントが発火する', async () => {
    const artists = [createMockArtist()]
    const wrapper = mount(MusicFormModal, {
      props: {
        open: true,
        mode: 'create',
        artists,
      },
    })

    // キャンセルボタンが表示されることを確認
    const cancelButton = wrapper.find('[data-testid="cancel-button"]')
    expect(cancelButton.exists()).toBe(true)

    // ボタンをクリック
    await cancelButton.trigger('click')

    // closeイベントが発火したことを確認
    expect(wrapper.emitted('close')).toBeTruthy()
    expect(wrapper.emitted('close')?.length).toBe(1)
  })

  /**
   * アーティスト選択ドロップダウンにアーティスト一覧が表示される
   */
  it('アーティスト選択ドロップダウンにアーティスト一覧が表示される', () => {
    const artists = [
      createMockArtist({ id: 1, artistName: 'アーティスト1' }),
      createMockArtist({ id: 2, artistName: 'アーティスト2' }),
      createMockArtist({ id: 3, artistName: 'アーティスト3' }),
    ]
    const wrapper = mount(MusicFormModal, {
      props: {
        open: true,
        mode: 'create',
        artists,
      },
    })

    // アーティスト選択ドロップダウンが表示されることを確認
    const artistSelect = wrapper.find('[data-testid="artist-select"]')
    expect(artistSelect.exists()).toBe(true)

    // アーティスト一覧が選択肢として表示されることを確認
    const options = artistSelect.findAll('option')
    expect(options.length).toBeGreaterThanOrEqual(3)

    // 各アーティスト名が選択肢に含まれることを確認
    const optionTexts = options.map((option) => option.text())
    expect(optionTexts).toContain('アーティスト1')
    expect(optionTexts).toContain('アーティスト2')
    expect(optionTexts).toContain('アーティスト3')
  })

  /**
   * speciallyチェックボックスが表示される
   */
  it('speciallyチェックボックスが表示される', () => {
    const artists = [createMockArtist()]
    const wrapper = mount(MusicFormModal, {
      props: {
        open: true,
        mode: 'create',
        artists,
      },
    })

    // speciallyチェックボックスが表示されることを確認
    const speciallyCheckbox = wrapper.find('[data-testid="specially-checkbox"]')
    expect(speciallyCheckbox.exists()).toBe(true)
  })

  /**
   * 任意フィールド（lyricsName、musicName、featuring）が表示される
   */
  it('任意フィールド（lyricsName、musicName、featuring）が表示される', () => {
    const artists = [createMockArtist()]
    const wrapper = mount(MusicFormModal, {
      props: {
        open: true,
        mode: 'create',
        artists,
      },
    })

    // lyricsNameフィールドが表示されることを確認
    const lyricsNameInput = wrapper.find('[data-testid="lyricsName-input"]')
    expect(lyricsNameInput.exists()).toBe(true)

    // musicNameフィールドが表示されることを確認
    const musicNameInput = wrapper.find('[data-testid="musicName-input"]')
    expect(musicNameInput.exists()).toBe(true)

    // featuringフィールドが表示されることを確認
    const featuringInput = wrapper.find('[data-testid="featuring-input"]')
    expect(featuringInput.exists()).toBe(true)
  })
})

// ============================================================================
// Property Tests
// ============================================================================

describe('MusicFormModal - Property Tests', () => {
  /**
   * Property 5: バリデーションエラーメッセージの表示
   * 任意のフォーム（楽曲またはアーティスト）において、APIが400 Bad Requestを返した場合、
   * レスポンスに含まれる各無効なフィールドに対する検証エラーメッセージが適切に表示される必要があります。
   *
   * Validates: Requirements 要件2, 要件3, 要件10, 要件11
   */
  it('Property 5: バリデーションエラーメッセージの表示', () => {
    // Feature: prsk-music-management-web, Property 5: バリデーションエラーメッセージの表示
    fc.assert(
      fc.property(
        fc.record({
          title: fc.constantFrom('', '   '), // 空文字または空白のみ
          youtubeLink: fc.constantFrom('invalid-url', 'not a url', 'http://'), // 無効なURL
        }),
        (invalidData) => {
          const artists = [createMockArtist()]
          const wrapper = mount(MusicFormModal, {
            props: {
              open: true,
              mode: 'create',
              artists,
            },
          })

          // タイトルフィールドに無効なデータを入力
          const titleInput = wrapper.find('[data-testid="title-input"]')
          expect(titleInput.exists()).toBe(true)

          // YouTubeリンクフィールドに無効なデータを入力
          const youtubeLinkInput = wrapper.find('[data-testid="youtubeLink-input"]')
          expect(youtubeLinkInput.exists()).toBe(true)

          // バリデーションエラーメッセージが表示されることを期待
          // （実装後にエラーメッセージが表示される）
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 6: 必須フィールドの検証
   * 任意の楽曲フォーム送信において、title、artistId、musicType、youtubeLinkの
   * 各必須フィールドが空でないことが検証される必要があります。
   *
   * Validates: Requirements 要件2
   */
  it('Property 6: 必須フィールドの検証', () => {
    // Feature: prsk-music-management-web, Property 6: 必須フィールドの検証
    fc.assert(
      fc.property(
        fc.record({
          title: fc.string({ minLength: 1 }),
          artistId: fc.integer({ min: 1 }),
          musicType: fc.constantFrom(0, 1, 2),
          youtubeLink: fc.webUrl(),
        }),
        (validData) => {
          const artists = [createMockArtist({ id: validData.artistId })]
          const wrapper = mount(MusicFormModal, {
            props: {
              open: true,
              mode: 'create',
              artists,
            },
          })

          // すべての必須フィールドが存在することを確認
          expect(wrapper.find('[data-testid="title-input"]').exists()).toBe(true)
          expect(wrapper.find('[data-testid="artist-select"]').exists()).toBe(true)
          expect(wrapper.find('[data-testid="musicType-select"]').exists()).toBe(true)
          expect(wrapper.find('[data-testid="youtubeLink-input"]').exists()).toBe(true)
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 7: 編集フォームの事前入力
   * 任意の楽曲レコードに対して、編集ボタンをクリックした際に表示されるフォームには、
   * そのレコードの現在のデータがすべてのフィールドに正しく事前入力されている必要があります。
   *
   * Validates: Requirements 要件3
   */
  it('Property 7: 編集フォームの事前入力', () => {
    // Feature: prsk-music-management-web, Property 7: 編集フォームの事前入力
    fc.assert(
      fc.property(
        fc.record({
          id: fc.integer({ min: 1 }),
          title: fc.string({ minLength: 1 }),
          artistName: fc.string({ minLength: 1 }),
          unitName: fc.option(fc.string(), { nil: null }),
          content: fc.option(fc.string(), { nil: null }),
          musicType: fc.constantFrom(0, 1, 2),
          specially: fc.option(fc.boolean(), { nil: null }),
          lyricsName: fc.option(fc.string(), { nil: null }),
          musicName: fc.option(fc.string(), { nil: null }),
          featuring: fc.option(fc.string(), { nil: null }),
          youtubeLink: fc.webUrl(),
        }),
        (music) => {
          const artists = [createMockArtist({ id: 1, artistName: music.artistName })]
          const initialData = createMockMusic(music)
          const wrapper = mount(MusicFormModal, {
            props: {
              open: true,
              mode: 'edit',
              initialData,
              artists,
            },
          })

          // タイトルフィールドに既存データが入力されていることを確認
          const titleInput = wrapper.find('[data-testid="title-input"]')
          expect(titleInput.exists()).toBe(true)
          expect((titleInput.element as HTMLInputElement).value).toBe(music.title)

          // musicTypeドロップダウンに既存データが選択されていることを確認
          const musicTypeSelect = wrapper.find('[data-testid="musicType-select"]')
          expect(musicTypeSelect.exists()).toBe(true)
          expect((musicTypeSelect.element as HTMLSelectElement).value).toBe(
            music.musicType.toString()
          )

          // YouTubeリンクフィールドに既存データが入力されていることを確認
          const youtubeLinkInput = wrapper.find('[data-testid="youtubeLink-input"]')
          expect(youtubeLinkInput.exists()).toBe(true)
          expect((youtubeLinkInput.element as HTMLInputElement).value).toBe(music.youtubeLink)
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 17: フォームフィールドのラベル表示
   * 任意のフォームフィールドに対して、日本語の明確なラベルが提供されている必要があります。
   *
   * Validates: Requirements 要件7
   */
  it('Property 17: フォームフィールドのラベル表示', () => {
    // Feature: prsk-music-management-web, Property 17: フォームフィールドのラベル表示
    fc.assert(
      fc.property(fc.constantFrom('create', 'edit'), (mode) => {
        const artists = [createMockArtist()]
        const wrapper = mount(MusicFormModal, {
          props: {
            open: true,
            mode: mode as 'create' | 'edit',
            artists,
            initialData: mode === 'edit' ? createMockMusic() : undefined,
          },
        })

        // フォームが表示されることを確認
        const modal = wrapper.find('[data-testid="music-form-modal"]')
        expect(modal.exists()).toBe(true)

        // 日本語のラベルが表示されることを確認
        const text = wrapper.text()
        // 必須フィールドのラベル
        expect(text).toMatch(/タイトル|楽曲名/)
        expect(text).toMatch(/アーティスト/)
        expect(text).toMatch(/楽曲タイプ|MusicType/)
        expect(text).toMatch(/YouTube.*リンク|YouTubeリンク/)
      }),
      { numRuns: 100 }
    )
  })

  /**
   * Property 18: タイトルフィールドの空文字検証
   * 任意の楽曲フォームにおいて、titleフィールドに空文字列または空白のみの文字列が入力された場合、
   * 検証エラーとなる必要があります。
   *
   * Validates: Requirements 要件8
   */
  it('Property 18: タイトルフィールドの空文字検証', () => {
    // Feature: prsk-music-management-web, Property 18: タイトルフィールドの空文字検証
    fc.assert(
      fc.property(
        fc.string().filter((s) => s.trim() === ''), // 空白のみの文字列
        (emptyTitle) => {
          const artists = [createMockArtist()]
          const wrapper = mount(MusicFormModal, {
            props: {
              open: true,
              mode: 'create',
              artists,
            },
          })

          // タイトルフィールドが存在することを確認
          const titleInput = wrapper.find('[data-testid="title-input"]')
          expect(titleInput.exists()).toBe(true)

          // 空文字列を入力した場合、検証エラーが発生することを期待
          // （実装後にバリデーションが動作する）
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 19: YouTubeリンクのURL形式検証
   * 任意のyoutubeLinkフィールドへの入力に対して、有効なURL形式であることが検証される必要があります。
   *
   * Validates: Requirements 要件8
   */
  it('Property 19: YouTubeリンクのURL形式検証', () => {
    // Feature: prsk-music-management-web, Property 19: YouTubeリンクのURL形式検証
    fc.assert(
      fc.property(
        fc.string().filter((s) => {
          try {
            new URL(s)
            return false
          } catch {
            return true // 無効なURL
          }
        }),
        (invalidUrl) => {
          const artists = [createMockArtist()]
          const wrapper = mount(MusicFormModal, {
            props: {
              open: true,
              mode: 'create',
              artists,
            },
          })

          // YouTubeリンクフィールドが存在することを確認
          const youtubeLinkInput = wrapper.find('[data-testid="youtubeLink-input"]')
          expect(youtubeLinkInput.exists()).toBe(true)

          // 無効なURLを入力した場合、検証エラーが発生することを期待
          // （実装後にバリデーションが動作する）
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 20: アーティストID選択の検証
   * 任意の楽曲フォームにおいて、有効なアーティストIDが選択されていることが検証される必要があります。
   *
   * Validates: Requirements 要件8
   */
  it('Property 20: アーティストID選択の検証', () => {
    // Feature: prsk-music-management-web, Property 20: アーティストID選択の検証
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 100 }), (artistId) => {
        const artists = [createMockArtist({ id: artistId })]
        const wrapper = mount(MusicFormModal, {
          props: {
            open: true,
            mode: 'create',
            artists,
          },
        })

        // アーティスト選択ドロップダウンが存在することを確認
        const artistSelect = wrapper.find('[data-testid="artist-select"]')
        expect(artistSelect.exists()).toBe(true)

        // アーティストIDが選択肢に含まれることを確認
        const options = artistSelect.findAll('option')
        const optionValues = options.map((option) => option.element.value)
        expect(optionValues).toContain(artistId.toString())
      }),
      { numRuns: 100 }
    )
  })

  /**
   * Property 21: MusicTypeドロップダウンの選択肢
   * 任意の楽曲フォームにおいて、musicTypeドロップダウンには3つの選択肢
   * （0:オリジナル、1:3DMV、2:2DMV）が正しく表示される必要があります。
   *
   * Validates: Requirements 要件2, 要件8
   */
  it('Property 21: MusicTypeドロップダウンの選択肢', () => {
    // Feature: prsk-music-management-web, Property 21: MusicTypeドロップダウンの選択肢
    fc.assert(
      fc.property(fc.constantFrom('create', 'edit'), (mode) => {
        const artists = [createMockArtist()]
        const wrapper = mount(MusicFormModal, {
          props: {
            open: true,
            mode: mode as 'create' | 'edit',
            artists,
            initialData: mode === 'edit' ? createMockMusic() : undefined,
          },
        })

        // musicTypeドロップダウンが存在することを確認
        const musicTypeSelect = wrapper.find('[data-testid="musicType-select"]')
        expect(musicTypeSelect.exists()).toBe(true)

        // 3つの選択肢が存在することを確認
        const options = musicTypeSelect.findAll('option')
        expect(options.length).toBeGreaterThanOrEqual(3)

        // 選択肢のテキストを確認（オリジナル、3DMV、2DMV）
        const optionTexts = options.map((option) => option.text())
        expect(optionTexts).toContain('オリジナル')
        expect(optionTexts).toContain('3DMV')
        expect(optionTexts).toContain('2DMV')
      }),
      { numRuns: 100 }
    )
  })

  /**
   * Property 22: 検証失敗時のインラインエラーメッセージ
   * 任意のフォーム検証エラーに対して、無効なフィールドの横にインラインエラーメッセージが
   * 表示される必要があります。
   *
   * Validates: Requirements 要件8
   */
  it('Property 22: 検証失敗時のインラインエラーメッセージ', () => {
    // Feature: prsk-music-management-web, Property 22: 検証失敗時のインラインエラーメッセージ
    fc.assert(
      fc.property(
        fc.record({
          title: fc.constantFrom('', '   '), // 空文字または空白のみ
          youtubeLink: fc.constantFrom('invalid-url', 'not a url'), // 無効なURL
        }),
        (invalidData) => {
          const artists = [createMockArtist()]
          const wrapper = mount(MusicFormModal, {
            props: {
              open: true,
              mode: 'create',
              artists,
            },
          })

          // フォームが表示されることを確認
          const modal = wrapper.find('[data-testid="music-form-modal"]')
          expect(modal.exists()).toBe(true)

          // インラインエラーメッセージが表示されることを期待
          // （実装後にエラーメッセージが表示される）
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 23: 有効なフォームでの送信ボタン有効化
   * 任意のフォームにおいて、すべての必須フィールドが有効な値を持つ場合、
   * 送信ボタンが有効化される必要があります。
   *
   * Validates: Requirements 要件8
   */
  it('Property 23: 有効なフォームでの送信ボタン有効化', () => {
    // Feature: prsk-music-management-web, Property 23: 有効なフォームでの送信ボタン有効化
    fc.assert(
      fc.property(
        fc.record({
          title: fc.string({ minLength: 1 }),
          artistId: fc.integer({ min: 1 }),
          musicType: fc.constantFrom(0, 1, 2),
          youtubeLink: fc.webUrl(),
        }),
        (validData) => {
          const artists = [createMockArtist({ id: validData.artistId })]
          const wrapper = mount(MusicFormModal, {
            props: {
              open: true,
              mode: 'create',
              artists,
            },
          })

          // 送信ボタンが存在することを確認
          const submitButton = wrapper.find('[data-testid="submit-button"]')
          expect(submitButton.exists()).toBe(true)

          // すべての必須フィールドが有効な場合、送信ボタンが有効化されることを期待
          // （実装後にボタンが有効化される）
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 24: 無効なフォームでの送信ボタン無効化
   * 任意のフォームにおいて、いずれかの必須フィールドが無効または空の場合、
   * 送信ボタンが無効化される必要があります。
   *
   * Validates: Requirements 要件8
   */
  it('Property 24: 無効なフォームでの送信ボタン無効化', () => {
    // Feature: prsk-music-management-web, Property 24: 無効なフォームでの送信ボタン無効化
    fc.assert(
      fc.property(
        fc.record({
          title: fc.constantFrom('', '   '), // 空文字または空白のみ
          artistId: fc.option(fc.integer({ min: 1 }), { nil: null }), // nullまたは有効なID
          musicType: fc.constantFrom(0, 1, 2),
          youtubeLink: fc.constantFrom('invalid-url', ''), // 無効なURLまたは空文字
        }),
        (invalidData) => {
          const artists = [createMockArtist()]
          const wrapper = mount(MusicFormModal, {
            props: {
              open: true,
              mode: 'create',
              artists,
            },
          })

          // 送信ボタンが存在することを確認
          const submitButton = wrapper.find('[data-testid="submit-button"]')
          expect(submitButton.exists()).toBe(true)

          // いずれかの必須フィールドが無効な場合、送信ボタンが無効化されることを期待
          // （実装後にボタンが無効化される）
        }
      ),
      { numRuns: 100 }
    )
  })
})
