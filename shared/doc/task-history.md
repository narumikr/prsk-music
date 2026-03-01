# タスク実施履歴

## プロジェクト概要

プロジェクトセカイ（プロセカ）の楽曲マスタデータとアーティストマスタデータを管理するWebアプリケーション。Vue 3、TypeScript、Tailwind CSSを使用し、既存のREST APIを利用してCRUD操作を提供する。

## 重要なドキュメント

次のタスクを実施する前に、以下のドキュメントを確認してください。

- **要件定義**: `.kiro/specs/prsk-music-management-web/requirements.md`
- **設計書**: `.kiro/specs/prsk-music-management-web/design.md`
- **タスク一覧**: `.kiro/specs/prsk-music-management-web/tasks.md`
- **UIガイドライン**: `.kiro/steering/ui-design-guidelines.md`
- **API仕様**: `shared/api/openapi.yaml`

## 現在の進捗状況

- ✅ タスク1: プロジェクトセットアップと基本構造の構築（完了）
- ✅ タスク2: 型定義とAPIクライアントの実装（完了）
- ✅ タスク3: Composablesの実装（完了）
- ✅ タスク4: 共通コンポーネントの実装（完了）
- ⏭️ タスク5: レイアウトコンポーネントの実装（次のタスク）

---

## 完了タスク

### タスク1: プロジェクトセットアップと基本構造の構築

**実施内容:**
- Viteプロジェクトの初期化（Vue 3 + TypeScript）
- 必要な依存関係のインストール
  - Vue Router v5
  - Tailwind CSS v4
  - Zod v4（バリデーション）
  - VeeValidate v4（フォーム管理）
  - Vitest v4（テストフレームワーク）
  - fast-check v4（Property-Based Testing）
  - Playwright v1（E2Eテスト）
  - MSW v2（APIモック）
- ディレクトリ構造の作成
  - `src/components/` - UIコンポーネント
  - `src/composables/` - Composition API hooks
  - `src/api/` - APIクライアント
  - `src/types/` - 型定義
  - `src/views/` - ページコンポーネント
- Tailwind CSSの設定完了

**対応要件:** 全要件

---

### タスク2: 型定義とAPIクライアントの実装

#### 2.1 型定義の作成

**実施内容:**
- ドメインモデル型の定義（`src/types/index.ts`）
  - `PrskMusic` - 楽曲データ型
  - `Artist` - アーティストデータ型
  - `MusicType` - 楽曲タイプ（0:オリジナル、1:3DMV、2:2DMV）
  - `AuditInfo` - 監査情報
  - `MUSIC_TYPE_LABELS` - 楽曲タイプのラベルマップ
- フォームデータ型の定義
  - `MusicFormData` - 楽曲フォーム入力型
  - `ArtistFormData` - アーティストフォーム入力型
- APIレスポンス型の定義
  - `PaginatedResponse<T>` - ページネーション付きレスポンス
  - `PaginationMeta` - ページネーションメタデータ
  - `ApiErrorResponse` - エラーレスポンス
  - `ErrorDetail` - エラー詳細

**対応要件:** 要件1, 要件9

#### 2.2 BaseApiClientのインターフェース定義

**実施内容:**
- `BaseApiClient`クラスの定義（`src/api/base.ts`）
  - メソッドシグネチャの実装
    - `get<T>()` - GETリクエスト
    - `post<T>()` - POSTリクエスト
    - `put<T>()` - PUTリクエスト
    - `delete<T>()` - DELETEリクエスト
  - 認証トークン管理のインターフェース
    - `setAuthToken()` - トークン設定（将来の認証対応）
  - 初期実装は空（`throw new Error('Not implemented')`）

**対応要件:** 要件2, 要件3, 要件4, 要件10, 要件11, 要件12

#### 2.4 BaseApiClientの実装

**実施内容:**
- 共通HTTPリクエストメソッドの実装
  - `request<T>()` - 共通リクエスト処理
  - ヘッダー管理（Content-Type、Authorization）
  - クエリパラメータの構築
  - レスポンスのJSON変換
  - 204 No Contentの処理
- 認証トークン管理機能の実装
  - `setAuthToken()` - トークンの設定/クリア
  - Authorizationヘッダーへの自動付与
- エラーハンドリングの実装
  - `ApiErrorResponse`クラス - APIエラーの表現
  - `parseBody()` - エラーレスポンスのパース
  - HTTPステータスコードの保持
- シングルトンインスタンスのエクスポート
  - `apiClient` - グローバルインスタンス

**対応要件:** 要件2, 要件3, 要件4, 要件10, 要件11, 要件12

#### 2.5 MusicApiClientのインターフェース定義

**実施内容:**
- `MusicApiClient`クラスの定義
  - メソッドシグネチャの実装
    - `getList()` - 楽曲一覧取得
    - `create()` - 楽曲登録
    - `update()` - 楽曲更新
    - `delete()` - 楽曲削除
  - 初期実装は空（`throw new Error('Not implemented')`）

**対応要件:** 要件1, 要件2, 要件3, 要件4

#### 2.6 ArtistApiClientのインターフェース定義

**実施内容:**
- `ArtistApiClient`クラスの定義
  - メソッドシグネチャの実装
    - `getList()` - アーティスト一覧取得
    - `create()` - アーティスト登録
    - `update()` - アーティスト更新
    - `delete()` - アーティスト削除
  - 初期実装は空（`throw new Error('Not implemented')`）

**対応要件:** 要件9, 要件10, 要件11, 要件12

#### 2.7 MusicApiClientとArtistApiClientの実装

**実施内容:**
- `MusicApiClient`の実装
  - `BaseApiClient`を使用した各メソッドの実装
  - エンドポイント: `/prsk-music`
  - ページネーション対応（page, limit）
  - CRUD操作の完全実装
- `ArtistApiClient`の実装
  - `BaseApiClient`を使用した各メソッドの実装
  - エンドポイント: `/artists`
  - ページネーション対応（page, limit）
  - CRUD操作の完全実装
