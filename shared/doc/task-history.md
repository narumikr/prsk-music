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
- ✅ タスク5: レイアウトコンポーネントの実装（完了）
- ✅ タスク6: アーティスト管理機能の実装（完了）
- 🔄 タスク7: 楽曲管理機能の実装（進行中）
  - ✅ 7.1 MusicTable.vueのスケルトン作成（完了）
  - ✅ 7.2 MusicTableのUnit Test作成（完了）
  - ✅ 7.3 MusicTableのProperty Test作成（完了）
  - ✅ 7.4 MusicTable.vueの実装（完了）
  - ✅ 7.5 MusicFormModal.vueのスケルトン作成（完了）
  - ✅ 7.6 MusicFormModalのUnit Test作成（完了）
  - ✅ 7.7 MusicFormModalのProperty Test作成（完了）
  - ✅ 7.8 MusicFormModal.vueの実装（完了）
  - ✅ 7.9 MusicListPage.vueのスケルトン作成（完了）
  - ⏭️ 7.10 MusicListPageのUnit Test作成（次のタスク）

---

## アーカイブ済みタスク

Task 1からTask 6までの完了タスクの詳細は、以下のアーカイブファイルに保管されています。

**アーカイブファイル**: `shared/doc/task-history-archive-tasks-1-6.md`

### アーカイブ済みタスク一覧

- ✅ タスク1: プロジェクトセットアップと基本構造の構築
- ✅ タスク2: 型定義とAPIクライアントの実装
- ✅ タスク3: Composablesの実装
- ✅ タスク4: 共通コンポーネントの実装
- ✅ タスク5: レイアウトコンポーネントの実装
- ✅ タスク6: アーティスト管理機能の実装

---

## 完了タスク（Task 7以降）

### タスク7: 楽曲管理機能の実装


#### 7.1 MusicTable.vueのスケルトン作成

**実施内容:**
- `src/components/MusicTable.vue`を新規作成
- `MusicTableProps`インターフェースの定義
- `MusicTableEmits`インターフェースの定義
- テンプレートは空の`<div></div>`（スケルトン）

**対応要件:** 要件1

#### 7.2 MusicTableのUnit Test作成

**実施内容:**
- `src/components/MusicTable.test.ts`を新規作成
- Unit Testの実装（10件のテストケース）
- テストは失敗する状態（Red）で作成完了

**対応要件:** 要件1

#### 7.3 MusicTableのProperty Test作成

**実施内容:**
- Property 1, 2, 3のテスト実装
- fast-checkを使用して100回の反復テスト
- テストは失敗する状態（Red）で作成完了

**対応要件:** 要件1

#### 7.4 MusicTable.vueの実装

**実施内容:**
- `src/components/MusicTable.vue`の完全な実装
- 楽曲一覧テーブル表示の実装
- YouTubeリンクのクリック可能表示の実装
- すべてのUnit TestとProperty Testがパス（Green）

**対応要件:** 要件1

#### 7.5 MusicFormModal.vueのスケルトン作成

**実施内容:**
- `src/components/MusicFormModal.vue`を新規作成
- `MusicFormModalProps`インターフェースの定義
- `MusicFormModalEmits`インターフェースの定義
- テンプレートは空の`<div></div>`（スケルトン）

**対応要件:** 要件2, 要件3, 要件7, 要件8

#### 7.6 MusicFormModalのUnit Test作成

**実施内容:**
- `src/components/MusicFormModal.test.ts`を新規作成
- Unit Testの実装（9件のテストケース）
- テストは失敗する状態（Red）で作成完了

**対応要件:** 要件2, 要件3

#### 7.7 MusicFormModalのProperty Test作成

**実施内容:**
- Property 5, 6, 7, 17, 18, 19, 20, 21, 22, 23, 24のテスト実装
- fast-checkを使用して100回の反復テスト
- テストは失敗する状態（Red）で作成完了

**対応要件:** 要件2, 要件3, 要件7, 要件8

#### 7.8 MusicFormModal.vueの実装

**実施内容:**
- `src/components/MusicFormModal.vue`の完全な実装
- VeeValidateとZodによるフォームバリデーションの実装
- フォームフィールドの実装（title、artistId、musicType、specially、lyricsName、musicName、featuring、youtubeLink）
- アーティスト新規追加トリガー機能の実装
- すべてのUnit TestとProperty Testがパス（Green）

**対応要件:** 要件2, 要件3, 要件7, 要件8

#### 7.9 MusicListPage.vueのスケルトン作成

**実施内容:**
- `src/views/MusicListPage.vue`を新規作成
- useMusicList、useArtistList、useNotificationの呼び出しを実装
- テンプレートは空の`<div></div>`（スケルトン）

**対応要件:** 要件1, 要件2, 要件3, 要件4

