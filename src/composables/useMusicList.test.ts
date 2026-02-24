import fc from 'fast-check'
import { HttpResponse, http } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import type { AuditInfo, MusicFormData, PaginationMeta, PrskMusic } from '@/types'
import { useMusicList } from './useMusicList'

// ============================================================================
// テスト用ヘルパー
// ============================================================================

const mockAuditInfo: AuditInfo = {
  createdAt: '2020-09-30T08:31:00Z',
  createdBy: 'test-user',
  updatedAt: '2020-09-30T08:31:00Z',
  updatedBy: 'test-user',
}

function buildMusicResponse(id: number, overrides: Partial<PrskMusic> = {}): PrskMusic {
  return {
    id,
    title: 'Test Music',
    artistName: 'Test Artist',
    unitName: null,
    content: null,
    musicType: 0,
    specially: null,
    lyricsName: null,
    musicName: null,
    featuring: null,
    youtubeLink: 'https://www.youtube.com/watch?v=test',
    auditInfo: mockAuditInfo,
    ...overrides,
  }
}

function buildPaginationMeta(pageIndex: number, totalItems: number, limit = 20): PaginationMeta {
  return {
    pageIndex,
    totalPages: Math.ceil(totalItems / limit),
    totalItems,
    limit,
  }
}

// ============================================================================
// MSW サーバー設定
// ============================================================================

const server = setupServer()

// happy-dom の window.location.origin からベースURLを動的に取得する
const getApiBase = () => `${window.location.origin}/api/v1`

beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

const mockMusicFormData: MusicFormData = {
  title: 'Test Music',
  artistId: 1,
  musicType: 0,
  specially: null,
  lyricsName: null,
  musicName: null,
  featuring: null,
  youtubeLink: 'https://www.youtube.com/watch?v=test',
}

// ============================================================================
// Unit Tests - CRUD Operations
// ============================================================================

describe('useMusicList - createMusic', () => {
  it('成功時にAPIを呼び出し、楽曲一覧を再取得する', async () => {
    const createdMusic = buildMusicResponse(999, { title: 'New Music' })

    server.use(
      http.post(`${getApiBase()}/prsk-music`, () => {
        return HttpResponse.json(createdMusic, { status: 201 })
      }),
      http.get(`${getApiBase()}/prsk-music`, () => {
        return HttpResponse.json({
          items: [createdMusic],
          meta: buildPaginationMeta(1, 1),
        })
      })
    )

    const { musics, loading, error, createMusic } = useMusicList()

    await createMusic(mockMusicFormData)

    expect(musics.value).toEqual([createdMusic])
    expect(loading.value).toBe(false)
    expect(error.value).toBeNull()
  })

  it('失敗時にerrorが設定され、loadingがリセットされる', async () => {
    server.use(
      http.post(`${getApiBase()}/prsk-music`, () => {
        return HttpResponse.json(
          { statusCode: 400, error: 'Bad Request', message: 'Invalid data' },
          { status: 400 }
        )
      })
    )

    const { loading, error, createMusic } = useMusicList()

    await expect(createMusic(mockMusicFormData)).rejects.toBeInstanceOf(Error)

    expect(loading.value).toBe(false)
    expect(error.value).toBeInstanceOf(Error)
  })
})

describe('useMusicList - updateMusic', () => {
  it('成功時にAPIを呼び出し、楽曲一覧を再取得する', async () => {
    const updatedMusic = buildMusicResponse(1, { title: 'Updated Music' })

    server.use(
      http.put(`${getApiBase()}/prsk-music/1`, () => {
        return HttpResponse.json(updatedMusic)
      }),
      http.get(`${getApiBase()}/prsk-music`, () => {
        return HttpResponse.json({
          items: [updatedMusic],
          meta: buildPaginationMeta(1, 1),
        })
      })
    )

    const { musics, loading, error, updateMusic } = useMusicList()

    await updateMusic(1, mockMusicFormData)

    expect(musics.value).toEqual([updatedMusic])
    expect(loading.value).toBe(false)
    expect(error.value).toBeNull()
  })

  it('失敗時にerrorが設定され、loadingがリセットされる', async () => {
    server.use(
      http.put(`${getApiBase()}/prsk-music/1`, () => {
        return HttpResponse.json(
          { statusCode: 404, error: 'Not Found', message: 'Music not found' },
          { status: 404 }
        )
      })
    )

    const { loading, error, updateMusic } = useMusicList()

    await expect(updateMusic(1, mockMusicFormData)).rejects.toBeInstanceOf(Error)

    expect(loading.value).toBe(false)
    expect(error.value).toBeInstanceOf(Error)
  })
})

