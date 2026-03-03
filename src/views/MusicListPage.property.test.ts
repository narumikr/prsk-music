import { mount } from '@vue/test-utils'
import fc from 'fast-check'
import { HttpResponse, http } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import type { Artist, PaginatedResponse, PrskMusic } from '@/types'
import MusicListPage from './MusicListPage.vue'

// ============================================================================
// MSW Server Setup
// ============================================================================

const server = setupServer()

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' })
})

afterEach(() => {
  server.resetHandlers()
})

afterAll(() => {
  server.close()
})

// ============================================================================
// Test Helpers
// ============================================================================

/**
 * テスト用のPrskMusicデータを生成
 */
function createMockMusic(id: number): PrskMusic {
  return {
    id,
    title: `楽曲${id}`,
    artistName: `アーティスト${id}`,
    unitName: `ユニット${id}`,
    content: `コンテンツ${id}`,
    musicType: 0,
    specially: false,
    lyricsName: `作詞者${id}`,
    musicName: `作曲者${id}`,
    featuring: null,
    youtubeLink: `https://www.youtube.com/watch?v=test${id}`,
    auditInfo: {
      createdAt: '2024-01-01T00:00:00Z',
      createdBy: 'test-user',
      updatedAt: '2024-01-01T00:00:00Z',
      updatedBy: 'test-user',
    },
  }
}

/**
 * テスト用のArtistデータを生成
 */
function createMockArtist(id: number, artistName?: string): Artist {
  return {
    id,
    artistName: artistName || `アーティスト${id}`,
    unitName: `ユニット${id}`,
    content: `コンテンツ${id}`,
    auditInfo: {
      createdAt: '2024-01-01T00:00:00Z',
      createdBy: 'test-user',
      updatedAt: '2024-01-01T00:00:00Z',
      updatedBy: 'test-user',
    },
  }
}

/**
 * PaginatedResponseを生成
 */
function createMockMusicResponse(
  musics: PrskMusic[],
  page = 1,
  totalItems = musics.length
): PaginatedResponse<PrskMusic> {
  return {
    items: musics,
    meta: {
      currentPage: page,
      totalPages: Math.ceil(totalItems / 20),
      totalItems,
      itemsPerPage: 20,
    },
  }
}

/**
 * PaginatedResponseを生成（Artist用）
 */
function createMockArtistResponse(
  artists: Artist[],
  page = 1,
  totalItems = artists.length
): PaginatedResponse<Artist> {
  return {
    items: artists,
    meta: {
      currentPage: page,
      totalPages: Math.ceil(totalItems / 20),
      totalItems,
      itemsPerPage: 20,
    },
  }
}

// ============================================================================
// Property-Based Tests
// ============================================================================

