import { StoreState } from '@bihealth/reev-frontend-lib/stores'
import { Pinia, createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import createFetchMock from 'vitest-fetch-mock'

import { type Comment$Api } from '@/api/comments/types'

import { useCommentsStore } from './store'

const fetchMocker = createFetchMock(vi)

describe('comments Store', () => {
  let pinia: Pinia
  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    fetchMocker.enableMocks()
    fetchMocker.resetMocks()
  })

  it('should have initial state', () => {
    // arrange:
    const store = useCommentsStore(pinia)

    // act: nothing to do

    // assert:
    expect(store.storeState).toBe(StoreState.Initial)
    expect(store.comments).toStrictEqual([])
  })

  it('should load comments', async () => {
    // arrange:
    const mockComments: Comment$Api[] = [
      {
        user: '2c0a153e-5e8c-11ee-8c99-0242ac120002',
        obj_type: 'seqvar',
        obj_id: 'HGNC:1100',
        id: '2c0a153e-5e8c-11ee-8c99-0242ac120001',
        public: true,
        text: 'This is a comment'
      }
    ]
    fetchMocker.mockResponse(JSON.stringify(mockComments))
    const store = useCommentsStore()

    // act:
    await store.loadComments()

    // assert:
    expect(store.storeState).toBe(StoreState.Active)
    expect(store.comments).toEqual(mockComments)
  })

  it('should handle error when loading comments', async () => {
    // arrange:
    // Disable error logging
    vi.spyOn(console, 'error').mockImplementation(() => {})
    fetchMocker.mockReject(new Error('Internal Server Error'))
    const store = useCommentsStore()

    // act:
    await store.loadComments()

    // assert:
    expect(store.storeState).toBe(StoreState.Error)
    expect(store.comments).toStrictEqual([])
  })

  it('should delete comment', async () => {
    // arrange:
    fetchMocker.mockResponse(JSON.stringify({}))
    const store = useCommentsStore()

    // act:
    await store.deleteComment('seqvar', 'HGNC:1100')

    // assert:
    expect(store.storeState).toBe(StoreState.Active)
    expect(store.comments).toStrictEqual({})
  })

  it('should handle error when deleting comment', async () => {
    // arrange:
    // Disable error logging
    vi.spyOn(console, 'error').mockImplementation(() => {})
    fetchMocker.mockReject(new Error('Internal Server Error'))
    const store = useCommentsStore()

    // act:
    await store.deleteComment('seqvar', 'HGNC:1100')

    // assert:
    expect(store.storeState).toBe(StoreState.Error)
    expect(store.comments).toStrictEqual([])
  })

  it('should create comment', async () => {
    // arrange:
    fetchMocker.mockResponse(JSON.stringify({ comment: 'created' }))
    const store = useCommentsStore()

    // act:
    await store.createComment('seqvar', 'HGNC:1100')

    // assert:
    expect(store.storeState).toBe(StoreState.Active)
    expect(store.comments).toStrictEqual({ comment: 'created' })
  })

  it('should handle error when creating comment', async () => {
    // arrange:
    // Disable error logging
    vi.spyOn(console, 'error').mockImplementation(() => {})
    fetchMocker.mockReject(new Error('Internal Server Error'))
    const store = useCommentsStore()

    // act:
    await store.createComment('seqvar', 'HGNC:1100')

    // assert:
    expect(store.storeState).toBe(StoreState.Error)
    expect(store.comments).toStrictEqual([])
  })

  it('should fetch comment', async () => {
    // arrange:
    fetchMocker.mockResponse(JSON.stringify({ comment: 'created' }))
    const store = useCommentsStore()
    store.storeState = StoreState.Active

    // act:
    const result = await store.fetchComment('seqvar', 'HGNC:1100')

    // assert:
    expect(store.storeState).toBe(StoreState.Active)
    expect(result).toStrictEqual({ comment: 'created' })
  })

  it('should handle error when fetching comment', async () => {
    // arrange:
    fetchMocker.mockResponse(JSON.stringify({ detail: 'Internal Server Error' }), { status: 500 })
    const store = useCommentsStore()
    store.storeState = StoreState.Active

    // act:
    await store.fetchComment('seqvar', 'HGNC:1100')

    // assert:
    expect(store.storeState).toBe(StoreState.Active)
    expect(store.comments).toStrictEqual([])
  })
})
