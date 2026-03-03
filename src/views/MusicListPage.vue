<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ApiErrorResponse, getApiErrorMessage } from '@/api/base'
import ArtistFormModal from '@/components/ArtistFormModal.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import MusicFormModal from '@/components/MusicFormModal.vue'
import MusicTable from '@/components/MusicTable.vue'
import PaginationControl from '@/components/PaginationControl.vue'
import { useArtistList, useMusicList, useNotification } from '@/composables'
import { TEXT } from '@/constants/text'
import type { ArtistFormData, MusicFormData, PrskMusic } from '@/types'

// Composablesの呼び出し
const { musics, loading, pagination, fetchMusics, createMusic, updateMusic, deleteMusic } =
  useMusicList()
const { artists, fetchArtists, createArtist } = useArtistList()
const { showSuccess, showError } = useNotification()

// 楽曲フォームモーダルの状態
const musicFormOpen = ref(false)
const musicFormMode = ref<'create' | 'edit'>('create')
const selectedMusic = ref<PrskMusic | undefined>(undefined)
const newlyCreatedArtistId = ref<number | null>(null)

// アーティストフォームモーダルの状態
const artistFormOpen = ref(false)

// 削除確認ダイアログの状態
const deleteDialogOpen = ref(false)
const musicToDelete = ref<number | null>(null)

// 初期データ取得
onMounted(async () => {
  try {
    await Promise.all([fetchMusics(1), fetchArtists(1)])
  } catch (error: unknown) {
    const errorMessage =
      error instanceof ApiErrorResponse ? getApiErrorMessage(error) : TEXT.apiError.default
    showError(errorMessage)
  }
})

// ページ変更ハンドラー
const handlePageChange = async (page: number) => {
  try {
    await fetchMusics(page)
  } catch (error: unknown) {
    const errorMessage =
      error instanceof ApiErrorResponse ? getApiErrorMessage(error) : TEXT.apiError.default
    showError(errorMessage)
  }
}

// 新規登録ボタンクリック
const handleCreate = () => {
  musicFormMode.value = 'create'
  selectedMusic.value = undefined
  newlyCreatedArtistId.value = null
  musicFormOpen.value = true
}

// 編集ボタンクリック
const handleEdit = (id: number) => {
  const music = musics.value.find((m) => m.id === id)
  if (music) {
    musicFormMode.value = 'edit'
    selectedMusic.value = music
    newlyCreatedArtistId.value = null
    musicFormOpen.value = true
  }
}

// 削除ボタンクリック
const handleDelete = (id: number) => {
  musicToDelete.value = id
  deleteDialogOpen.value = true
}

// 楽曲フォーム送信
const handleMusicFormSubmit = async (data: MusicFormData) => {
  try {
    if (musicFormMode.value === 'create') {
      await createMusic(data)
      showSuccess(TEXT.musicListPage.createSuccess)
    } else if (musicFormMode.value === 'edit' && selectedMusic.value) {
      await updateMusic(selectedMusic.value.id, data)
      showSuccess(TEXT.musicListPage.updateSuccess)
    }
    musicFormOpen.value = false
    newlyCreatedArtistId.value = null
  } catch (error: unknown) {
    const errorMessage =
      error instanceof ApiErrorResponse ? getApiErrorMessage(error) : TEXT.apiError.default
    showError(errorMessage)
  }
}

// 楽曲フォームキャンセル
const handleMusicFormClose = () => {
  musicFormOpen.value = false
  newlyCreatedArtistId.value = null
}

// アーティスト新規追加トリガー
const handleCreateArtist = () => {
  artistFormOpen.value = true
}

// アーティストフォーム送信
const handleArtistFormSubmit = async (data: ArtistFormData) => {
  try {
    await createArtist(data)
    showSuccess(TEXT.artistListPage.createSuccess)
    artistFormOpen.value = false

    // アーティスト一覧を再取得
    await fetchArtists(1)

    // 新規追加されたアーティストを特定（最後に追加されたアーティスト）
    if (artists.value.length > 0) {
      // 最後のアーティストを自動選択
      const lastArtist = artists.value[artists.value.length - 1]
      newlyCreatedArtistId.value = lastArtist.id
    }
  } catch (error: unknown) {
    const errorMessage =
      error instanceof ApiErrorResponse ? getApiErrorMessage(error) : TEXT.apiError.default
    showError(errorMessage)
  }
}

// アーティストフォームキャンセル
const handleArtistFormClose = () => {
  artistFormOpen.value = false
}

// 削除確認
const handleDeleteConfirm = async () => {
  if (musicToDelete.value !== null) {
    try {
      await deleteMusic(musicToDelete.value)
      showSuccess(TEXT.musicListPage.deleteSuccess)
      deleteDialogOpen.value = false
      musicToDelete.value = null
    } catch (error: unknown) {
      const errorMessage =
        error instanceof ApiErrorResponse ? getApiErrorMessage(error) : TEXT.apiError.default
      showError(errorMessage)
    }
  }
}

// 削除キャンセル
const handleDeleteCancel = () => {
  deleteDialogOpen.value = false
  musicToDelete.value = null
}
</script>

<template>
  <div class="py-6">
    <!-- ヘッダー -->
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-semibold text-gray-900">
        {{ TEXT.navigation.musics }}
      </h1>
      <button
        type="button"
        class="px-4 py-2 border border-primary text-primary rounded hover:bg-primary hover:bg-opacity-10 transition duration-150 ease-in-out"
        data-testid="create-music-button"
        @click="handleCreate"
      >
        {{ TEXT.common.create }}
      </button>
    </div>

    <!-- 楽曲一覧テーブル -->
    <MusicTable
      :data="musics"
      :loading="loading"
      data-testid="music-table"
      @edit="handleEdit"
      @delete="handleDelete"
    />

    <!-- ページネーション -->
    <PaginationControl
      v-if="pagination.totalItems > 0"
      :current-page="pagination.currentPage"
      :total-pages="pagination.totalPages"
      :total-items="pagination.totalItems"
      @page-change="handlePageChange"
    />

    <!-- 楽曲フォームモーダル -->
    <MusicFormModal
      :open="musicFormOpen"
      :mode="musicFormMode"
      :initial-data="selectedMusic"
      :artists="artists"
      :newly-created-artist-id="newlyCreatedArtistId"
      data-testid="music-form-modal"
      @close="handleMusicFormClose"
      @submit="handleMusicFormSubmit"
      @create-artist="handleCreateArtist"
    />

    <!-- アーティストフォームモーダル -->
    <ArtistFormModal
      :open="artistFormOpen"
      mode="create"
      data-testid="artist-form-modal"
      @close="handleArtistFormClose"
      @submit="handleArtistFormSubmit"
    />

    <!-- 削除確認ダイアログ -->
    <ConfirmDialog
      :open="deleteDialogOpen"
      :title="TEXT.musicListPage.deleteConfirmTitle"
      :message="TEXT.musicListPage.deleteConfirmMessage"
      @confirm="handleDeleteConfirm"
      @cancel="handleDeleteCancel"
    />
  </div>
</template>
