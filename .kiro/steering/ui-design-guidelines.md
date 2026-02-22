# UI Design Guidelines

このプロジェクトのUIデザインに関するガイドラインです。

## デザインコンセプト

シンプルで控えめなデザイン。カラーはborderやhover時など、アクセントとして使用する。

## カラーパレット

### テーマ
- ライトモードのみ

### ブランドカラー
- Primary: `#33ccba`
- Secondary: `#33aaee`

### 状態カラー
- Success: `#bbdd22`
- Warning: `#ffc096`
- Error: `#ff6699`

### グレースケール
Tailwind CSSのデフォルトグレースケール（gray-50〜gray-900）を使用

- Text Primary: `gray-900`
- Text Secondary: `gray-600`
- Background: `white` / `gray-50`
- Disabled: `gray-400`

## タイポグラフィ

### フォントサイズ
Tailwind CSSのデフォルトスケールを使用

- 見出し（大）: `text-2xl` (24px)
- 見出し（中）: `text-xl` (20px)
- 見出し（小）: `text-lg` (18px)
- 本文: `text-base` (16px)
- 補足テキスト: `text-sm` (14px)
- キャプション: `text-xs` (12px)

### 行間
- 本文: `1.5`
- 見出し: `1.2`

## スペーシング

Tailwind CSSのデフォルトスペーシングスケール（4px単位）を使用

推奨値:
- 極小: `space-1` (4px)
- 小: `space-2` (8px)
- 中: `space-4` (16px)
- 大: `space-6` (24px)
- 特大: `space-8` (32px)

## レイアウト

### コンテナ
- 最大幅: `720px`
- 左右パディング: `16px`（モバイル）、`24px`（タブレット以上）

### ブレークポイント
Tailwind CSSのデフォルトブレークポイントを使用

- sm: `640px`
- md: `768px`
- lg: `1024px`
- xl: `1280px`
- 2xl: `1536px`

## インタラクション

### ホバー
- 透明度: `opacity-80`
- トランジション: `transition duration-150 ease-in-out`

### フォーカス
- アウトライン: Primary カラー（`#33ccba`）の薄い版
- リングの太さ: `ring-2`
- リングのオフセット: `ring-offset-2`

### 無効状態
- 透明度: `opacity-50`
- カーソル: `cursor-not-allowed`

### トランジション
- デフォルト: `150ms ease-in-out`
- 遅い: `300ms ease-in-out`

## コンポーネントスタイル

### ボーダー
- デフォルト: `border-gray-200`
- ホバー時: Primary または Secondary カラー
- 太さ: `border` (1px)
- 角丸: `rounded` (4px)

### ボタン
- Primary ボタン: Primary カラーのborderとテキスト、背景は白
- Secondary ボタン: Secondary カラーのborderとテキスト、背景は白
- ホバー時: 背景にカラーを薄く適用（`bg-opacity-10`）

### 入力フィールド
- ボーダー: `border-gray-200`
- フォーカス時: Primary カラーのring
- 角丸: `rounded` (4px)
- パディング: `px-3 py-2`

### カード
- 背景: `white`
- ボーダー: `border-gray-200`
- 角丸: `rounded-lg` (8px)
- シャドウ: `shadow-sm`（控えめ）

## アクセシビリティ

### コントラスト
- テキストと背景のコントラスト比: 最低4.5:1（WCAG AA準拠）
- 大きなテキスト: 最低3:1

### フォーカス表示
- すべてのインタラクティブ要素に明確なフォーカス表示を提供

### キーボード操作
- すべての機能がキーボードで操作可能であること

## 実装時の注意事項

- カラーは控えめに使用し、主にborder、hover、アクセントとして活用
- 過度な装飾は避け、シンプルで読みやすいUIを心がける
- Tailwind CSSのユーティリティクラスを活用
- カスタムカラーはTailwind設定に追加して使用
