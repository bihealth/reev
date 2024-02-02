import { beforeEach, describe, expect, it, vi } from 'vitest'
import createFetchMock from 'vitest-fetch-mock'

import { type BookmarkData } from '@/stores/bookmarks'

import { BookmarksClient } from '../bookmarks'

const fetchMocker = createFetchMock(vi)

/** Example Bookmark data */
const mockBookmarks: BookmarkData[] = [
  {
    user: '2c0a153e-5e8c-11ee-8c99-0242ac120002',
    obj_type: 'seqvar',
    obj_id: 'HGNC:1100',
    id: '2c0a153e-5e8c-11ee-8c99-0242ac120001'
  }
]

describe.concurrent('Bookmarks Client', () => {
  beforeEach(() => {
    fetchMocker.enableMocks()
    fetchMocker.resetMocks()
  })

  it('fetches bookmarks correctly', async () => {
    // arrange:
    fetchMocker.mockResponse((req) => {
      if (req.url.includes('users/me')) {
        return Promise.resolve(JSON.stringify({ id: '2c0a153e-5e8c-11ee-8c99-0242ac120002' }))
      } else if (req.url.includes('bookmarks/list')) {
        return Promise.resolve(JSON.stringify(mockBookmarks))
      }
      return Promise.resolve(JSON.stringify({ status: 400 }))
    })

    // act:
    const client = new BookmarksClient()
    const result = await client.fetchBookmarks()

    // assert:
    expect(result).toEqual(mockBookmarks)
  })

  it('fails to fetch bookmarks', async () => {
    // arrange:
    fetchMocker.mockResponse((req) => {
      if (req.url.includes('users/me')) {
        return Promise.resolve(JSON.stringify({ id: '2c0a153e-5e8c-11ee-8c99-0242ac120002' }))
      } else if (req.url.includes('bookmarks/list')) {
        return Promise.resolve(JSON.stringify({ status: 500 }))
      }
      return Promise.resolve(JSON.stringify({ status: 400 }))
    })

    // act:
    const client = new BookmarksClient()
    const result = await client.fetchBookmarks()

    // assert:
    expect(result).toEqual({ status: 500 })
  })

  it('fetches bookmark correctly', async () => {
    // arrange:
    fetchMocker.mockResponse(JSON.stringify(mockBookmarks[0]))

    // act:
    const client = new BookmarksClient()
    const result = await client.fetchBookmark('seqvar', 'HGNC:1100')

    // assert:
    expect(result).toEqual(mockBookmarks[0])
  })

  it('fails to fetch bookmark', async () => {
    // arrange:
    fetchMocker.mockResponse(JSON.stringify({ detail: 'Internal Server Error' }), { status: 500 })

    // act:
    const client = new BookmarksClient()
    const result = await client.fetchBookmark('seqvar', 'HGNC:1100')

    // assert:
    expect(result).toEqual({ detail: 'Internal Server Error' })
  })

  it('creates bookmark correctly', async () => {
    // arrange:
    fetchMocker.mockResponse(JSON.stringify({}))

    // act:
    const client = new BookmarksClient()
    const result = await client.createBookmark('seqvar', 'HGNC:1100')

    // assert:
    expect(result).toEqual({})
  })

  it('fails to create bookmark', async () => {
    // arrange:
    fetchMocker.mockResponse(JSON.stringify({ detail: 'Internal Server Error' }), { status: 500 })

    // act:
    const client = new BookmarksClient()
    const result = await client.createBookmark('seqvar', 'HGNC:1100')

    // assert:
    expect(result).toEqual({ detail: 'Internal Server Error' })
  })

  it('deletes bookmark correctly', async () => {
    // arrange:
    fetchMocker.mockResponse(JSON.stringify({}))

    // act:
    const client = new BookmarksClient()
    const result = await client.deleteBookmark('seqvar', 'HGNC:1100')

    // assert:
    expect(result).toEqual({})
  })

  it('fails to delete bookmark', async () => {
    // arrange:
    fetchMocker.mockResponse(JSON.stringify({ detail: 'Internal Server Error' }), { status: 500 })

    // act:
    const client = new BookmarksClient()
    const result = await client.deleteBookmark('seqvar', 'HGNC:1100')

    // assert:
    expect(result).toEqual({ detail: 'Internal Server Error' })
  })
})
