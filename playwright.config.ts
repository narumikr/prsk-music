import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright E2Eテスト設定
 *
 * プロセカ楽曲・アーティスト管理Webページのエンドツーエンドテスト設定
 */
export default defineConfig({
  // テストディレクトリ
  testDir: './tests/e2e',

  // 並列実行を有効化
  fullyParallel: true,

  // CI環境では.only()を禁止
  forbidOnly: !!process.env.CI,

  // CI環境では失敗時に2回リトライ
  retries: process.env.CI ? 2 : 0,

  // CI環境では1ワーカー、ローカルでは並列実行
  workers: process.env.CI ? 1 : undefined,

  // レポーター設定
  reporter: [['html', { outputFolder: 'playwright-report' }], ['list']],

  // グローバルタイムアウト設定
  timeout: 30000, // 30秒
  expect: {
    timeout: 5000, // 5秒
  },

  // 共通設定
  use: {
    // ベースURL
    baseURL: 'http://localhost:5173',

    // トレース設定（失敗時のみ記録）
    trace: 'on-first-retry',

    // スクリーンショット設定（失敗時のみ）
    screenshot: 'only-on-failure',

    // ビデオ設定（失敗時のみ）
    video: 'retain-on-failure',

    // ナビゲーションタイムアウト
    navigationTimeout: 10000,

    // アクションタイムアウト
    actionTimeout: 5000,
  },

  // ブラウザプロジェクト設定
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
      },
    },

    // Firefox（オプション）
    // {
    //   name: 'firefox',
    //   use: {
    //     ...devices['Desktop Firefox'],
    //     viewport: { width: 1280, height: 720 },
    //   },
    // },

    // Safari（オプション）
    // {
    //   name: 'webkit',
    //   use: {
    //     ...devices['Desktop Safari'],
    //     viewport: { width: 1280, height: 720 },
    //   },
    // },

    // タブレット（オプション）
    // {
    //   name: 'tablet',
    //   use: {
    //     ...devices['iPad Pro'],
    //   },
    // },
  ],

  // 開発サーバー設定
  webServer: {
    command: 'pnpm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120000, // 2分
  },
})
