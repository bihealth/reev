import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import createFetchMock from 'vitest-fetch-mock'

import { type BookmarkData, useBookmarksStore } from '../bookmarks'
import { StoreState } from '../misc'

const fetchMocker = createFetchMock(vi)

describe.concurrent('User Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    fetchMocker.enableMocks()
    fetchMocker.resetMocks()
  })

  it('should have initial state', () => {
    const store = useBookmarksStore()

    expect(store.storeState).toBe(StoreState.Initial)
    expect(store.bookmarks).toStrictEqual([])
  })

  it('should load bookmarks', async () => {
    const mockBookmarks: BookmarkData[] = [
      {
        user: '2c0a153e-5e8c-11ee-8c99-0242ac120002',
        obj_type: 'seqvar',
        obj_id: 'HGNC:1100',
        id: '2c0a153e-5e8c-11ee-8c99-0242ac120001'
      }
    ]

    const store = useBookmarksStore()
    fetchMocker.mockResponse(JSON.stringify(mockBookmarks))

    await store.loadBookmarks()

    expect(store.storeState).toBe(StoreState.Active)
    expect(store.bookmarks).toEqual(mockBookmarks)
  })

  it.skip('should handle error when loading bookmarks', async () => {
    const store = useBookmarksStore()
    fetchMocker.mockResponse(JSON.stringify({ detail: 'Internal Server Error' }), { status: 500 })

    await store.loadBookmarks()

    expect(store.storeState).toBe(StoreState.Error)
    expect(store.bookmarks).toStrictEqual([])
  })

  it('should delete bookmark', async () => {
    const store = useBookmarksStore()
    fetchMocker.mockResponse(JSON.stringify({}))

    await store.deleteBookmark('seqvar', 'HGNC:1100')

    expect(store.storeState).toBe(StoreState.Active)
    expect(store.bookmarks).toStrictEqual({})
  })

  it.skip('should handle error when deleting bookmark', async () => {
    const store = useBookmarksStore()
    fetchMocker.mockResponse(JSON.stringify({ detail: 'Internal Server Error' }), { status: 500 })

    await store.deleteBookmark('seqvar', 'HGNC:1100')

    expect(store.storeState).toBe(StoreState.Error)
    expect(store.bookmarks).toStrictEqual([])
  })

  it('should create bookmark', async () => {
    const store = useBookmarksStore()
    fetchMocker.mockResponse(JSON.stringify({ bookmark: 'created' }))

    await store.createBookmark('seqvar', 'HGNC:1100')

    expect(store.storeState).toBe(StoreState.Active)
    expect(store.bookmarks).toStrictEqual({ bookmark: 'created' })
  })

  it.skip('should handle error when creating bookmark', async () => {
    const store = useBookmarksStore()
    fetchMocker.mockResponse(JSON.stringify({ detail: 'Internal Server Error' }), { status: 500 })

    await store.createBookmark('seqvar', 'HGNC:1100')

    expect(store.storeState).toBe(StoreState.Error)
    expect(store.bookmarks).toStrictEqual([])
  })

  it('should fetch bookmark', async () => {
    const store = useBookmarksStore()
    store.storeState = StoreState.Active
    fetchMocker.mockResponse(JSON.stringify({ bookmark: 'created' }))

    const result = await store.fetchBookmark('seqvar', 'HGNC:1100')

    expect(store.storeState).toBe(StoreState.Active)
    expect(result).toStrictEqual({ bookmark: 'created' })
  })

  it('should handle error when fetching bookmark', async () => {
    const store = useBookmarksStore()
    store.storeState = StoreState.Active
    fetchMocker.mockResponse(JSON.stringify({ detail: 'Internal Server Error' }), { status: 500 })

    await store.fetchBookmark('seqvar', 'HGNC:1100')

    expect(store.storeState).toBe(StoreState.Active)
    expect(store.bookmarks).toStrictEqual([])
  })
})
