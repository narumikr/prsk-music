# E2Eテスト

プロセカ楽曲・アーティスト管理Webページのエンドツーエンドテストディレクトリです。

## 概要

Playwrightを使用して、実際のブラウザ上でアプリケーションの動作を検証します。

## ディレクトリ構造

```
tests/e2e/
├── README.md           # このファイル
├── setup.ts            # グローバルセットアップ
├── fixtures.ts         # カスタムフィクスチャ
├── helpers.ts          # ヘルパー関数
├── mock-data.ts        # モックデータ
└── *.spec.ts           # テストファイル
```

## テストの実行

### すべてのE2Eテストを実行

```bash
pnpm test:e2e
```

### UIモードで実行（推奨）

```bash
pnpm exec playwright test --ui
```

### 特定のテストファイルのみ実行

```bash
pnpm exec playwright test tests/e2e/music-management.spec.ts
```

### デバッグモードで実行

```bash
pnpm exec playwright test --debug
```

### ヘッドレスモードを無効化（ブラウザを表示）

```bash
pnpm exec playwright test --headed
```

## テストレポート

テスト実行後、HTMLレポートが生成されます。

```bash
pnpm exec playwright show-report
```

## テストの書き方

### 基本的なテスト構造

```typescript
import { test, expect } from './fixtures'
import { waitForPageLoad, clickButtonByText } from './helpers'

test.describe('機能名', () => {
  test('テストケース名', async ({ page }) => {
    // ページに移動
    await page.goto('/musics')
    await waitForPageLoad(page)
    
    // 操作
    await clickButtonByText(page, '新規登録')
    
    // 検証
    await expect(page.locator('[role="dialog"]')).toBeVisible()
  })
})
```

### ヘルパー関数の使用

`helpers.ts`に定義されたヘルパー関数を使用して、テストコードを簡潔に保ちます。

```typescript
import { 
  waitForPageLoad,
  clickButtonByText,
  fillInputByLabel,
  waitForModal,
  confirmDialog,
} from './helpers'

test('フォーム送信', async ({ page }) => {
  await page.goto('/musics')
  await clickButtonByText(page, '新規登録')
  await waitForModal(page)
  
  await fillInputByLabel(page, 'タイトル', 'テスト楽曲')
  await clickButtonByText(page, '保存')
  
  await confirmDialog(page)
})
```

### モックデータの使用

`mock-data.ts`に定義されたモックデータを使用します。

```typescript
import { mockMusics, newMusicFormData } from './mock-data'

test('データ検証', async ({ page }) => {
  // モックデータを使用してテスト
  const expectedTitle = mockMusics[0].title
  await expect(page.getByText(expectedTitle)).toBeVisible()
})
```

## ベストプラクティス

### 1. テストの独立性

各テストは独立して実行できるようにします。他のテストの実行結果に依存しないようにしてください。

### 2. 明確なテスト名

テスト名は何をテストしているのか明確にします。

```typescript
// ❌ 悪い例
test('test1', async ({ page }) => { ... })

// ✅ 良い例
test('新規登録ボタンをクリックしたときにフォームモーダルが表示される', async ({ page }) => { ... })
```

### 3. data-testid属性の使用

要素の選択には、可能な限り`data-testid`属性を使用します。

```typescript
// ✅ 推奨
await page.locator('[data-testid="music-table"]').click()

// ⚠️ 避ける（スタイル変更で壊れる可能性）
await page.locator('.music-table-class').click()
```

### 4. 待機処理

非同期操作の後は適切に待機します。

```typescript
// ✅ 良い例
await page.click('button')
await page.waitForLoadState('networkidle')

// ❌ 悪い例（固定時間の待機は避ける）
await page.click('button')
await page.waitForTimeout(1000)
```

### 5. エラーメッセージの検証

エラーハンドリングのテストでは、具体的なエラーメッセージを検証します。

```typescript
await expect(page.getByText('タイトルは必須です')).toBeVisible()
```

## トラブルシューティング

### テストがタイムアウトする

- `playwright.config.ts`のタイムアウト設定を確認
- `waitForLoadState('networkidle')`を使用して適切に待機

### 要素が見つからない

- `data-testid`属性が正しく設定されているか確認
- 要素が表示されるまで待機しているか確認

### テストが不安定（フレーキー）

- 固定時間の待機（`waitForTimeout`）を避ける
- 要素の状態を確認してから操作する
- `waitFor`メソッドを使用して要素の表示を待つ

## 参考リンク

- [Playwright公式ドキュメント](https://playwright.dev/)
- [Playwrightベストプラクティス](https://playwright.dev/docs/best-practices)
