# 実装計画: プロセカ楽曲・アーティスト管理Webページ

## 概要

Vue 3、TypeScript、Tailwind CSSを使用して、プロセカ楽曲とアーティストのマスタデータを管理するWebアプリケーションを実装します。既存のREST APIを利用し、CRUD操作を提供します。

## タスク

- [x] 1. プロジェクトセットアップと基本構造の構築
  - Viteプロジェクトの初期化（Vue 3 + TypeScript）
  - 必要な依存関係のインストール（Vue Router、Tailwind CSS、Zod、VeeValidate、Vitest、fast-check、Playwright）
  - ディレクトリ構造の作成（components、composables、api、types、views）
  - Tailwind CSSの設定
  - _Requirements: 全要件_

- [x] 2. 型定義とAPIクライアントの実装
  - [x] 2.1 型定義の作成
    - ドメインモデル型（PrskMusic、Artist、MusicType、AuditInfo）
    - フォームデータ型（MusicFormData、ArtistFormData）
    - APIレスポンス型（PaginatedResponse、PaginationMeta、ApiError）
    - _Requirements: 要件1, 要件9_
  
  - [x] 2.2 BaseApiClientのインターフェース定義
    - メソッドシグネチャのみ実装（get、post、put、delete）
    - 認証トークン管理のインターフェース
    - 実装は空（throw new Error('Not implemented')）
    - _Requirements: 要件2, 要件3, 要件4, 要件10, 要件11, 要件12_
  
  - [x] 2.3 BaseApiClientのProperty Test作成
    - **Property 4: 楽曲作成時のPOSTリクエスト送信**
    - **Property 8: 楽曲更新時のPUTリクエスト送信**
    - **Property 9: 楽曲削除時のDELETEリクエスト送信**
    - **Property 10: ページネーションクエリパラメータの送信**
    - **Property 27: アーティスト作成時のPOSTリクエスト送信**
    - **Property 33: アーティスト更新時のPUTリクエスト送信**
    - **Property 34: アーティスト削除時のDELETEリクエスト送信**
    - MSWでAPIをモック
    - テストは失敗する状態（Red）
    - **Validates: Requirements 要件2, 要件3, 要件4, 要件5, 要件10, 要件11, 要件12**
  
  - [x] 2.4 BaseApiClientの実装
    - 共通HTTPリクエストメソッドの実装
    - 認証トークン管理機能の実装
    - エラーハンドリングの実装
    - すべてのProperty Testがパスすることを確認（Green）
    - _Requirements: 要件2, 要件3, 要件4, 要件10, 要件11, 要件12_
  
  - [x] 2.5 MusicApiClientのインターフェース定義
    - メソッドシグネチャのみ実装
    - 実装は空（throw new Error('Not implemented')）
    - _Requirements: 要件1, 要件2, 要件3, 要件4_
  
  - [x] 2.6 ArtistApiClientのインターフェース定義
    - メソッドシグネチャのみ実装
    - 実装は空（throw new Error('Not implemented')）
    - _Requirements: 要件9, 要件10, 要件11, 要件12_
  
  - [x] 2.7 MusicApiClientとArtistApiClientの実装
    - BaseApiClientを使用した実装
    - _Requirements: 要件1, 要件2, 要件3, 要件4, 要件9, 要件10, 要件11, 要件12_
  
  - [x] 2.8 ApiErrorHandlerのインターフェース定義とテスト作成
    - メソッドシグネチャのみ実装
    - Unit Testを作成（各ステータスコードのエラーメッセージ確認）
    - テストは失敗する状態（Red）
    - _Requirements: 要件6_
  
  - [x] 2.9 ApiErrorHandlerの実装
    - ステータスコード別エラーメッセージ生成の実装
    - すべてのUnit Testがパスすることを確認（Green）
    - _Requirements: 要件6_


