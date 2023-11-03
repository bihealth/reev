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
})
