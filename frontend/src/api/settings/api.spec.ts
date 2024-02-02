import { beforeEach, describe, expect, it, vi } from 'vitest'
import createFetchMock from 'vitest-fetch-mock'

import { SettingsClient } from '@/api/settings'

const fetchMocker = createFetchMock(vi)

describe.concurrent('Settings Client', () => {
  beforeEach(() => {
    fetchMocker.enableMocks()
    fetchMocker.resetMocks()
  })

  it('fetches version info correctly', async () => {
    // arrange:
    fetchMocker.mockResponseOnce(
      JSON.stringify({ matomo_host: 'https://matomo.example.com/', matomo_site_id: '1' })
    )

    // act:
    const client = new SettingsClient()
    const result = await client.fetchFrontendSettings()

    // assert:
    expect(result).toEqual({ matomo_host: 'https://matomo.example.com/', matomo_site_id: '1' })
  })

  it('handles different settings data', async () => {
    // arrange:
    const alternativeSettings = { theme: 'dark', language: 'en' }
    fetchMocker.mockResponseOnce(JSON.stringify(alternativeSettings))

    // act:
    const client = new SettingsClient()
    const result = await client.fetchFrontendSettings()

    // assert:
    expect(result).toEqual(alternativeSettings)
  })

  it('handles empty settings response', async () => {
    // arrange:
    fetchMocker.mockResponseOnce(JSON.stringify({}))

    // act:
    const client = new SettingsClient()
    const result = await client.fetchFrontendSettings()

    // assert:
    expect(result).toEqual({})
  })

  it('handles null settings response', async () => {
    // arrange:
    fetchMocker.mockResponseOnce('null')

    // act:
    const client = new SettingsClient()
    const result = await client.fetchFrontendSettings()

    // assert:
    expect(result).toBeNull()
  })

  it('handles server error when fetching settings', async () => {
    // arrange:
    const errorMessage = 'Internal Server Error' // The statusText for a 500 error
    fetchMocker.mockResponseOnce(JSON.stringify({ msg: 'Internal server error' }), { status: 500 })

    // act:
    const client = new SettingsClient()

    // assert:
    await expect(client.fetchFrontendSettings()).rejects.toThrow(errorMessage)
  })

  it('handles network error when fetching settings', async () => {
    // arrange:
    fetchMocker.mockReject(new Error('Network Error'))

    // act:
    const client = new SettingsClient()

    // assert:
    await expect(client.fetchFrontendSettings()).rejects.toThrow('Network Error')
  })
})