- [ ] 3. Composablesの実装
  - [x] 3.1 useMusicListのインターフェース定義
    - 戻り値の型定義
    - メソッドシグネチャのみ実装
    - 実装は空（throw new Error('Not implemented')）
    - _Requirements: 要件1, 要件2, 要件3, 要件4, 要件5_
  
  - [x] 3.2 useMusicListのProperty Test作成
    - **Property 12: ページ番号クリック時のデータ取得**
    - MSWでAPIをモック
    - テストは失敗する状態（Red）
    - **Validates: Requirements 要件5**
  
  - [x] 3.3 useMusicListの実装
    - 楽曲一覧の状態管理の実装
    - データ取得・作成・更新・削除メソッドの実装
    - すべてのProperty Testがパスすることを確認（Green）
    - _Requirements: 要件1, 要件2, 要件3, 要件4, 要件5_
  
  - [x] 3.4 useArtistListのインターフェース定義
    - 戻り値の型定義
    - メソッドシグネチャのみ実装
    - 実装は空（throw new Error('Not implemented')）
    - _Requirements: 要件9, 要件10, 要件11, 要件12_
  
  - [x] 3.5 useArtistListのProperty Test作成
    - アーティスト一覧取得のテスト
    - MSWでAPIをモック
    - テストは失敗する状態（Red）
    - _Requirements: 要件9_
  
  - [x] 3.6 useArtistListの実装
    - アーティスト一覧の状態管理の実装
    - データ取得・作成・更新・削除メソッドの実装
    - すべてのProperty Testがパスすることを確認（Green）
    - _Requirements: 要件9, 要件10, 要件11, 要件12_
  
  - [x] 3.7 useNotificationのインターフェース定義
    - 戻り値の型定義
    - メソッドシグネチャのみ実装
    - 実装は空（throw new Error('Not implemented')）
    - _Requirements: 要件2, 要件3, 要件4, 要件6_
  
  - [x] 3.8 useNotificationのProperty Test作成
    - **Property 14: エラー詳細の表示**
    - **Property 15: エラーのコンソールログ出力**
    - テストは失敗する状態（Red）
    - **Validates: Requirements 要件6**
  
  - [x] 3.9 useNotificationの実装
    - 成功・エラー・情報メッセージの表示機能の実装
    - すべてのProperty Testがパスすることを確認（Green）
    - _Requirements: 要件2, 要件3, 要件4, 要件6_

- [ ] 4. 共通コンポーネントの実装
  - [x] 4.1 LoadingSpinner.vueのスケルトン作成
    - propsの型定義のみ
    - テンプレートは空のdiv
    - _Requirements: 要件7_
  
  - [x] 4.2 LoadingSpinnerのProperty Test作成
    - **Property 16: 非同期操作中のローディング表示**
    - テストは失敗する状態（Red）
    - **Validates: Requirements 要件7**
  
  - [x] 4.3 LoadingSpinner.vueの実装
    - サイズバリエーション（small、medium、large）の実装
    - すべてのProperty Testがパスすることを確認（Green）
    - _Requirements: 要件7_
  
  - [x] 4.4 PaginationControl.vueのスケルトン作成
    - propsとemitsの型定義のみ
    - テンプレートは空のdiv
    - _Requirements: 要件1, 要件5, 要件9_
  
  - [x] 4.5 PaginationControlのUnit Test作成
    - 20件以下でページネーション非表示
    - 21件以上でページネーション表示
    - 最初のページで「前へ」ボタン無効化
    - 最後のページで「次へ」ボタン無効化
    - テストは失敗する状態（Red）
    - _Requirements: 要件1, 要件5, 要件9_
  
  - [x] 4.6 PaginationControlのProperty Test作成
    - **Property 11: ページネーションメタデータの表示**
    - **Property 13: 20件超でのページネーション表示**
    - テストは失敗する状態（Red）
    - **Validates: Requirements 要件1, 要件5, 要件9**
  
  - [x] 4.7 PaginationControl.vueの実装
    - ページ情報表示の実装
    - 前へ・次へボタン、ページ番号リンクの実装
    - 最初/最後のページでのボタン無効化の実装
    - すべてのUnit TestとProperty Testがパスすることを確認（Green）
    - _Requirements: 要件1, 要件5, 要件9_
  
  - [x] 4.8 ConfirmDialog.vueのスケルトン作成
    - propsとemitsの型定義のみ
    - テンプレートは空のdiv
    - _Requirements: 要件4, 要件12_
  
  - [x] 4.9 ConfirmDialog.vueのUnit Test作成
    - 確認ダイアログ表示のテスト
    - 確認ボタンクリック時のイベント発火
    - キャンセルボタンクリック時のイベント発火
    - テストは失敗する状態（Red）
    - _Requirements: 要件4, 要件12_
  
  - [x] 4.10 ConfirmDialog.vueの実装
    - タイトル、メッセージ、確認・キャンセルボタンの実装
    - すべてのUnit Testがパスすることを確認（Green）
    - _Requirements: 要件4, 要件12_
  
  - [x] 4.11 YouTubeModal.vueのスケルトン作成
    - propsとemitsの型定義のみ
    - テンプレートは空のdiv
    - _Requirements: 要件1_
  
  - [x] 4.12 YouTubeModal.vueのUnit Test作成
    - モーダル表示のテスト
    - YouTube動画埋め込みのテスト
    - URLから動画ID抽出のテスト
    - テストは失敗する状態（Red）
    - _Requirements: 要件1_
  
  - [x] 4.13 YouTubeModal.vueの実装
    - YouTube動画埋め込み表示の実装
    - URLから動画ID抽出の実装
    - すべてのUnit Testがパスすることを確認（Green）
    - _Requirements: 要件1_