- シングルトンインスタンスのエクスポート
  - `musicApiClient` - 楽曲APIクライアント
  - `artistApiClient` - アーティストAPIクライアント

**対応要件:** 要件1, 要件2, 要件3, 要件4, 要件9, 要件10, 要件11, 要件12

#### 2.8 ApiErrorHandlerのインターフェース定義とテスト作成

**実施内容:**
- `ApiErrorHandler`クラスの定義
  - メソッドシグネチャの実装
    - `getErrorMessage()` - エラーメッセージ生成
  - 初期実装は空（`throw new Error('Not implemented')`）
- Unit Testの作成（`src/api/base.test.ts`）
  - 各HTTPステータスコードのエラーメッセージ確認
  - テストは失敗する状態（Red）

**対応要件:** 要件6

#### 2.9 ApiErrorHandlerの実装

**実施内容:**
- ステータスコード別エラーメッセージ生成の実装
  - 400: リクエストが無効です
  - 401: 認証が必要です。ログインしてください
  - 403: この操作を実行する権限がありません
  - 404: 指定されたレコードが見つかりません
  - 409: 重複するデータが存在します
  - 500: サーバーエラーが発生しました
  - 503: サービスがメンテナンス中です
  - default: エラーが発生しました
- APIレスポンスのmessageフィールドの活用
- すべてのUnit Testがパスすることを確認（Green）

**対応要件:** 要件6

---

### タスク3: Composablesの実装

#### 3.1 useMusicListのインターフェース定義

**実施内容:**
- `src/composables/index.ts`にuseMusicListのインターフェース定義を追加
- `UseMusicListReturn`型の定義
  - `musics: Ref<PrskMusic[]>` - 楽曲一覧の状態
  - `loading: Ref<boolean>` - ローディング状態
  - `error: Ref<Error | null>` - エラー状態
  - `pagination: Ref<PaginationMeta>` - ページネーション情報
  - `fetchMusics(page: number): Promise<void>` - 楽曲一覧取得
  - `createMusic(data: MusicFormData): Promise<void>` - 楽曲作成
  - `updateMusic(id: number, data: MusicFormData): Promise<void>` - 楽曲更新
  - `deleteMusic(id: number): Promise<void>` - 楽曲削除
- `useMusicList()`関数のシグネチャ定義（実装は空、`throw new Error('Not implemented')`）
- 型安全性を確保するためVueの`Ref`型をインポート
- 既存の型定義（`PrskMusic`、`MusicFormData`、`PaginationMeta`）を活用

**対応要件:** 要件1, 要件2, 要件3, 要件4, 要件5

#### 3.2 useMusicListのProperty Test作成

**実施内容:**
- `src/composables/index.test.ts`にProperty Testを作成
- **Property 12: ページ番号クリック時のデータ取得**のテスト実装
  - 任意のページ番号に対して対応するページの楽曲レコードが取得されることを検証
  - fast-checkを使用して100回の反復テスト
  - MSWでAPIをモック
- テストは失敗する状態（Red）で作成完了

**対応要件:** 要件5

#### 3.3 useMusicListの実装

**実施内容:**
- `src/composables/index.ts`にuseMusicListの完全な実装を追加
- 状態管理の実装
  - `musics: Ref<PrskMusic[]>` - 楽曲一覧
  - `loading: Ref<boolean>` - ローディング状態
  - `error: Ref<Error | null>` - エラー状態
  - `pagination: Ref<PaginationMeta>` - ページネーション情報
- メソッドの実装
  - `fetchMusics(page)` - 楽曲一覧取得（ページネーション対応）
  - `createMusic(data)` - 楽曲作成（作成後に現在ページを再取得）
  - `updateMusic(id, data)` - 楽曲更新（更新後に現在ページを再取得）
  - `deleteMusic(id)` - 楽曲削除（削除後に現在ページを再取得）
- エラーハンドリングの実装
  - try-catch-finallyでエラーを捕捉
  - エラー状態の更新
  - ローディング状態の適切な管理
- すべてのProperty Testがパス（Green）
- 型チェックもパス

**対応要件:** 要件1, 要件2, 要件3, 要件4, 要件5

#### 3.4 useArtistListのインターフェース定義

**実施内容:**
- `src/composables/index.ts`にuseArtistListのインターフェース定義を追加
- `UseArtistListReturn`型の定義
  - `artists: Ref<Artist[]>` - アーティスト一覧の状態
  - `loading: Ref<boolean>` - ローディング状態
  - `error: Ref<Error | null>` - エラー状態
  - `pagination: Ref<PaginationMeta>` - ページネーション情報
  - `fetchArtists(page: number): Promise<void>` - アーティスト一覧取得
  - `createArtist(data: ArtistFormData): Promise<void>` - アーティスト作成
  - `updateArtist(id: number, data: ArtistFormData): Promise<void>` - アーティスト更新
  - `deleteArtist(id: number): Promise<void>` - アーティスト削除
- `useArtistList()`関数のシグネチャ定義（実装は空、`throw new Error('Not implemented')`）
- 型安全性を確保するためVueの`Ref`型をインポート
- 既存の型定義（`Artist`、`ArtistFormData`、`PaginationMeta`）を活用
- 型チェックがパスすることを確認

**対応要件:** 要件9, 要件10, 要件11, 要件12

#### 3.5 useArtistListのProperty Test作成

**実施内容:**
- `src/composables/index.test.ts`にuseArtistListのProperty Testを追加
- アーティスト一覧取得のProperty Test実装
  - 任意のページ番号に対して対応するページのアーティストレコードが取得されることを検証
  - fast-checkを使用して100回の反復テスト
  - MSWでAPIをモック（`/api/v1/artists`エンドポイント）
- テスト用ヘルパー関数の追加
  - `buildArtistResponse()` - テスト用アーティストデータ生成
- テストは失敗する状態（Red）で作成完了
  - エラー: "Error: Not implemented"（useArtistListが未実装のため）

**対応要件:** 要件9

#### 3.6 useArtistListの実装

