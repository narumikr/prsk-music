import { type Ref, ref } from 'vue'

/**
 * 通知の状態
 */
interface NotificationState {
  message: string
  type: 'success' | 'error' | 'info'
  visible: boolean
}

/**
 * useNotificationの戻り値の型定義
 */
export interface UseNotificationReturn {
  notification: Ref<NotificationState>
  showSuccess: (message: string) => void
  showError: (message: string) => void
  showInfo: (message: string) => void
  hideNotification: () => void
}

/**
 * グローバルな通知状態
 * シングルトンパターンで実装し、アプリケーション全体で同じ状態を共有
 */
const notificationState = ref<NotificationState>({
  message: '',
  type: 'info',
  visible: false,
})

/**
 * 通知メッセージの管理
 *
 * @returns {UseNotificationReturn} 通知メッセージの表示メソッドと状態
 *
 * Requirements: 要件2, 要件3, 要件4, 要件6
 */
export function useNotification(): UseNotificationReturn {
  /**
   * 成功メッセージを表示
   * @param message - 表示するメッセージ
   */
  const showSuccess = (message: string): void => {
    // コンソールにログ出力（デバッグ用）
    console.log('[Success]', message)

    // 通知状態を更新
    notificationState.value = {
      message,
      type: 'success',
      visible: true,
    }
  }

  /**
   * エラーメッセージを表示
   * @param message - 表示するメッセージ
   */
  const showError = (message: string): void => {
    // コンソールにエラーログ出力（デバッグ用）
    // Requirements 6.5: エラー発生時にエラー詳細をブラウザコンソールにログ出力
    console.error('[Error]', message)

    // 通知状態を更新
    notificationState.value = {
      message,
      type: 'error',
      visible: true,
    }
  }

  /**
   * 情報メッセージを表示
   * @param message - 表示するメッセージ
   */
  const showInfo = (message: string): void => {
    // コンソールにログ出力（デバッグ用）
    console.log('[Info]', message)

    // 通知状態を更新
    notificationState.value = {
      message,
      type: 'info',
      visible: true,
    }
  }

  /**
   * 通知を非表示にする
   */
  const hideNotification = (): void => {
    notificationState.value = {
      ...notificationState.value,
      visible: false,
    }
  }

  return {
    notification: notificationState,
    showSuccess,
    showError,
    showInfo,
    hideNotification,
  }
}
