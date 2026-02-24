import { TEXT } from '@/constants/text'

/**
 * BaseApiClient
 * 共通のHTTPリクエストメソッドを提供するAPIクライアント
 */
export class BaseApiClient {
  private baseUrl = '/btw-api/v1'
  private authToken: string | null = null

  /**
   * 認証トークンの設定（将来の認証対応）
   */
  setAuthToken(token: string | null): void {
    this.authToken = token
  }

  /**
   * 共通のHTTPリクエストメソッド
   */
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (this.authToken) {
      headers.Authorization = `Bearer ${this.authToken}`
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        ...headers,
        ...(options.headers as Record<string, string>),
      },
    })

    if (!response.ok) {
      const error = new ApiErrorResponse(response)
      await error.parseBody()
      throw error
    }

    if (response.status === 204) {
      return undefined as T
    }

    return response.json()
  }

  /**
   * GETリクエスト
   */
  async get<T>(endpoint: string, params?: Record<string, unknown>): Promise<T> {
    let url = endpoint
    if (params) {
      const searchParams = new URLSearchParams()
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value))
        }
      }
      const queryString = searchParams.toString()
      if (queryString) {
        url = `${endpoint}?${queryString}`
      }
    }
    return this.request<T>(url)
  }

  /**
   * POSTリクエスト
   */
  async post<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  /**
   * PUTリクエスト
   */
  async put<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  /**
   * DELETEリクエスト
   */
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    })
  }
}

/**
 * ApiErrorResponse
 * APIエラーを表すクラス
 */
export class ApiErrorResponse extends Error {
  status: number
  data: { message?: string } | null
  private response: Response

  constructor(response: Response) {
    super(`API Error: ${response.status}`)
    this.status = response.status
    this.response = response
    this.name = 'ApiErrorResponse'
    this.data = null
  }

  async parseBody(): Promise<void> {
    try {
      this.data = await this.response.json()
    } catch {
      this.data = null
    }
  }
}

/**
 * APIエラーをユーザーフレンドリーなメッセージに変換
 */
export function getApiErrorMessage(error: ApiErrorResponse): string {
  switch (error.status) {
    case 400:
      return error.data?.message ?? TEXT.apiError.badRequest
    case 401:
      return TEXT.apiError.unauthorized
    case 403:
      return TEXT.apiError.forbidden
    case 404:
      return TEXT.apiError.notFound
    case 409:
      return error.data?.message ?? TEXT.apiError.conflict
    case 500:
      return TEXT.apiError.serverError
    case 503:
      return TEXT.apiError.serviceUnavailable
    default:
      return TEXT.apiError.default
  }
}

/**
 * シングルトンインスタンス
 */
export const apiClient = new BaseApiClient()
