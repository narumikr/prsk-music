# プロセカ楽曲・アーティスト管理Webページ

プロジェクトセカイ（プロセカ）の楽曲マスタデータとアーティストマスタデータを管理するWebアプリケーション。

## 技術スタック

- **フロントエンド**: Vue 3 + TypeScript
- **ビルドツール**: Vite
- **スタイリング**: Tailwind CSS
- **ルーティング**: Vue Router
- **フォーム管理**: VeeValidate + Zod
- **テスト**: Vitest + Playwright + fast-check

## セットアップ

```bash
# 依存関係のインストール
pnpm install

# 開発サーバーの起動
pnpm run dev

# ビルド
pnpm run build

# プレビュー
pnpm run preview
```

## テスト

```bash
# Unit/Property Tests
pnpm run test

# テストUI
pnpm run test:ui

# カバレッジ
pnpm run test:coverage

# E2Eテスト
pnpm run test:e2e
```

## ディレクトリ構造

```
src/
├── api/          # APIクライアント
├── assets/       # 静的アセット
├── components/   # Vueコンポーネント
├── composables/  # Composition API hooks
├── types/        # TypeScript型定義
├── views/        # ページコンポーネント
├── App.vue       # ルートコンポーネント
├── main.ts       # エントリーポイント
└── style.css     # グローバルスタイル
```

## 機能

- 楽曲の閲覧・登録・編集・削除
- アーティストの閲覧・登録・編集・削除
- 楽曲フォームから直接アーティストを追加
- ページネーション対応
- YouTube動画のモーダル表示
- エラーハンドリング

## API

バックエンドAPIは `http://localhost:8080/api/v1` で動作することを想定しています。

- `GET /prsk-music` - 楽曲一覧取得
- `POST /prsk-music` - 楽曲登録
- `PUT /prsk-music/{id}` - 楽曲更新
- `DELETE /prsk-music/{id}` - 楽曲削除
- `GET /artists` - アーティスト一覧取得
- `POST /artists` - アーティスト登録
- `PUT /artists/{id}` - アーティスト更新
- `DELETE /artists/{id}` - アーティスト削除
