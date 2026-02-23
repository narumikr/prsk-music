---
inclusion: always
---

# コーディング規約

このプロジェクトのコーディング規約です。

## UI表示テキストの管理

### 原則

UI表示テキストはリテラル文字列として直接コンポーネントに記述せず、`src/constants`フォルダで一元管理すること。

### テキスト定義ファイル

**ファイル**: `src/constants/text.ts`

このファイルには以下のカテゴリでテキストを定義します。

- `common`: 共通で使用するテキスト（ボタンラベル、メッセージなど）
- `validation`: バリデーションメッセージ
- `error`: エラーメッセージ
- その他、機能ごとのカテゴリ

### 使用例

```typescript
// ❌ 悪い例：リテラル文字列を直接記述
<button>保存</button>

// ✅ 良い例：constantsから参照
import { TEXT } from '@/constants/text';

<button>{{ TEXT.common.save }}</button>
```

### 新しいテキストの追加

新しいUI表示テキストが必要な場合は、`src/constants/text.ts`に追加してから使用すること。

```typescript
export const TEXT = {
  // 既存のカテゴリに追加
  common: {
    // ...
    newButton: '新しいボタン',
  },
  
  // または新しいカテゴリを作成
  myFeature: {
    title: 'マイ機能',
    description: '説明文',
  },
} as const;
```

## TypeScript

### 型定義

- 型定義は`src/types`フォルダで管理
- API型定義は`src/types/index.ts`に記載
- 共通型は適切なファイルに分割

### 型安全性

- `any`型の使用は避ける
- 必要に応じて`unknown`を使用し、型ガードで絞り込む
- 型アサーションは最小限に

## Vue 3

### Composition API

- `<script setup>`構文を使用
- リアクティブな状態は`ref`または`reactive`で定義
- 副作用は`watchEffect`または`watch`で管理

### Props と Emits

- Propsは型定義を明示
- Emitsは`defineEmits`で型安全に定義

```typescript
interface Props {
  title: string;
  count?: number;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  update: [value: number];
}>();
```

### テンプレート

- シンプルで読みやすいテンプレートを心がける
- 複雑なロジックはcomputedまたはメソッドに分離

## ファイル構成

### コンポーネント

- コンポーネントはPascalCaseで命名
- 単一ファイルコンポーネント（.vue）を使用
- `src/components`に配置

### ビュー

- ページレベルのコンポーネントは`src/views`に配置
- ルーティングと対応させる

### Composables

- 再利用可能なロジックは`src/composables`に配置
- `use`プレフィックスを使用（例: `useApi`, `usePrskMusic`）

### 定数

- 定数は`src/constants`に配置
- UI表示テキストは`text.ts`
- その他の定数は適切なファイルに分割

## スタイリング

### Tailwind CSS

- Tailwind CSSのユーティリティクラスを使用
- カスタムCSSは最小限に
- UIガイドライン（`.kiro/steering/ui-design-guidelines.md`）に従う

### クラス名

- 動的なクラスは`class`バインディングを使用
- 条件付きクラスは配列またはオブジェクト構文を使用

```vue
<div :class="['base-class', { active: isActive }]">
```

## テスト

### 単体テスト

- Vitestを使用
- テストファイルは`.test.ts`拡張子
- 可能な限りソースファイルと同じディレクトリに配置

### E2Eテスト

- Playwrightを使用
- `tests/e2e`ディレクトリに配置

## コミット

### コミットメッセージ

- 簡潔で明確なメッセージを記述
- 変更内容が分かるように記述

## 注意事項

- コードレビュー時にこれらの規約に従っているか確認すること
- 規約に従わないコードは修正を依頼すること
- 規約の改善提案は歓迎
