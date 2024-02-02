import { beforeEach, describe, expect, it, vi } from 'vitest'
import createFetchMock from 'vitest-fetch-mock'

import { AuthClient } from './api'

const fetchMocker = createFetchMock(vi)

describe.concurrent('AuthClient', () => {
  beforeEach(() => {
    fetchMocker.enableMocks()
    fetchMocker.resetMocks()
  })

  it('should login successfully', async () => {
    // arrange:
    fetchMocker.mockResponseOnce('', { status: 204 })

    // act:
    const client = new AuthClient()
    const result = await client.login('testuser', 'password123')

    // assert:
    expect(result).toBe(true)
  })

  it('should fail to login with incorrect credentials', async () => {
    // arrange:
    fetchMocker.mockResponseOnce('', { status: 401 })

    // act:
    const client = new AuthClient()
    const result = await client.login('invaliduser', 'invalidpassword')

    // assert:
    expect(result).toBe(false)
  })

  it('should logout successfully', async () => {
    // arrange:
    fetchMocker.mockResponseOnce('Logout Successful', { status: 200 })

    // act:
    const client = new AuthClient()
    const result = await client.logout()

    // assert:
    expect(result).toBe('Logout Successful')
  })

  it('should handle logout failure', async () => {
    // arrange:
    fetchMocker.mockResponseOnce('Logout Failed', { status: 500 })

    // act:
    const client = new AuthClient()
    const result = await client.logout()

    // assert:
    expect(result).toBe('Logout Failed')
  })
})