- [ ] 5. レイアウトコンポーネントの実装
  - [x] 5.1 Navigation.vueのスケルトン作成
    - propsの型定義のみ
    - テンプレートは空のnav
    - _Requirements: 要件13_
  
  - [x] 5.2 NavigationのProperty Test作成
    - **Property 35: ナビゲーションメニューの現在ページ表示**
    - **Property 36: 全ページでのナビゲーションメニュー表示**
    - テストは失敗する状態（Red）
    - **Validates: Requirements 要件13**
  
  - [x] 5.3 Navigation.vueの実装
    - 楽曲管理・アーティスト管理のナビゲーションリンクの実装
    - 現在のページのハイライト表示の実装
    - すべてのProperty Testがパスすることを確認（Green）
    - _Requirements: 要件13_
  
  - [x] 5.4 Layout.vueのスケルトン作成
    - テンプレートは空のdiv
    - _Requirements: 要件13_
  
  - [x] 5.5 Layout.vueのUnit Test作成
    - ヘッダー表示のテスト
    - ナビゲーション表示のテスト
    - router-view表示のテスト
    - テストは失敗する状態（Red）
    - _Requirements: 要件13_
  
  - [x] 5.6 Layout.vueの実装
    - ヘッダー（ナビゲーション含む）の実装
    - メインコンテンツエリア（<router-view>）の実装
    - すべてのUnit Testがパスすることを確認（Green）
    - _Requirements: 要件13_

- [ ] 6. アーティスト管理機能の実装
  - [x] 6.1 ArtistTable.vueのスケルトン作成
    - propsとemitsの型定義のみ
    - テンプレートは空のdiv
    - _Requirements: 要件9_
  
  - [x] 6.2 ArtistTableのProperty Test作成
    - **Property 25: アーティストレコードの完全なフィールド表示**
    - **Property 26: アーティストレコードのアクションボタン表示**
    - テストは失敗する状態（Red）
    - **Validates: Requirements 要件9**
  
  - [x] 6.3 ArtistTable.vueの実装
    - アーティスト一覧テーブル表示の実装（id、artistName、unitName、content）
    - 編集・削除アクションボタンの実装
    - すべてのProperty Testがパスすることを確認（Green）
    - _Requirements: 要件9_
  
  - [x] 6.4 ArtistFormModal.vueのスケルトン作成
    - propsとemitsの型定義のみ
    - テンプレートは空のdiv
    - _Requirements: 要件7, 要件10, 要件11_
  
  - [x] 6.5 ArtistFormModalのProperty Test作成
    - **Property 17: フォームフィールドのラベル表示**
    - **Property 28: アーティスト名フィールドの空文字検証**
    - **Property 29: アーティスト名の文字数検証**
    - **Property 30: ユニット名の文字数検証**
    - **Property 31: コンテンツ名の文字数検証**
    - **Property 32: アーティスト編集フォームの事前入力**
    - テストは失敗する状態（Red）
    - **Validates: Requirements 要件7, 要件10, 要件11**
  
  - [x] 6.6 ArtistFormModal.vueの実装
    - アーティスト登録・編集フォームの実装
    - フィールド: artistName（必須、1-50文字）、unitName（任意、1-25文字）、content（任意、1-20文字）
    - Zodバリデーションスキーマの実装
    - VeeValidateによるフォーム管理の実装
    - すべてのProperty Testがパスすることを確認（Green）
    - _Requirements: 要件10, 要件11_
  
  - [x] 6.7 ArtistListPage.vueのスケルトン作成
    - テンプレートは空のdiv
    - useArtistListとuseNotificationの呼び出しのみ
    - _Requirements: 要件9, 要件10, 要件11, 要件12_
  
  - [x] 6.8 ArtistListPageのUnit Test作成
    - アーティスト一覧ページアクセス時のテーブル表示
    - 新規登録ボタンクリック時のフォーム表示
    - 削除ボタンクリック時の確認ダイアログ表示
    - 削除確認時のAPIリクエスト送信
    - テストは失敗する状態（Red）
    - _Requirements: 要件9, 要件10, 要件12_
  
  - [x] 6.9 ArtistListPage.vueの実装
    - アーティスト一覧表示の実装
    - 新規登録ボタンの実装
    - ページネーションの実装
    - フォームモーダル・削除確認ダイアログの制御の実装
    - useArtistListとuseNotificationの統合
    - すべてのUnit Testがパスすることを確認（Green）
    - _Requirements: 要件9, 要件10, 要件11, 要件12_


