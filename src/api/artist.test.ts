import fc from 'fast-check'
import { HttpResponse, http } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import type { Artist, ArtistFormData, AuditInfo } from '@/types'
import { ArtistApiClient } from './artist'

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

// ============================================================================
// Arbitraries
// ============================================================================

const artistFormDataArb: fc.Arbitrary<ArtistFormData> = fc.record({
  artistName: fc.string({ minLength: 1, maxLength: 50 }).filter((s) => !s.includes('\0')),
  unitName: fc.option(
    fc.string({ minLength: 1, maxLength: 25 }).filter((s) => !s.includes('\0')),
    { nil: null }
  ),
  content: fc.option(
    fc.string({ minLength: 1, maxLength: 20 }).filter((s) => !s.includes('\0')),
    { nil: null }
  ),
})

const partialArtistFormDataArb: fc.Arbitrary<Partial<ArtistFormData>> = fc.record(
  {
    artistName: fc.string({ minLength: 1, maxLength: 50 }).filter((s) => !s.includes('\0')),
    unitName: fc.option(
      fc.string({ minLength: 1, maxLength: 25 }).filter((s) => !s.includes('\0')),
      { nil: null }
    ),
    content: fc.option(
      fc.string({ minLength: 1, maxLength: 20 }).filter((s) => !s.includes('\0')),
      { nil: null }
    ),
  },
  { requiredKeys: [] }
)

// ============================================================================
// MSW サーバー設定
// ============================================================================

const server = setupServer()
const artistApi = new ArtistApiClient()

// happy-dom の window.location.origin からベースURLを動的に取得する
// （Vitest の happy-dom 環境では http://localhost:PORT が設定される）
const getApiBase = () => `${window.location.origin}/api/v1`

beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

// ============================================================================
// Property Tests
// ============================================================================

describe('ArtistApiClient - Property Tests', () => {
  /**
   * Property 27: アーティスト作成時のPOSTリクエスト送信
   * 任意のアーティストデータに対して、POST /artists が呼ばれ、
   * リクエストボディに入力データが正確に含まれること
   */
  it('Property 27: 任意のアーティストデータでPOSTリクエストが/artistsに送信される', async () => {
    await fc.assert(
      fc.asyncProperty(artistFormDataArb, async (data) => {
        let capturedMethod: string | undefined
        let capturedPath: string | undefined
        let capturedBody: unknown

        server.use(
          http.post(`${getApiBase()}/artists`, async ({ request }) => {
            capturedMethod = request.method
            capturedPath = new URL(request.url).pathname
            capturedBody = await request.json()
            return HttpResponse.json(buildArtistResponse(1), { status: 201 })
          })
        )

        await artistApi.create(data)

        expect(capturedMethod).toBe('POST')
        expect(capturedPath).toBe('/api/v1/artists')
        expect(capturedBody).toEqual(data)
      }),
      { numRuns: 100 }
    )
  })

  /**
   * Property 33: アーティスト更新時のPUTリクエスト送信
   * 任意のIDと部分的なアーティストデータに対して、PUT /artists/:id が呼ばれ、
   * リクエストボディに入力データが正確に含まれること
   */
  it('Property 33: 任意のIDとアーティストデータでPUTリクエストが/artists/:idに送信される', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 1, max: 9999 }),
        partialArtistFormDataArb,
        async (id, data) => {
          let capturedMethod: string | undefined
          let capturedPath: string | undefined
          let capturedBody: unknown

          server.use(
            http.put(`${getApiBase()}/artists/${id}`, async ({ request }) => {
              capturedMethod = request.method
              capturedPath = new URL(request.url).pathname
              capturedBody = await request.json()
              return HttpResponse.json(buildArtistResponse(id), { status: 200 })
            })
          )

          await artistApi.update(id, data)

          expect(capturedMethod).toBe('PUT')
          expect(capturedPath).toBe(`/api/v1/artists/${id}`)
          expect(capturedBody).toEqual(data)
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 34: アーティスト削除時のDELETEリクエスト送信
   * 任意のIDに対して、DELETE /artists/:id が呼ばれること
   */
  it('Property 34: 任意のIDでDELETEリクエストが/artists/:idに送信される', async () => {
    await fc.assert(
      fc.asyncProperty(fc.integer({ min: 1, max: 9999 }), async (id) => {
        let capturedMethod: string | undefined
        let capturedPath: string | undefined

        server.use(
          http.delete(`${getApiBase()}/artists/${id}`, ({ request }) => {
            capturedMethod = request.method
            capturedPath = new URL(request.url).pathname
            return new HttpResponse(null, { status: 204 })
          })
        )

        await artistApi.delete(id)

        expect(capturedMethod).toBe('DELETE')
        expect(capturedPath).toBe(`/api/v1/artists/${id}`)
      }),
      { numRuns: 100 }
    )
  })
})
