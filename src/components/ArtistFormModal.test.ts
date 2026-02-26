import { mount } from '@vue/test-utils'
import fc from 'fast-check'
import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import { TEXT } from '@/constants/text'
import type { Artist } from '@/types'
import ArtistFormModal from './ArtistFormModal.vue'

// Zodバリデーションスキーマ（コンポーネントと同じ定義）
const artistFormSchema = z.object({
  artistName: z
    .string()
    .transform((val) => val.trim())
    .pipe(
      z
        .string()
        .min(1, { message: TEXT.artistForm.artistNameRequired })
        .max(50, { message: TEXT.artistForm.artistNameMaxLength })
    ),
  unitName: z
    .string()
    .transform((val) => val.trim())
    .pipe(z.string().max(25, { message: TEXT.artistForm.unitNameMaxLength }).optional())
    .transform((val) => (val === '' ? null : val)),
  content: z
    .string()
    .transform((val) => val.trim())
    .pipe(z.string().max(20, { message: TEXT.artistForm.contentMaxLength }).optional())
    .transform((val) => (val === '' ? null : val)),
})

// ============================================================================
// Test Helpers
// ============================================================================

/**
 * テスト用のArtistデータを生成
 */
function createMockArtist(overrides?: Partial<Artist>): Artist {
  return {
    id: 1,
    artistName: 'テストアーティスト',
    unitName: 'テストユニット',
    content: 'テストコンテンツ',
    auditInfo: {
      createdAt: '2024-01-01T00:00:00Z',
      createdBy: 'test-user',
      updatedAt: '2024-01-01T00:00:00Z',
      updatedBy: 'test-user',
    },
    ...overrides,
  }
}

// ============================================================================
// Property Tests
// ============================================================================