#### 7.10 MusicListPageのUnit Test作成

**実施内容:**
- `src/views/MusicListPage.test.ts`を新規作成
- Unit Testの実装（12件のテストケース）
  - 楽曲一覧ページアクセス時のテーブル表示
  - 新規登録ボタンクリック時のフォーム表示
  - 削除ボタンクリック時の確認ダイアログ表示
  - アーティスト追加完了後の自動選択
  - 削除確認時のDELETEリクエスト送信
  - 編集ボタンクリック時の編集フォーム表示
  - ページネーションが20件を超えるときに表示される
  - ローディング中にLoadingSpinnerが表示される
  - フォームを閉じたときにモーダルが非表示になる
  - 削除をキャンセルしたときに確認ダイアログが閉じる
  - 楽曲作成後に一覧が再取得される
- MSWでAPIをモック（/api/v1/prsk-music、/api/v1/artists）
- テストは失敗する状態（Red）で作成完了

**対応要件:** 要件1, 要件2, 要件4

#### 7.11 MusicListPageのProperty Test作成

**実施内容:**
- `src/views/MusicListPage.property.test.ts`を新規作成
- Property 37と38のテスト実装
  - Property 37: 楽曲フォームからのアーティスト追加トリガー（作成・編集モード両方で検証）
  - Property 38: アーティスト追加後の自動選択（任意のアーティスト名、ユニット名、コンテンツで検証）
- fast-checkを使用して100回の反復テスト
- MSWでAPIをモック（/api/v1/prsk-music、/api/v1/artists）
- テストは失敗する状態（Red）で作成完了

**対応要件:** 要件2

#### 7.12 MusicListPage.vueの実装

**実施内容:**
- `src/views/MusicListPage.vue`の完全な実装
- 楽曲一覧表示の実装
- 新規登録ボタンの実装
- ページネーションの実装
- 楽曲フォームモーダル・アーティストフォームモーダル・削除確認ダイアログの制御の実装
- useMusicList、useArtistList、useNotificationの統合
- アーティスト追加フローの実装（楽曲フォームから呼び出し→アーティスト登録→一覧再取得→自動選択）
- `src/constants/text.ts`に楽曲リストページ用のテキストを追加
- `src/components/MusicFormModal.vue`に`newlyCreatedArtistId`プロパティを追加
- `src/components/ArtistFormModal.vue`のformタグに`data-testid="artist-form"`を追加
- Zodバリデーションスキーマで`z.coerce.number()`を使用してselect要素の文字列を数値に変換
- すべてのUnit TestとProperty Testがパス（Green）

**対応要件:** 要件1, 要件2, 要件3, 要件4

---

## 次のタスク

**次のタスク: 8.1 Vue Routerの設定**

---

## 実装済みファイル一覧

以下のファイルが既に実装されており、次のタスクで利用可能です。

### 型定義
- `src/types/index.ts` - ドメインモデル型、フォームデータ型、APIレスポンス型

### APIクライアント
- `src/api/base.ts` - BaseApiClient、ApiErrorResponse
- `src/api/music.ts` - MusicApiClient
- `src/api/artist.ts` - ArtistApiClient
- `src/api/index.ts` - 上記のre-export

### Composables
- `src/composables/useMusicList.ts` - 楽曲一覧の状態管理
- `src/composables/useArtistList.ts` - アーティスト一覧の状態管理
- `src/composables/useNotification.ts` - 通知メッセージの管理
- `src/composables/index.ts` - 上記のre-export

### 定数
- `src/constants/text.ts` - UI表示テキスト定義

### コンポーネント
- `src/components/LoadingSpinner.vue` - ローディングスピナー
- `src/components/PaginationControl.vue` - ページネーション
- `src/components/Navigation.vue` - ナビゲーションメニュー
- `src/components/Layout.vue` - レイアウト
- `src/components/ConfirmDialog.vue` - 確認ダイアログ
- `src/components/YouTubeModal.vue` - YouTubeモーダル
- `src/components/ArtistTable.vue` - アーティスト一覧テーブル
- `src/components/ArtistFormModal.vue` - アーティストフォーム
- `src/components/MusicTable.vue` - 楽曲一覧テーブル
- `src/components/MusicFormModal.vue` - 楽曲フォーム

### ビュー
- `src/views/ArtistListPage.vue` - アーティスト一覧ページ
- `src/views/MusicListPage.vue` - 楽曲一覧ページ（スケルトン）

### テスト
- `src/views/ArtistListPage.test.ts` - アーティスト一覧ページのUnit Test
- `src/views/MusicListPage.test.ts` - 楽曲一覧ページのUnit Test
- `src/views/MusicListPage.property.test.ts` - 楽曲一覧ページのProperty Test

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