**実施内容:**
- `src/composables/index.ts`にuseArtistListの完全な実装を追加
- 状態管理の実装
  - `artists: Ref<Artist[]>` - アーティスト一覧
  - `loading: Ref<boolean>` - ローディング状態
  - `error: Ref<Error | null>` - エラー状態
  - `pagination: Ref<PaginationMeta>` - ページネーション情報
- メソッドの実装
  - `fetchArtists(page)` - アーティスト一覧取得（ページネーション対応）
  - `createArtist(data)` - アーティスト作成（作成後に現在ページを再取得）
  - `updateArtist(id, data)` - アーティスト更新（更新後に現在ページを再取得）
  - `deleteArtist(id)` - アーティスト削除（削除後に現在ページを再取得）
- エラーハンドリングの実装
  - try-catch-finallyでエラーを捕捉
  - エラー状態の更新
  - ローディング状態の適切な管理
- `artistApiClient`をインポートして使用
- すべてのProperty Testがパス（Green）
- 型チェックもパス

**対応要件:** 要件9, 要件10, 要件11, 要件12

#### 3.7 useNotificationのインターフェース定義

**実施内容:**
- `src/composables/useNotification.ts`を新規作成
- `UseNotificationReturn`型の定義
  - `showSuccess: (message: string) => void` - 成功メッセージ表示
  - `showError: (message: string) => void` - エラーメッセージ表示
  - `showInfo: (message: string) => void` - 情報メッセージ表示
- `useNotification()`関数のシグネチャ定義（実装は空、`throw new Error('Not implemented')`）
- `src/composables/index.ts`にuseNotificationをエクスポート追加
- 型チェックがパスすることを確認

**対応要件:** 要件2, 要件3, 要件4, 要件6

#### 3.8 useNotificationのProperty Test作成

**実施内容:**
- `src/composables/useNotification.test.ts`を新規作成
- **Property 14: エラー詳細の表示**のテスト実装
  - 任意のAPIエラーレスポンスに対してエラー詳細がユーザーに表示されることを検証
  - fast-checkを使用して100回の反復テスト
  - HTTPステータスコード（400, 404, 409, 500, 503）とエラーメッセージの組み合わせをテスト
- **Property 15: エラーのコンソールログ出力**のテスト実装
  - 任意のエラー発生時にコンソールにログ出力されることを検証
  - fast-checkを使用して100回の反復テスト
  - console.errorのスパイを設定
- Property 14 & 15の統合テスト
  - エラー詳細の表示とコンソールログ出力が同時に行われることを確認
- 追加テスト
  - 成功メッセージの表示テスト（showSuccess）
  - 情報メッセージの表示テスト（showInfo）
- テストヘルパー関数の実装
  - `createMockResponse()` - モックResponseオブジェクト作成
  - `createApiError()` - ApiErrorResponse作成
- テストは失敗する状態（Red）で作成完了
  - エラー: "Error: Not implemented"（useNotificationが未実装のため）

**対応要件:** 要件6

#### 3.9 useNotificationの実装

**実施内容:**
- `src/composables/useNotification.ts`にuseNotificationの完全な実装を追加
- メソッドの実装
  - `showSuccess(message)` - 成功メッセージ表示
    - console.logでログ出力
    - 将来のUI通知コンポーネント対応のためのTODOコメント追加
  - `showError(message)` - エラーメッセージ表示
    - console.errorでエラーログ出力（要件6.5対応）
    - 将来のUI通知コンポーネント対応のためのTODOコメント追加
  - `showInfo(message)` - 情報メッセージ表示
    - console.logでログ出力
    - 将来のUI通知コンポーネント対応のためのTODOコメント追加
- すべてのProperty Testがパス（Green）
  - Property 14: APIエラーレスポンスのエラー詳細がユーザーに表示される
  - Property 15: エラー発生時にコンソールにログ出力される
  - Property 14 & 15の統合テスト
  - 成功メッセージ表示テスト
  - 情報メッセージ表示テスト
- 型チェックもパス

**対応要件:** 要件2, 要件3, 要件4, 要件6

---

#### 4.1 LoadingSpinner.vueのスケルトン作成

**実施内容:**
- `src/components/LoadingSpinner.vue`を新規作成
- `LoadingSpinnerProps`インターフェースの定義
  - `size?: 'small' | 'medium' | 'large'` - スピナーのサイズ（デフォルト: 'medium'）
- `withDefaults`を使用してデフォルト値を設定
- テンプレートは空の`<div></div>`（スケルトン）
- 次のタスク（4.2）でProperty Testを作成予定

**対応要件:** 要件7

---

#### 4.2 LoadingSpinnerのProperty Test作成

**実施内容:**
- `src/components/LoadingSpinner.test.ts`を新規作成
- **Property 16: 非同期操作中のローディング表示**のテスト実装
  - 任意の非同期操作（フォーム送信またはデータ取得）中にローディングインジケーターが表示されることを検証
  - サイズバリエーション（small, medium, large）のテスト
  - fast-checkを使用して100回の反復テスト
  - 非同期操作の遅延時間（1-50ms）をランダムに生成してテスト
- **Property 16 (補足): サイズバリエーションの検証**
  - 任意のサイズに対して適切なローディングインジケーターが表示されることを検証
  - サイズに応じたクラス（w-4/h-4, w-8/h-8, w-12/h-12）の適用を確認
- **Property 16 (補足): デフォルトサイズの検証**
  - sizeプロパティが指定されていない場合、mediumサイズが適用されることを検証
- テストは失敗する状態（Red）で作成完了
  - エラー: `expected false to be true` - `[data-testid="loading-spinner"]`が存在しない（スケルトン実装のため）
- 次のタスク（4.3）で実装を行い、テストをパスさせる予定

**対応要件:** 要件7

#### 4.3 LoadingSpinner.vueの実装

**実施内容:**
- `src/components/LoadingSpinner.vue`の完全な実装
- サイズバリエーション（small、medium、large）の実装
  - small: w-4 h-4 border-2
  - medium: w-8 h-8 border-2（デフォルト）
  - large: w-12 h-12 border-4
- UIガイドラインに従ったデザイン
  - Primaryカラー（#33ccba）をアクセントとして使用
  - グレー（gray-200）をベースカラーとして使用
  - シンプルで控えめなスピナーデザイン
