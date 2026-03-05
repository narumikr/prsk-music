import { expect, test } from './fixtures'
import {
  clickButtonByText,
  fillInputByLabel,
  getTableRowCount,
  waitForModal,
  waitForModalClose,
  waitForNotification,
  waitForPageLoad,
} from './helpers'

/**
 * エラーハンドリングのE2Eテスト
 *
 * 要件2: 楽曲新規登録
 * 要件3: 楽曲情報編集
 * 要件6: エラーハンドリング
 *
 * このテストは実際のAPIサーバーが必要です。
 * APIサーバーが起動していない場合、テストはスキップされます。
 */

test.describe('エラーハンドリング', () => {
  test.describe('楽曲管理 - 409 Conflict（重複データ）', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/musics')
      await waitForPageLoad(page)
    })

    test('重複データ登録時に409エラーが表示される', async ({ page }) => {
      // アーティストの選択肢が存在するか確認
      await clickButtonByText(page, '作成')
      await waitForModal(page)

      const artistSelect = page.getByLabel('アーティスト')
      const options = await artistSelect.locator('option').count()

      if (options <= 1) {
        test.skip()
        return
      }

      // 既存の楽曲データを取得
      await clickButtonByText(page, 'キャンセル')
      await waitForModalClose(page)

      const rowCount = await getTableRowCount(page)
      if (rowCount === 0) {
        test.skip()
        return
      }

      // 最初の行のタイトルとmusicTypeを取得
      const firstRow = page.locator('tbody tr').first()
      const cells = firstRow.locator('td')
      const title = await cells.nth(1).textContent()
      const musicTypeText = await cells.nth(5).textContent()

      if (!title || !musicTypeText) {
        test.skip()
        return
      }

      // musicTypeのラベルから数値に変換
      let musicType = '0'
      if (musicTypeText.includes('3DMV')) {
        musicType = '1'
      } else if (musicTypeText.includes('2DMV')) {
        musicType = '2'
      }

      // 同じタイトルとmusicTypeで新規登録を試みる
      await clickButtonByText(page, '作成')
      await waitForModal(page)

      await fillInputByLabel(page, 'タイトル', title)
      await artistSelect.selectOption({ index: 1 })
      await page.getByLabel('楽曲タイプ').selectOption(musicType)
      await fillInputByLabel(page, 'YouTubeリンク', 'https://www.youtube.com/watch?v=duplicate')

      await clickButtonByText(page, '保存')

      // 409エラーメッセージが表示されることを確認
      // APIが409を返す場合、通知ダイアログにエラーメッセージが表示される
      await waitForNotification(page, '同じタイトルと楽曲タイプの楽曲が既に存在します')
    })
  })

  test.describe('楽曲管理 - 400 Bad Request（無効なデータ）', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/musics')
      await waitForPageLoad(page)
    })

    test('無効なデータ送信時に400エラーが表示される', async ({ page: _page }) => {
      // このテストはクライアント側のバリデーションをバイパスして
      // サーバー側のバリデーションエラーを確認する必要があります。
      // 実際のAPIサーバーが必要です。

      // 現在の実装では、クライアント側のバリデーションが厳密なため、
      // 無効なデータを送信することが困難です。
      // このテストは、将来的にAPIサーバーのモックを使用して実装する予定です。

      test.skip()
    })

    test('クライアント側のバリデーションエラーが表示される', async ({ page }) => {
      await clickButtonByText(page, '作成')
      await waitForModal(page)

      // 無効なYouTube URLを入力
      await fillInputByLabel(page, 'YouTubeリンク', 'invalid-url')
      await page.getByLabel('YouTubeリンク').blur()

      // バリデーションエラーが表示されることを確認
      await expect(page.getByText('有効なURLを入力してください')).toBeVisible()

      // 送信ボタンが無効化されていることを確認
      const submitButton = page.getByRole('button', { name: '保存' })
      await expect(submitButton).toBeDisabled()
    })
  })

  test.describe('楽曲管理 - 404 Not Found（存在しないレコード）', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/musics')
      await waitForPageLoad(page)
    })

    test('存在しないレコード操作時に404エラーが表示される', async ({ page: _page }) => {
      // このテストは実際のAPIサーバーが必要です。
      // 存在しないIDに対して編集または削除を試みる必要があります。

      // 現在の実装では、UIから存在しないIDを指定することが困難です。
      // このテストは、将来的にAPIサーバーのモックを使用して実装する予定です。

      test.skip()
    })
  })

  test.describe('アーティスト管理 - 409 Conflict（重複データ）', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/artists')
      await waitForPageLoad(page)
    })

    test('重複データ登録時に409エラーが表示される', async ({ page }) => {
      const rowCount = await getTableRowCount(page)
      if (rowCount === 0) {
        test.skip()
        return
      }

      // 最初の行のアーティスト名を取得
      const firstRow = page.locator('tbody tr').first()
      const cells = firstRow.locator('td')
      const artistName = await cells.nth(1).textContent()

      if (!artistName) {
        test.skip()
        return
      }

      // 同じアーティスト名で新規登録を試みる
      await clickButtonByText(page, '作成')
      await waitForModal(page)

      await fillInputByLabel(page, 'アーティスト名', artistName)

      await clickButtonByText(page, '保存')

      // 409エラーメッセージが表示されることを確認
      await waitForNotification(page, '同じアーティスト名が既に存在します')
    })
  })

  test.describe('アーティスト管理 - 400 Bad Request（無効なデータ）', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/artists')
      await waitForPageLoad(page)
    })

    test('無効なデータ送信時に400エラーが表示される', async ({ page: _page }) => {
      // このテストはクライアント側のバリデーションをバイパスして
      // サーバー側のバリデーションエラーを確認する必要があります。
      // 実際のAPIサーバーが必要です。

      test.skip()
    })

    test('クライアント側のバリデーションエラーが表示される', async ({ page }) => {
      await clickButtonByText(page, '作成')
      await waitForModal(page)

      // 51文字のアーティスト名を入力
      const longName = 'あ'.repeat(51)
      await fillInputByLabel(page, 'アーティスト名', longName)
      await page.getByLabel('アーティスト名').blur()

      // バリデーションエラーが表示されることを確認
      await expect(page.getByText('アーティスト名は50文字以内で入力してください')).toBeVisible()

      // 送信ボタンが無効化されていることを確認
      const submitButton = page.getByRole('button', { name: '保存' })
      await expect(submitButton).toBeDisabled()
    })
  })

  test.describe('アーティスト管理 - 404 Not Found（存在しないレコード）', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/artists')
      await waitForPageLoad(page)
    })

    test('存在しないレコード操作時に404エラーが表示される', async ({ page: _page }) => {
      // このテストは実際のAPIサーバーが必要です。
      // 存在しないIDに対して編集または削除を試みる必要があります。

      test.skip()
    })
  })

  test.describe('ネットワークエラー', () => {
    test('APIサーバーが停止している場合のエラー表示', async ({ page: _page }) => {
      // このテストは実際のAPIサーバーが停止している状態で実行する必要があります。
      // または、ネットワークをシミュレートする必要があります。

      test.skip()
    })
  })
})
