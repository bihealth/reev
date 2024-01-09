import { beforeEach, describe, expect, it, vi } from 'vitest'
import createFetchMock from 'vitest-fetch-mock'

import { CadaPrioClient } from '@/api/cadaPrio'

const fetchMocker = createFetchMock(vi)

describe.concurrent('Cada Prio Client', () => {
  beforeEach(() => {
    fetchMocker.enableMocks()
    fetchMocker.resetMocks()
  })

  it('fetches gene impact correctly', async () => {
    fetchMocker.mockResponseOnce(JSON.stringify({ result: 'pathogenic' }))

    const client = new CadaPrioClient()
    const result = await client.predictGeneImpact(['HP:0000001'])
    expect(JSON.stringify(result)).toEqual(JSON.stringify({ result: 'pathogenic' }))
  })

  it('fetches gene impact correctly with gene symbols', async () => {
    fetchMocker.mockResponseOnce(JSON.stringify({ result: 'pathogenic' }))

    const client = new CadaPrioClient()
    const result = await client.predictGeneImpact(['HP:0000001'], ['BRCA1'])
    expect(JSON.stringify(result)).toEqual(JSON.stringify({ result: 'pathogenic' }))
  })

  it('fails to fetch gene impact with wrong HPO terms', async () => {
    fetchMocker.mockResponse((req) => {
      if (req.url.includes('hpo_terms=HP:0000001')) {
        return Promise.resolve(JSON.stringify({ result: 'pathogenic' }))
      }
      return Promise.resolve(JSON.stringify({ status: 400 }))
    })

    const client = new CadaPrioClient()
    const result = await client.predictGeneImpact(['123'])
    expect(JSON.stringify(result)).toEqual(JSON.stringify({ status: 400 }))
  })
})