- アクセシビリティ対応
  - `role="status"` 属性の追加
  - `aria-label="読み込み中"` 属性の追加
  - `data-testid="loading-spinner"` 属性の追加
- すべてのProperty Testがパス（Green）
  - Property 16: 任意の非同期操作中にローディングインジケーターが表示される（100回反復）
  - Property 16（補足）: 任意のサイズに対して適切なローディングインジケーターが表示される（100回反復）
  - Property 16（補足）: sizeプロパティが指定されていない場合はmediumサイズが適用される
- 型チェックもパス

**対応要件:** 要件7

#### 4.4 PaginationControl.vueのスケルトン作成

**実施内容:**
- `src/components/PaginationControl.vue`を新規作成
- `PaginationControlProps`インターフェースの定義
  - `currentPage: number` - 現在のページ番号
  - `totalPages: number` - 総ページ数
  - `totalItems: number` - 総アイテム数
- `PaginationControlEmits`インターフェースの定義
  - `page-change` - ページ変更イベント（ページ番号を引数として渡す）
- `defineProps`と`defineEmits`を使用した型安全なprops/emits定義
- テンプレートは空の`<div></div>`（スケルトン）
- 型チェックがパスすることを確認
- 次のタスク（4.5）でUnit Testを作成予定

**対応要件:** 要件1, 要件5, 要件9

#### 4.5 PaginationControlのUnit Test作成

**実施内容:**
- `src/components/PaginationControl.test.ts`を新規作成
- Unit Testの実装
  - 20件以下でページネーション非表示のテスト
  - 21件以上でページネーション表示のテスト
  - 最初のページで「前へ」ボタン無効化のテスト
  - 最後のページで「次へ」ボタン無効化のテスト
  - 中間ページで「前へ」「次へ」ボタンが有効のテスト
  - ページ情報が正しく表示されるテスト
  - 「前へ」ボタンクリックでpage-changeイベント発火のテスト
  - 「次へ」ボタンクリックでpage-changeイベント発火のテスト
  - ページ番号リンククリックでpage-changeイベント発火のテスト
  - 現在のページ番号がハイライト表示されるテスト
- テストは失敗する状態（Red）で作成完了
  - 9件のテストが失敗（期待通り）
  - 1件のテスト（20件以下でページネーション非表示）がパス（スケルトンが空のdivのため）
- 次のタスク（4.6）でProperty Testを作成予定

**対応要件:** 要件1, 要件5, 要件9

#### 4.6 PaginationControlのProperty Test作成

**実施内容:**
- `src/components/PaginationControl.test.ts`にProperty Testを追加
- **Property 11: ページネーションメタデータの表示**のテスト実装
  - 任意のページネーションメタデータ（currentPage、totalPages、totalItems）に対して正しく表示されることを検証
  - fast-checkを使用して100回の反復テスト
  - currentPageがtotalPagesを超えないように調整
  - ページ情報要素（`[data-testid="page-info"]`）に各値が含まれることを確認
- **Property 13: 20件超でのページネーション表示**のテスト実装
  - 任意のアイテム数（21-1000件）に対してページネーションが表示されることを検証
  - fast-checkを使用して100回の反復テスト
  - 1ページあたり20件として総ページ数を自動計算
  - ページネーション要素（`[data-testid="pagination"]`）が存在することを確認
- **Property 13（補足）: 20件以下でのページネーション非表示**のテスト実装
  - 任意のアイテム数（1-20件）に対してページネーションが非表示になることを検証
  - fast-checkを使用して100回の反復テスト
- テストは失敗する状態（Red）で作成完了
  - Property 11: 失敗（`[data-testid="page-info"]`が存在しない）
  - Property 13: 失敗（`[data-testid="pagination"]`が存在しない）
  - Property 13（補足）: パス（スケルトンが空のdivのため）
- 次のタスク（4.7）で実装を行い、すべてのテストをパスさせる予定

**対応要件:** 要件1, 要件5, 要件9

#### 4.7 PaginationControl.vueの実装

**実施内容:**
- `src/components/PaginationControl.vue`の完全な実装
- ページネーション表示条件の実装
  - 20件以下の場合は非表示（`shouldShowPagination` computed）
  - 21件以上の場合は表示
- ページ情報表示の実装
  - 現在のページ番号、総ページ数、総アイテム数を表示
  - フォーマット: 「ページ X / Y （全 Z 件）」
- 前へ・次へボタンの実装
  - 最初のページで「前へ」ボタンを無効化
  - 最後のページで「次へ」ボタンを無効化
  - クリック時に`page-change`イベントを発火
- ページ番号リンクの実装
  - 全ページ番号をボタンとして表示
  - クリック時に`page-change`イベントを発火
  - 現在のページ番号をハイライト表示（Primaryカラー）
- UIガイドラインに従ったデザイン
  - Primaryカラー（#33ccba）をアクセントとして使用
  - グレー（gray-200）をボーダーに使用
  - ホバー時にPrimaryカラーのborderとテキストカラーを適用
  - 無効状態は透明度50%、cursor-not-allowed
- すべてのUnit TestとProperty Testがパス（Green）
  - Unit Test: 10件すべてパス
  - Property 11: 任意のページネーションメタデータが正しく表示される（100回反復）
  - Property 13: 任意のアイテム数が20件を超える場合にページネーションが表示される（100回反復）
  - Property 13（補足）: 任意のアイテム数が20件以下の場合にページネーションが非表示（100回反復）
- Property 11のテスト修正
  - totalItemsを21件以上に制限（ページネーションが表示される条件を満たすため）
- 型チェックもパス

**対応要件:** 要件1, 要件5, 要件9

#### 4.8 ConfirmDialog.vueのスケルトン作成

**実施内容:**
- `src/components/ConfirmDialog.vue`を新規作成
- `ConfirmDialogProps`インターフェースの定義
  - `open: boolean` - ダイアログの表示/非表示
  - `title: string` - ダイアログのタイトル
  - `message: string` - 確認メッセージ
