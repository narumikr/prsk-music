<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ApiErrorResponse, getApiErrorMessage } from '@/api/base'
import ArtistFormModal from '@/components/ArtistFormModal.vue'
import ArtistTable from '@/components/ArtistTable.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import PaginationControl from '@/components/PaginationControl.vue'
import { useArtistList, useNotification } from '@/composables'
import { TEXT } from '@/constants/text'
import type { Artist, ArtistFormData } from '@/types'

// Composablesの呼び出し
const { artists, loading, pagination, fetchArtists, createArtist, updateArtist, deleteArtist } =
  useArtistList()
const { showSuccess, showError } = useNotification()

// フォームモーダルの状態
const formOpen = ref(false)
const formMode = ref<'create' | 'edit'>('create')
const selectedArtist = ref<Artist | undefined>(undefined)

// 削除確認ダイアログの状態
const deleteDialogOpen = ref(false)
const artistToDelete = ref<number | null>(null)

// 初期データ取得
onMounted(async () => {
  await fetchArtists(1)
})

// ページ変更ハンドラー
const handlePageChange = async (page: number) => {
  await fetchArtists(page)
}

// 新規登録ボタンクリック
const handleCreate = () => {
  formMode.value = 'create'
  selectedArtist.value = undefined
  formOpen.value = true
}

// 編集ボタンクリック
const handleEdit = (id: number) => {
  const artist = artists.value.find((a) => a.id === id)
  if (artist) {
    formMode.value = 'edit'
    selectedArtist.value = artist
    formOpen.value = true
  }
}

// 削除ボタンクリック
const handleDelete = (id: number) => {
  artistToDelete.value = id
  deleteDialogOpen.value = true
}

// フォーム送信
const handleFormSubmit = async (data: ArtistFormData) => {
  try {
    if (formMode.value === 'create') {
      await createArtist(data)
      showSuccess(TEXT.artistListPage.createSuccess)
    } else if (formMode.value === 'edit' && selectedArtist.value) {
      await updateArtist(selectedArtist.value.id, data)
      showSuccess(TEXT.artistListPage.updateSuccess)
    }
    formOpen.value = false
    // createArtist/updateArtistの中で既に再取得が行われているため、ここでは不要
  } catch (error: unknown) {
    const errorMessage = error instanceof ApiErrorResponse
      ? getApiErrorMessage(error)
      : TEXT.apiError.default
    showError(errorMessage)
  }
}

// フォームキャンセル
const handleFormClose = () => {
  formOpen.value = false
}

// 削除確認
const handleDeleteConfirm = async () => {
  if (artistToDelete.value !== null) {
    try {
      await deleteArtist(artistToDelete.value)
      showSuccess(TEXT.artistListPage.deleteSuccess)
      deleteDialogOpen.value = false
      artistToDelete.value = null
      // deleteArtistの中で既に再取得が行われているため、ここでは不要
    } catch (error: unknown) {
      const errorMessage = error instanceof ApiErrorResponse
        ? getApiErrorMessage(error)
        : TEXT.apiError.default
      showError(errorMessage)
    }
  }
}

// 削除キャンセル
const handleDeleteCancel = () => {
  deleteDialogOpen.value = false
  artistToDelete.value = null
}
</script>

<template>
  <div class="py-6">
    <!-- ヘッダー -->
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-semibold text-gray-900">
        {{ TEXT.navigation.artists }}
      </h1>
      <button
        type="button"
        class="px-4 py-2 border border-primary text-primary rounded hover:bg-primary hover:bg-opacity-10 transition duration-150 ease-in-out"
        data-testid="create-artist-button"
        @click="handleCreate"
      >
        {{ TEXT.common.create }}
      </button>
    </div>

    <!-- アーティスト一覧テーブル -->
    <ArtistTable
      :data="artists"
      :loading="loading"
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

    <!-- アーティストフォームモーダル -->
    <ArtistFormModal
      :open="formOpen"
      :mode="formMode"
      :initial-data="selectedArtist"
      @close="handleFormClose"
      @submit="handleFormSubmit"
    />

    <!-- 削除確認ダイアログ -->
    <ConfirmDialog
      :open="deleteDialogOpen"
      :title="TEXT.artistListPage.deleteConfirmTitle"
      :message="TEXT.artistListPage.deleteConfirmMessage"
      @confirm="handleDeleteConfirm"
      @cancel="handleDeleteCancel"
    />
  </div>
</template>
