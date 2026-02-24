/**
 * useNotificationの戻り値の型定義
 */
export interface UseNotificationReturn {
  showSuccess: (message: string) => void
  showError: (message: string) => void
  showInfo: (message: string) => void
}

/**
 * 通知メッセージの管理
 *
 * @returns {UseNotificationReturn} 通知メッセージの表示メソッド
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

    // TODO: 実際のUI通知コンポーネントを実装する際に、ここで通知を表示する
    // 例: toast.success(message)
  }

  /**
   * エラーメッセージを表示
   * @param message - 表示するメッセージ
   */
  const showError = (message: string): void => {
    // コンソールにエラーログ出力（デバッグ用）
    // Requirements 6.5: エラー発生時にエラー詳細をブラウザコンソールにログ出力
    console.error('[Error]', message)

    // TODO: 実際のUI通知コンポーネントを実装する際に、ここで通知を表示する
    // 例: toast.error(message)
  }

  /**
   * 情報メッセージを表示
   * @param message - 表示するメッセージ
   */
  const showInfo = (message: string): void => {
    // コンソールにログ出力（デバッグ用）
    console.log('[Info]', message)

    // TODO: 実際のUI通知コンポーネントを実装する際に、ここで通知を表示する
    // 例: toast.info(message)
  }

  return {
    showSuccess,
    showError,
    showInfo,
  }
}
