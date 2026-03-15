import { expect, test } from './fixtures'
import { waitForPageLoad } from './helpers'

/**
 * 認証機能のE2Eテスト
 *
 * 要件1: サインインページ表示
 * 要件2: 認証処理
 * 要件3: セッション管理
 */

// テスト用の認証トークン（.env.localのVITE_AUTH_TOKENと一致させる必要がある）
const VALID_PASSWORD = process.env.VITE_AUTH_TOKEN || 'test-auth-token'
const INVALID_PASSWORD = 'wrong-password'

test.describe('サインインフロー', () => {
  test.beforeEach(async ({ page }) => {
    // localStorageをクリアして未認証状態にする
    await page.goto('/signin')
    await page.evaluate(() => localStorage.clear())
    await page.goto('/signin')
    await waitForPageLoad(page)
  })

  test.describe('サインイン成功フロー', () => {
    test('正しいパスワードでサインインすると楽曲一覧ページにリダイレクトされる', async ({
      page,
    }) => {
      // サインインページが表示されることを確認
      await expect(page.getByRole('heading', { name: 'サインイン' })).toBeVisible()

      // パスワードを入力
      await page.getByLabel('パスワード').fill(VALID_PASSWORD)

      // サインインボタンをクリック
      await page.getByRole('button', { name: 'サインイン' }).click()

      // 楽曲一覧ページにリダイレクトされることを確認
      await page.waitForURL('**/musics')
      await expect(page).toHaveURL(/\/musics/)
    })

    test('サインイン後にナビゲーションが表示される', async ({ page }) => {
      // サインイン
      await page.getByLabel('パスワード').fill(VALID_PASSWORD)
      await page.getByRole('button', { name: 'サインイン' }).click()
      await page.waitForURL('**/musics')

      // ナビゲーションが表示されることを確認
      await expect(page.getByText('楽曲管理')).toBeVisible()
      await expect(page.getByText('アーティスト管理')).toBeVisible()
    })
  })

  test.describe('サインイン失敗フロー', () => {
    test('誤ったパスワードでサインインするとエラーメッセージが表示される', async ({ page }) => {
      // 誤ったパスワードを入力
      await page.getByLabel('パスワード').fill(INVALID_PASSWORD)

      // サインインボタンをクリック
      await page.getByRole('button', { name: 'サインイン' }).click()

      // エラーメッセージが表示されることを確認
      await expect(page.getByTestId('error-message')).toBeVisible()
      await expect(page.getByTestId('error-message')).toHaveText('認証に失敗しました')

      // サインインページに留まることを確認
      await expect(page).toHaveURL(/\/signin/)
    })

    test('空のパスワードではサインインボタンが無効化される', async ({ page }) => {
      // パスワードが空の状態でサインインボタンが無効化されていることを確認
      await expect(page.getByRole('button', { name: 'サインイン' })).toBeDisabled()
    })

    test('パスワード入力後にクリアするとサインインボタンが無効化される', async ({ page }) => {
      // パスワードを入力
      await page.getByLabel('パスワード').fill('some-text')
      await expect(page.getByRole('button', { name: 'サインイン' })).toBeEnabled()

      // パスワードをクリア
      await page.getByLabel('パスワード').fill('')
      await expect(page.getByRole('button', { name: 'サインイン' })).toBeDisabled()
    })
  })

  test.describe('セッション永続化', () => {
    test('サインイン後にページをリロードしても認証状態が維持される', async ({ page }) => {
      // サインイン
      await page.getByLabel('パスワード').fill(VALID_PASSWORD)
      await page.getByRole('button', { name: 'サインイン' }).click()
      await page.waitForURL('**/musics')

      // ページをリロード
      await page.reload()
      await waitForPageLoad(page)

      // 楽曲一覧ページに留まることを確認（サインインページにリダイレクトされない）
      await expect(page).toHaveURL(/\/musics/)
    })

    test('サインイン後に別の保護されたルートに直接アクセスできる', async ({ page }) => {
      // サインイン
      await page.getByLabel('パスワード').fill(VALID_PASSWORD)
      await page.getByRole('button', { name: 'サインイン' }).click()
      await page.waitForURL('**/musics')

      // アーティスト管理ページに直接アクセス
      await page.goto('/artists')
      await waitForPageLoad(page)

      // アーティスト管理ページが表示されることを確認
      await expect(page).toHaveURL(/\/artists/)
    })

    test('localStorageにトークンが保存されている状態でアクセスすると認証済みとして扱われる', async ({
      page,
    }) => {
      // サインインしてトークンを保存
      await page.getByLabel('パスワード').fill(VALID_PASSWORD)
      await page.getByRole('button', { name: 'サインイン' }).click()
      await page.waitForURL('**/musics')

      // 新しいページコンテキストで楽曲一覧ページにアクセス
      // （localStorageは同一オリジンで共有される）
      await page.goto('/musics')
      await waitForPageLoad(page)

      // 認証済みとして楽曲一覧ページが表示されることを確認
      await expect(page).toHaveURL(/\/musics/)
      await expect(page.getByTestId('sign-out-button')).toBeVisible()
    })
  })
})