- `ConfirmDialogEmits`インターフェースの定義
  - `confirm` - 確認ボタンクリック時のイベント
  - `cancel` - キャンセルボタンクリック時のイベント
- `defineProps`と`defineEmits`を使用した型安全なprops/emits定義
- テンプレートは空の`<div></div>`（スケルトン）
- 型チェックがパスすることを確認
- 次のタスク（4.9）でUnit Testを作成予定

**対応要件:** 要件4, 要件12

#### 4.9 ConfirmDialog.vueのUnit Test作成

**実施内容:**
- `src/components/ConfirmDialog.test.ts`を新規作成
- Unit Testの実装（11件のテストケース）
  - 確認ダイアログ表示のテスト（open=trueで表示、open=falseで非表示）
  - タイトル表示のテスト
  - メッセージ表示のテスト
  - 確認ボタン表示のテスト
  - キャンセルボタン表示のテスト
  - 確認ボタンクリック時のconfirmイベント発火のテスト
  - キャンセルボタンクリック時のcancelイベント発火のテスト
  - 背景オーバーレイクリック時のcancelイベント発火のテスト
  - Escapeキー押下時のcancelイベント発火のテスト
  - アーティスト削除時の警告メッセージ表示のテスト
- アクセシビリティ対応の確認
  - `role="dialog"`属性の確認
  - `data-testid`属性の設定
- テストは失敗する状態（Red）で作成完了
  - 10件のテストが失敗（期待通り）
  - 1件のテスト（open=falseで非表示）がパス（スケルトンが空のdivのため）
- 次のタスク（4.10）で実装を行い、すべてのテストをパスさせる予定

**対応要件:** 要件4, 要件12

#### 4.10 ConfirmDialog.vueの実装

**実施内容:**
- `src/components/ConfirmDialog.vue`の完全な実装
- ダイアログ表示条件の実装
  - `open`プロパティがtrueの場合のみ表示
  - v-ifディレクティブで条件付きレンダリング
- ダイアログコンテンツの実装
  - タイトル表示（`dialog-title`）
  - メッセージ表示（`dialog-message`）
  - 確認ボタン（`confirm-button`）
  - キャンセルボタン（`cancel-button`）
- イベントハンドリングの実装
  - 確認ボタンクリック時に`confirm`イベント発火
  - キャンセルボタンクリック時に`cancel`イベント発火
  - 背景オーバーレイクリック時に`cancel`イベント発火
  - Escapeキー押下時に`cancel`イベント発火
- Escapeキーリスナーの管理
  - `watch`でダイアログの開閉を監視
  - 開いているときにkeydownリスナーを追加
  - 閉じているときにリスナーを削除
  - `onUnmounted`でクリーンアップ
- UIガイドラインに従ったデザイン
  - Errorカラー（#ff6699）を確認ボタンに使用
  - グレー（gray-200）をボーダーに使用
  - ホバー時に透明度80%を適用
  - シンプルで控えめなモーダルデザイン
  - 背景オーバーレイ（黒、透明度50%）
- アクセシビリティ対応
  - `role="dialog"` 属性の追加
  - `aria-modal="true"` 属性の追加
  - `data-testid`属性の追加（テスト用）
- コーディング規約への準拠
  - UI表示テキストを`src/constants/text.ts`に追加
  - `TEXT.confirmDialog.cancel`と`TEXT.confirmDialog.delete`を使用
  - リテラル文字列を直接記述せず、定数から参照
- すべてのUnit Testがパス（Green）
  - 11件のテストすべてがパス
- 型チェックもパス

**対応要件:** 要件4, 要件12

#### 4.11 YouTubeModal.vueのスケルトン作成

**実施内容:**
- `src/components/YouTubeModal.vue`を新規作成
- `YouTubeModalProps`インターフェースの定義
  - `open: boolean` - モーダルの表示/非表示
  - `videoUrl: string` - YouTube動画のURL
- `YouTubeModalEmits`インターフェースの定義
  - `close` - モーダルを閉じるイベント
- `defineProps`と`defineEmits`を使用した型安全なprops/emits定義
- テンプレートは空の`<div></div>`（スケルトン）
- 型チェックがパスすることを確認
- 次のタスク（4.12）でUnit Testを作成予定

**対応要件:** 要件1

#### 4.12 YouTubeModal.vueのUnit Test作成

**実施内容:**
- `src/components/YouTubeModal.test.ts`を新規作成
- Unit Testの実装（12件のテストケース）
  - モーダル表示のテスト（open=trueで表示、open=falseで非表示）
  - YouTube動画埋め込みのテスト（iframeの存在確認）
  - URLから動画ID抽出のテスト
    - 標準形式: `https://www.youtube.com/watch?v=VIDEO_ID`
    - 短縮形式: `https://youtu.be/VIDEO_ID`
    - 埋め込み形式: `https://www.youtube.com/embed/VIDEO_ID`
  - 閉じるボタン表示のテスト
  - 閉じるボタンクリック時のcloseイベント発火のテスト
  - 背景オーバーレイクリック時のcloseイベント発火のテスト
  - Escapeキー押下時のcloseイベント発火のテスト
  - iframeの適切な属性設定のテスト（allow、allowfullscreen）
  - 無効なURLの場合のエラーハンドリングのテスト
- アクセシビリティ対応の確認
  - `role="dialog"`属性の確認
  - `data-testid`属性の設定
- テストは失敗する状態（Red）で作成完了
  - 11件のテストが失敗（期待通り）
  - 1件のテスト（open=falseで非表示）がパス（スケルトンが空のdivのため）
- 次のタスク（4.13）で実装を行い、すべてのテストをパスさせる予定

**対応要件:** 要件1

#### 4.13 YouTubeModal.vueの実装

**実施内容:**
- `src/components/YouTubeModal.vue`の完全な実装
- YouTube動画ID抽出機能の実装
  - `extractVideoId()` - URLから動画IDを抽出
  - 標準形式（`watch?v=`）、短縮形式（`youtu.be/`）、埋め込み形式（`embed/`）に対応
  - 正規表現を使用した柔軟なパース処理
