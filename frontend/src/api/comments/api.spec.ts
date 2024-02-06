import { beforeEach, describe, expect, it, vi } from 'vitest'
import createFetchMock from 'vitest-fetch-mock'

import { type Comment$Api } from '@/api/comments/types'

import { CommentsClient } from '../comments'

const fetchMocker = createFetchMock(vi)

/** Example Comment data */
const mockComments: Comment$Api[] = [
  {
    user: '2c0a153e-5e8c-11ee-8c99-0242ac120002',
    obj_type: 'seqvar',
    obj_id: 'HGNC:1100',
    id: '2c0a153e-5e8c-11ee-8c99-0242ac120001',
    text: 'This is a comment',
    public: true
  }
]

describe.concurrent('Comments Client', () => {
  beforeEach(() => {
    fetchMocker.enableMocks()
    fetchMocker.resetMocks()
  })

  it('fetches comments correctly', async () => {
    // arrange:
    fetchMocker.mockResponse((req) => {
      if (req.url.includes('users/me')) {
        return Promise.resolve(JSON.stringify({ id: '2c0a153e-5e8c-11ee-8c99-0242ac120002' }))
      } else if (req.url.includes('comments/list')) {
        return Promise.resolve(JSON.stringify(mockComments))
      }
      return Promise.resolve(JSON.stringify({ status: 400 }))
    })

    // act:
    const client = new CommentsClient()
    const result = await client.fetchComments()

    // assert:
    expect(result).toEqual(mockComments)
  })

  it('fails to fetch comments', async () => {
    // arrange:
    fetchMocker.mockResponse((req) => {
      if (req.url.includes('users/me')) {
        return Promise.resolve(JSON.stringify({ id: '2c0a153e-5e8c-11ee-8c99-0242ac120002' }))
      } else if (req.url.includes('comments/list')) {
        return Promise.resolve(JSON.stringify({ status: 500 }))
      }
      return Promise.resolve(JSON.stringify({ status: 400 }))
    })

    // act:
    const client = new CommentsClient()
    const result = await client.fetchComments()

    // assert:
    expect(result).toEqual({ status: 500 })
  })

  it('fetches comment correctly', async () => {
    // arrange:
    fetchMocker.mockResponse(JSON.stringify(mockComments[0]))

    // act:
    const client = new CommentsClient()
    const result = await client.fetchComment('seqvar', 'HGNC:1100')

    // assert:
    expect(result).toEqual(mockComments[0])
  })

  it('fails to fetch comment', async () => {
    // arrange:
    fetchMocker.mockResponse(JSON.stringify({ detail: 'Internal Server Error' }), { status: 500 })

    // act:
    const client = new CommentsClient()
    const result = await client.fetchComment('seqvar', 'HGNC:1100')

    // assert:
    expect(result).toEqual({ detail: 'Internal Server Error' })
  })

  it('creates comment correctly', async () => {
    // arrange:
    fetchMocker.mockResponse(JSON.stringify({}))

    // act:
    const client = new CommentsClient()
    const result = await client.createComment('seqvar', 'HGNC:1100')

    // assert:
    expect(result).toEqual({})
  })

  it('fails to create comment', async () => {
    // arrange:
    fetchMocker.mockResponse(JSON.stringify({ detail: 'Internal Server Error' }), { status: 500 })

    // act:
    const client = new CommentsClient()
    const result = await client.createComment('seqvar', 'HGNC:1100')

    // assert:
    expect(result).toEqual({ detail: 'Internal Server Error' })
  })

  it('deletes comment correctly', async () => {
    // arrange:
    fetchMocker.mockResponse(JSON.stringify({}))

    // act:
    const client = new CommentsClient()
    const result = await client.deleteComment('seqvar', 'HGNC:1100')

    // assert:
    expect(result).toEqual({})
  })

  it('fails to delete comment', async () => {
    // arrange:
    fetchMocker.mockResponse(JSON.stringify({ detail: 'Internal Server Error' }), { status: 500 })

    // act:
    const client = new CommentsClient()
    const result = await client.deleteComment('seqvar', 'HGNC:1100')

    // assert:
    expect(result).toEqual({ detail: 'Internal Server Error' })
  })
})
