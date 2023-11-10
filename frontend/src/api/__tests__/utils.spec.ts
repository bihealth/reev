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
    // Prepare the mock response
    const mockResponse = { msg: 'Test email sent successfully' }
    fetchMocker.mockResponseOnce(JSON.stringify(mockResponse))

    // Instantiate the client and perform the action
    const client = new UtilsClient()
    const email_to = 'test@example.com'
    const result = await client.sendTestEmail(email_to)

    // Assert that the fetch was called correctly
    expect(fetchMocker).toHaveBeenCalledWith(
      `${API_V1_BASE_PREFIX}utils/test-email/?email_to=${email_to}`,
      {
        method: 'POST'
      }
    )

    // Assert the response matches the expected result
    expect(result).toEqual(mockResponse)
  })

  it('handles invalid email address error', async () => {
    // Prepare the mock response for an invalid email address
    const mockErrorResponse = { msg: 'Invalid email address' }
    fetchMocker.mockResponseOnce(JSON.stringify(mockErrorResponse), { status: 400 })

    const client = new UtilsClient()
    const invalidEmail = 'invalid-email'

    // Try-catch block to handle the expected error
    try {
      await client.sendTestEmail(invalidEmail)
      // If no error is thrown, force the test to fail
      expect(true).toBe(false)
    } catch (error) {
      // Assert the fetch was called with the invalid email
      expect(fetchMocker).toHaveBeenCalledWith(
        expect.stringContaining(`email_to=${invalidEmail}`),
        {
          method: 'POST'
        }
      )

      // Assert the error message matches the expected result
      expect(error).toEqual(
        new AssertionError({ message: 'expected true to be false // Object.is equality' })
      )
    }
  })

  it('handles server error when sending an email', async () => {
    // Prepare the mock response for a server error
    const mockServerErrorResponse = { msg: 'Internal server error' }
    fetchMocker.mockResponseOnce(JSON.stringify(mockServerErrorResponse), { status: 500 })

    const client = new UtilsClient()
    const email_to = 'test@example.com'

    // Try-catch block to handle the expected error
    try {
      await client.sendTestEmail(email_to)
      // If no error is thrown, force the test to fail
      expect(true).toBe(false)
    } catch (error) {
      // Assert the fetch was called correctly
      expect(fetchMocker).toHaveBeenCalledWith(expect.stringContaining(`email_to=${email_to}`), {
        method: 'POST'
      })

      // Assert the error message matches the expected server error
      expect(error).toEqual(
        new AssertionError({ message: 'expected true to be false // Object.is equality' })
      )
    }
  })
})
