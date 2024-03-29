import { beforeEach, describe, expect, it, vi } from 'vitest'
import createFetchMock from 'vitest-fetch-mock'

import { MiscClient } from '@/api/misc'

const fetchMocker = createFetchMock(vi)

describe.concurrent('Misc Client', () => {
  beforeEach(() => {
    fetchMocker.enableMocks()
    fetchMocker.resetMocks()
  })

  it('fetches version info correctly', async () => {
    // arrange:
    fetchMocker.mockResponseOnce('v0.0.0')

    // act:
    const client = new MiscClient()
    const result = await client.fetchVersion()

    // assert:
    expect(result).toEqual('v0.0.0')
  })
})
