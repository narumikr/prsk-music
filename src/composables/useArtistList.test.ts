import fc from 'fast-check'
import { HttpResponse, http } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import type { Artist, ArtistFormData, AuditInfo, PaginationMeta } from '@/types'
import { useArtistList } from './useArtistList'

// ============================================================================
// テスト用ヘルパー
// ============================================================================

const mockAuditInfo: AuditInfo = {
  createdAt: '2020-09-30T08:31:00Z',
  createdBy: 'test-user',
  updatedAt: '2020-09-30T08:31:00Z',
  updatedBy: 'test-user',
}

function buildArtistResponse(id: number, overrides: Partial<Artist> = {}): Artist {
  return {
    id,
    artistName: 'Test Artist',
    unitName: null,
    content: null,
    auditInfo: mockAuditInfo,
    ...overrides,
  }
}

function buildPaginationMeta(
  currentPage: number,
  totalItems: number,
  itemsPerPage = 20
): PaginationMeta {
  return {
    currentPage,
    totalPages: Math.ceil(totalItems / itemsPerPage),
    totalItems,
    itemsPerPage,
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

const mockArtistFormData: ArtistFormData = {
  artistName: 'Test Artist',
  unitName: null,
  content: null,
}

// ============================================================================
// Unit Tests - CRUD Operations
// ============================================================================

describe('useArtistList - createArtist', () => {
  it('成功時にAPIを呼び出し、アーティスト一覧を再取得する', async () => {
    const createdArtist = buildArtistResponse(999, { artistName: 'New Artist' })

    server.use(
      http.post(`${getApiBase()}/artists`, () => {
        return HttpResponse.json(createdArtist, { status: 201 })
      }),
      http.get(`${getApiBase()}/artists`, () => {
        return HttpResponse.json({
          items: [createdArtist],
          meta: buildPaginationMeta(1, 1),
        })
      })
    )

    const { artists, loading, error, createArtist } = useArtistList()

    await createArtist(mockArtistFormData)

    expect(artists.value).toEqual([createdArtist])
    expect(loading.value).toBe(false)
    expect(error.value).toBeNull()
  })

  it('失敗時にerrorが設定され、loadingがリセットされる', async () => {
    server.use(
      http.post(`${getApiBase()}/artists`, () => {
        return HttpResponse.json(
          { statusCode: 400, error: 'Bad Request', message: 'Invalid data' },
          { status: 400 }
        )
      })
    )

    const { loading, error, createArtist } = useArtistList()

    await expect(createArtist(mockArtistFormData)).rejects.toBeInstanceOf(Error)

    expect(loading.value).toBe(false)
    expect(error.value).toBeInstanceOf(Error)
  })
})

describe('useArtistList - updateArtist', () => {
  it('成功時にAPIを呼び出し、アーティスト一覧を再取得する', async () => {
    const updatedArtist = buildArtistResponse(1, { artistName: 'Updated Artist' })

    server.use(
      http.put(`${getApiBase()}/artists/1`, () => {
        return HttpResponse.json(updatedArtist)
      }),
      http.get(`${getApiBase()}/artists`, () => {
        return HttpResponse.json({
          items: [updatedArtist],
          meta: buildPaginationMeta(1, 1),
        })
      })
    )

    const { artists, loading, error, updateArtist } = useArtistList()

    await updateArtist(1, mockArtistFormData)

    expect(artists.value).toEqual([updatedArtist])
    expect(loading.value).toBe(false)
    expect(error.value).toBeNull()
  })

  it('失敗時にerrorが設定され、loadingがリセットされる', async () => {
    server.use(
      http.put(`${getApiBase()}/artists/1`, () => {
        return HttpResponse.json(
          { statusCode: 404, error: 'Not Found', message: 'Artist not found' },
          { status: 404 }
        )
      })
    )

    const { loading, error, updateArtist } = useArtistList()

    await expect(updateArtist(1, mockArtistFormData)).rejects.toBeInstanceOf(Error)

    expect(loading.value).toBe(false)
    expect(error.value).toBeInstanceOf(Error)
  })
})

describe('useArtistList - deleteArtist', () => {
  it('成功時にAPIを呼び出し、アーティスト一覧を再取得する', async () => {
    server.use(
      http.delete(`${getApiBase()}/artists/1`, () => {
        return new HttpResponse(null, { status: 204 })
      }),
      http.get(`${getApiBase()}/artists`, () => {
        return HttpResponse.json({
          items: [],
          meta: buildPaginationMeta(1, 0),
        })
      })
    )

    const { artists, loading, error, deleteArtist } = useArtistList()

    await deleteArtist(1)

    expect(artists.value).toEqual([])
    expect(loading.value).toBe(false)
    expect(error.value).toBeNull()
  })

  it('失敗時にerrorが設定され、loadingがリセットされる', async () => {
    server.use(
      http.delete(`${getApiBase()}/artists/1`, () => {
        return HttpResponse.json(
          { statusCode: 404, error: 'Not Found', message: 'Artist not found' },
          { status: 404 }
        )
      })
    )

    const { loading, error, deleteArtist } = useArtistList()

    await expect(deleteArtist(1)).rejects.toBeInstanceOf(Error)

    expect(loading.value).toBe(false)
    expect(error.value).toBeInstanceOf(Error)
  })
})

// ============================================================================
// Property Tests
// ============================================================================

describe('useArtistList - Property Tests', () => {
  /**
   * アーティスト一覧取得のProperty Test
   * 任意のページ番号に対して、そのページ番号をクリックした際には
   * 対応するページのアーティストレコードが取得され表示される必要があります
   *
   * Feature: prsk-music-management-web
   * Validates: Requirements 要件9
   */
  it('Property: 任意のページ番号に対して対応するページのアーティストレコードが取得される', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 1, max: 100 }), // ページ番号
        fc.integer({ min: 1, max: 50 }), // そのページのアイテム数
        fc.integer({ min: 0, max: 1000 }), // 総アイテム数
        async (page, itemCount, totalItems) => {
          // テストデータ生成
          const artists = Array.from({ length: itemCount }, (_, i) =>
            buildArtistResponse(page * 100 + i, {
              artistName: `Artist ${page}-${i}`,
            })
          )

          const meta = buildPaginationMeta(page, totalItems)

          // MSWでAPIをモック
          server.use(
            http.get(`${getApiBase()}/artists`, ({ request }) => {
              const url = new URL(request.url)
              const requestedPage = url.searchParams.get('page')

              // リクエストされたページ番号が正しいことを確認
              if (requestedPage === String(page)) {
                return HttpResponse.json({
                  items: artists,
                  meta,
                })
              }

              return HttpResponse.json({
                items: [],
                meta: buildPaginationMeta(Number(requestedPage) || 1, 0),
              })
            })
          )

          // useArtistListを使用
          const { artists: artistList, pagination, fetchArtists } = useArtistList()

          // ページ番号をクリック（fetchArtistsを呼び出し）
          await fetchArtists(page)

          // 対応するページのアーティストレコードが取得されていることを確認
          expect(artistList.value).toHaveLength(itemCount)
          expect(artistList.value).toEqual(artists)

          // ページネーション情報が正しく設定されていることを確認
          expect(pagination.value.currentPage).toBe(page)
          expect(pagination.value.totalItems).toBe(totalItems)
        }
      ),
      { numRuns: 100 }
    )
  })
})
