import type { Ref } from 'vue'
import { ref } from 'vue'
import { musicApiClient } from '@/api'
import type { MusicFormData, PaginationMeta, PrskMusic } from '@/types'

/**
 * useMusicListの戻り値の型定義
 */
export interface UseMusicListReturn {
  musics: Ref<PrskMusic[]>
  loading: Ref<boolean>
  error: Ref<Error | null>
  pagination: Ref<PaginationMeta>
  fetchMusics: (page: number) => Promise<void>
  createMusic: (data: MusicFormData) => Promise<void>
  updateMusic: (id: number, data: MusicFormData) => Promise<void>
  deleteMusic: (id: number) => Promise<void>
}

/**
 * 楽曲一覧の状態管理
 *
 * @returns {UseMusicListReturn} 楽曲一覧の状態とメソッド
 *
 * Requirements: 要件1, 要件2, 要件3, 要件4, 要件5
 */
export function useMusicList(): UseMusicListReturn {
  // 状態管理
  const musics = ref<PrskMusic[]>([])
  const loading = ref(false)
  const error = ref<Error | null>(null)
  const pagination = ref<PaginationMeta>({
    pageIndex: 1,
    totalPages: 0,
    totalItems: 0,
    limit: 20,
  })

  /**
   * 楽曲一覧を取得
   * @param page ページ番号
   */
  const fetchMusics = async (page: number): Promise<void> => {
    loading.value = true
    error.value = null

    try {
      const response = await musicApiClient.getList(page, pagination.value.limit)
      musics.value = response.items
      pagination.value = response.meta
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('Unknown error')
      throw error.value
    } finally {
      loading.value = false
    }
  }

  /**
   * 楽曲を作成
   * @param data 楽曲フォームデータ
   */
  const createMusic = async (data: MusicFormData): Promise<void> => {
    loading.value = true
    error.value = null

    try {
      await musicApiClient.create(data)
      // 作成後、現在のページを再取得
      await fetchMusics(pagination.value.pageIndex)
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('Unknown error')
      throw error.value
    } finally {
      loading.value = false
    }
  }

  /**
   * 楽曲を更新
   * @param id 楽曲ID
   * @param data 楽曲フォームデータ
   */
  const updateMusic = async (id: number, data: MusicFormData): Promise<void> => {
    loading.value = true
    error.value = null

    try {
      await musicApiClient.update(id, data)
      // 更新後、現在のページを再取得
      await fetchMusics(pagination.value.pageIndex)
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('Unknown error')
      throw error.value
    } finally {
      loading.value = false
    }
  }

  /**
   * 楽曲を削除
   * @param id 楽曲ID
   */
  const deleteMusic = async (id: number): Promise<void> => {
    loading.value = true
    error.value = null

    try {
      await musicApiClient.delete(id)
      // 削除後、現在のページを再取得
      await fetchMusics(pagination.value.pageIndex)
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('Unknown error')
      throw error.value
    } finally {
      loading.value = false
    }
  }

  return {
    musics,
    loading,
    error,
    pagination,
    fetchMusics,
    createMusic,
    updateMusic,
    deleteMusic,
  }
}
