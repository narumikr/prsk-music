/**
 * UI表示テキスト定義
 *
 * このファイルにはアプリケーション全体で使用するUI表示テキストを定義します。
 * リテラル文字列を直接コンポーネントに記述せず、このファイルから参照してください。
 */

export const TEXT = {
  // 共通
  common: {
    appName: 'プロセカ楽曲管理',
    loading: '読み込み中...',
    error: 'エラーが発生しました',
    success: '成功しました',
    cancel: 'キャンセル',
    close: '閉じる',
    save: '保存',
    delete: '削除',
    edit: '編集',
    create: '作成',
    search: '検索',
    filter: 'フィルター',
    sort: '並び替え',
    noData: 'データがありません',
  },

  // 確認ダイアログ
  confirmDialog: {
    cancel: 'キャンセル',
    delete: '削除',
  },

  // バリデーションメッセージ
  validation: {
    required: '必須項目です',
    invalidFormat: '形式が正しくありません',
    tooLong: '文字数が多すぎます',
    tooShort: '文字数が少なすぎます',
  },

  // エラーメッセージ
  error: {
    networkError: 'ネットワークエラーが発生しました',
    serverError: 'サーバーエラーが発生しました',
    notFound: 'データが見つかりません',
    unauthorized: '認証が必要です',
    forbidden: 'アクセス権限がありません',
  },

  // APIエラーメッセージ
  apiError: {
    badRequest: 'リクエストが無効です',
    unauthorized: '認証が必要です。ログインしてください',
    forbidden: 'この操作を実行する権限がありません',
    notFound: '指定されたレコードが見つかりません',
    conflict: '重複するデータが存在します',
    serverError: 'サーバーエラーが発生しました。しばらくしてからもう一度お試しください',
    serviceUnavailable: 'サービスがメンテナンス中です。しばらくお待ちください',
    default: 'エラーが発生しました',
  },

  // デモ用テキスト（HelloWorldコンポーネント用）
  demo: {
    title: 'Vite + Vue',
    countButton: 'count is',
    editMessage: 'Edit',
    editFile: 'components/HelloWorld.vue',
    editSuffix: 'to test HMR',
    checkOut: 'Check out',
    createVueLink: 'create-vue',
    createVueDescription: ', the official Vue + Vite starter',
    learnMore: 'Learn more about IDE Support for Vue in the',
    vueDocsLink: 'Vue Docs Scaling up Guide',
    clickLogos: 'Click on the Vite and Vue logos to learn more',
  },

  // 楽曲タイプラベル
  musicType: {
    original: 'オリジナル',
    mv3d: '3DMV',
    mv2d: '2DMV',
  },

  // ページネーション
  pagination: {
    pagePrefix: 'ページ',
    totalPrefix: '全',
    totalSuffix: '件',
    prev: '前へ',
    next: '次へ',
    pageLabel: 'ページ目',
  },

  // YouTubeモーダル
  youtubeModal: {
    title: 'YouTube動画',
    loadError: '動画を読み込めませんでした',
  },

  // ナビゲーション
  navigation: {
    musics: '楽曲管理',
    artists: 'アーティスト管理',
  },

  // アーティストテーブル
  artistTable: {
    id: 'ID',
    artistName: 'アーティスト名',
    unitName: 'ユニット名',
    content: 'コンテンツ',
    actions: 'アクション',
    noData: 'アーティストが登録されていません',
  },

  // アーティストフォーム
  artistForm: {
    createTitle: 'アーティスト新規登録',
    editTitle: 'アーティスト編集',
    artistName: 'アーティスト名',
    artistNamePlaceholder: 'アーティスト名を入力',
    artistNameRequired: 'アーティスト名は必須です',
    artistNameMaxLength: 'アーティスト名は50文字以内で入力してください',
    unitName: 'ユニット名',
    unitNamePlaceholder: 'ユニット名を入力（任意）',
    unitNameMaxLength: 'ユニット名は25文字以内で入力してください',
    content: 'コンテンツ',
    contentPlaceholder: 'コンテンツ名を入力（任意）',
    contentMaxLength: 'コンテンツ名は20文字以内で入力してください',
    submit: '保存',
    cancel: 'キャンセル',
    close: '閉じる',
  },

  // アーティストリストページ
  artistListPage: {
    deleteConfirmTitle: 'アーティスト削除',
    deleteConfirmMessage:
      'このアーティストを削除してもよろしいですか？削除すると楽曲から参照されているアーティストが不明なアーティストとして扱われます。',
    createSuccess: 'アーティストを登録しました',
    updateSuccess: 'アーティストを更新しました',
    deleteSuccess: 'アーティストを削除しました',
  },
} as const

export type TextKey = typeof TEXT
