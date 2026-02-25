import { mount } from '@vue/test-utils'
import fc from 'fast-check'
import { describe, expect, it } from 'vitest'
import PaginationControl from './PaginationControl.vue'

// ============================================================================
// Unit Tests
// ============================================================================

describe('PaginationControl Unit Tests', () => {
  it('20件以下でページネーション非表示', () => {
    // 20件以下の場合、ページネーションコンポーネント自体が表示されない
    const wrapper = mount(PaginationControl, {
      props: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 20,
      },
    })

    // ページネーション要素が存在しないことを確認
    const pagination = wrapper.find('[data-testid="pagination"]')
    expect(pagination.exists()).toBe(false)
  })

  it('21件以上でページネーション表示', () => {
    // 21件以上の場合、ページネーションコンポーネントが表示される
    const wrapper = mount(PaginationControl, {
      props: {
        currentPage: 1,
        totalPages: 2,
        totalItems: 21,
      },
    })

    // ページネーション要素が存在することを確認
    const pagination = wrapper.find('[data-testid="pagination"]')
    expect(pagination.exists()).toBe(true)
  })

  it('最初のページで「前へ」ボタン無効化', () => {
    // 最初のページ（currentPage = 1）の場合、「前へ」ボタンが無効化される
    const wrapper = mount(PaginationControl, {
      props: {
        currentPage: 1,
        totalPages: 3,
        totalItems: 60,
      },
    })

    // 「前へ」ボタンを取得
    const prevButton = wrapper.find('[data-testid="prev-button"]')
    expect(prevButton.exists()).toBe(true)

    // ボタンが無効化されていることを確認
    expect(prevButton.attributes('disabled')).toBeDefined()
  })

  it('最後のページで「次へ」ボタン無効化', () => {
    // 最後のページ（currentPage = totalPages）の場合、「次へ」ボタンが無効化される
    const wrapper = mount(PaginationControl, {
      props: {
        currentPage: 3,
        totalPages: 3,
        totalItems: 60,
      },
    })

    // 「次へ」ボタンを取得
    const nextButton = wrapper.find('[data-testid="next-button"]')
    expect(nextButton.exists()).toBe(true)

    // ボタンが無効化されていることを確認
    expect(nextButton.attributes('disabled')).toBeDefined()
  })

  it('中間ページで「前へ」「次へ」ボタンが有効', () => {
    // 中間ページの場合、両方のボタンが有効化される
    const wrapper = mount(PaginationControl, {
      props: {
        currentPage: 2,
        totalPages: 3,
        totalItems: 60,
      },
    })

    // 「前へ」ボタンが有効であることを確認
    const prevButton = wrapper.find('[data-testid="prev-button"]')
    expect(prevButton.exists()).toBe(true)
    expect(prevButton.attributes('disabled')).toBeUndefined()

    // 「次へ」ボタンが有効であることを確認
    const nextButton = wrapper.find('[data-testid="next-button"]')
    expect(nextButton.exists()).toBe(true)
    expect(nextButton.attributes('disabled')).toBeUndefined()
  })

  it('ページ情報が正しく表示される', () => {
    // ページネーション情報（現在ページ、総ページ数、総アイテム数）が表示される
    const wrapper = mount(PaginationControl, {
      props: {
        currentPage: 2,
        totalPages: 5,
        totalItems: 100,
      },
    })

    // ページ情報のテキストを確認
    const pageInfo = wrapper.find('[data-testid="page-info"]')
    expect(pageInfo.exists()).toBe(true)
    expect(pageInfo.text()).toContain('2')
    expect(pageInfo.text()).toContain('5')
    expect(pageInfo.text()).toContain('100')
  })

  it('「前へ」ボタンクリックでpage-changeイベント発火', async () => {
    // 「前へ」ボタンをクリックすると、page-changeイベントが発火される
    const wrapper = mount(PaginationControl, {
      props: {
        currentPage: 2,
        totalPages: 3,
        totalItems: 60,
      },
    })

    const prevButton = wrapper.find('[data-testid="prev-button"]')
    await prevButton.trigger('click')

    // page-changeイベントが発火され、currentPage - 1が渡されることを確認
    expect(wrapper.emitted('page-change')).toBeTruthy()
    expect(wrapper.emitted('page-change')?.[0]).toEqual([1])
  })

  it('「次へ」ボタンクリックでpage-changeイベント発火', async () => {
    // 「次へ」ボタンをクリックすると、page-changeイベントが発火される
    const wrapper = mount(PaginationControl, {
      props: {
        currentPage: 2,
        totalPages: 3,
        totalItems: 60,
      },
    })

    const nextButton = wrapper.find('[data-testid="next-button"]')
    await nextButton.trigger('click')

    // page-changeイベントが発火され、currentPage + 1が渡されることを確認
    expect(wrapper.emitted('page-change')).toBeTruthy()
    expect(wrapper.emitted('page-change')?.[0]).toEqual([3])
  })

  it('ページ番号リンククリックでpage-changeイベント発火', async () => {
    // ページ番号リンクをクリックすると、page-changeイベントが発火される
    const wrapper = mount(PaginationControl, {
      props: {
        currentPage: 1,
        totalPages: 3,
        totalItems: 60,
      },
    })

    // ページ番号3のリンクをクリック
    const pageLink = wrapper.find('[data-testid="page-link-3"]')
    await pageLink.trigger('click')

    // page-changeイベントが発火され、クリックしたページ番号が渡されることを確認
    expect(wrapper.emitted('page-change')).toBeTruthy()
    expect(wrapper.emitted('page-change')?.[0]).toEqual([3])
  })

  it('現在のページ番号がハイライト表示される', () => {
    // 現在のページ番号が視覚的にハイライトされる
    const wrapper = mount(PaginationControl, {
      props: {
        currentPage: 2,
        totalPages: 3,
        totalItems: 60,
      },
    })

    // 現在のページ番号要素を取得
    const currentPageElement = wrapper.find('[data-testid="page-link-2"]')
    expect(currentPageElement.exists()).toBe(true)

    // ハイライトを示すクラスが適用されていることを確認
    // （実装時にはPrimaryカラーのborderやテキストカラーが適用される想定）
    expect(currentPageElement.classes()).toContain('border-primary')
  })
})

