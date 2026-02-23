import fc from 'fast-check'
import { HttpResponse, http } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import type { AuditInfo, PaginationMeta, PrskMusic } from '@/types'
import { useMusicList } from './index'

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

function buildPaginationMeta(page: number, totalItems: number, itemsPerPage = 20): PaginationMeta {
  return {
    currentPage: page,
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
const getApiBase = () => `${window.location.origin}/btw-api/v1`

beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

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
          expect(pagination.value.currentPage).toBe(page)
          expect(pagination.value.totalItems).toBe(totalItems)
        }
      ),
      { numRuns: 100 }
    )
  })
})
