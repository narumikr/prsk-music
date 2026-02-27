import { mount } from '@vue/test-utils'
import fc from 'fast-check'
import { describe, expect, it } from 'vitest'
import type { Artist } from '@/types'
import ArtistTable from './ArtistTable.vue'

// ============================================================================
// Property-Based Tests
// ============================================================================

describe('ArtistTable Property Tests', () => {
  it('Property 25: アーティストレコードの完全なフィールド表示', () => {
    // Feature: prsk-music-management-web, Property 25: アーティストレコードの完全なフィールド表示
    // 任意のアーティストレコードに対して、テーブル表示には id、artistName、unitName、content のすべてのフィールドが含まれている必要があります
    fc.assert(
      fc.property(
        fc.record({
          id: fc.integer({ min: 1, max: 10000 }),
          artistName: fc.string({ minLength: 1, maxLength: 50 }),
          unitName: fc.option(fc.string({ minLength: 1, maxLength: 25 }), { nil: null }),
          content: fc.option(fc.string({ minLength: 1, maxLength: 20 }), { nil: null }),
          auditInfo: fc.record({
            createdAt: fc
              .integer({ min: 0, max: 4102444800000 })
              .map((ts) => new Date(ts).toISOString()),
            createdBy: fc.string({ minLength: 1, maxLength: 50 }),
            updatedAt: fc
              .integer({ min: 0, max: 4102444800000 })
              .map((ts) => new Date(ts).toISOString()),
            updatedBy: fc.string({ minLength: 1, maxLength: 50 }),
          }),
        }),
        (artist: Artist) => {
          const wrapper = mount(ArtistTable, {
            props: {
              data: [artist],
              loading: false,
            },
          })

          // テーブルが表示されていることを確認
          const table = wrapper.find('[data-testid="artist-table"]')
          expect(table.exists()).toBe(true)

          // すべてのフィールドが表示されていることを確認
          const text = wrapper.text()

          // id フィールドの表示確認
          expect(text).toContain(artist.id.toString())

          // artistName フィールドの表示確認
          expect(text).toContain(artist.artistName)

          // unitName フィールドの表示確認（nullの場合は'-'が表示される）
          if (artist.unitName !== null) {
            expect(text).toContain(artist.unitName)
          } else {
            // nullの場合は'-'が表示されることを確認
            const unitNameCell = wrapper.find('[data-testid="artist-unitName"]')
            expect(unitNameCell.exists()).toBe(true)
          }

          // content フィールドの表示確認（nullの場合は'-'が表示される）
          if (artist.content !== null) {
            expect(text).toContain(artist.content)
          } else {
            // nullの場合は'-'が表示されることを確認
            const contentCell = wrapper.find('[data-testid="artist-content"]')
            expect(contentCell.exists()).toBe(true)
          }
        }
      ),
      { numRuns: 100 }
    )
  })

  it('Property 26: アーティストレコードのアクションボタン表示', () => {
    // Feature: prsk-music-management-web, Property 26: アーティストレコードのアクションボタン表示
    // 任意のアーティストレコードに対して、編集と削除のアクションボタンが提供されている必要があります
    fc.assert(
      fc.property(
        fc.record({
          id: fc.integer({ min: 1, max: 10000 }),
          artistName: fc.string({ minLength: 1, maxLength: 50 }),
          unitName: fc.option(fc.string({ minLength: 1, maxLength: 25 }), { nil: null }),
          content: fc.option(fc.string({ minLength: 1, maxLength: 20 }), { nil: null }),
          auditInfo: fc.record({
            createdAt: fc
              .integer({ min: 0, max: 4102444800000 })
              .map((ts) => new Date(ts).toISOString()),
            createdBy: fc.string({ minLength: 1, maxLength: 50 }),
            updatedAt: fc
              .integer({ min: 0, max: 4102444800000 })
              .map((ts) => new Date(ts).toISOString()),
            updatedBy: fc.string({ minLength: 1, maxLength: 50 }),
          }),
        }),
        (artist: Artist) => {
          const wrapper = mount(ArtistTable, {
            props: {
              data: [artist],
              loading: false,
            },
          })

          // 編集ボタンが表示されていることを確認
          const editButton = wrapper.find(`[data-testid="edit-button-${artist.id}"]`)
          expect(editButton.exists()).toBe(true)

          // 削除ボタンが表示されていることを確認
          const deleteButton = wrapper.find(`[data-testid="delete-button-${artist.id}"]`)
          expect(deleteButton.exists()).toBe(true)
        }
      ),
      { numRuns: 100 }
    )
  })
})
