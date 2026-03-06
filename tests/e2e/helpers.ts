import type { Page } from '@playwright/test'

/**
 * E2Eテスト用のヘルパー関数
 */

/**
 * ページが完全に読み込まれるまで待機
 */
export async function waitForPageLoad(page: Page) {
  await page.waitForLoadState('networkidle')
}

/**
 * 指定されたテキストを持つボタンをクリック
 */
export async function clickButtonByText(page: Page, text: string) {
  await page.getByRole('button', { name: text }).click()
}

/**
 * 指定されたラベルを持つ入力フィールドに値を入力
 */
export async function fillInputByLabel(page: Page, label: string, value: string) {
  await page.getByLabel(label).fill(value)
}

/**
 * テーブルの行数を取得
 */
export async function getTableRowCount(page: Page): Promise<number> {
  const rows = await page.locator('tbody tr').count()
  return rows
}

/**
 * モーダルが表示されるまで待機
 */
export async function waitForModal(page: Page) {
  await page.locator('[role="dialog"]').waitFor({ state: 'visible' })
}

/**
 * モーダルが非表示になるまで待機
 */
export async function waitForModalClose(page: Page) {
  await page.locator('[role="dialog"]').waitFor({ state: 'hidden' })
}

/**
 * 通知メッセージが表示されるまで待機
 */
export async function waitForNotification(page: Page, message: string) {
  await page.getByText(message).waitFor({ state: 'visible' })
}

/**
 * ページネーションの特定のページに移動
 */
export async function goToPage(page: Page, pageNumber: number) {
  await page.getByRole('button', { name: pageNumber.toString() }).click()
  await waitForPageLoad(page)
}

/**
 * 確認ダイアログで確認ボタンをクリック
 */
export async function confirmDialog(page: Page) {
  await page.getByRole('button', { name: '確認' }).click()
}

/**
 * 確認ダイアログでキャンセルボタンをクリック
 */
export async function cancelDialog(page: Page) {
  await page.getByRole('button', { name: 'キャンセル' }).click()
}