- YouTube埋め込みURL生成の実装
  - `embedUrl` computed - 動画IDから埋め込みURLを生成
  - 無効なURLの場合は空文字列を返す
- モーダル表示条件の実装
  - `open`プロパティがtrueの場合のみ表示
  - v-ifディレクティブで条件付きレンダリング
- モーダルコンテンツの実装
  - ヘッダー（タイトル + 閉じるボタン）
  - YouTube動画埋め込みエリア（16:9アスペクト比）
  - エラーメッセージ表示（無効なURLの場合）
- イベントハンドリングの実装
  - 閉じるボタンクリック時に`close`イベント発火
  - 背景オーバーレイクリック時に`close`イベント発火
  - Escapeキー押下時に`close`イベント発火
- Escapeキーリスナーの管理
  - `watch`でモーダルの開閉を監視
  - 開いているときにkeydownリスナーを追加
  - 閉じているときにリスナーを削除
  - `onUnmounted`でクリーンアップ
- UIガイドラインに従ったデザイン
  - グレー（gray-200）をボーダーに使用
  - シンプルで控えめなモーダルデザイン
  - 背景オーバーレイ（黒、透明度50%）
  - レスポンシブ対応（max-w-4xl、mx-4）
- アクセシビリティ対応
  - `role="dialog"` 属性の追加
  - `aria-modal="true"` 属性の追加
  - `data-testid`属性の追加（テスト用）
- コーディング規約への準拠
  - UI表示テキストを`src/constants/text.ts`に追加
  - `TEXT.youtubeModal.title`と`TEXT.youtubeModal.loadError`を使用
  - リテラル文字列を直接記述せず、定数から参照
- すべてのUnit Testがパス（Green）
  - 12件のテストすべてがパス
- 型チェックもパス

**対応要件:** 要件1

---

#### 5.1 Navigation.vueのスケルトン作成

**実施内容:**
- `src/components/Navigation.vue`を新規作成
- `NavigationProps`インターフェースの定義
  - `currentPath: string` - 現在のパス
- `defineProps`を使用した型安全なprops定義
- テンプレートは空の`<nav></nav>`（スケルトン）
- TypeScriptの型チェックがパスすることを確認

**対応要件:** 要件13

#### 5.2 NavigationのProperty Test作成

**実施内容:**
- `src/components/Navigation.test.ts`を新規作成
- **Property 35: ナビゲーションメニューの現在ページ表示**のテスト実装
  - 任意のページ（/musics、/artists）に対して現在表示中のページが視覚的に示されることを検証
  - fast-checkを使用して100回の反復テスト
  - 現在のページに対応するリンクがハイライト表示されることを確認（border-primaryクラス）
- **Property 36: 全ページでのナビゲーションメニュー表示**のテスト実装
  - 任意のページに対して一貫したナビゲーションメニューが表示されることを検証
  - fast-checkを使用して100回の反復テスト
  - 楽曲管理リンクとアーティスト管理リンクが常に表示されることを確認
- **Property 36（補足）: ナビゲーションメニューのリンクテキスト表示**のテスト実装
  - 任意のページに対してナビゲーションメニューに適切なリンクテキストが表示されることを検証
  - 「楽曲管理」と「アーティスト管理」のテキストが表示されることを確認
- テストは失敗する状態（Red）で作成完了
  - 3件のテストすべてが失敗（期待通り）
  - Property 35: `[data-testid="navigation"]`が存在しない
  - Property 36: `[data-testid="nav-link-musics"]`が存在しない
  - Property 36（補足）: ナビゲーションメニューのテキストが空
- 次のタスク（5.3）で実装を行い、すべてのテストをパスさせる予定

**対応要件:** 要件13

#### 5.3 Navigation.vueの実装

**実施内容:**
- `src/components/Navigation.vue`の完全な実装
- UI表示テキストの定数化
  - `src/constants/text.ts`に`navigation`カテゴリを追加
  - `musics`: '楽曲管理'
  - `artists`: 'アーティスト管理'
- ナビゲーションメニューの実装
  - 楽曲管理リンク（`/musics`）
  - アーティスト管理リンク（`/artists`）
  - 各リンクに`data-testid`属性を追加（テスト用）
- 現在のページのハイライト表示の実装
  - `isActive(path)`関数で現在のパスを判定
  - アクティブなリンクにPrimaryカラー（#33ccba）のborderとテキストカラーを適用
  - 非アクティブなリンクはグレー（gray-600）で表示
- UIガイドラインに従ったデザイン
  - Primaryカラー（#33ccba）をアクセントとして使用
  - グレー（gray-200）をボーダーに使用
  - ホバー時にグレー（gray-300）のborderとテキストカラー（gray-900）を適用
  - トランジション（150ms ease-in-out）を追加
- レスポンシブ対応
  - 最大幅720pxのコンテナ（max-w-screen-lg）
  - 左右パディング16px（px-4）
- アクセシビリティ対応
  - `data-testid`属性の追加（テスト用）
  - セマンティックなHTML（`<nav>`タグ）
- すべてのProperty Testがパス（Green）
  - Property 35: 任意のページに対して現在表示中のページが視覚的に示される（100回反復）
  - Property 36: 任意のページに対して一貫したナビゲーションメニューが表示される（100回反復）
  - Property 36（補足）: 任意のページに対してナビゲーションメニューに適切なリンクテキストが表示される（100回反復）
- 型チェックもパス

**対応要件:** 要件13

---

#### 5.4 Layout.vueのスケルトン作成

**実施内容:**
- `src/components/Layout.vue`を新規作成
- テンプレートは空の`<div></div>`（スケルトン）
- TypeScriptの型チェックがパスすることを確認
- 次のタスク（5.5）でUnit Testを作成予定

**対応要件:** 要件13

#### 5.5 Layout.vueのUnit Test作成