- [ ] 7. 楽曲管理機能の実装
  - [ ] 7.1 MusicTable.vueのスケルトン作成
    - propsとemitsの型定義のみ
    - テンプレートは空のdiv
    - _Requirements: 要件1_
  
  - [ ] 7.2 MusicTableのUnit Test作成
    - 楽曲一覧ページアクセス時のテーブル表示
    - YouTubeリンククリック時のモーダル表示
    - テストは失敗する状態（Red）
    - _Requirements: 要件1_
  
  - [ ] 7.3 MusicTableのProperty Test作成
    - **Property 1: 楽曲レコードの完全なフィールド表示**
    - **Property 2: MusicType値のラベル変換**
    - **Property 3: YouTubeリンクのクリック可能性**
    - テストは失敗する状態（Red）
    - **Validates: Requirements 要件1**
  
  - [ ] 7.4 MusicTable.vueの実装
    - 楽曲一覧テーブル表示の実装（id、title、artistName、unitName、musicType、specially、lyricsName、musicName、featuring、youtubeLink）
    - musicTypeの数値→ラベル変換の実装（0→オリジナル、1→3DMV、2→2DMV）
    - YouTubeリンクのクリック可能表示の実装
    - 編集・削除アクションボタンの実装
    - すべてのUnit TestとProperty Testがパスすることを確認（Green）
    - _Requirements: 要件1_
  
  - [ ] 7.5 MusicFormModal.vueのスケルトン作成
    - propsとemitsの型定義のみ
    - テンプレートは空のdiv
    - _Requirements: 要件2, 要件3, 要件7, 要件8_
  
  - [ ] 7.6 MusicFormModalのUnit Test作成
    - 新規登録ボタンクリック時の空フォーム表示
    - 編集ボタンクリック時の事前入力フォーム表示
    - musicTypeドロップダウンの選択肢表示
    - アーティスト新規追加ボタンクリック時のイベント発火
    - テストは失敗する状態（Red）
    - _Requirements: 要件2, 要件3_
  
  - [ ] 7.7 MusicFormModalのProperty Test作成
    - **Property 5: バリデーションエラーメッセージの表示**
    - **Property 6: 必須フィールドの検証**
    - **Property 7: 編集フォームの事前入力**
    - **Property 17: フォームフィールドのラベル表示**
    - **Property 18: タイトルフィールドの空文字検証**
    - **Property 19: YouTubeリンクのURL形式検証**
    - **Property 20: アーティストID選択の検証**
    - **Property 21: MusicTypeドロップダウンの選択肢**
    - **Property 22: 検証失敗時のインラインエラーメッセージ**
    - **Property 23: 有効なフォームでの送信ボタン有効化**
    - **Property 24: 無効なフォームでの送信ボタン無効化**
    - テストは失敗する状態（Red）
    - **Validates: Requirements 要件2, 要件3, 要件7, 要件8**
  
  - [ ] 7.8 MusicFormModal.vueの実装
    - 楽曲登録・編集フォームの実装
    - フィールド: title（必須）、artistId（必須、ドロップダウン + 新規追加ボタン）、musicType（必須、ドロップダウン）、specially（チェックボックス）、lyricsName、musicName、featuring（任意）、youtubeLink（必須、URL検証）
    - Zodバリデーションスキーマの実装
    - VeeValidateによるフォーム管理の実装
    - アーティスト新規追加トリガー機能の実装
    - すべてのUnit TestとProperty Testがパスすることを確認（Green）
    - _Requirements: 要件2, 要件3, 要件7, 要件8_
  
  - [ ] 7.9 MusicListPage.vueのスケルトン作成
    - テンプレートは空のdiv
    - useMusicList、useArtistList、useNotificationの呼び出しのみ
    - _Requirements: 要件1, 要件2, 要件3, 要件4_
  
  - [ ] 7.10 MusicListPageのUnit Test作成
    - 楽曲一覧ページアクセス時のテーブル表示
    - 新規登録ボタンクリック時のフォーム表示
    - 削除ボタンクリック時の確認ダイアログ表示
    - アーティスト追加完了後の自動選択
    - テストは失敗する状態（Red）
    - _Requirements: 要件1, 要件2, 要件4_
  
  - [ ] 7.11 MusicListPageのProperty Test作成
    - **Property 37: 楽曲フォームからのアーティスト追加トリガー**
    - **Property 38: アーティスト追加後の自動選択**
    - テストは失敗する状態（Red）
    - **Validates: Requirements 要件2**
  
  - [ ] 7.12 MusicListPage.vueの実装
    - 楽曲一覧表示の実装
    - 新規登録ボタンの実装
    - ページネーションの実装
    - 楽曲フォームモーダル・アーティストフォームモーダル・削除確認ダイアログの制御の実装
    - useMusicList、useArtistList、useNotificationの統合
    - アーティスト追加フローの実装（楽曲フォームから呼び出し→アーティスト登録→一覧再取得→自動選択）
    - すべてのUnit TestとProperty Testがパスすることを確認（Green）
    - _Requirements: 要件1, 要件2, 要件3, 要件4_


