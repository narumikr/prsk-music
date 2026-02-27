<script setup lang="ts">
import { computed } from 'vue'
import { TEXT } from '@/constants/text'

interface PaginationControlProps {
  currentPage: number
  totalPages: number
  totalItems: number
}

type PaginationControlEmits = (e: 'page-change', page: number) => void

const props = defineProps<PaginationControlProps>()
const emit = defineEmits<PaginationControlEmits>()

const shouldShowPagination = computed(() => props.totalItems > 20)

// 前へボタンが無効かどうか
const isPrevDisabled = computed(() => props.currentPage === 1)

// 次へボタンが無効かどうか
const isNextDisabled = computed(() => props.currentPage === props.totalPages)

const pageNumbers = computed(() => {
  const pages: number[] = []
  for (let i = 1; i <= props.totalPages; i++) {
    pages.push(i)
  }
  return pages
})

// ページ変更ハンドラー
const handlePageChange = (page: number) => {
  if (page >= 1 && page <= props.totalPages) {
    emit('page-change', page)
  }
}

const handlePrev = () => {
  if (!isPrevDisabled.value) {
    handlePageChange(props.currentPage - 1)
  }
}

const handleNext = () => {
  if (!isNextDisabled.value) {
    handlePageChange(props.currentPage + 1)
  }
}
</script>

<template>
  <div v-if="shouldShowPagination" data-testid="pagination" class="flex items-center justify-between gap-4 py-4">
    <!-- ページ情報 -->
    <div data-testid="page-info" class="text-sm text-gray-600">
<<<<<<< HEAD
      {{ TEXT.pagination.pagePrefix }} {{ currentPage }} / {{ totalPages }} （{{ TEXT.pagination.totalPrefix }} {{ totalItems }} {{ TEXT.pagination.totalSuffix }}）
=======
      ページ {{ currentPage }} / {{ totalPages }} （全 {{ totalItems }} 件）
>>>>>>> 78aa01a3885cb201dcb237d611580601af49d446
    </div>

    <!-- ページネーションコントロール -->
    <div class="flex items-center gap-2">
      <!-- 前へボタン -->
      <button
        data-testid="prev-button"
        :disabled="isPrevDisabled"
        :class="[
          'px-3 py-1 text-sm border rounded transition duration-150 ease-in-out',
          isPrevDisabled
            ? 'border-gray-200 text-gray-400 cursor-not-allowed opacity-50'
            : 'border-gray-200 text-gray-900 hover:border-primary hover:text-primary',
        ]"
        @click="handlePrev"
      >
<<<<<<< HEAD
        {{ TEXT.pagination.prev }}
=======
        前へ
>>>>>>> 78aa01a3885cb201dcb237d611580601af49d446
      </button>

      <!-- ページ番号リンク -->
      <div class="flex items-center gap-1">
        <button
          v-for="page in pageNumbers"
          :key="page"
          :data-testid="`page-link-${page}`"
          :class="[
            'px-3 py-1 text-sm border rounded transition duration-150 ease-in-out',
            page === currentPage
              ? 'border-primary text-primary bg-primary bg-opacity-10'
              : 'border-gray-200 text-gray-900 hover:border-primary hover:text-primary',
          ]"
          @click="handlePageChange(page)"
        >
          {{ page }}
        </button>
      </div>

      <!-- 次へボタン -->
      <button
        data-testid="next-button"
        :disabled="isNextDisabled"
        :class="[
          'px-3 py-1 text-sm border rounded transition duration-150 ease-in-out',
          isNextDisabled
            ? 'border-gray-200 text-gray-400 cursor-not-allowed opacity-50'
            : 'border-gray-200 text-gray-900 hover:border-primary hover:text-primary',
        ]"
        @click="handleNext"
      >
<<<<<<< HEAD
        {{ TEXT.pagination.next }}
=======
        次へ
>>>>>>> 78aa01a3885cb201dcb237d611580601af49d446
      </button>
    </div>
  </div>
</template>
