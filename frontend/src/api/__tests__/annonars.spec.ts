import { beforeEach, describe, it, expect, vi } from 'vitest'
import createFetchMock from 'vitest-fetch-mock'

import { AnnonarsClient } from '../annonars'
import * as BRCA1geneInfo from '@/assets/__tests__/BRCA1GeneInfo.json'

const fetchMocker = createFetchMock(vi)

describe('Annonars Client', () => {
  beforeEach(() => {
    fetchMocker.enableMocks()
    fetchMocker.resetMocks()
  })

  it('fetches gene info correctly', async () => {
    fetchMocker.mockResponseOnce(JSON.stringify(BRCA1geneInfo))

    const client = new AnnonarsClient()
    const result = await client.fetchGeneInfo('BRCA1')
    expect(JSON.stringify(result)).toEqual(JSON.stringify(BRCA1geneInfo))
  })

  it('fails to fetch gene info with wrong hgnc-id', async () => {
    fetchMocker.mockResponse((req) => {
      if (req.url.includes('hgnc-id=BRCA1')) {
        return Promise.resolve(JSON.stringify(BRCA1geneInfo))
      }
      return Promise.resolve(JSON.stringify({ status: 400 }))
    })

    const client = new AnnonarsClient()
    const result = await client.fetchGeneInfo('123')
    expect(JSON.stringify(result)).toEqual(JSON.stringify({ status: 400 }))
  })
})