- [ ] 8. ルーティングとアプリケーション統合
  - [ ] 8.1 Vue Routerの設定
    - ルート定義（/musics、/artists）
    - デフォルトルート（/musicsへリダイレクト）
    - _Requirements: 要件13_
  
  - [ ] 8.2 App.vueの実装
    - Layoutコンポーネントの配置
    - router-viewの設定
    - グローバル通知コンポーネントの配置
    - _Requirements: 要件13_
  
  - [ ] 8.3 main.tsの実装
    - Vueアプリケーションの初期化
    - Vue Routerのマウント
    - グローバルスタイル（Tailwind CSS）のインポート
    - _Requirements: 全要件_

- [ ] 9. チェックポイント - 基本機能の動作確認
  - すべてのテストがパスすることを確認
  - 楽曲とアーティストのCRUD操作が正常に動作することを確認
  - ページネーションが正しく機能することを確認
  - エラーハンドリングが適切に動作することを確認
  - ユーザーに質問があれば確認

- [ ] 10. E2Eテストの実装
  - [ ] 10.1 Playwrightの設定
    - playwright.config.tsの作成
    - テスト環境の設定
  
  - [ ] 10.2 楽曲管理のE2Eテスト
    - 楽曲一覧表示
    - 楽曲新規登録フロー
    - 楽曲編集フロー
    - 楽曲削除フロー
    - ページネーション操作
    - _Requirements: 要件1, 要件2, 要件3, 要件4, 要件5_
  
  - [ ] 10.3 アーティスト管理のE2Eテスト
    - アーティスト一覧表示
    - アーティスト新規登録フロー
    - アーティスト編集フロー
    - アーティスト削除フロー
    - _Requirements: 要件9, 要件10, 要件11, 要件12_
  
  - [ ] 10.4 楽曲フォームからのアーティスト追加E2Eテスト
    - 楽曲フォームで「新規アーティスト追加」ボタンをクリック
    - アーティスト登録モーダルでアーティストを追加
    - 楽曲フォームで新規追加されたアーティストが自動選択されることを確認
    - _Requirements: 要件2_
  
  - [ ] 10.5 エラーハンドリングのE2Eテスト
    - 重複データ登録時の409エラー表示
    - 無効なデータ送信時の400エラー表示
    - 存在しないレコード操作時の404エラー表示
    - _Requirements: 要件2, 要件3, 要件6_

- [ ] 11. 最終チェックポイント
  - すべてのUnit TestとProperty Testがパスすることを確認
  - すべてのE2Eテストがパスすることを確認
  - テストカバレッジが目標（80%以上）を達成していることを確認
  - レスポンシブデザインが正しく動作することを確認（デスクトップ・タブレット）
  - すべての要件が実装されていることを確認
  - ユーザーに質問があれば確認

## 注意事項

- `*`マークが付いているタスクはオプションで、より迅速なMVP開発のためにスキップ可能です
- 各タスクは前のタスクに依存しているため、順番に実装してください
- **テスト駆動開発（TDD）のアプローチを採用しています**:
  1. **Red**: まずインターフェース定義（スケルトン）とテストを作成します。テストは失敗する状態です
  2. **Green**: 実装を行い、すべてのテストがパスすることを確認します
  3. **Refactor**: 必要に応じてコードをリファクタリングします
- スケルトン作成タスクでは、型定義とメソッドシグネチャのみを実装し、実装は空（`throw new Error('Not implemented')`）にしてください
- テスト作成タスクでは、MSWを使用してAPIをモックし、実際のAPIを呼び出さないようにしてください
- Property Testは各テストで最低100回の反復を実行してください
- すべてのテストには、デザインドキュメントのプロパティを参照するコメントを含めてください
- チェックポイントでは、実装した機能が正しく動作することを確認し、問題があれば修正してください