describe('MusicListPage - Property Tests', () => {
  /**
   * Property 37: 楽曲フォームからのアーティスト追加トリガー
   *
   * 任意の楽曲フォーム（作成または編集モード）において、
   * 「新規アーティスト追加」ボタンをクリックした際には、
   * アーティスト登録モーダルが開く必要があります。
   *
   * Feature: prsk-music-management-web, Property 37: 楽曲フォームからのアーティスト追加トリガー
   * Validates: Requirements 2.9
   */
  it('Property 37: 楽曲フォームからのアーティスト追加トリガー', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom('create', 'edit'),
        fc.array(fc.integer({ min: 1, max: 100 }), { minLength: 1, maxLength: 10 }),
        async (mode, artistIds) => {
          // Arrange - モックデータの準備
          const mockMusics = [createMockMusic(1)]
          const mockArtists = artistIds.map((id) => createMockArtist(id))
          const _editMusic = mode === 'edit' ? createMockMusic(1) : undefined

          server.use(
            http.get('/api/v1/prsk-music', () => {
              return HttpResponse.json(createMockMusicResponse(mockMusics))
            }),
            http.get('/api/v1/artists', () => {
              return HttpResponse.json(createMockArtistResponse(mockArtists))
            })
          )

          const wrapper = mount(MusicListPage)
          await wrapper.vm.$nextTick()
          await new Promise((resolve) => setTimeout(resolve, 100))

          // Act - 楽曲フォームを開く
          if (mode === 'create') {
            const createButton = wrapper.find('[data-testid="create-music-button"]')
            await createButton.trigger('click')
          } else {
            const editButton = wrapper.find('[data-testid="edit-button-1"]')
            await editButton.trigger('click')
          }
          await wrapper.vm.$nextTick()

          // 楽曲フォームが表示されることを確認
          const musicFormModal = wrapper.find('[data-testid="music-form-modal"]')
          expect(musicFormModal.exists()).toBe(true)

          // 「新規アーティスト追加」ボタンをクリック
          const createArtistButton = wrapper.find('[data-testid="create-artist-button"]')
          await createArtistButton.trigger('click')
          await wrapper.vm.$nextTick()

          // Assert - アーティスト登録モーダルが開くことを確認
          const artistFormModal = wrapper.find('[data-testid="artist-form-modal"]')
          expect(artistFormModal.exists()).toBe(true)

          wrapper.unmount()
        }
      ),
      { numRuns: 100 }
    )
  }, 30000)

  /**
   * Property 38: アーティスト追加後の自動選択
   *
   * 任意の新規追加されたアーティストに対して、
   * アーティスト登録完了後には、そのアーティストが楽曲フォームの
   * アーティスト選択ドロップダウンで自動的に選択される必要があります。
   *
   * Feature: prsk-music-management-web, Property 38: アーティスト追加後の自動選択
   * Validates: Requirements 2.10
   */
  it('Property 38: アーティスト追加後の自動選択', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(fc.integer({ min: 1, max: 100 }), { minLength: 1, maxLength: 5 }),
        fc.string({ minLength: 1, maxLength: 50 }).filter((s) => s.trim().length > 0),
        fc.option(fc.string({ minLength: 1, maxLength: 25 }), { nil: null }),
        fc.option(fc.string({ minLength: 1, maxLength: 20 }), { nil: null }),
        async (existingArtistIds, newArtistName, newUnitName, newContent) => {
          // Arrange - モックデータの準備
          const mockMusics = [createMockMusic(1)]
          const existingArtists = existingArtistIds.map((id) => createMockArtist(id))
          const newArtistId = Math.max(...existingArtistIds) + 1
          const newArtist = createMockArtist(newArtistId, newArtistName)
          newArtist.unitName = newUnitName
          newArtist.content = newContent

          let artistsAfterCreate = [...existingArtists]

          server.use(
            http.get('/api/v1/prsk-music', () => {
              return HttpResponse.json(createMockMusicResponse(mockMusics))
            }),
            http.get('/api/v1/artists', () => {
              return HttpResponse.json(createMockArtistResponse(artistsAfterCreate))
            }),
            http.post('/api/v1/artists', async () => {
              artistsAfterCreate = [...existingArtists, newArtist]
              return HttpResponse.json(newArtist, { status: 201 })
            })
          )

          const wrapper = mount(MusicListPage)
          await wrapper.vm.$nextTick()
          await new Promise((resolve) => setTimeout(resolve, 100))

          // 楽曲新規登録ボタンをクリック
          const createMusicButton = wrapper.find('[data-testid="create-music-button"]')
          await createMusicButton.trigger('click')
          await wrapper.vm.$nextTick()

          // アーティスト新規追加ボタンをクリック
          const createArtistButton = wrapper.find('[data-testid="create-artist-button"]')
          await createArtistButton.trigger('click')
          await wrapper.vm.$nextTick()

          // Act - アーティストフォームに値を入力して送信
          const artistNameInput = wrapper.find('[data-testid="artistName-input"]')
          await artistNameInput.setValue(newArtistName)

          if (newUnitName) {
            const unitNameInput = wrapper.find('[data-testid="unitName-input"]')
            await unitNameInput.setValue(newUnitName)
          }

          if (newContent) {
            const contentInput = wrapper.find('[data-testid="content-input"]')
            await contentInput.setValue(newContent)
          }

          // VeeValidateのバリデーションが完了するまで待機
          await wrapper.vm.$nextTick()
          await new Promise((resolve) => setTimeout(resolve, 50))

          // アーティストフォームを送信
          const artistForm = wrapper.find('[data-testid="artist-form"]')
          await artistForm.trigger('submit')
          await wrapper.vm.$nextTick()
          await new Promise((resolve) => setTimeout(resolve, 100))

          // Assert - 楽曲フォームのアーティスト選択で新規追加されたアーティストが自動選択されている
          const artistSelect = wrapper.find('[data-testid="artistId-select"]')
          expect(artistSelect.exists()).toBe(true)
          expect((artistSelect.element as HTMLSelectElement).value).toBe(newArtistId.toString())

          wrapper.unmount()
        }
      ),
      { numRuns: 100 }
    )
  }, 30000)
})
