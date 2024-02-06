import { beforeEach, describe, expect, it, vi } from 'vitest'
import createFetchMock from 'vitest-fetch-mock'

import { UnauthenticatedError, UsersClient } from '@/api/users'

const fetchMocker = createFetchMock(vi)

describe.concurrent('Users Client', () => {
  beforeEach(() => {
    fetchMocker.enableMocks()
    fetchMocker.resetMocks()
  })

  it('should fetch current user profile successfully', async () => {
    // arrange:
    const userData = {
      id: '1',
      email: 'test@example.com',
      is_active: true,
      is_superuser: false,
      is_verified: true
    }
    fetchMocker.mockResponseOnce(JSON.stringify(userData), { status: 200 })

    // act:
    const client = new UsersClient()
    const result = await client.fetchCurrentUserProfile()

    // assert:
    expect(result).toEqual(userData)
  })

  it('should throw UnauthenticatedError when not authenticated', async () => {
    // arrange:
    fetchMocker.mockResponseOnce('', { status: 401 })

    // act:
    const client = new UsersClient()

    // assert:
    try {
      await client.fetchCurrentUserProfile()
      expect(true).toBe(false)
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthenticatedError)
    }
  })

  it('should throw UnauthenticatedError on unexpected status', async () => {
    // arrange:
    fetchMocker.mockResponseOnce('', { status: 500 })

    // act:
    const client = new UsersClient()

    // assert:
    try {
      await client.fetchCurrentUserProfile()
      expect(true).toBe(false)
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthenticatedError)
    }
  })
})
