# 実装計画: 簡易認証機能

## 概要

プロセカ楽曲・アーティスト管理Webページに固定トークン認証方式による簡易的な認証機能を追加します。環境変数で管理される認証トークンとlocalStorageによるセッション管理を実装し、Vue Routerのナビゲーションガードで保護されたルートへのアクセスを制御します。

## タスク

- [x] 1. テキスト定数の追加
  - `src/constants/text.ts`に認証関連のテキストを追加
  - サインインページ、フォーム、エラーメッセージのテキストを定義
  - _Requirements: 8.3, 8.5_

- [x] 2. useAuth Composableの実装
  - [x] 2.1 useAuth Composableの基本実装
    - `src/composables/useAuth.ts`を作成
    - 環境変数から認証トークンを取得する機能
    - localStorageへの認証トークンの保存・削除機能
    - 認証状態の管理（isAuthenticated, isLoading, error）
    - signIn, signOut, checkAuthメソッドの実装
    - _Requirements: 2.1, 2.2, 3.1, 3.2, 3.3, 4.2, 6.1, 6.2_
  
  - [x] 2.2 useAuth Composableの単体テスト
    - `src/composables/useAuth.test.ts`を作成
    - サインイン成功・失敗のテスト
    - サインアウトのテスト
    - 認証状態チェックのテスト
    - 環境変数未設定時のエラーハンドリングテスト
    - _Requirements: 2.1, 2.2, 2.4, 2.5, 4.2, 6.2_
  
  - [x] 2.3 useAuth Composableのプロパティテスト
    - `src/composables/useAuth.property.test.ts`を作成
    - **Property 2: 認証トークン比較の正確性**
    - **Validates: Requirements 2.1**
    - **Property 3: 認証成功時のセッション永続化**
    - **Validates: Requirements 2.2, 3.1**
    - **Property 4: 認証状態の復元**
    - **Validates: Requirements 3.2, 3.3**
    - **Property 5: サインアウト時のセッション削除**
    - **Validates: Requirements 4.2**

- [x] 3. SignInFormコンポーネントの実装
  - [x] 3.1 SignInFormコンポーネントの基本実装
    - `src/components/SignInForm.vue`を作成
    - パスワード入力フィールド（type="password"）
    - サインインボタン
    - フォームバリデーション（空チェック）
    - ローディング状態の表示
    - エラーメッセージの表示
    - UIガイドラインに準拠したスタイリング
    - _Requirements: 1.2, 1.3, 2.5, 7.1, 8.1, 8.2, 8.3, 8.4, 8.5_
  
  - [x] 3.2 SignInFormコンポーネントの単体テスト
    - `src/components/SignInForm.test.ts`を作成
    - パスワード入力フィールドの存在確認
    - サインインボタンの存在確認
    - パスワードフィールドが空の場合のボタン無効化
    - type="password"の確認
    - ラベルの存在確認
    - ローディング状態の表示
    - エラーメッセージの表示
    - _Requirements: 1.2, 1.3, 2.5, 7.1, 8.3, 8.4, 8.5_

- [x] 4. SignInPageの実装
  - [x] 4.1 SignInPageコンポーネントの基本実装
    - `src/views/SignInPage.vue`を作成
    - SignInFormコンポーネントの配置
    - useAuth Composableの使用
    - 認証成功時のリダイレクト処理（/musicsへ）
    - エラー表示
    - レスポンシブレイアウト
    - _Requirements: 1.1, 1.4, 1.5, 2.3, 2.4_
  
  - [x] 4.2 SignInPageコンポーネントの単体テスト
    - `src/views/SignInPage.test.ts`を作成
    - SignInFormコンポーネントのレンダリング
    - 認証成功時のリダイレクト処理
    - エラー表示
    - _Requirements: 1.1, 2.3, 2.4_

