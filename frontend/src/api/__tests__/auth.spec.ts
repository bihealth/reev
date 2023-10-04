import { beforeEach, describe, expect, it, vi } from 'vitest'
import createFetchMock from 'vitest-fetch-mock'

import { AuthClient } from '@/api/auth'

const fetchMocker = createFetchMock(vi)

describe.concurrent('AuthClient', () => {
  beforeEach(() => {
    fetchMocker.enableMocks()
    fetchMocker.resetMocks()
  })

  it('should login successfully', async () => {
    fetchMocker.mockResponseOnce('', { status: 204 })

    const client = new AuthClient()
    const result = await client.login('testuser', 'password123')

    expect(result).toBe(true)
  })

  it('should fail to login with incorrect credentials', async () => {
    fetchMocker.mockResponseOnce('', { status: 401 })

    const client = new AuthClient()
    const result = await client.login('invaliduser', 'invalidpassword')

    expect(result).toBe(false)
  })

  it('should logout successfully', async () => {
    fetchMocker.mockResponseOnce('Logout Successful', { status: 200 })

    const client = new AuthClient()
    const result = await client.logout()

    expect(result).toBe('Logout Successful')
  })

  it('should handle logout failure', async () => {
    fetchMocker.mockResponseOnce('Logout Failed', { status: 500 })

    const client = new AuthClient()
    const result = await client.logout()

    expect(result).toBe('Logout Failed')
  })
})
