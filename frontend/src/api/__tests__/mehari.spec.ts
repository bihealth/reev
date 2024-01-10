import { beforeEach, describe, expect, it, vi } from 'vitest'
import createFetchMock from 'vitest-fetch-mock'

import { MehariClient } from '@/api/mehari'
import * as BRCA1TxInfo from '@/assets/__tests__/BRCA1TxInfo.json'
import * as SVInfo from '@/assets/__tests__/ExampleSVTxInfo.json'
import { SeqvarImpl } from '@/lib/genomicVars'
import { LinearStrucvarImpl } from '@/lib/genomicVars'

const fetchMocker = createFetchMock(vi)

const seqVar = new SeqvarImpl('grch37', '1', 123, 'A', 'G')
const strucVar = new LinearStrucvarImpl('DEL', 'grch37', 'chr17', 43044295, 43044297)

describe.concurrent('Mehari Client', () => {
  beforeEach(() => {
    fetchMocker.enableMocks()
    fetchMocker.resetMocks()
  })

  it('fetches TxCsq info correctly', async () => {
    fetchMocker.mockResponseOnce(JSON.stringify(BRCA1TxInfo))

    const client = new MehariClient()
    const result = await client.retrieveSeqvarsCsq(seqVar, 'HGNC:1100')
    expect(JSON.stringify(result)).toEqual(JSON.stringify(BRCA1TxInfo))
  })

  it('fetches TxCsq info correctly without HGNC id', async () => {
    fetchMocker.mockResponseOnce(JSON.stringify(BRCA1TxInfo))

    const client = new MehariClient()
    const result = await client.retrieveSeqvarsCsq(seqVar)
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
    const result = await client.retrieveSeqvarsCsq(seqVar)
    expect(JSON.stringify(result)).toEqual(JSON.stringify({ status: 400 }))
  })

  it('fetches Structur Variant info correctly', async () => {
    fetchMocker.mockResponseOnce(JSON.stringify(SVInfo))

    const client = new MehariClient()
    const result = await client.retrieveStrucvarsCsq(strucVar)
    expect(JSON.stringify(result)).toEqual(JSON.stringify(SVInfo))
  })

  it('fails to fetch variant info with wrong variant', async () => {
    fetchMocker.mockResponse((req) => {
      if (req.url.includes('alternative=G')) {
        return Promise.resolve(JSON.stringify(SVInfo))
      }
      return Promise.resolve(JSON.stringify({ status: 400 }))
    })

    const client = new MehariClient()
    const result = await client.retrieveStrucvarsCsq(strucVar)
    expect(JSON.stringify(result)).toEqual(JSON.stringify({ status: 400 }))
  })
})