// ============================================================================
// Property Tests
// ============================================================================

describe('PaginationControl - Property Tests', () => {
  /**
   * Property 11: ページネーションメタデータの表示
   * 任意のページネーションメタデータに対して、ページネーション制御コンポーネントには
   * 現在のページ番号、総ページ数、総アイテム数が正しく表示される必要があります
   *
   * Feature: prsk-music-management-web, Property 11: ページネーションメタデータの表示
   * Validates: Requirements 要件5.2
   */
  it('Property 11: 任意のページネーションメタデータが正しく表示される', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 100 }), // currentPage
        fc.integer({ min: 1, max: 100 }), // totalPages
        fc.integer({ min: 21, max: 2000 }), // totalItems（21件以上でページネーションが表示される）
        (currentPage, totalPages, totalItems) => {
          // currentPageがtotalPagesを超えないように調整
          const validCurrentPage = Math.min(currentPage, totalPages)

          const wrapper = mount(PaginationControl, {
            props: {
              currentPage: validCurrentPage,
              totalPages,
              totalItems,
            },
          })

          // ページネーション情報が表示されることを確認
          const pageInfo = wrapper.find('[data-testid="page-info"]')
          expect(pageInfo.exists()).toBe(true)

          // 現在のページ番号が表示されることを確認
          expect(pageInfo.text()).toContain(validCurrentPage.toString())

          // 総ページ数が表示されることを確認
          expect(pageInfo.text()).toContain(totalPages.toString())

          // 総アイテム数が表示されることを確認
          expect(pageInfo.text()).toContain(totalItems.toString())
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 13: 20件超でのページネーション表示
   * 任意のデータリスト（楽曲またはアーティスト）において、
   * アイテム数が20件を超える場合、ページネーション制御コンポーネントが表示される必要があります
   *
   * Feature: prsk-music-management-web, Property 13: 20件超でのページネーション表示
   * Validates: Requirements 要件1.3, 要件9.3
   */
  it('Property 13: 任意のアイテム数が20件を超える場合にページネーションが表示される', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 21, max: 1000 }), // totalItems（21件以上）
        (totalItems) => {
          // 1ページあたり20件として総ページ数を計算
          const itemsPerPage = 20
          const totalPages = Math.ceil(totalItems / itemsPerPage)
          const currentPage = 1

          const wrapper = mount(PaginationControl, {
            props: {
              currentPage,
              totalPages,
              totalItems,
            },
          })

          // ページネーション要素が表示されることを確認
          const pagination = wrapper.find('[data-testid="pagination"]')
          expect(pagination.exists()).toBe(true)
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property 13 (補足): 20件以下でのページネーション非表示
   * 任意のデータリストにおいて、
   * アイテム数が20件以下の場合、ページネーション制御コンポーネントが表示されない必要があります
   */
  it('Property 13 (補足): 任意のアイテム数が20件以下の場合にページネーションが非表示', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 20 }), // totalItems（1-20件）
        (totalItems) => {
          const wrapper = mount(PaginationControl, {
            props: {
              currentPage: 1,
              totalPages: 1,
              totalItems,
            },
          })

          // ページネーション要素が表示されないことを確認
          const pagination = wrapper.find('[data-testid="pagination"]')
          expect(pagination.exists()).toBe(false)
        }
      ),
      { numRuns: 100 }
    )
  })
})
