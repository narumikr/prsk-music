import { mount } from '@vue/test-utils'
import { HttpResponse, http } from 'msw'
import { setupServer } from 'msw/node'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { Artist, PaginatedResponse } from '@/types'
import ArtistListPage from './ArtistListPage.vue'

// MSWサーバーのセットアップ
const server = setupServer()

beforeEach(() => {
  server.listen({ onUnhandledRequest: 'error' })
})

afterEach(() => {
  server.resetHandlers()
})

afterAll(() => {
  server.close()
})

// テスト用ヘルパー関数
function createMockArtist(id: number): Artist {
  return {
    id,
    artistName: `アーティスト${id}`,
    unitName: `ユニット${id}`,
    content: `コンテンツ${id}`,
    auditInfo: {
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
  }
}

function createMockArtistResponse(
  artists: Artist[],
  page = 1,
  totalItems = artists.length
): PaginatedResponse<Artist> {
  return {
    items: artists,
    meta: {
      currentPage: page,
      totalPages: Math.ceil(totalItems / 20),
      totalItems,
      itemsPerPage: 20,
    },
  }
}

describe('ArtistListPage', () => {
  it('アーティスト一覧ページにアクセスしたときにテーブルが表示される', async () => {
    // Arrange
    const mockArtists = [createMockArtist(1), createMockArtist(2)]
    server.use(
      http.get('/api/v1/artists', () => {
        return HttpResponse.json(createMockArtistResponse(mockArtists))
      })
    )

    // Act
    const wrapper = mount(ArtistListPage)
    await wrapper.vm.$nextTick()
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Assert
    expect(wrapper.find('[data-testid="artist-table"]').exists()).toBe(true)
  })

  it('新規登録ボタンをクリックしたときにフォームが表示される', async () => {
    // Arrange
    const mockArtists = [createMockArtist(1)]
    server.use(
      http.get('/api/v1/artists', () => {
        return HttpResponse.json(createMockArtistResponse(mockArtists))
      })
    )

    const wrapper = mount(ArtistListPage)
    await wrapper.vm.$nextTick()
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Act
    const createButton = wrapper.find('[data-testid="create-artist-button"]')
    await createButton.trigger('click')
    await wrapper.vm.$nextTick()

    // Assert
    expect(wrapper.find('[data-testid="artist-form-modal"]').exists()).toBe(true)
  })

  it('削除ボタンをクリックしたときに確認ダイアログが表示される', async () => {
    // Arrange
    const mockArtists = [createMockArtist(1)]
    server.use(
      http.get('/api/v1/artists', () => {
        return HttpResponse.json(createMockArtistResponse(mockArtists))
      })
    )

    const wrapper = mount(ArtistListPage)
    await wrapper.vm.$nextTick()
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Act
    const deleteButton = wrapper.find('[data-testid="delete-button-1"]')
    await deleteButton.trigger('click')
    await wrapper.vm.$nextTick()

    // Assert
    expect(wrapper.find('[data-testid="confirm-dialog"]').exists()).toBe(true)
  })

  it('削除を確認したときにDELETEリクエストが送信される', async () => {
    // Arrange
    const mockArtists = [createMockArtist(1)]
    let deleteRequestSent = false

    server.use(
      http.get('/api/v1/artists', () => {
        return HttpResponse.json(createMockArtistResponse(mockArtists))
      }),
      http.delete('/api/v1/artists/1', () => {
        deleteRequestSent = true
        return new HttpResponse(null, { status: 204 })
      })
    )

    const wrapper = mount(ArtistListPage)
    await wrapper.vm.$nextTick()
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Act
    const deleteButton = wrapper.find('[data-testid="delete-button-1"]')
    await deleteButton.trigger('click')
    await wrapper.vm.$nextTick()

    const confirmButton = wrapper.find('[data-testid="confirm-button"]')
    await confirmButton.trigger('click')
    await wrapper.vm.$nextTick()
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Assert
    expect(deleteRequestSent).toBe(true)
  })

  it('編集ボタンをクリックしたときに編集フォームが表示される', async () => {
    // Arrange
    const mockArtists = [createMockArtist(1)]
    server.use(
      http.get('/api/v1/artists', () => {
        return HttpResponse.json(createMockArtistResponse(mockArtists))
      })
    )

    const wrapper = mount(ArtistListPage)
    await wrapper.vm.$nextTick()
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Act
    const editButton = wrapper.find('[data-testid="edit-button-1"]')
    await editButton.trigger('click')
    await wrapper.vm.$nextTick()

    // Assert
    const formModal = wrapper.find('[data-testid="artist-form-modal"]')
    expect(formModal.exists()).toBe(true)
  })

  it('ページネーションが20件を超えるときに表示される', async () => {
    // Arrange
    const mockArtists = Array.from({ length: 25 }, (_, i) => createMockArtist(i + 1))
    server.use(
      http.get('/api/v1/artists', () => {
        return HttpResponse.json(createMockArtistResponse(mockArtists, 1, 25))
      })
    )

    // Act
    const wrapper = mount(ArtistListPage)
    await wrapper.vm.$nextTick()
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Assert
    expect(wrapper.find('[data-testid="pagination"]').exists()).toBe(true)
  })

  it('ローディング中にLoadingSpinnerが表示される', async () => {
    // Arrange
    server.use(
      http.get('/api/v1/artists', async () => {
        await new Promise((resolve) => setTimeout(resolve, 200))
        return HttpResponse.json(createMockArtistResponse([]))
      })
    )

    // Act
    const wrapper = mount(ArtistListPage)
    await wrapper.vm.$nextTick()

    // Assert
    expect(wrapper.find('[data-testid="loading-spinner"]').exists()).toBe(true)
  })

  it('フォームを閉じたときにモーダルが非表示になる', async () => {
    // Arrange
    const mockArtists = [createMockArtist(1)]
    server.use(
      http.get('/api/v1/artists', () => {
        return HttpResponse.json(createMockArtistResponse(mockArtists))
      })
    )

    const wrapper = mount(ArtistListPage)
    await wrapper.vm.$nextTick()
    await new Promise((resolve) => setTimeout(resolve, 100))

    // 新規登録ボタンをクリックしてフォームを開く
    const createButton = wrapper.find('[data-testid="create-artist-button"]')
    await createButton.trigger('click')
    await wrapper.vm.$nextTick()

    // Act
    const cancelButton = wrapper.find('[data-testid="cancel-button"]')
    await cancelButton.trigger('click')
    await wrapper.vm.$nextTick()

    // Assert
    expect(wrapper.find('[data-testid="artist-form-modal"]').exists()).toBe(false)
  })

  it('削除をキャンセルしたときに確認ダイアログが閉じる', async () => {
    // Arrange
    const mockArtists = [createMockArtist(1)]
    server.use(
      http.get('/api/v1/artists', () => {
        return HttpResponse.json(createMockArtistResponse(mockArtists))
      })
    )

    const wrapper = mount(ArtistListPage)
    await wrapper.vm.$nextTick()
    await new Promise((resolve) => setTimeout(resolve, 100))

    // 削除ボタンをクリックして確認ダイアログを開く
    const deleteButton = wrapper.find('[data-testid="delete-button-1"]')
    await deleteButton.trigger('click')
    await wrapper.vm.$nextTick()

    // Act
    const cancelButton = wrapper.find('[data-testid="cancel-button"]')
    await cancelButton.trigger('click')
    await wrapper.vm.$nextTick()

    // Assert
    expect(wrapper.find('[data-testid="confirm-dialog"]').exists()).toBe(false)
  })

  it('アーティスト作成後に一覧が再取得される', async () => {
    // Arrange
    const mockArtists = [createMockArtist(1)]
    let fetchCount = 0
    let postRequestSent = false

    server.use(
      http.get('/api/v1/artists', () => {
        fetchCount++
        return HttpResponse.json(createMockArtistResponse(mockArtists))
      }),
      http.post('/api/v1/artists', async () => {
        postRequestSent = true
        return HttpResponse.json(createMockArtist(2), { status: 201 })
      })
    )

    const wrapper = mount(ArtistListPage)
    await wrapper.vm.$nextTick()
    await new Promise((resolve) => setTimeout(resolve, 100))

    // 新規登録ボタンをクリック
    const createButton = wrapper.find('[data-testid="create-artist-button"]')
    await createButton.trigger('click')
    await wrapper.vm.$nextTick()

    // フォーム送信直前のfetchCountを記録
    const fetchCountBeforeSubmit = fetchCount

    // フォームに値を入力
    const artistNameInput = wrapper.find('[data-testid="artistName-input"]')
    await artistNameInput.setValue('テストアーティスト')

    // VeeValidateのバリデーションが完了するまで待機
    await wrapper.vm.$nextTick()
    await new Promise((resolve) => setTimeout(resolve, 50))

    // Act - フォームを直接submit
    const form = wrapper.find('form')
    await form.trigger('submit')
    await wrapper.vm.$nextTick()
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Assert - POSTリクエストが送信され、一覧が再取得される
    expect(postRequestSent).toBe(true)
    // createArtist内でfetchArtistsが呼ばれるため、fetchCountが増加する
    expect(fetchCount).toBeGreaterThan(fetchCountBeforeSubmit)
  })
})
