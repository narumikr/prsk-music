<script setup lang="ts">
import { computed, watch } from 'vue'

/**
 * NotificationDialog.vue
 *
 * グローバル通知ダイアログコンポーネント
 *
 * Requirements: 要件2, 要件3, 要件4, 要件6
 */

/**
 * Props定義
 */
interface NotificationDialogProps {
  message: string
  type: 'success' | 'error' | 'info'
  visible: boolean
}

const props = defineProps<NotificationDialogProps>()

/**
 * Emits定義
 */
const emit = defineEmits<{
  close: []
}>()

/**
 * visible/message/typeの変更を監視し、自動クローズタイマーを管理
 * onCleanupでタイマーをクリアすることで、visible=false時やmessage更新時・unmount時に
 * 不要なタイマーが残らないようにする
 */
watch(
  () => [props.visible, props.message, props.type] as const,
  ([visible], _, onCleanup) => {
    if (!visible) return
    const timer = setTimeout(() => emit('close'), 3000)
    onCleanup(() => clearTimeout(timer))
  },
  { immediate: true }
)

/**
 * タイプ別のボーダーカラー
 */
const borderColor = computed(() => {
  switch (props.type) {
    case 'success':
      return 'border-[#bbdd22]'
    case 'error':
      return 'border-[#ff6699]'
    case 'info':
      return 'border-[#33aaee]'
    default:
      return 'border-gray-200'
  }
})

/**
 * タイプ別のARIA role
 * error は assertive な通知 (role="alert")、それ以外は polite な通知 (role="status")
 */
const ariaRole = computed(() => (props.type === 'error' ? 'alert' : 'status'))

/**
 * タイプ別の背景カラー
 */
const bgColor = computed(() => {
  switch (props.type) {
    case 'success':
      return 'bg-[#bbdd22]/10'
    case 'error':
      return 'bg-[#ff6699]/10'
    case 'info':
      return 'bg-[#33aaee]/10'
    default:
      return 'bg-gray-50'
  }
})
</script>

<template>
  <Transition
    enter-active-class="transition duration-150 ease-out"
    enter-from-class="opacity-0 translate-y-2"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 translate-y-2"
  >
    <div
      v-if="props.visible"
      data-testid="notification-dialog"
      :role="ariaRole"
      :aria-live="ariaRole === 'alert' ? 'assertive' : 'polite'"
      aria-atomic="true"
      :class="[
        'fixed top-4 right-4 z-50',
        'max-w-md w-full',
        'px-4 py-3',
        'border-l-4',
        'rounded',
        'shadow-sm',
        'text-gray-900',
        borderColor,
        bgColor,
      ]"
    >
      <p class="text-sm">{{ message }}</p>
    </div>
  </Transition>
</template>