**実施内容:**
- `src/components/Layout.test.ts`を新規作成
- Unit Testの実装（7件のテストケース）
  - ヘッダー表示のテスト
  - ナビゲーション表示のテスト
  - router-view配置のテスト
  - メインコンテンツエリア表示のテスト
  - レイアウト構造の順序テスト（ヘッダー→メインコンテンツ）
  - NavigationコンポーネントへのcurrentPath props渡しのテスト
  - レスポンシブレイアウトのテスト
- テストは失敗する状態（Red）で作成完了
  - 7件のテストすべてが失敗（期待通り）
  - `[data-testid="layout-header"]`が存在しない
  - Navigationコンポーネントが存在しない
  - `[data-testid="layout-content"]`が存在しない
  - `<main>`要素が存在しない
- 次のタスク（5.6）で実装を行い、すべてのテストをパスさせる予定

**対応要件:** 要件13

#### 5.6 Layout.vueの実装

**実施内容:**
- `src/components/Layout.vue`の完全な実装
- ヘッダー（Navigationコンポーネント含む）の実装
  - `data-testid="layout-header"`属性の追加
  - 白背景とグレーのボーダー（`bg-white border-b border-gray-200`）
- メインコンテンツエリア（`<router-view>`）の実装
  - `<main>`タグでセマンティックなHTML構造
  - 最大幅720px（`max-w-screen-lg`）のレスポンシブレイアウト
  - 左右パディング16px（`px-4`）、上下パディング24px（`py-6`）
  - `data-testid="layout-content"`属性の追加
- Vue Routerとの統合
  - `useRoute()`で現在のルートパスを取得
  - `computed`でcurrentPathを算出
  - NavigationコンポーネントにcurrentPathをpropsとして渡す
- UIガイドラインに従ったデザイン
  - 背景色: `bg-gray-50`（全体）
  - 最小高さ: `min-h-screen`
  - シンプルで控えめなレイアウト
- テストファイルの修正
  - `src/components/Layout.test.ts`にVue Routerのセットアップを追加
  - `createRouter`と`createMemoryHistory`を使用
  - すべてのテストケースに`async/await`とrouter初期化を追加
- すべてのUnit Testがパス（Green）
  - 7件のテストすべてがパス

**対応要件:** 要件13

---

## 次のタスク

### タスク6: アーティスト管理コンポーネントの実装

**次のタスク: 6.1 ArtistTable.vueのスケルトン作成**

**実装予定のコンポーネント:**
- `ArtistTable.vue` - アーティスト一覧テーブル
- `ArtistFormModal.vue` - アーティスト登録・編集フォーム
- `ArtistListPage.vue` - アーティスト一覧ページ

**実装ファイル:**
- `src/components/` - コンポーネントの実装先
- `src/views/` - ページコンポーネントの実装先

**参考:**
- 設計書の「Artist Management Components」セクションを参照
- UIガイドライン（`.kiro/steering/ui-design-guidelines.md`）に従う

---

## 実装済みファイル一覧

以下のファイルが既に実装されており、次のタスクで利用可能です。

### 型定義
- `src/types/index.ts`
  - ドメインモデル型（PrskMusic、Artist、MusicType、AuditInfo）
  - フォームデータ型（MusicFormData、ArtistFormData）
  - APIレスポンス型（PaginatedResponse、PaginationMeta、ApiError）

### APIクライアント
- `src/api/base.ts`
  - `BaseApiClient` - 共通HTTPリクエストメソッド
  - `ApiErrorResponse` - APIエラークラス
  - `getApiErrorMessage` - エラーメッセージ生成
  - シングルトンインスタンス（`apiClient`）
- `src/api/music.ts`
  - `MusicApiClient` - 楽曲API（getList、create、update、delete）
  - シングルトンインスタンス（`musicApiClient`）
- `src/api/artist.ts`
  - `ArtistApiClient` - アーティストAPI（getList、create、update、delete）
  - シングルトンインスタンス（`artistApiClient`）
- `src/api/index.ts` - 上記のre-export

### Composables
- `src/composables/useMusicList.ts`
  - `UseMusicListReturn` - useMusicListの戻り値型定義
  - `useMusicList()` - 楽曲一覧の状態管理（実装済み）
- `src/composables/useArtistList.ts`
  - `UseArtistListReturn` - useArtistListの戻り値型定義
  - `useArtistList()` - アーティスト一覧の状態管理（実装済み）
- `src/composables/useNotification.ts`
  - `UseNotificationReturn` - useNotificationの戻り値型定義
  - `useNotification()` - 通知メッセージの管理（実装済み）
- `src/composables/index.ts` - 上記のre-export

### 定数
- `src/constants/text.ts`
  - `TEXT` - UI表示テキスト定義
  - `common` - 共通テキスト（ボタンラベル、メッセージなど）
  - `confirmDialog` - 確認ダイアログテキスト（キャンセル、削除）
  - `youtubeModal` - YouTubeモーダルテキスト（タイトル、読み込みエラー）
  - `navigation` - ナビゲーションテキスト（楽曲管理、アーティスト管理）
  - `validation` - バリデーションメッセージ
  - `error` - エラーメッセージ
  - `apiError` - APIエラーメッセージ
  - `demo` - デモ用テキスト
  - `musicType` - 楽曲タイプラベル

### コンポーネント
- `src/components/LoadingSpinner.vue`
  - `LoadingSpinnerProps` - propsの型定義（size: 'small' | 'medium' | 'large'）
  - サイズバリエーション実装（small: 16px、medium: 32px、large: 48px）
  - Primaryカラー（#33ccba）を使用したスピナーアニメーション
  - アクセシビリティ対応（role="status"、aria-label）
- `src/components/PaginationControl.vue`
  - `PaginationControlProps` - propsの型定義（currentPage、totalPages、totalItems）
  - `PaginationControlEmits` - emitsの型定義（page-change）
  - ページネーション表示条件（20件以下は非表示、21件以上は表示）
  - ページ情報表示（現在ページ/総ページ数、総アイテム数）
  - 前へ・次へボタン（最初/最後のページで無効化）
  - ページ番号リンク（現在ページをハイライト表示）
  - Primaryカラー（#33ccba）をアクセントとして使用
