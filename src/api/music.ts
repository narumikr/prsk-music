import type { MusicFormData, PaginatedResponse, PrskMusic } from '@/types'
import { apiClient } from './base'

/**
 * MusicApiClient
 * 楽曲APIクライアント
 */
export class MusicApiClient {
  /**
   * 楽曲一覧取得
   */
  async getList(page: number, limit: number): Promise<PaginatedResponse<PrskMusic>> {
    return apiClient.get<PaginatedResponse<PrskMusic>>('/prsk-music', { page, limit })
  }

  /**
   * 楽曲登録
   */
  async create(data: MusicFormData): Promise<PrskMusic> {
    return apiClient.post<PrskMusic>('/prsk-music', data)
  }

  /**
   * 楽曲更新
   */
  async update(id: number, data: Partial<MusicFormData>): Promise<PrskMusic> {
    return apiClient.put<PrskMusic>(`/prsk-music/${id}`, data)
  }

  /**
   * 楽曲削除
   */
  async delete(id: number): Promise<void> {
    return apiClient.delete<void>(`/prsk-music/${id}`)
  }
}

/**
 * MusicApiClientのシングルトンインスタンス
 */
export const musicApiClient = new MusicApiClient()
