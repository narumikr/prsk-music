import { expect, test } from './fixtures'
import { waitForPageLoad } from './helpers'

/**
 * Playwright設定確認用のサンプルテスト
 *
 * このテストは、Playwright設定が正しく動作することを確認するためのものです。
 * 実際のE2Eテストは別のファイルに実装します。
 */

test.describe('Playwright設定確認', () => {
  test('アプリケーションが起動する', async ({ page }) => {
    // ルートパスにアクセス
    await page.goto('/')
    await waitForPageLoad(page)

    // /musicsにリダイレクトされることを確認
    await expect(page).toHaveURL('/musics')
  })

  test('楽曲管理ページが表示される', async ({ page }) => {
    await page.goto('/musics')
    await waitForPageLoad(page)

    // ページタイトルが表示されることを確認
    await expect(page.getByText('楽曲管理')).toBeVisible()
  })

  test('アーティスト管理ページが表示される', async ({ page }) => {
    await page.goto('/artists')
    await waitForPageLoad(page)

    // ページタイトルが表示されることを確認
    await expect(page.getByText('アーティスト管理')).toBeVisible()
  })

  test('ナビゲーションメニューが表示される', async ({ page }) => {
    await page.goto('/musics')
    await waitForPageLoad(page)

    // ナビゲーションメニューのリンクが表示されることを確認
    await expect(page.getByRole('link', { name: '楽曲管理' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'アーティスト管理' })).toBeVisible()
  })

  test('楽曲管理とアーティスト管理の間を移動できる', async ({ page }) => {
    // 楽曲管理ページから開始
    await page.goto('/musics')
    await waitForPageLoad(page)

    // アーティスト管理ページに移動
    await page.getByRole('link', { name: 'アーティスト管理' }).click()
    await waitForPageLoad(page)
    await expect(page).toHaveURL('/artists')

    // 楽曲管理ページに戻る
    await page.getByRole('link', { name: '楽曲管理' }).click()
    await waitForPageLoad(page)
    await expect(page).toHaveURL('/musics')
  })
})
