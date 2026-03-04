import { flushPromises, mount } from '@vue/test-utils'
import { HttpResponse, http } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import type { Artist, PaginatedResponse, PrskMusic } from '@/types'
import MusicListPage from './MusicListPage.vue'

// MSWサーバーのセットアップ
const server = setupServer()

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' })
})

afterEach(() => {
  server.resetHandlers()
})

afterAll(() => {
  server.close()
})

// テスト用ヘルパー関数
function createMockMusic(id: number): PrskMusic {
  return {
    id,
    title: `楽曲${id}`,
    artistName: `アーティスト${id}`,
    unitName: `ユニット${id}`,
    content: `コンテンツ${id}`,
    musicType: 0,
    specially: false,
    lyricsName: `作詞者${id}`,
    musicName: `作曲者${id}`,
    featuring: null,
    youtubeLink: `https://www.youtube.com/watch?v=test${id}`,
    auditInfo: {
      createdAt: '2024-01-01T00:00:00Z',
      createdBy: 'test-user',
      updatedAt: '2024-01-01T00:00:00Z',
      updatedBy: 'test-user',
    },
  }
}

function createMockArtist(id: number): Artist {
  return {
    id,
    artistName: `アーティスト${id}`,
    unitName: `ユニット${id}`,
    content: `コンテンツ${id}`,
    auditInfo: {
      createdAt: '2024-01-01T00:00:00Z',
      createdBy: 'test-user',
      updatedAt: '2024-01-01T00:00:00Z',
      updatedBy: 'test-user',
    },
  }
}

