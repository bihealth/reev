import { beforeEach, describe, expect, it, vi } from 'vitest'
import createFetchMock from 'vitest-fetch-mock'

import { MehariClient } from '@/api/mehari'
import * as BRCA1TxInfo from '@/assets/__tests__/BRCA1TxInfo.json'
import * as SVInfo from '@/assets/__tests__/ExampleSVTxInfo.json'
import { SeqvarImpl } from '@/lib/genomicVars'
import { LinearStrucvarImpl } from '@/lib/genomicVars'

const fetchMocker = createFetchMock(vi)

// Test data
const seqVar = new SeqvarImpl('grch37', '1', 123, 'A', 'G')
const strucVar = new LinearStrucvarImpl('DEL', 'grch37', 'chr17', 43044295, 43044297)

describe.concurrent('Mehari Client', () => {
  beforeEach(() => {
    fetchMocker.enableMocks()
    fetchMocker.resetMocks()
  })

  it('fetches TxCsq info correctly', async () => {
    // arrange:
    fetchMocker.mockResponseOnce(JSON.stringify(BRCA1TxInfo))

    // act:
    const client = new MehariClient()
    const result = await client.retrieveSeqvarsCsq(seqVar, 'HGNC:1100')

    // assert:
    expect(JSON.stringify(result)).toEqual(JSON.stringify(BRCA1TxInfo))
  })

  it('fetches TxCsq info correctly without HGNC id', async () => {
    // arrange:
    fetchMocker.mockResponseOnce(JSON.stringify(BRCA1TxInfo))

    // act:
    const client = new MehariClient()
    const result = await client.retrieveSeqvarsCsq(seqVar)

    // assert:
    expect(JSON.stringify(result)).toEqual(JSON.stringify(BRCA1TxInfo))
  })

  it('fails to fetch variant info with wrong variant', async () => {
    // arrange:
    const seqVarInvalid = new SeqvarImpl('grch37', '1', 123, 'A', 'T')
    fetchMocker.mockResponse((req) => {
      if (req.url.includes('alternative=G')) {
        return Promise.resolve(JSON.stringify(BRCA1TxInfo))
      }
      return Promise.resolve(JSON.stringify({ status: 400 }))
    })

    // act:
    const client = new MehariClient()
    const result = await client.retrieveSeqvarsCsq(seqVarInvalid)

    // assert:
    expect(JSON.stringify(result)).toEqual(JSON.stringify({ status: 400 }))
  })

  it('fetches Structur Variant info correctly', async () => {
    // arrange:
    fetchMocker.mockResponseOnce(JSON.stringify(SVInfo))

    // act:
    const client = new MehariClient()
    const result = await client.retrieveStrucvarsCsq(strucVar)

    // assert:
    expect(JSON.stringify(result)).toEqual(JSON.stringify(SVInfo))
  })

  it('fails to fetch variant info with wrong variant', async () => {
    // arrange:
    const strucVarInvalid = new LinearStrucvarImpl('DUP', 'grch37', 'chr17', 43044295, 43044297)
    fetchMocker.mockResponse((req) => {
      if (req.url.includes('DEL')) {
        return Promise.resolve(JSON.stringify(SVInfo))
      }
      return Promise.resolve(JSON.stringify({ status: 400 }))
    })

    // act:
    const client = new MehariClient()
    const result = await client.retrieveStrucvarsCsq(strucVarInvalid)

    // assert:
    expect(JSON.stringify(result)).toEqual(JSON.stringify({ status: 400 }))
  })
})
