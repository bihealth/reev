import { beforeEach, describe, it, expect, vi } from 'vitest'
import createFetchMock from 'vitest-fetch-mock'

import { MehariClient } from '../mehari'
import * as BRCA1TxInfo from '@/assets/__tests__/BRCA1TxInfo.json'

const fetchMocker = createFetchMock(vi)

describe.concurrent('Mehari Client', () => {
  beforeEach(() => {
    fetchMocker.enableMocks()
    fetchMocker.resetMocks()
  })

  it('fetches TxCsq info correctly', async () => {
    fetchMocker.mockResponseOnce(JSON.stringify(BRCA1TxInfo))

    const client = new MehariClient()
    const result = await client.retrieveTxCsq('grch37', 'chr17', 43044295, 'A', 'G', 'HGNC:1100')
    expect(JSON.stringify(result)).toEqual(JSON.stringify(BRCA1TxInfo))
  })

  it('fetches TxCsq info correctly without HGNC id', async () => {
    fetchMocker.mockResponseOnce(JSON.stringify(BRCA1TxInfo))

    const client = new MehariClient()
    const result = await client.retrieveTxCsq('grch37', 'chr17', 43044295, 'A', 'G')
    expect(JSON.stringify(result)).toEqual(JSON.stringify(BRCA1TxInfo))
  })

  it('fails to fetch variant info with wrong variant', async () => {
    fetchMocker.mockResponse((req) => {
      if (req.url.includes('alternative=G')) {
        return Promise.resolve(JSON.stringify(BRCA1TxInfo))
      }
      return Promise.resolve(JSON.stringify({ status: 400 }))
    })

    const client = new MehariClient()
    const result = await client.retrieveTxCsq('grch37', 'chr17', 43044295, 'A', 'T')
    expect(JSON.stringify(result)).toEqual(JSON.stringify({ status: 400 }))
  })
})