- `src/components/ConfirmDialog.vue`
  - `ConfirmDialogProps` - propsの型定義（open、title、message）
  - `ConfirmDialogEmits` - emitsの型定義（confirm、cancel）
  - ダイアログ表示条件（openプロパティで制御）
  - タイトル、メッセージ、確認・キャンセルボタンの実装
  - イベントハンドリング（確認、キャンセル、背景クリック、Escapeキー）
  - Errorカラー（#ff6699）を確認ボタンに使用
  - アクセシビリティ対応（role="dialog"、aria-modal）
  - UI表示テキストを定数から参照（TEXT.confirmDialog）
- `src/components/YouTubeModal.vue`
  - `YouTubeModalProps` - propsの型定義（open、videoUrl）
  - `YouTubeModalEmits` - emitsの型定義（close）
  - YouTube動画ID抽出機能（標準形式、短縮形式、埋め込み形式に対応）
  - YouTube埋め込みURL生成（embedUrl computed）
  - モーダル表示条件（openプロパティで制御）
  - YouTube動画埋め込みエリア（16:9アスペクト比）
  - エラーメッセージ表示（無効なURLの場合）
  - イベントハンドリング（閉じるボタン、背景クリック、Escapeキー）
  - Escapeキーリスナーの管理（watch、onUnmounted）
  - アクセシビリティ対応（role="dialog"、aria-modal）
  - UI表示テキストを定数から参照（TEXT.youtubeModal）
- `src/components/Navigation.vue`
  - `NavigationProps` - propsの型定義（currentPath）
  - ナビゲーションメニュー実装（楽曲管理、アーティスト管理）
  - 現在のページのハイライト表示（Primaryカラー）
  - ホバー時のスタイル変更（グレー）
  - レスポンシブ対応（最大幅720px）
  - UI表示テキストを定数から参照（TEXT.navigation）
- `src/components/Layout.vue`
  - ヘッダー（Navigationコンポーネント含む）の実装
  - メインコンテンツエリア（`<router-view>`）の実装
  - Vue Routerとの統合（useRoute、computed）
  - レスポンシブレイアウト（最大幅720px、左右パディング16px）
  - UIガイドラインに従ったデザイン（bg-gray-50、min-h-screen）

### テスト
- `src/api/base.test.ts` - `getApiErrorMessage` のUnit Test
- `src/api/music.test.ts` - `MusicApiClient` のProperty Test
- `src/api/artist.test.ts` - `ArtistApiClient` のProperty Test
- `src/composables/useMusicList.test.ts` - `useMusicList` のProperty Test
- `src/composables/useArtistList.test.ts` - `useArtistList` のProperty Test
- `src/composables/useNotification.test.ts` - `useNotification` のProperty Test
- `src/components/LoadingSpinner.test.ts` - `LoadingSpinner` のProperty Test（Property 16）
- `src/components/PaginationControl.test.ts` - `PaginationControl` のUnit Test + Property Test（Property 11, Property 13）
- `src/components/ConfirmDialog.test.ts` - `ConfirmDialog` のUnit Test（11件のテストケース）
- `src/components/YouTubeModal.test.ts` - `YouTubeModal` のUnit Test（12件のテストケース）
- `src/components/Navigation.test.ts` - `Navigation` のProperty Test（Property 35, Property 36、3件のテストケース）
- `src/components/Layout.test.ts` - `Layout` のUnit Test（7件のテストケース、Vue Routerセットアップ含む）

---

## 技術スタック

- **フロントエンド**: Vue 3 (Composition API) + TypeScript
- **スタイリング**: Tailwind CSS v4
- **ルーティング**: Vue Router v5
- **フォーム管理**: VeeValidate v4
- **バリデーション**: Zod v4
- **HTTPクライアント**: Fetch API
- **ビルドツール**: Vite v8
- **パッケージマネージャー**: pnpm
- **テスト**: Vitest v4 + fast-check v4 + Playwright v1
- **APIモック**: MSW v2

---

## 設計原則

1. **関心の分離**: UI、ビジネスロジック、API通信を明確に分離
2. **再利用性**: 共通コンポーネントの最大限の活用
3. **型安全性**: TypeScriptによる厳密な型定義
4. **エラーハンドリング**: 一貫したエラー処理とユーザーフィードバック
5. **テスト駆動開発**: Unit Test + Property-Based Testingの組み合わせ

---

## 開発環境セットアップ

次のタスクを開始する前に、以下のコマンドで開発環境を確認してください。

```bash
# 依存関係のインストール（初回のみ）
pnpm install

# 開発サーバーの起動
pnpm dev

# テストの実行
pnpm test

# 型チェック
pnpm typecheck

# Lintチェック
pnpm lint
```

**注意事項:**
- Node.jsのバージョン: 18以上推奨
- パッケージマネージャー: pnpm必須
- エディタ: VSCodeを推奨（TypeScript、Vue、Tailwind CSSの拡張機能をインストール）

---

## トラブルシューティング

### よくある問題と解決方法

**問題1: pnpmコマンドが見つからない**
```bash
npm install -g pnpm
```

**問題2: 型エラーが発生する**
```bash
pnpm typecheck
```
型エラーの詳細を確認し、`src/types/index.ts`の型定義を参照してください。

**問題3: テストが失敗する**
- MSWのセットアップを確認
- APIエンドポイントが正しいか確認（`/api/v1`がベースURL）
- テストファイルの`describe`と`it`の構造を確認

**問題4: Tailwind CSSが適用されない**
- `postcss.config.js`の設定を確認
- `src/style.css`でTailwindディレクティブがインポートされているか確認

---

## 連絡先・質問

実装中に不明点がある場合は、以下を確認してください。

1. 設計書（`.kiro/specs/prsk-music-management-web/design.md`）の該当セクション
2. 要件定義（`.kiro/specs/prsk-music-management-web/requirements.md`）の受入基準
3. 既存の実装ファイル（`src/types/index.ts`、`src/api/index.ts`）

それでも解決しない場合は、チームメンバーに相談してください。
- `src/components/PaginationControl.test.ts` - `PaginationControl` のUnit Test + Property Test（Property 11, Property 13）
