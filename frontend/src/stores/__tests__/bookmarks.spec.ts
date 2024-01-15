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
    // arrange:
    const store = useBookmarksStore()

    // act: nothing to do

    // assert:
    expect(store.storeState).toBe(StoreState.Initial)
    expect(store.bookmarks).toStrictEqual([])
  })

  it('should load bookmarks', async () => {
    // arrange:
    const mockBookmarks: BookmarkData[] = [
      {
        user: '2c0a153e-5e8c-11ee-8c99-0242ac120002',
        obj_type: 'seqvar',
        obj_id: 'HGNC:1100',
        id: '2c0a153e-5e8c-11ee-8c99-0242ac120001'
      }
    ]
    fetchMocker.mockResponse(JSON.stringify(mockBookmarks))
    const store = useBookmarksStore()

    // act:
    await store.loadBookmarks()

    // assert:
    expect(store.storeState).toBe(StoreState.Active)
    expect(store.bookmarks).toEqual(mockBookmarks)
  })

  it('should handle error when loading bookmarks', async () => {
    // arrange:
    // Disable error logging
    vi.spyOn(console, 'error').mockImplementation(() => {})
    fetchMocker.mockReject(new Error('Internal Server Error'))
    const store = useBookmarksStore()

    // act:
    await store.loadBookmarks()

    // assert:
    expect(store.storeState).toBe(StoreState.Error)
    expect(store.bookmarks).toStrictEqual([])
  })

  it('should delete bookmark', async () => {
    // arrange:
    fetchMocker.mockResponse(JSON.stringify({}))
    const store = useBookmarksStore()

    // act:
    await store.deleteBookmark('seqvar', 'HGNC:1100')

    // assert:
    expect(store.storeState).toBe(StoreState.Active)
    expect(store.bookmarks).toStrictEqual({})
  })

  it('should handle error when deleting bookmark', async () => {
    // arrange:
    // Disable error logging
    vi.spyOn(console, 'error').mockImplementation(() => {})
    fetchMocker.mockReject(new Error('Internal Server Error'))
    const store = useBookmarksStore()

    // act:
    await store.deleteBookmark('seqvar', 'HGNC:1100')

    // assert:
    expect(store.storeState).toBe(StoreState.Error)
    expect(store.bookmarks).toStrictEqual([])
  })

  it('should create bookmark', async () => {
    // arrange:
    fetchMocker.mockResponse(JSON.stringify({ bookmark: 'created' }))
    const store = useBookmarksStore()

    // act:
    await store.createBookmark('seqvar', 'HGNC:1100')

    // assert:
    expect(store.storeState).toBe(StoreState.Active)
    expect(store.bookmarks).toStrictEqual({ bookmark: 'created' })
  })

  it('should handle error when creating bookmark', async () => {
    // arrange:
    // Disable error logging
    vi.spyOn(console, 'error').mockImplementation(() => {})
    fetchMocker.mockReject(new Error('Internal Server Error'))
    const store = useBookmarksStore()

    // act:
    await store.createBookmark('seqvar', 'HGNC:1100')

    // assert:
    expect(store.storeState).toBe(StoreState.Error)
    expect(store.bookmarks).toStrictEqual([])
  })

  it('should fetch bookmark', async () => {
    // arrange:
    fetchMocker.mockResponse(JSON.stringify({ bookmark: 'created' }))
    const store = useBookmarksStore()
    store.storeState = StoreState.Active

    // act:
    const result = await store.fetchBookmark('seqvar', 'HGNC:1100')

    // assert:
    expect(store.storeState).toBe(StoreState.Active)
    expect(result).toStrictEqual({ bookmark: 'created' })
  })

  it('should handle error when fetching bookmark', async () => {
    // arrange:
    fetchMocker.mockResponse(JSON.stringify({ detail: 'Internal Server Error' }), { status: 500 })
    const store = useBookmarksStore()
    store.storeState = StoreState.Active

    // act:
    await store.fetchBookmark('seqvar', 'HGNC:1100')

    // assert:
    expect(store.storeState).toBe(StoreState.Active)
    expect(store.bookmarks).toStrictEqual([])
  })
})
