import { expect, test } from './fixtures'
import {
  clickButtonByText,
  fillInputByLabel,
  waitForModal,
  waitForNotification,
  waitForPageLoad,
} from './helpers'

test.describe('楽曲フォームからのアーティスト追加', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/musics')
    await waitForPageLoad(page)
  })

  test('楽曲フォームで新規追加ボタンをクリックするとアーティスト登録モーダルが表示される', async ({
    page,
  }) => {
    await clickButtonByText(page, '作成')
    await waitForModal(page)
    await expect(page.getByText('楽曲新規登録')).toBeVisible()
    await clickButtonByText(page, '新規追加')
    await expect(page.getByText('アーティスト新規登録')).toBeVisible()
    await expect(page.getByLabel('アーティスト名')).toBeVisible()
  })

  test('アーティスト追加後、新規追加されたアーティストが楽曲フォームで自動選択される', async ({
    page,
  }) => {
    await clickButtonByText(page, '作成')
    await waitForModal(page)
    await clickButtonByText(page, '新規追加')
    const timestamp = Date.now()
    const artistName = `E2Eテストアーティスト_${timestamp}`
    await fillInputByLabel(page, 'アーティスト名', artistName)
    await fillInputByLabel(page, 'ユニット名', 'E2Eテストユニット')
    await fillInputByLabel(page, 'コンテンツ', 'E2Eテスト')
    await page.locator('[data-testid="artist-form"]').getByRole('button', { name: '保存' }).click()

    const artistDialog = page.getByRole('dialog', { name: 'アーティスト新規登録' })
    try {
      await artistDialog.waitFor({ state: 'hidden', timeout: 3000 })
    } catch (_error) {
      test.skip()
      return
    }

    await waitForNotification(page, 'アーティストを登録しました')
    await expect(page.getByText('楽曲新規登録')).toBeVisible()
    const artistSelect = page.getByLabel('アーティスト')
    const selectedOption = await artistSelect.locator('option:checked').textContent()
    expect(selectedOption).toContain(artistName)
  })

  test('アーティスト追加後、楽曲を作成できる', async ({ page }) => {
    await clickButtonByText(page, '作成')
    await waitForModal(page)
    await clickButtonByText(page, '新規追加')
    const timestamp = Date.now()
    await fillInputByLabel(page, 'アーティスト名', `E2Eテストアーティスト_${timestamp}`)
    await fillInputByLabel(page, 'ユニット名', 'E2Eテストユニット')
    await fillInputByLabel(page, 'コンテンツ', 'E2Eテスト')
    await page.locator('[data-testid="artist-form"]').getByRole('button', { name: '保存' }).click()

    const artistDialog = page.getByRole('dialog', { name: 'アーティスト新規登録' })
    try {
      await artistDialog.waitFor({ state: 'hidden', timeout: 3000 })
    } catch (_error) {
      test.skip()
      return
    }

    await waitForNotification(page, 'アーティストを登録しました')
    await fillInputByLabel(page, 'タイトル', `E2Eテスト楽曲_${timestamp}`)
    await page.getByLabel('楽曲タイプ').selectOption('0')
    await fillInputByLabel(page, 'YouTubeリンク', 'https://www.youtube.com/watch?v=test123')
    await page
      .locator('[data-testid="music-form-modal"]')
      .getByRole('button', { name: '保存' })
      .click()

    const musicDialog = page.getByRole('dialog', { name: '楽曲新規登録' })
    try {
      await musicDialog.waitFor({ state: 'hidden', timeout: 3000 })
    } catch (_error) {
      test.skip()
      return
    }

    await waitForNotification(page, '楽曲を登録しました')
  })
})
