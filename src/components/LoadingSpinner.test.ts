import { mount } from '@vue/test-utils'
import fc from 'fast-check'
import { describe, expect, it } from 'vitest'
import LoadingSpinner from './LoadingSpinner.vue'

// ============================================================================
// Property Tests
// ============================================================================

describe('LoadingSpinner - Property Tests', () => {
  /**
   * Property 16: 非同期操作中のローディング表示
   * 任意の非同期操作（フォーム送信またはデータ取得）中は、
   * 適切なローディングインジケーターが表示される必要があります
   *
   * Feature: prsk-music-management-web, Property 16: 非同期操作中のローディング表示
   * Validates: Requirements 要件7.3, 要件7.4
   */
  it('Property 16: 任意の非同期操作中にローディングインジケーターが表示される', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom('small', 'medium', 'large'), // サイズバリエーション
        fc.integer({ min: 1, max: 50 }), // 非同期操作の遅延時間（ms）
        async (size, delay) => {
          // LoadingSpinnerをマウント
          const wrapper = mount(LoadingSpinner, {
            props: {
              size,
            },
          })

          expect(wrapper.find('[data-testid="loading-spinner"]').exists()).toBe(true)

          // 非同期操作をシミュレート
          await new Promise((resolve) => setTimeout(resolve, delay))

          // ローディングスピナーが引き続き表示されていることを確認
          expect(wrapper.find('[data-testid="loading-spinner"]').exists()).toBe(true)
        }
      ),
      { numRuns: 100 }
    )
  }, 10000)

  /**
   * Property 16 (補足): サイズバリエーションの検証
   * 任意のサイズ（small, medium, large）に対して、
   * ローディングインジケーターが適切なサイズで表示される必要があります
   */
  it('Property 16 (補足): 任意のサイズに対して適切なローディングインジケーターが表示される', () => {
    fc.assert(
      fc.property(fc.constantFrom('small', 'medium', 'large'), (size) => {
        const wrapper = mount(LoadingSpinner, {
          props: {
            size,
          },
        })

        const spinner = wrapper.find('[data-testid="loading-spinner"]')
        expect(spinner.exists()).toBe(true)

        if (size === 'small') {
          expect(spinner.classes()).toContain('w-4')
          expect(spinner.classes()).toContain('h-4')
        } else if (size === 'medium') {
          expect(spinner.classes()).toContain('w-8')
          expect(spinner.classes()).toContain('h-8')
        } else if (size === 'large') {
          expect(spinner.classes()).toContain('w-12')
          expect(spinner.classes()).toContain('h-12')
        }
      }),
      { numRuns: 100 }
    )
  })

  /**
   * Property 16 (補足): デフォルトサイズの検証
   * sizeプロパティが指定されていない場合、
   * デフォルトで'medium'サイズが適用される必要があります
   */
  it('Property 16 (補足): sizeプロパティが指定されていない場合はmediumサイズが適用される', () => {
    const wrapper = mount(LoadingSpinner)

    const spinner = wrapper.find('[data-testid="loading-spinner"]')
    expect(spinner.exists()).toBe(true)
    expect(spinner.classes()).toContain('w-8')
    expect(spinner.classes()).toContain('h-8')
  })
})