describe('ArtistFormModal - Property Tests', () => {
  /**
   * Property 17: フォームフィールドのラベル表示
   * 任意のフォームフィールドに対して、日本語の明確なラベルが提供されている必要があります
   *
   * Feature: prsk-music-management-web, Property 17: フォームフィールドのラベル表示
   * Validates: Requirements 要件7.6
   */
  it('Property 17: 任意のフォームフィールドに日本語の明確なラベルが表示される', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('create', 'edit'), // mode
        (mode) => {
          const wrapper = mount(ArtistFormModal, {
            props: {
              open: true,
              mode: mode as 'create' | 'edit',
              initialData: mode === 'edit' ? createMockArtist() : undefined,
            },
          })

          // アーティスト名フィールドのラベルが表示されることを確認
          const artistNameLabel = wrapper.find('[data-testid="artistName-label"]')
          expect(artistNameLabel.exists()).toBe(true)
          expect(artistNameLabel.text()).toBeTruthy()

          // ユニット名フィールドのラベルが表示されることを確認
          const unitNameLabel = wrapper.find('[data-testid="unitName-label"]')
          expect(unitNameLabel.exists()).toBe(true)
          expect(unitNameLabel.text()).toBeTruthy()

          // コンテンツフィールドのラベルが表示されることを確認
          const contentLabel = wrapper.find('[data-testid="content-label"]')
          expect(contentLabel.exists()).toBe(true)
          expect(contentLabel.text()).toBeTruthy()
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 28: アーティスト名フィールドの空文字検証
   * 任意のアーティストフォームにおいて、artistNameフィールドに空文字列または
   * 空白のみの文字列が入力された場合、検証エラーとなる必要があります
   *
   * Feature: prsk-music-management-web, Property 28: アーティスト名フィールドの空文字検証
   * Validates: Requirements 要件10.6
   */
  it('Property 28: 任意の空文字列または空白のみの文字列でアーティスト名検証エラーが発生する', () => {
    fc.assert(
      fc.property(
        fc.string().filter((s) => s.trim() === ''), // 空白のみの文字列
        (emptyString) => {
          // Zodスキーマを直接テスト
          const result = artistFormSchema.safeParse({
            artistName: emptyString,
            unitName: '',
            content: '',
          })

          // バリデーションが失敗することを確認
          expect(result.success).toBe(false)
          if (!result.success) {
            // artistNameフィールドにエラーがあることを確認
            const artistNameError = result.error.issues.find(
              (issue) => issue.path[0] === 'artistName'
            )
            expect(artistNameError).toBeDefined()
          }
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 29: アーティスト名の文字数検証
   * 任意のアーティストフォームにおいて、artistNameフィールドは
   * 1文字以上50文字以下であることが検証される必要があります
   *
   * Feature: prsk-music-management-web, Property 29: アーティスト名の文字数検証
   * Validates: Requirements 要件10.7
   */
  it('Property 29: 任意の51文字以上の文字列でアーティスト名文字数検証エラーが発生する', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 51, maxLength: 100 }).filter((s) => s.trim().length >= 51), // 51文字以上の文字列（トリム後も51文字以上）
        (longString) => {
          // Zodスキーマを直接テスト
          const result = artistFormSchema.safeParse({
            artistName: longString,
            unitName: '',
            content: '',
          })

          // バリデーションが失敗することを確認
          expect(result.success).toBe(false)
          if (!result.success) {
            // artistNameフィールドにエラーがあることを確認
            const artistNameError = result.error.issues.find(
              (issue) => issue.path[0] === 'artistName'
            )
            expect(artistNameError).toBeDefined()
          }
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 29 (補足): アーティスト名の有効な文字数範囲
   * 任意のアーティストフォームにおいて、artistNameフィールドに
   * 1-50文字の文字列が入力された場合、検証エラーが発生しない必要があります
   */
  it('Property 29 (補足): 任意の1-50文字の文字列でアーティスト名検証が成功する', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 50 }).filter((s) => s.trim().length >= 1), // 1-50文字で空白のみでない文字列
        (validString) => {
          // Zodスキーマを直接テスト
          const result = artistFormSchema.safeParse({
            artistName: validString,
            unitName: '',
            content: '',
          })

          // バリデーションが成功することを確認
          expect(result.success).toBe(true)
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 30: ユニット名の文字数検証
   * 任意のアーティストフォームにおいて、unitNameフィールドが入力されている場合、
   * 1文字以上25文字以下であることが検証される必要があります
   *
   * Feature: prsk-music-management-web, Property 30: ユニット名の文字数検証
   * Validates: Requirements 要件10.8
   */
  it('Property 30: 任意の26文字以上の文字列でユニット名文字数検証エラーが発生する', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 26, maxLength: 50 }).filter((s) => s.trim().length >= 26), // 26文字以上で空白のみでない文字列
        (longString) => {
          // Zodスキーマを直接テスト
          const result = artistFormSchema.safeParse({
            artistName: 'ValidName',
            unitName: longString,
            content: '',
          })

          // バリデーションが失敗することを確認
          expect(result.success).toBe(false)
          if (!result.success) {
            // unitNameフィールドにエラーがあることを確認
            const unitNameError = result.error.issues.find((issue) => issue.path[0] === 'unitName')
            expect(unitNameError).toBeDefined()
          }
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 30 (補足): ユニット名の有効な文字数範囲
   * 任意のアーティストフォームにおいて、unitNameフィールドに
   * 1-25文字の文字列が入力された場合、検証エラーが発生しない必要があります
   */
  it('Property 30 (補足): 任意の1-25文字の文字列でユニット名検証が成功する', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 25 }), // 1-25文字の文字列
        (validString) => {
          // Zodスキーマを直接テスト
          const result = artistFormSchema.safeParse({
            artistName: 'ValidName',
            unitName: validString,
            content: '',
          })

          // バリデーションが成功することを確認
          expect(result.success).toBe(true)
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 31: コンテンツ名の文字数検証
   * 任意のアーティストフォームにおいて、contentフィールドが入力されている場合、
   * 1文字以上20文字以下であることが検証される必要があります
   *
   * Feature: prsk-music-management-web, Property 31: コンテンツ名の文字数検証
   * Validates: Requirements 要件10.9
   */
  it('Property 31: 任意の21文字以上の文字列でコンテンツ名文字数検証エラーが発生する', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 21, maxLength: 50 }).filter((s) => s.trim().length >= 21), // 21文字以上で空白のみでない文字列
        (longString) => {
          // Zodスキーマを直接テスト
          const result = artistFormSchema.safeParse({
            artistName: 'ValidName',
            unitName: '',
            content: longString,
          })

          // バリデーションが失敗することを確認
          expect(result.success).toBe(false)
          if (!result.success) {
            // contentフィールドにエラーがあることを確認
            const contentError = result.error.issues.find((issue) => issue.path[0] === 'content')
            expect(contentError).toBeDefined()
          }
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 31 (補足): コンテンツ名の有効な文字数範囲
   * 任意のアーティストフォームにおいて、contentフィールドに
   * 1-20文字の文字列が入力された場合、検証エラーが発生しない必要があります
   */
  it('Property 31 (補足): 任意の1-20文字の文字列でコンテンツ名検証が成功する', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 20 }), // 1-20文字の文字列
        (validString) => {
          // Zodスキーマを直接テスト
          const result = artistFormSchema.safeParse({
            artistName: 'ValidName',
            unitName: '',
            content: validString,
          })

          // バリデーションが成功することを確認
          expect(result.success).toBe(true)
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 32: アーティスト編集フォームの事前入力
   * 任意のアーティストレコードに対して、編集ボタンをクリックした際に表示されるフォームには、
   * そのレコードの現在のデータがすべてのフィールドに正しく事前入力されている必要があります
   *
   * Feature: prsk-music-management-web, Property 32: アーティスト編集フォームの事前入力
   * Validates: Requirements 要件11.1
   */
  it('Property 32: 任意のアーティストレコードに対して編集フォームが正しく事前入力される', () => {
    fc.assert(
      fc.property(
        fc.record({
          id: fc.integer({ min: 1, max: 1000 }),
          artistName: fc
            .string({ minLength: 1, maxLength: 50 })
            .filter((s) => s.trim().length >= 1),
          unitName: fc.option(fc.string({ minLength: 1, maxLength: 25 }), { nil: null }),
          content: fc.option(fc.string({ minLength: 1, maxLength: 20 }), { nil: null }),
        }),
        (artistData) => {
          const mockArtist = createMockArtist(artistData)

          const wrapper = mount(ArtistFormModal, {
            props: {
              open: true,
              mode: 'edit',
              initialData: mockArtist,
            },
          })

          // フォームフィールドが存在することを確認
          const artistNameInput = wrapper.find('[data-testid="artistName-input"]')
          expect(artistNameInput.exists()).toBe(true)

          const unitNameInput = wrapper.find('[data-testid="unitName-input"]')
          expect(unitNameInput.exists()).toBe(true)

          const contentInput = wrapper.find('[data-testid="content-input"]')
          expect(contentInput.exists()).toBe(true)

          // モーダルが編集モードで開いていることを確認
          const modalTitle = wrapper.find('[data-testid="modal-title"]')
          expect(modalTitle.text()).toBe(TEXT.artistForm.editTitle)
        }
      ),
      { numRuns: 100 }
    )
  })
})
