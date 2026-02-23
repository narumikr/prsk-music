import type { Artist, ArtistFormData, PaginatedResponse } from '@/types'
import { apiClient } from './base'

/**
 * ArtistApiClient
 * アーティストAPIクライアント
 */
export class ArtistApiClient {
  /**
   * アーティスト一覧取得
   */
  async getList(page: number, limit: number): Promise<PaginatedResponse<Artist>> {
    return apiClient.get<PaginatedResponse<Artist>>('/artists', { page, limit })
  }

  /**
   * アーティスト登録
   */
  async create(data: ArtistFormData): Promise<Artist> {
    return apiClient.post<Artist>('/artists', data)
  }

  /**
   * アーティスト更新
   */
  async update(id: number, data: Partial<ArtistFormData>): Promise<Artist> {
    return apiClient.put<Artist>(`/artists/${id}`, data)
  }

  /**
   * アーティスト削除
   */
  async delete(id: number): Promise<void> {
    return apiClient.delete<void>(`/artists/${id}`)
  }
}

/**
 * ArtistApiClientのシングルトンインスタンス
 */
export const artistApiClient = new ArtistApiClient()
