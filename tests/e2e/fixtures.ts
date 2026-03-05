import { test as base } from '@playwright/test'

/**
 * E2Eテスト用のカスタムフィクスチャ
 *
 * テストで共通的に使用するヘルパー関数やモックデータを提供
 */

// カスタムフィクスチャの型定義
type CustomFixtures = {
  // 将来的に追加するカスタムフィクスチャ
}

// カスタムフィクスチャを含むtestオブジェクトをエクスポート
export const test = base.extend<CustomFixtures>({
  // カスタムフィクスチャの実装はここに追加
})

export { expect } from '@playwright/test'
