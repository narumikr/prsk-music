import fc from 'fast-check'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ApiErrorResponse } from '@/api/base'
import { useNotification } from './useNotification'

// ============================================================================
// テスト用ヘルパー
// ============================================================================

/**
 * モックResponseオブジェクトを作成
 */
function createMockResponse(status: number, body?: unknown): Response {
  return {
    status,
    ok: status >= 200 && status < 300,
    json: async () => body ?? {},
  } as Response
}

/**
 * ApiErrorResponseを作成
 */
async function createApiError(status: number, message?: string): Promise<ApiErrorResponse> {
  const response = createMockResponse(status, message ? { message } : undefined)
  const error = new ApiErrorResponse(response)
  await error.parseBody()
  return error
}

// ============================================================================
// Property Tests
// ============================================================================

describe('useNotification - Property Tests', () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>
  let consoleLogSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    // console.errorとconsole.logをスパイ
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {
      // noop
    })
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {
      // noop
    })
  })

  afterEach(() => {
    // スパイをリストア
    consoleErrorSpy.mockRestore()
    consoleLogSpy.mockRestore()
  })

  /**
   * Property 14: エラー詳細の表示
   * 任意のAPIエラーレスポンスにおいて、レスポンスボディにエラー詳細が含まれている場合、
   * それらの具体的なエラーメッセージがユーザーに表示される必要があります
   *
   * Feature: prsk-music-management-web, Property 14: エラー詳細の表示
   * Validates: Requirements 6.4
   */
  it('Property 14: APIエラーレスポンスのエラー詳細がユーザーに表示される', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(400, 404, 409, 500, 503), // HTTPステータスコード
        fc.string({ minLength: 1, maxLength: 100 }), // エラーメッセージ
        async (status, errorMessage) => {
          consoleErrorSpy.mockClear()

          // ApiErrorResponseを作成
          const apiError = await createApiError(status, errorMessage)

          // useNotificationを使用
          const { showError } = useNotification()

          // エラーを表示
          const displayMessage = apiError.data?.message ?? 'エラーが発生しました'
          showError(displayMessage)

          // エラーメッセージがconsole.errorで出力されることを確認
          expect(consoleErrorSpy).toHaveBeenCalledWith('[Error]', displayMessage)
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 15: エラーのコンソールログ出力
   * 任意のエラーが発生した場合、デバッグのためにエラー詳細が
   * ブラウザコンソールにログ出力される必要があります
   *
   * Feature: prsk-music-management-web, Property 15: エラーのコンソールログ出力
   * Validates: Requirements 6.5
   */
  it('Property 15: エラー発生時にコンソールにログ出力される', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(400, 401, 403, 404, 409, 500, 503), // HTTPステータスコード
        fc.option(fc.string({ minLength: 1, maxLength: 100 }), { nil: undefined }), // エラーメッセージ（任意）
        async (status, errorMessage) => {
          consoleErrorSpy.mockClear()

          // ApiErrorResponseを作成
          const apiError = await createApiError(status, errorMessage)

          // useNotificationを使用
          const { showError } = useNotification()

          // エラーを表示
          const displayMessage = apiError.data?.message ?? 'エラーが発生しました'
          showError(displayMessage)

          // console.errorが呼び出されることを確認
          expect(consoleErrorSpy).toHaveBeenCalledWith('[Error]', displayMessage)
          expect(consoleErrorSpy).toHaveBeenCalledTimes(1)
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 14 & 15の統合テスト
   * エラー詳細の表示とコンソールログ出力が同時に行われることを確認
   */
  it('Property 14 & 15: エラー詳細の表示とコンソールログ出力が同時に行われる', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          status: fc.constantFrom(400, 401, 403, 404, 409, 500, 503),
          message: fc.option(fc.string({ minLength: 1, maxLength: 100 }), { nil: undefined }),
        }),
        async ({ status, message }) => {
          consoleErrorSpy.mockClear()

          // ApiErrorResponseを作成
          const apiError = await createApiError(status, message)

          // useNotificationを使用
          const { showError } = useNotification()

          // エラーを表示
          const displayMessage = apiError.data?.message ?? 'エラーが発生しました'
          showError(displayMessage)

          // console.errorが正しいメッセージで呼び出されることを確認
          expect(consoleErrorSpy).toHaveBeenCalledWith('[Error]', displayMessage)
          expect(consoleErrorSpy).toHaveBeenCalledTimes(1)
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * 成功メッセージの表示テスト
   * showSuccessが正しく動作することを確認
   */
  it('任意の成功メッセージが表示される', async () => {
    await fc.assert(
      fc.asyncProperty(fc.string({ minLength: 1, maxLength: 100 }), async (message) => {
        consoleLogSpy.mockClear()

        const { showSuccess } = useNotification()

        // 成功メッセージを表示
        showSuccess(message)

        // console.logが正しいメッセージで呼び出されることを確認
        expect(consoleLogSpy).toHaveBeenCalledWith('[Success]', message)
        expect(consoleLogSpy).toHaveBeenCalledTimes(1)
      }),
      { numRuns: 100 }
    )
  })

  /**
   * 情報メッセージの表示テスト
   * showInfoが正しく動作することを確認
   */
  it('任意の情報メッセージが表示される', async () => {
    await fc.assert(
      fc.asyncProperty(fc.string({ minLength: 1, maxLength: 100 }), async (message) => {
        consoleLogSpy.mockClear()

        const { showInfo } = useNotification()

        // 情報メッセージを表示
        showInfo(message)

        // console.logが正しいメッセージで呼び出されることを確認
        expect(consoleLogSpy).toHaveBeenCalledWith('[Info]', message)
        expect(consoleLogSpy).toHaveBeenCalledTimes(1)
      }),
      { numRuns: 100 }
    )
  })
})
