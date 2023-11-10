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
    fetchMocker.mockResponseOnce(
      JSON.stringify({ matomo_host: 'https://matomo.example.com/', matomo_site_id: '1' })
    )

    const client = new SettingsClient()
    const result = await client.fetchFrontendSettings()
    expect(result).toEqual({ matomo_host: 'https://matomo.example.com/', matomo_site_id: '1' })
  })

  it('handles different settings data', async () => {
    const alternativeSettings = { theme: 'dark', language: 'en' }
    fetchMocker.mockResponseOnce(JSON.stringify(alternativeSettings))

    const client = new SettingsClient()
    const result = await client.fetchFrontendSettings()
    expect(result).toEqual(alternativeSettings)
  })

  it('handles empty settings response', async () => {
    fetchMocker.mockResponseOnce(JSON.stringify({}))

    const client = new SettingsClient()
    const result = await client.fetchFrontendSettings()
    expect(result).toEqual({})
  })

  it('handles null settings response', async () => {
    fetchMocker.mockResponseOnce('null')

    const client = new SettingsClient()
    const result = await client.fetchFrontendSettings()
    expect(result).toBeNull()
  })

  it('handles server error when fetching settings', async () => {
    const errorMessage = 'Internal Server Error' // The statusText for a 500 error
    fetchMocker.mockResponseOnce(JSON.stringify({ msg: 'Internal server error' }), { status: 500 })

    const client = new SettingsClient()
    await expect(client.fetchFrontendSettings()).rejects.toThrow(errorMessage)
  })

  it('handles network error when fetching settings', async () => {
    fetchMocker.mockReject(new Error('Network Error'))

    const client = new SettingsClient()
    await expect(client.fetchFrontendSettings()).rejects.toThrow('Network Error')
  })
})