- [x] 5. Routerのナビゲーションガード設定
  - [x] 5.1 ルート定義とナビゲーションガードの実装
    - `src/router/index.ts`を修正
    - サインインページのルート追加（/signin）
    - ナビゲーションガードの実装
    - 未認証時の保護されたルートへのアクセス制御
    - 認証済み時のサインインページへのアクセス制御
    - _Requirements: 3.4, 5.1, 5.2, 5.3, 5.4_
  
  - [x] 5.2 ナビゲーションガードの単体テスト
    - `src/router/index.test.ts`を作成
    - 未認証時の保護されたルートへのアクセス（サインインページへリダイレクト）
    - 認証済み時のサインインページへのアクセス（楽曲一覧ページへリダイレクト）
    - 認証済み時の保護されたルートへのアクセス（ページ表示）
    - _Requirements: 3.4, 5.2, 5.3, 5.4_
  
  - [x] 5.3 ナビゲーションガードのプロパティテスト
    - `src/router/index.property.test.ts`を作成
    - **Property 1: 未認証時のサインインページリダイレクト**
    - **Validates: Requirements 1.1, 3.4, 5.2**
    - **Property 6: 認証済みユーザーの保護されたルートアクセス**
    - **Validates: Requirements 5.3**

- [x] 6. Checkpoint - コア機能の動作確認
  - すべてのテストが通ることを確認
  - サインイン・サインアウトの基本フローが動作することを確認
  - 質問があればユーザーに確認

- [x] 7. Layoutコンポーネントへのサインアウトボタン追加
  - [x] 7.1 Layoutコンポーネントの修正
    - `src/components/Layout.vue`を修正
    - ナビゲーションバーの右端にサインアウトボタンを追加
    - 認証済みの場合のみ表示
    - useAuth Composableを使用してサインアウト処理を実装
    - UIガイドラインに準拠したスタイリング
    - _Requirements: 4.1, 4.3, 8.6_
  
  - [x] 7.2 Layoutコンポーネントの単体テスト更新
    - `src/components/Layout.test.ts`を修正
    - 認証済み時のサインアウトボタン表示
    - 未認証時のサインアウトボタン非表示
    - サインアウトボタンクリック時の動作
    - _Requirements: 4.1_

- [x] 8. Composablesのエクスポート更新
  - `src/composables/index.ts`にuseAuthを追加
  - _Requirements: 2.1_

- [ ]* 9. E2Eテストの実装
  - [x] 9.1 サインインフローのE2Eテスト
    - `tests/e2e/authentication.spec.ts`を作成
    - サインイン成功フロー
    - サインイン失敗フロー
    - セッション永続化（ページリロード後も認証状態維持）
    - _Requirements: 1.1, 2.1, 2.2, 2.3, 2.4, 3.1, 3.2, 3.3_
  
  - [x] 9.2 サインアウトフローのE2Eテスト
    - `tests/e2e/authentication.spec.ts`に追加
    - サインアウトフロー
    - サインアウト後のサインインページリダイレクト
    - _Requirements: 4.1, 4.2, 4.3_
  
  - [ ]* 9.3 ルート保護のE2Eテスト
    - `tests/e2e/authentication.spec.ts`に追加
    - 未認証状態で保護されたルートに直接アクセス
    - サインインページへのリダイレクト確認
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [x] 10. Final Checkpoint - 全体の動作確認
  - すべてのテストが通ることを確認
  - 認証フロー全体が正しく動作することを確認
  - UIガイドラインに準拠していることを確認
  - 質問があればユーザーに確認

## 注意事項

- タスクに`*`が付いているものはオプションで、より早いMVPのためにスキップ可能です
- 各タスクは特定の要件を参照しており、トレーサビリティを確保しています
- Checkpointタスクで段階的な検証を行い、早期に問題を発見します
- プロパティテストは設計ドキュメントのCorrectness Propertiesを検証します
- 単体テストは特定の例、エッジケース、エラー条件を検証します

## 環境変数設定

実装後、以下の環境変数を設定する必要があります。

```bash
# .env.local
VITE_AUTH_TOKEN=your-secret-token-here
```

開発環境では`.env.local`ファイルを作成し、本番環境では適切な方法で環境変数を設定してください。
