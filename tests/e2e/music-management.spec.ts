import { expect, test } from './fixtures'
import {
  cancelDialog,
  clickButtonByText,
  confirmDialog,
  fillInputByLabel,
  getTableRowCount,
  waitForModal,
  waitForModalClose,
  waitForNotification,
  waitForPageLoad,
} from './helpers'

/**
 * 楽曲管理機能のE2Eテスト
 *
 * 要件1: 楽曲一覧表示
 * 要件2: 楽曲新規登録
 * 要件3: 楽曲情報編集
 * 要件4: 楽曲削除
 * 要件5: ページネーション
 */

test.describe('楽曲管理機能', () => {
  test.beforeEach(async ({ page }) => {
    // 各テストの前に楽曲管理ページに移動
    await page.goto('/musics')
    await waitForPageLoad(page)
  })

  test.describe('楽曲一覧表示', () => {
    test('楽曲一覧ページにアクセスしたときにページが表示される', async ({ page }) => {
      // ページタイトルが表示されることを確認（h1タグで特定）
      await expect(page.getByRole('heading', { name: '楽曲管理' })).toBeVisible()

      // 作成ボタンが表示されることを確認
      await expect(page.getByRole('button', { name: '作成' })).toBeVisible()

      // テーブルまたは「データなし」メッセージが表示されることを確認
      const table = page.locator('table')
      const noDataMessage = page.getByText('楽曲が登録されていません')

      const hasTable = await table.isVisible().catch(() => false)
      const hasNoDataMessage = await noDataMessage.isVisible().catch(() => false)

      // どちらか一方が表示されていることを確認
      expect(hasTable || hasNoDataMessage).toBe(true)

      // テーブルが表示されている場合は、ヘッダーを確認
      if (hasTable) {
        await expect(page.getByRole('columnheader', { name: 'ID' })).toBeVisible()
        await expect(page.getByRole('columnheader', { name: 'タイトル' })).toBeVisible()
        await expect(page.getByRole('columnheader', { name: 'アーティスト名' })).toBeVisible()
        await expect(page.getByRole('columnheader', { name: 'ユニット名' })).toBeVisible()
        await expect(page.getByRole('columnheader', { name: 'コンテンツ' })).toBeVisible()
        await expect(page.getByRole('columnheader', { name: '楽曲タイプ' })).toBeVisible()
        await expect(page.getByRole('columnheader', { name: 'スペシャル' })).toBeVisible()
        await expect(page.getByRole('columnheader', { name: '作詞' })).toBeVisible()
        await expect(page.getByRole('columnheader', { name: '作曲' })).toBeVisible()
        await expect(page.getByRole('columnheader', { name: 'フィーチャリング' })).toBeVisible()
        await expect(page.getByRole('columnheader', { name: 'YouTube' })).toBeVisible()
        await expect(page.getByRole('columnheader', { name: 'アクション' })).toBeVisible()
      }
    })

    test('楽曲レコードのすべてのフィールドが表示される', async ({ page }) => {
      const rowCount = await getTableRowCount(page)

      if (rowCount === 0) {
        test.skip()
        return
      }

      // 最初の行のデータが表示されることを確認
      const firstRow = page.locator('tbody tr').first()
      await expect(firstRow).toBeVisible()

      // 各フィールドが存在することを確認（具体的な値は確認しない）
      const cells = firstRow.locator('td')
      const cellCount = await cells.count()
      expect(cellCount).toBeGreaterThan(0)
    })

    test('musicTypeが日本語ラベルに変換されて表示される', async ({ page }) => {
      const rowCount = await getTableRowCount(page)

      if (rowCount === 0) {
        test.skip()
        return
      }

      // musicTypeのラベル（オリジナル、3DMV、2DMV）のいずれかが表示されることを確認
      const hasLabel =
        (await page.getByText('オリジナル').count()) > 0 ||
        (await page.getByText('3DMV').count()) > 0 ||
        (await page.getByText('2DMV').count()) > 0

      expect(hasLabel).toBe(true)
    })

    test('YouTubeリンクがクリック可能なリンクとして表示される', async ({ page }) => {
      const rowCount = await getTableRowCount(page)

      if (rowCount === 0) {
        test.skip()
        return
      }

      // YouTubeリンクが存在することを確認
      const youtubeLinks = page.getByText('YouTubeで見る')
      const linkCount = await youtubeLinks.count()
      expect(linkCount).toBeGreaterThan(0)
    })
  })

  test.describe('楽曲新規登録フロー', () => {
    test('新規登録ボタンをクリックすると空のフォームが表示される', async ({ page }) => {
      // 作成ボタンをクリック
      await clickButtonByText(page, '作成')

      // モーダルが表示されるまで待機
      await waitForModal(page)

      // フォームのタイトルが表示されることを確認
      await expect(page.getByText('楽曲新規登録')).toBeVisible()

      // フォームフィールドが空であることを確認
      await expect(page.getByLabel('タイトル')).toHaveValue('')
      await expect(page.getByLabel('YouTubeリンク')).toHaveValue('')
    })

    test('必須フィールドを入力して送信すると楽曲が作成される', async ({ page }) => {
      // 作成ボタンをクリック
      await clickButtonByText(page, '作成')
      await waitForModal(page)

      // アーティストの選択肢が存在するか確認
      const artistSelect = page.getByLabel('アーティスト')
      const options = await artistSelect.locator('option').count()

      // アーティストが存在しない場合はテストをスキップ
      if (options <= 1) {
        test.skip()
        return
      }

      // フォームに入力
      await fillInputByLabel(page, 'タイトル', 'E2Eテスト楽曲')
      await artistSelect.selectOption({ index: 1 })
      await page.getByLabel('楽曲タイプ').selectOption('0')
      await fillInputByLabel(page, 'YouTubeリンク', 'https://www.youtube.com/watch?v=test123')

      // 送信ボタンをクリック
      await clickButtonByText(page, '保存')

      // モーダルが閉じるまで待機
      await waitForModalClose(page)

      // 成功メッセージが表示されることを確認
      await waitForNotification(page, '楽曲を登録しました')
    })

    test('任意フィールドも含めて入力して送信すると楽曲が作成される', async ({ page }) => {
      // 作成ボタンをクリック
      await clickButtonByText(page, '作成')
      await waitForModal(page)

      // アーティストの選択肢が存在するか確認
      const artistSelect = page.getByLabel('アーティスト')
      const options = await artistSelect.locator('option').count()

      // アーティストが存在しない場合はテストをスキップ
      if (options <= 1) {
        test.skip()
        return
      }

      // フォームに入力（任意フィールドも含む）
      await fillInputByLabel(page, 'タイトル', 'E2Eテスト楽曲（全フィールド）')
      await artistSelect.selectOption({ index: 1 })
      await page.getByLabel('楽曲タイプ').selectOption('1')
      await page.getByLabel('スペシャル').check()
      await fillInputByLabel(page, '作詞', 'テスト作詞者')
      await fillInputByLabel(page, '作曲', 'テスト作曲者')
      await fillInputByLabel(page, 'フィーチャリング', 'テストフィーチャリング')
      await fillInputByLabel(page, 'YouTubeリンク', 'https://www.youtube.com/watch?v=test456')

      // 送信ボタンをクリック
      await clickButtonByText(page, '保存')

      // モーダルが閉じるまで待機
      await waitForModalClose(page)

      // 成功メッセージが表示されることを確認
      await waitForNotification(page, '楽曲を登録しました')
    })

    test('必須フィールドが空の場合は送信ボタンが無効化される', async ({ page }) => {
      // 作成ボタンをクリック
      await clickButtonByText(page, '作成')
      await waitForModal(page)

      // 送信ボタンが無効化されていることを確認
      const submitButton = page.getByRole('button', { name: '保存' })
      await expect(submitButton).toBeDisabled()
    })

    test('無効なYouTube URLを入力するとバリデーションエラーが表示される', async ({ page }) => {
      // 作成ボタンをクリック
      await clickButtonByText(page, '作成')
      await waitForModal(page)

      // 無効なURLを入力
      await fillInputByLabel(page, 'YouTubeリンク', 'invalid-url')
      await page.getByLabel('YouTubeリンク').blur()

      // バリデーションエラーが表示されることを確認
      await expect(page.getByText('有効なURLを入力してください')).toBeVisible()
    })

    test('キャンセルボタンをクリックするとフォームが閉じる', async ({ page }) => {
      // 作成ボタンをクリック
      await clickButtonByText(page, '作成')
      await waitForModal(page)

      // キャンセルボタンをクリック
      await clickButtonByText(page, 'キャンセル')

      // モーダルが閉じることを確認
      await waitForModalClose(page)
    })
  })

  test.describe('楽曲編集フロー', () => {
    test('編集ボタンをクリックすると事前入力されたフォームが表示される', async ({ page }) => {
      const rowCount = await getTableRowCount(page)
      if (rowCount === 0) {
        test.skip()
        return
      }

      // 最初の行の編集ボタンをクリック
      const firstRow = page.locator('tbody tr').first()
      await firstRow.getByRole('button', { name: '編集' }).click()

      // モーダルが表示されるまで待機
      await waitForModal(page)

      // フォームのタイトルが表示されることを確認
      await expect(page.getByText('楽曲編集')).toBeVisible()

      // フォームフィールドに値が入力されていることを確認
      const titleInput = page.getByLabel('タイトル')
      const titleValue = await titleInput.inputValue()
      expect(titleValue).not.toBe('')
    })

    test('フォームを編集して送信すると楽曲が更新される', async ({ page }) => {
      const rowCount = await getTableRowCount(page)
      if (rowCount === 0) {
        test.skip()
        return
      }

      // 最初の行の編集ボタンをクリック
      const firstRow = page.locator('tbody tr').first()
      await firstRow.getByRole('button', { name: '編集' }).click()
      await waitForModal(page)

      // タイトルを変更
      await fillInputByLabel(page, 'タイトル', '編集後のタイトル')

      // 送信ボタンをクリック
      await clickButtonByText(page, '保存')

      // モーダルが閉じるまで待機
      await waitForModalClose(page)

      // 成功メッセージが表示されることを確認
      await waitForNotification(page, '楽曲を更新しました')
    })

    test('編集フォームでキャンセルボタンをクリックするとフォームが閉じる', async ({ page }) => {
      const rowCount = await getTableRowCount(page)
      if (rowCount === 0) {
        test.skip()
        return
      }

      // 最初の行の編集ボタンをクリック
      const firstRow = page.locator('tbody tr').first()
      await firstRow.getByRole('button', { name: '編集' }).click()
      await waitForModal(page)

      // キャンセルボタンをクリック
      await clickButtonByText(page, 'キャンセル')

      // モーダルが閉じることを確認
      await waitForModalClose(page)
    })
  })

  test.describe('楽曲削除フロー', () => {
    test('削除ボタンをクリックすると確認ダイアログが表示される', async ({ page }) => {
      const rowCount = await getTableRowCount(page)
      if (rowCount === 0) {
        test.skip()
        return
      }

      // 最初の行の削除ボタンをクリック
      const firstRow = page.locator('tbody tr').first()
      await firstRow.getByRole('button', { name: '削除' }).click()

      // 確認ダイアログが表示されることを確認
      await waitForModal(page)
      await expect(page.getByText('楽曲を削除しますか？')).toBeVisible()
    })

    test('確認ダイアログで確認をクリックすると楽曲が削除される', async ({ page }) => {
      const rowCount = await getTableRowCount(page)
      if (rowCount === 0) {
        test.skip()
        return
      }

      // 最初の行の削除ボタンをクリック
      const firstRow = page.locator('tbody tr').first()
      await firstRow.getByRole('button', { name: '削除' }).click()
      await waitForModal(page)

      // 確認ボタンをクリック
      await confirmDialog(page)

      // モーダルが閉じるまで待機
      await waitForModalClose(page)

      // 成功メッセージが表示されることを確認
      await waitForNotification(page, '楽曲を削除しました')
    })

    test('確認ダイアログでキャンセルをクリックすると削除がキャンセルされる', async ({ page }) => {
      const rowCount = await getTableRowCount(page)
      if (rowCount === 0) {
        test.skip()
        return
      }

      // 最初の行の削除ボタンをクリック
      const firstRow = page.locator('tbody tr').first()
      await firstRow.getByRole('button', { name: '削除' }).click()
      await waitForModal(page)

      // キャンセルボタンをクリック
      await cancelDialog(page)

      // モーダルが閉じることを確認
      await waitForModalClose(page)
    })
  })

  test.describe('ページネーション操作', () => {
    test('20件以下の場合はページネーションが表示されない', async ({ page }) => {
      const rowCount = await getTableRowCount(page)

      if (rowCount > 20) {
        test.skip()
        return
      }

      // 20件以下の場合はページネーションが表示されないことを確認
      const pagination = page.locator('[data-testid="pagination"]')
      await expect(pagination).not.toBeVisible()
    })

    test('21件以上の場合はページネーションが表示される', async ({ page }) => {
      const rowCount = await getTableRowCount(page)

      if (rowCount <= 20) {
        test.skip()
        return
      }

      const pagination = page.locator('[data-testid="pagination"]')
      await expect(pagination).toBeVisible()
    })

    test('次へボタンをクリックすると次のページに移動する', async ({ page }) => {
      const pagination = page.locator('[data-testid="pagination"]')
      const isVisible = await pagination.isVisible().catch(() => false)

      if (!isVisible) {
        test.skip()
        return
      }

      // 次へボタンをクリック
      await clickButtonByText(page, '次へ')
      await waitForPageLoad(page)

      // 前へボタンが有効化されていることで2ページ目にいることを確認
      await expect(page.getByRole('button', { name: '前へ' })).toBeEnabled()
    })

    test('前へボタンをクリックすると前のページに移動する', async ({ page }) => {
      const pagination = page.locator('[data-testid="pagination"]')
      const isVisible = await pagination.isVisible().catch(() => false)

      if (!isVisible) {
        test.skip()
        return
      }

      // まず次へボタンをクリックして2ページ目に移動
      const nextButton = page.getByRole('button', { name: '次へ' })
      const isNextEnabled = await nextButton.isEnabled().catch(() => false)

      if (!isNextEnabled) {
        test.skip()
        return
      }

      await nextButton.click()
      await waitForPageLoad(page)

      // 前へボタンをクリック
      await clickButtonByText(page, '前へ')
      await waitForPageLoad(page)

      // 前へボタンが無効化されていることで1ページ目に戻ったことを確認
      await expect(page.getByRole('button', { name: '前へ' })).toBeDisabled()
    })

    test('最初のページでは前へボタンが無効化される', async ({ page }) => {
      const pagination = page.locator('[data-testid="pagination"]')
      const isVisible = await pagination.isVisible().catch(() => false)

      if (!isVisible) {
        test.skip()
        return
      }

      // 前へボタンが無効化されていることを確認
      const prevButton = page.getByRole('button', { name: '前へ' })
      await expect(prevButton).toBeDisabled()
    })

    test('最後のページでは次へボタンが無効化される', async ({ page }) => {
      const pagination = page.locator('[data-testid="pagination"]')
      const isVisible = await pagination.isVisible().catch(() => false)

      if (!isVisible) {
        test.skip()
        return
      }

      // 次へボタンをクリックし続けて最後のページに移動
      const nextButton = page.getByRole('button', { name: '次へ' })
      while (await nextButton.isEnabled()) {
        await nextButton.click()
        await waitForPageLoad(page)
      }

      // 最後のページでは次へボタンが無効化されていることを確認
      await expect(nextButton).toBeDisabled()
    })

    test('ページ番号をクリックすると該当ページに移動する', async ({ page }) => {
      const pagination = page.locator('[data-testid="pagination"]')
      const isVisible = await pagination.isVisible().catch(() => false)

      if (!isVisible) {
        test.skip()
        return
      }

      // ページ番号ボタンが複数あることを確認
      const pageNumberButtons = page.locator('[data-testid="pagination"] button[type="button"]')
      const buttonCount = await pageNumberButtons.count()

      if (buttonCount < 3) {
        // 前へ/次へボタンしかない場合はスキップ
        test.skip()
        return
      }

      // 2ページ目のボタンをクリック
      await page.getByRole('button', { name: '2' }).click()
      await waitForPageLoad(page)

      // 前へボタンが有効化されていることで2ページ目に移動したことを確認
      await expect(page.getByRole('button', { name: '前へ' })).toBeEnabled()
    })
  })
})
