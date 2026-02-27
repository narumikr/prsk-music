<script setup lang="ts">
import { onUnmounted, watch } from 'vue'
import { TEXT } from '@/constants/text'

interface ConfirmDialogProps {
  open: boolean
  title: string
  message: string
}

interface ConfirmDialogEmits {
  (e: 'confirm'): void
  (e: 'cancel'): void
}

const props = defineProps<ConfirmDialogProps>()
const emit = defineEmits<ConfirmDialogEmits>()

// Escapeキーでダイアログを閉じる
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.open) {
    emit('cancel')
  }
}

// ダイアログが開いているときにEscapeキーリスナーを追加
watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeydown)
    } else {
      document.removeEventListener('keydown', handleKeydown)
    }
  },
  { immediate: true }
)

// コンポーネントがアンマウントされるときにリスナーをクリーンアップ
onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})

const handleConfirm = () => {
  emit('confirm')
}

const handleCancel = () => {
  emit('cancel')
}

const handleOverlayClick = () => {
  emit('cancel')
}
</script>

<template>
  <!-- ダイアログオーバーレイ -->
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-150 ease-in-out"
    data-testid="dialog-overlay"
    @click="handleOverlayClick"
  >
    <!-- ダイアログコンテンツ -->
    <div
      role="dialog"
      aria-modal="true"
      class="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 transition-transform duration-150 ease-in-out"
      data-testid="confirm-dialog"
      @click.stop
      @keydown.escape.stop="handleCancel"
    >
      <!-- ダイアログヘッダー -->
      <div class="px-6 py-4 border-b border-gray-200">
        <h2 class="text-xl font-semibold text-gray-900" data-testid="dialog-title">
          {{ title }}
        </h2>
      </div>

      <!-- ダイアログボディ -->
      <div class="px-6 py-4">
        <p class="text-base text-gray-900 leading-relaxed" data-testid="dialog-message">
          {{ message }}
        </p>
      </div>

      <!-- ダイアログフッター -->
      <div class="px-6 py-4 border-t border-gray-200 flex justify-end gap-4">
        <!-- キャンセルボタン -->
        <button
          type="button"
          class="px-4 py-2 border border-gray-200 rounded text-gray-900 hover:border-gray-400 hover:bg-gray-50 transition duration-150 ease-in-out"
          data-testid="cancel-button"
          @click="handleCancel"
        >
          {{ TEXT.confirmDialog.cancel }}
        </button>

        <!-- 確認ボタン -->
        <button
          type="button"
          class="px-4 py-2 border rounded text-white transition duration-150 ease-in-out"
          :class="[
            'bg-error',
            'border-error',
            'hover:opacity-80'
          ]"
          data-testid="confirm-button"
          @click="handleConfirm"
        >
          {{ TEXT.confirmDialog.delete }}
        </button>
      </div>
    </div>
  </div>
</template>
