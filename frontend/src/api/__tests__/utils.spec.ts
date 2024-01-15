import { AssertionError } from 'assert'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import createFetchMock from 'vitest-fetch-mock'

import { API_V1_BASE_PREFIX } from '@/api/common'
import { UtilsClient } from '@/api/utils'

const fetchMocker = createFetchMock(vi)

describe.concurrent('Utils Client', () => {
  beforeEach(() => {
    fetchMocker.enableMocks()
    fetchMocker.resetMocks()
  })

  it('sends a test email correctly', async () => {
    // arrange:
    const mockResponse = { msg: 'Test email sent successfully' }
    fetchMocker.mockResponseOnce(JSON.stringify(mockResponse))

    // act:
    const client = new UtilsClient()
    const email_to = 'test@example.com'
    const result = await client.sendTestEmail(email_to)

    // assert:
    expect(fetchMocker).toHaveBeenCalledWith(
      `${API_V1_BASE_PREFIX}utils/test-email/?email_to=${email_to}`,
      {
        method: 'POST'
      }
    )
    expect(result).toEqual(mockResponse)
  })

  it('handles invalid email address error', async () => {
    // arrange:
    const mockErrorResponse = { msg: 'Invalid email address' }
    fetchMocker.mockResponseOnce(JSON.stringify(mockErrorResponse), { status: 400 })

    // act:
    const client = new UtilsClient()
    const invalidEmail = 'invalid-email'

    // assert:
    try {
      await client.sendTestEmail(invalidEmail)
      expect(true).toBe(false)
    } catch (error) {
      expect(fetchMocker).toHaveBeenCalledWith(
        expect.stringContaining(`email_to=${invalidEmail}`),
        {
          method: 'POST'
        }
      )
      expect(error).toEqual(
        new AssertionError({ message: 'expected true to be false // Object.is equality' })
      )
    }
  })

  it('handles server error when sending an email', async () => {
    // arrange:
    const mockServerErrorResponse = { msg: 'Internal server error' }
    fetchMocker.mockResponseOnce(JSON.stringify(mockServerErrorResponse), { status: 500 })

    // act:
    const client = new UtilsClient()
    const email_to = 'test@example.com'

    // assert:
    try {
      await client.sendTestEmail(email_to)
      expect(true).toBe(false)
    } catch (error) {
      expect(fetchMocker).toHaveBeenCalledWith(expect.stringContaining(`email_to=${email_to}`), {
        method: 'POST'
      })
      expect(error).toEqual(
        new AssertionError({ message: 'expected true to be false // Object.is equality' })
      )
    }
  })
})