describe('useMusicList - deleteMusic', () => {
  it('成功時にAPIを呼び出し、楽曲一覧を再取得する', async () => {
    server.use(
      http.delete(`${getApiBase()}/prsk-music/1`, () => {
        return new HttpResponse(null, { status: 204 })
      }),
      http.get(`${getApiBase()}/prsk-music`, () => {
        return HttpResponse.json({
          items: [],
          meta: buildPaginationMeta(1, 0),
        })
      })
    )

    const { musics, loading, error, deleteMusic } = useMusicList()

    await deleteMusic(1)

    expect(musics.value).toEqual([])
    expect(loading.value).toBe(false)
    expect(error.value).toBeNull()
  })

  it('失敗時にerrorが設定され、loadingがリセットされる', async () => {
    server.use(
      http.delete(`${getApiBase()}/prsk-music/1`, () => {
        return HttpResponse.json(
          { statusCode: 404, error: 'Not Found', message: 'Music not found' },
          { status: 404 }
        )
      })
    )

    const { loading, error, deleteMusic } = useMusicList()

    await expect(deleteMusic(1)).rejects.toBeInstanceOf(Error)

    expect(loading.value).toBe(false)
    expect(error.value).toBeInstanceOf(Error)
  })
})

// ============================================================================
// Property Tests
// ============================================================================

describe('useMusicList - Property Tests', () => {
  /**
   * Property 12: ページ番号クリック時のデータ取得
   * 任意のページ番号に対して、そのページ番号をクリックした際には
   * 対応するページの楽曲レコードが取得され表示される必要があります
   *
   * Feature: prsk-music-management-web, Property 12: ページ番号クリック時のデータ取得
   * Validates: Requirements 要件5.3
   */
  it('Property 12: 任意のページ番号に対して対応するページの楽曲レコードが取得される', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 1, max: 100 }), // ページ番号
        fc.integer({ min: 1, max: 50 }), // そのページのアイテム数
        fc.integer({ min: 0, max: 1000 }), // 総アイテム数
        async (page, itemCount, totalItems) => {
          // テストデータ生成
          const musics = Array.from({ length: itemCount }, (_, i) =>
            buildMusicResponse(page * 100 + i, {
              title: `Music ${page}-${i}`,
            })
          )

          const meta = buildPaginationMeta(page, totalItems)

          // MSWでAPIをモック
          server.use(
            http.get(`${getApiBase()}/prsk-music`, ({ request }) => {
              const url = new URL(request.url)
              const requestedPage = url.searchParams.get('page')

              // リクエストされたページ番号が正しいことを確認
              if (requestedPage === String(page)) {
                return HttpResponse.json({
                  items: musics,
                  meta,
                })
              }

              return HttpResponse.json({
                items: [],
                meta: buildPaginationMeta(Number(requestedPage) || 1, 0),
              })
            })
          )

          // useMusicListを使用
          const { musics: musicList, pagination, fetchMusics } = useMusicList()

          // ページ番号をクリック（fetchMusicsを呼び出し）
          await fetchMusics(page)

          // 対応するページの楽曲レコードが取得されていることを確認
          expect(musicList.value).toHaveLength(itemCount)
          expect(musicList.value).toEqual(musics)

          // ページネーション情報が正しく設定されていることを確認
          expect(pagination.value.pageIndex).toBe(page)
          expect(pagination.value.totalItems).toBe(totalItems)
        }
      ),
      { numRuns: 100 }
    )
  })
})
