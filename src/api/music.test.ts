import fc from 'fast-check'
import { HttpResponse, http } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import type { AuditInfo, MusicFormData, MusicType, PrskMusic } from '@/types'
import { MusicApiClient } from './music'

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

// ============================================================================
// Arbitraries
// ============================================================================

const musicTypeArb = fc.constantFrom<MusicType>(0, 1, 2)

const nullableStringArb = fc.option(
  fc.string({ minLength: 1, maxLength: 50 }).filter((s) => !s.includes('\0')),
  { nil: null }
)

const musicFormDataArb: fc.Arbitrary<MusicFormData> = fc.record({
  title: fc.string({ minLength: 1, maxLength: 100 }).filter((s) => !s.includes('\0')),
  artistId: fc.integer({ min: 1, max: 9999 }),
  musicType: musicTypeArb,
  specially: fc.option(fc.boolean(), { nil: null }),
  lyricsName: nullableStringArb,
  musicName: nullableStringArb,
  featuring: nullableStringArb,
  youtubeLink: fc.string({ minLength: 1, maxLength: 200 }).filter((s) => !s.includes('\0')),
})

const partialMusicFormDataArb: fc.Arbitrary<Partial<MusicFormData>> = fc.record(
  {
    title: fc.string({ minLength: 1, maxLength: 100 }).filter((s) => !s.includes('\0')),
    artistId: fc.integer({ min: 1, max: 9999 }),
    musicType: musicTypeArb,
    specially: fc.option(fc.boolean(), { nil: null }),
    lyricsName: nullableStringArb,
    musicName: nullableStringArb,
    featuring: nullableStringArb,
    youtubeLink: fc.string({ minLength: 1, maxLength: 200 }).filter((s) => !s.includes('\0')),
  },
  { requiredKeys: [] }
)

// ============================================================================
// MSW サーバー設定
// ============================================================================

const server = setupServer()
const musicApi = new MusicApiClient()

// happy-dom の window.location.origin からベースURLを動的に取得する
// （Vitest の happy-dom 環境では http://localhost:PORT が設定される）
const getApiBase = () => `${window.location.origin}/btw-api/v1`

beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

// ============================================================================
// Property Tests
// ============================================================================

describe('MusicApiClient - Property Tests', () => {
  /**
   * Property 4: 楽曲作成時のPOSTリクエスト送信
   * 任意の楽曲データに対して、POST /prsk-music が呼ばれ、
   * リクエストボディに入力データが正確に含まれること
   */
  it('Property 4: 任意の楽曲データでPOSTリクエストが/prsk-musicに送信される', async () => {
    await fc.assert(
      fc.asyncProperty(musicFormDataArb, async (data) => {
        let capturedMethod: string | undefined
        let capturedPath: string | undefined
        let capturedBody: unknown

        server.use(
          http.post(`${getApiBase()}/prsk-music`, async ({ request }) => {
            capturedMethod = request.method
            capturedPath = new URL(request.url).pathname
            capturedBody = await request.json()
            return HttpResponse.json(buildMusicResponse(1), { status: 201 })
          })
        )

        await musicApi.create(data)

        expect(capturedMethod).toBe('POST')
        expect(capturedPath).toBe('/btw-api/v1/prsk-music')
        expect(capturedBody).toEqual(data)
      }),
      { numRuns: 100 }
    )
  })

  /**
   * Property 8: 楽曲更新時のPUTリクエスト送信
   * 任意のIDと部分的な楽曲データに対して、PUT /prsk-music/:id が呼ばれ、
   * リクエストボディに入力データが正確に含まれること
   */
  it('Property 8: 任意のIDと楽曲データでPUTリクエストが/prsk-music/:idに送信される', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 1, max: 9999 }),
        partialMusicFormDataArb,
        async (id, data) => {
          let capturedMethod: string | undefined
          let capturedPath: string | undefined
          let capturedBody: unknown

          server.use(
            http.put(`${getApiBase()}/prsk-music/${id}`, async ({ request }) => {
              capturedMethod = request.method
              capturedPath = new URL(request.url).pathname
              capturedBody = await request.json()
              return HttpResponse.json(buildMusicResponse(id), { status: 200 })
            })
          )

          await musicApi.update(id, data)

          expect(capturedMethod).toBe('PUT')
          expect(capturedPath).toBe(`/btw-api/v1/prsk-music/${id}`)
          expect(capturedBody).toEqual(data)
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 9: 楽曲削除時のDELETEリクエスト送信
   * 任意のIDに対して、DELETE /prsk-music/:id が呼ばれること
   */
  it('Property 9: 任意のIDでDELETEリクエストが/prsk-music/:idに送信される', async () => {
    await fc.assert(
      fc.asyncProperty(fc.integer({ min: 1, max: 9999 }), async (id) => {
        let capturedMethod: string | undefined
        let capturedPath: string | undefined

        server.use(
          http.delete(`${getApiBase()}/prsk-music/${id}`, ({ request }) => {
            capturedMethod = request.method
            capturedPath = new URL(request.url).pathname
            return new HttpResponse(null, { status: 204 })
          })
        )

        await musicApi.delete(id)

        expect(capturedMethod).toBe('DELETE')
        expect(capturedPath).toBe(`/btw-api/v1/prsk-music/${id}`)
      }),
      { numRuns: 100 }
    )
  })

  /**
   * Property 10: ページネーションクエリパラメータの送信
   * 任意のpage・limitに対して、GETリクエストのクエリパラメータに
   * page と limit が正確に付与されること
   */
  it('Property 10: 任意のpage・limitでGETリクエストのクエリパラメータに付与される', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 1, max: 9999 }),
        fc.integer({ min: 1, max: 1000 }),
        async (page, limit) => {
          let capturedPage: string | null = null
          let capturedLimit: string | null = null

          server.use(
            http.get(`${getApiBase()}/prsk-music`, ({ request }) => {
              const url = new URL(request.url)
              capturedPage = url.searchParams.get('page')
              capturedLimit = url.searchParams.get('limit')
              return HttpResponse.json({
                items: [],
                meta: { totalItems: 0, totalPages: 1, pageIndex: page, limit },
              })
            })
          )

          await musicApi.getList(page, limit)

          expect(capturedPage).toBe(String(page))
          expect(capturedLimit).toBe(String(limit))
        }
      ),
      { numRuns: 100 }
    )
  })
})