/**
 * サインアウトフローのE2Eテスト
 *
 * 要件4: サインアウト機能
 *   4.1 認証済みユーザーにサインアウトボタンを表示
 *   4.2 サインアウト時にlocalStorageからトークンを削除
 *   4.3 サインアウト後にサインインページへリダイレクト
 */
test.describe('サインアウトフロー', () => {
  test.beforeEach(async ({ page }) => {
    // localStorageをクリアして未認証状態にする
    await page.goto('/signin')
    await page.evaluate(() => localStorage.clear())
    await page.goto('/signin')
    await waitForPageLoad(page)

    // サインインして認証済み状態にする
    await page.getByLabel('パスワード').fill(VALID_PASSWORD)
    await page.getByRole('button', { name: 'サインイン' }).click()
    await page.waitForURL('**/musics')
  })

  test('認証済み状態でサインアウトボタンが表示される', async ({ page }) => {
    // Requirements: 4.1
    await expect(page.getByTestId('sign-out-button')).toBeVisible()
    await expect(page.getByTestId('sign-out-button')).toHaveText('サインアウト')
  })

  test('サインアウトボタンをクリックするとサインインページにリダイレクトされる', async ({
    page,
  }) => {
    // Requirements: 4.2, 4.3
    await page.getByTestId('sign-out-button').click()

    // サインインページにリダイレクトされることを確認
    await page.waitForURL('**/signin')
    await expect(page).toHaveURL(/\/signin/)
  })

  test('サインアウト後にlocalStorageからトークンが削除される', async ({ page }) => {
    // Requirements: 4.2
    // サインアウト前にトークンが存在することを確認
    const tokenBefore = await page.evaluate(() => localStorage.getItem('auth_token'))
    expect(tokenBefore).not.toBeNull()

    // サインアウト
    await page.getByTestId('sign-out-button').click()
    await page.waitForURL('**/signin')

    // localStorageからトークンが削除されていることを確認
    const tokenAfter = await page.evaluate(() => localStorage.getItem('auth_token'))
    expect(tokenAfter).toBeNull()
  })

  test('サインアウト後に保護されたルートにアクセスするとサインインページにリダイレクトされる', async ({
    page,
  }) => {
    // Requirements: 4.3
    // サインアウト
    await page.getByTestId('sign-out-button').click()
    await page.waitForURL('**/signin')

    // 保護されたルートに直接アクセス
    await page.goto('/musics')
    await waitForPageLoad(page)

    // サインインページにリダイレクトされることを確認
    await expect(page).toHaveURL(/\/signin/)
  })

  test('サインアウト後にアーティスト管理ページにアクセスするとサインインページにリダイレクトされる', async ({
    page,
  }) => {
    // Requirements: 4.3
    // サインアウト
    await page.getByTestId('sign-out-button').click()
    await page.waitForURL('**/signin')

    // アーティスト管理ページに直接アクセス
    await page.goto('/artists')
    await waitForPageLoad(page)

    // サインインページにリダイレクトされることを確認
    await expect(page).toHaveURL(/\/signin/)
  })
})