function createMockMusicResponse(
  musics: PrskMusic[],
  page = 1,
  totalItems = musics.length
): PaginatedResponse<PrskMusic> {
  return {
    items: musics,
    meta: {
      currentPage: page,
      totalPages: Math.ceil(totalItems / 20),
      totalItems,
      itemsPerPage: 20,
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

describe('MusicListPage', () => {
  it('楽曲一覧ページにアクセスしたときにテーブルが表示される', async () => {
    // Arrange
    const mockMusics = [createMockMusic(1), createMockMusic(2)]
    const mockArtists = [createMockArtist(1), createMockArtist(2)]
    server.use(
      http.get('/api/v1/prsk-music', () => {
        return HttpResponse.json(createMockMusicResponse(mockMusics))
      }),
      http.get('/api/v1/artists', () => {
        return HttpResponse.json(createMockArtistResponse(mockArtists))
      })
    )

    // Act
    const wrapper = mount(MusicListPage)
    await wrapper.vm.$nextTick()
    await flushPromises()

    // Assert
    expect(wrapper.find('[data-testid="music-table"]').exists()).toBe(true)
  })

  it('新規登録ボタンをクリックしたときにフォームが表示される', async () => {
    // Arrange
    const mockMusics = [createMockMusic(1)]
    const mockArtists = [createMockArtist(1)]
    server.use(
      http.get('/api/v1/prsk-music', () => {
        return HttpResponse.json(createMockMusicResponse(mockMusics))
      }),
      http.get('/api/v1/artists', () => {
        return HttpResponse.json(createMockArtistResponse(mockArtists))
      })
    )

    const wrapper = mount(MusicListPage)
    await wrapper.vm.$nextTick()
    await flushPromises()

    // Act
    const createButton = wrapper.find('[data-testid="create-music-button"]')
    await createButton.trigger('click')
    await wrapper.vm.$nextTick()

    // Assert
    expect(wrapper.find('[data-testid="music-form-modal"]').exists()).toBe(true)
  })

  it('削除ボタンをクリックしたときに確認ダイアログが表示される', async () => {
    // Arrange
    const mockMusics = [createMockMusic(1)]
    const mockArtists = [createMockArtist(1)]
    server.use(
      http.get('/api/v1/prsk-music', () => {
        return HttpResponse.json(createMockMusicResponse(mockMusics))
      }),
      http.get('/api/v1/artists', () => {
        return HttpResponse.json(createMockArtistResponse(mockArtists))
      })
    )

    const wrapper = mount(MusicListPage)
    await wrapper.vm.$nextTick()
    await flushPromises()

    // Act
    const deleteButton = wrapper.find('[data-testid="delete-button-1"]')
    await deleteButton.trigger('click')
    await wrapper.vm.$nextTick()

    // Assert
    expect(wrapper.find('[data-testid="confirm-dialog"]').exists()).toBe(true)
  })

  it('アーティスト追加完了後に新規追加されたアーティストが自動選択される', async () => {
    // Arrange
    const mockMusics = [createMockMusic(1)]
    const mockArtists = [createMockArtist(1)]
    const newArtist = createMockArtist(2)
    let artistsAfterCreate = [...mockArtists]

    server.use(
      http.get('/api/v1/prsk-music', () => {
        return HttpResponse.json(createMockMusicResponse(mockMusics))
      }),
      http.get('/api/v1/artists', () => {
        return HttpResponse.json(createMockArtistResponse(artistsAfterCreate))
      }),
      http.post('/api/v1/artists', async () => {
        artistsAfterCreate = [...mockArtists, newArtist]
        return HttpResponse.json(newArtist, { status: 201 })
      })
    )

    const wrapper = mount(MusicListPage)
    await wrapper.vm.$nextTick()
    await flushPromises()

    // 楽曲新規登録ボタンをクリック
    const createMusicButton = wrapper.find('[data-testid="create-music-button"]')
    await createMusicButton.trigger('click')
    await wrapper.vm.$nextTick()

    // Act - アーティスト新規追加ボタンをクリック
    const createArtistButton = wrapper.find('[data-testid="create-artist-button"]')
    await createArtistButton.trigger('click')
    await wrapper.vm.$nextTick()

    // アーティストフォームに値を入力
    const artistNameInput = wrapper.find('[data-testid="artistName-input"]')
    await artistNameInput.setValue('新規アーティスト')

    // VeeValidateのバリデーションが完了するまで待機
    await wrapper.vm.$nextTick()
    await flushPromises()

    // アーティストフォームを送信
    const artistForm = wrapper.find('[data-testid="artist-form"]')
    await artistForm.trigger('submit')
    await wrapper.vm.$nextTick()
    // VeeValidate の非同期バリデーション → MSW POST → fetchArtists → reactive watch →
    // setFieldValue のマルチステップ非同期チェーンが全て完了するまで待機
    // NOTE: flushPromises() は VeeValidate の内部バリデーション Promise を挟む
    // form submit では十分でないため、setTimeout で待機する
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Assert - 楽曲フォームのアーティスト選択で新規追加されたアーティストが選択されている
    const artistSelect = wrapper.find('[data-testid="artist-select"]')
    expect(artistSelect.element.value).toBe('2')
  })

  it('削除を確認したときにDELETEリクエストが送信される', async () => {
    // Arrange
    const mockMusics = [createMockMusic(1)]
    const mockArtists = [createMockArtist(1)]
    let deleteRequestSent = false

    server.use(
      http.get('/api/v1/prsk-music', () => {
        return HttpResponse.json(createMockMusicResponse(mockMusics))
      }),
      http.get('/api/v1/artists', () => {
        return HttpResponse.json(createMockArtistResponse(mockArtists))
      }),
      http.delete('/api/v1/prsk-music/1', () => {
        deleteRequestSent = true
        return new HttpResponse(null, { status: 204 })
      })
    )

    const wrapper = mount(MusicListPage)
    await wrapper.vm.$nextTick()
    await flushPromises()

    // Act
    const deleteButton = wrapper.find('[data-testid="delete-button-1"]')
    await deleteButton.trigger('click')
    await wrapper.vm.$nextTick()

    const confirmButton = wrapper.find('[data-testid="confirm-button"]')
    await confirmButton.trigger('click')
    await wrapper.vm.$nextTick()
    await flushPromises()

    // Assert
    expect(deleteRequestSent).toBe(true)
  })

  it('編集ボタンをクリックしたときに編集フォームが表示される', async () => {
    // Arrange
    const mockMusics = [createMockMusic(1)]
    const mockArtists = [createMockArtist(1)]
    server.use(
      http.get('/api/v1/prsk-music', () => {
        return HttpResponse.json(createMockMusicResponse(mockMusics))
      }),
      http.get('/api/v1/artists', () => {
        return HttpResponse.json(createMockArtistResponse(mockArtists))
      })
    )

    const wrapper = mount(MusicListPage)
    await wrapper.vm.$nextTick()
    await flushPromises()

    // Act
    const editButton = wrapper.find('[data-testid="edit-button-1"]')
    await editButton.trigger('click')
    await wrapper.vm.$nextTick()

    // Assert
    const formModal = wrapper.find('[data-testid="music-form-modal"]')
    expect(formModal.exists()).toBe(true)
  })

  it('ページネーションが20件を超えるときに表示される', async () => {
    // Arrange
    const mockMusics = Array.from({ length: 25 }, (_, i) => createMockMusic(i + 1))
    const mockArtists = [createMockArtist(1)]
    server.use(
      http.get('/api/v1/prsk-music', () => {
        return HttpResponse.json(createMockMusicResponse(mockMusics, 1, 25))
      }),
      http.get('/api/v1/artists', () => {
        return HttpResponse.json(createMockArtistResponse(mockArtists))
      })
    )

    // Act
    const wrapper = mount(MusicListPage)
    await wrapper.vm.$nextTick()
    await flushPromises()

    // Assert
    expect(wrapper.find('[data-testid="pagination"]').exists()).toBe(true)
  })

  it('ローディング中にLoadingSpinnerが表示される', async () => {
    // Arrange
    const mockArtists = [createMockArtist(1)]
    server.use(
      http.get('/api/v1/prsk-music', async () => {
        await new Promise((resolve) => setTimeout(resolve, 200))
        return HttpResponse.json(createMockMusicResponse([]))
      }),
      http.get('/api/v1/artists', () => {
        return HttpResponse.json(createMockArtistResponse(mockArtists))
      })
    )

    // Act
    const wrapper = mount(MusicListPage)
    await wrapper.vm.$nextTick()

    // Assert
    expect(wrapper.find('[data-testid="loading-spinner"]').exists()).toBe(true)
  })

  it('フォームを閉じたときにモーダルが非表示になる', async () => {
    // Arrange
    const mockMusics = [createMockMusic(1)]
    const mockArtists = [createMockArtist(1)]
    server.use(
      http.get('/api/v1/prsk-music', () => {
        return HttpResponse.json(createMockMusicResponse(mockMusics))
      }),
      http.get('/api/v1/artists', () => {
        return HttpResponse.json(createMockArtistResponse(mockArtists))
      })
    )

    const wrapper = mount(MusicListPage)
    await wrapper.vm.$nextTick()
    await flushPromises()

    // 新規登録ボタンをクリックしてフォームを開く
    const createButton = wrapper.find('[data-testid="create-music-button"]')
    await createButton.trigger('click')
    await wrapper.vm.$nextTick()

    // Act
    const cancelButton = wrapper.find('[data-testid="cancel-button"]')
    await cancelButton.trigger('click')
    await wrapper.vm.$nextTick()

    // Assert
    expect(wrapper.find('[data-testid="music-form-modal"]').exists()).toBe(false)
  })

  it('削除をキャンセルしたときに確認ダイアログが閉じる', async () => {
    // Arrange
    const mockMusics = [createMockMusic(1)]
    const mockArtists = [createMockArtist(1)]
    server.use(
      http.get('/api/v1/prsk-music', () => {
        return HttpResponse.json(createMockMusicResponse(mockMusics))
      }),
      http.get('/api/v1/artists', () => {
        return HttpResponse.json(createMockArtistResponse(mockArtists))
      })
    )

    const wrapper = mount(MusicListPage)
    await wrapper.vm.$nextTick()
    await flushPromises()

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

  it('楽曲作成後に一覧が再取得される', async () => {
    // Arrange
    const mockMusics = [createMockMusic(1)]
    const mockArtists = [createMockArtist(1)]
    let fetchCount = 0
    let postRequestSent = false

    server.use(
      http.get('/api/v1/prsk-music', () => {
        fetchCount++
        return HttpResponse.json(createMockMusicResponse(mockMusics))
      }),
      http.get('/api/v1/artists', () => {
        return HttpResponse.json(createMockArtistResponse(mockArtists))
      }),
      http.post('/api/v1/prsk-music', async () => {
        postRequestSent = true
        return HttpResponse.json(createMockMusic(2), { status: 201 })
      })
    )

    const wrapper = mount(MusicListPage)
    await wrapper.vm.$nextTick()
    await flushPromises()

    // 新規登録ボタンをクリック
    const createButton = wrapper.find('[data-testid="create-music-button"]')
    await createButton.trigger('click')
    await wrapper.vm.$nextTick()

    // フォーム送信直前のfetchCountを記録
    const fetchCountBeforeSubmit = fetchCount

    // フォームに値を入力
    const titleInput = wrapper.find('[data-testid="title-input"]')
    await titleInput.setValue('テスト楽曲')

    const artistSelect = wrapper.find('[data-testid="artist-select"]')
    await artistSelect.setValue('1')

    const musicTypeSelect = wrapper.find('[data-testid="musicType-select"]')
    await musicTypeSelect.setValue('0')

    const youtubeLinkInput = wrapper.find('[data-testid="youtubeLink-input"]')
    await youtubeLinkInput.setValue('https://www.youtube.com/watch?v=test')

    // VeeValidateのバリデーションが完了するまで待機
    await wrapper.vm.$nextTick()
    await flushPromises()

    // Act - フォームを直接submit
    const form = wrapper.find('form')
    await form.trigger('submit')
    await wrapper.vm.$nextTick()
    // VeeValidate の非同期バリデーション → MSW POST → fetchMusics の
    // マルチステップ非同期チェーンが全て完了するまで待機
    // NOTE: flushPromises() は VeeValidate の内部バリデーション Promise を挟む
    // form submit では十分でないため、setTimeout で待機する
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Assert - POSTリクエストが送信され、一覧が再取得される
    expect(postRequestSent).toBe(true)
    // createMusic内でfetchMusicsが呼ばれるため、fetchCountが増加する
    expect(fetchCount).toBeGreaterThan(fetchCountBeforeSubmit)
  })
})
