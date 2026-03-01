import type { Ref } from 'vue'
import { ref } from 'vue'
import { artistApiClient } from '@/api'
import type { Artist, ArtistFormData, PaginationMeta } from '@/types'

/**
 * useArtistListの戻り値の型定義
 */
export interface UseArtistListReturn {
  artists: Ref<Artist[]>
  loading: Ref<boolean>
  error: Ref<Error | null>
  pagination: Ref<PaginationMeta>
  fetchArtists: (page: number) => Promise<void>
  createArtist: (data: ArtistFormData) => Promise<void>
  updateArtist: (id: number, data: ArtistFormData) => Promise<void>
  deleteArtist: (id: number) => Promise<void>
}

/**
 * アーティスト一覧の状態管理
 *
 * @returns {UseArtistListReturn} アーティスト一覧の状態とメソッド
 *
 * Requirements: 要件9, 要件10, 要件11, 要件12
 */
export function useArtistList(): UseArtistListReturn {
  // 状態管理
  const artists = ref<Artist[]>([])
  const loading = ref(false)
  const error = ref<Error | null>(null)
  const pagination = ref<PaginationMeta>({
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
    itemsPerPage: 20,
  })

  /**
   * アーティスト一覧を取得
   * @param page ページ番号
   */
  const fetchArtists = async (page: number): Promise<void> => {
    loading.value = true
    error.value = null

    try {
      const response = await artistApiClient.getList(page, pagination.value.itemsPerPage)
      artists.value = response.items
      pagination.value = response.meta
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('Unknown error')
      throw error.value
    } finally {
      loading.value = false
    }
  }

  /**
   * アーティストを作成
   * @param data アーティストフォームデータ
   */
  const createArtist = async (data: ArtistFormData): Promise<void> => {
    loading.value = true
    error.value = null

    try {
      await artistApiClient.create(data)
      // 作成後、現在のページを再取得
      await fetchArtists(pagination.value.currentPage)
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('Unknown error')
      throw error.value
    } finally {
      loading.value = false
    }
  }

  /**
   * アーティストを更新
   * @param id アーティストID
   * @param data アーティストフォームデータ
   */
  const updateArtist = async (id: number, data: ArtistFormData): Promise<void> => {
    loading.value = true
    error.value = null

    try {
      await artistApiClient.update(id, data)
      // 更新後、現在のページを再取得
      await fetchArtists(pagination.value.currentPage)
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('Unknown error')
      throw error.value
    } finally {
      loading.value = false
    }
  }

  /**
   * アーティストを削除
   * @param id アーティストID
   */
  const deleteArtist = async (id: number): Promise<void> => {
    loading.value = true
    error.value = null

    try {
      await artistApiClient.delete(id)
      // 削除後、現在のページを再取得
      await fetchArtists(pagination.value.currentPage)
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('Unknown error')
      throw error.value
    } finally {
      loading.value = false
    }
  }

  return {
    artists,
    loading,
    error,
    pagination,
    fetchArtists,
    createArtist,
    updateArtist,
    deleteArtist,
  }
}
