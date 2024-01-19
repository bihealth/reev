import { beforeEach, describe, expect, it, vi } from 'vitest'
import createFetchMock from 'vitest-fetch-mock'

import { AcmgSeqVarClient } from '@/api/acmgSeqvar'
import { SeqvarImpl } from '@/lib/genomicVars'
import { type AcmgRatingBackend } from '@/stores/seqvarAcmgRating'

const fetchMocker = createFetchMock(vi)

/** Example Sequence Variant */
const seqVar = new SeqvarImpl('grch37', '1', 123, 'A', 'G')

/** Example ACMG Rating data */
const mockAcmgRating: AcmgRatingBackend = {
  comment: 'exampleComment',
  criterias: [
    {
      criteria: 'Pm1',
      presence: 'Present',
      evidence: 'Pathogenic Moderate'
    }
  ]
}

describe.concurrent('AcmgSeqVar Client', () => {
  beforeEach(() => {
    fetchMocker.enableMocks()
    fetchMocker.resetMocks()
  })

  it('lists ACMG ratings correctly', async () => {
    // arrange:
    fetchMocker.mockResponse(JSON.stringify([mockAcmgRating]))

    // act:
    const client = new AcmgSeqVarClient()
    const result = await client.listAcmgRatings()

    // assert:
    expect(result).toEqual([mockAcmgRating])
  })

  it('fails to list ACMG ratings', async () => {
    // arrange:
    fetchMocker.mockResponse((req) => {
      if (req.url.includes('acmgseqvar/list')) {
        return Promise.resolve(JSON.stringify({ status: 500 }))
      }
      return Promise.resolve(JSON.stringify({ status: 400 }))
    })

    // act:
    const client = new AcmgSeqVarClient()
    const result = await client.listAcmgRatings()

    // assert:
    expect(result).toEqual({ status: 500 })
  })

  it('fetches ACMG rating correctly', async () => {
    // arrange:
    fetchMocker.mockResponse(JSON.stringify(mockAcmgRating))

    // act:
    const client = new AcmgSeqVarClient()
    const result = await client.fetchAcmgRating(seqVar)

    // assert:
    expect(result).toEqual(mockAcmgRating)
  })

  it('fails to fetch ACMG rating', async () => {
    // arrange:
    fetchMocker.mockResponse((req) => {
      if (req.url.includes('acmgseqvar/get')) {
        return Promise.resolve(JSON.stringify({ status: 500 }))
      }
      return Promise.resolve(JSON.stringify({ status: 400 }))
    })

    // act:
    const client = new AcmgSeqVarClient()
    const result = await client.fetchAcmgRating(seqVar)

    // assert:
    expect(result).toEqual({ status: 500 })
  })

  it('saves ACMG rating correctly', async () => {
    // arrange:
    fetchMocker.mockResponse(JSON.stringify(mockAcmgRating))

    // act:
    const client = new AcmgSeqVarClient()
    const result = await client.saveAcmgRating(seqVar, mockAcmgRating)

    // assert:
    expect(result).toEqual(mockAcmgRating)
  })

  it('fails to save ACMG rating', async () => {
    // arrange:
    fetchMocker.mockResponse((req) => {
      if (req.url.includes('acmgseqvar/create')) {
        return Promise.resolve(JSON.stringify({ status: 500 }))
      }
      return Promise.resolve(JSON.stringify({ status: 400 }))
    })

    // act:
    const client = new AcmgSeqVarClient()
    const result = await client.saveAcmgRating(seqVar, mockAcmgRating)

    // assert:
    expect(result).toEqual({ status: 500 })
  })

  it('updates ACMG rating correctly', async () => {
    // arrange:
    fetchMocker.mockResponse(JSON.stringify(mockAcmgRating))

    // act:
    const client = new AcmgSeqVarClient()
    const result = await client.updateAcmgRating(seqVar, mockAcmgRating)

    // assert:
    expect(result).toEqual(mockAcmgRating)
  })

  it('fails to update ACMG rating', async () => {
    // arrange:
    fetchMocker.mockResponse((req) => {
      if (req.url.includes('acmgseqvar/update')) {
        return Promise.resolve(JSON.stringify({ status: 500 }))
      }
      return Promise.resolve(JSON.stringify({ status: 400 }))
    })

    // act:
    const client = new AcmgSeqVarClient()
    const result = await client.updateAcmgRating(seqVar, mockAcmgRating)

    // assert:
    expect(result).toEqual({ status: 500 })
  })

  it('deletes ACMG rating correctly', async () => {
    // arrange:
    fetchMocker.mockResponse(JSON.stringify({}))

    // act:
    const client = new AcmgSeqVarClient()
    const result = await client.deleteAcmgRating(seqVar)

    // assert:
    expect(result).toEqual({})
  })

  it('fails to delete ACMG rating', async () => {
    // arrange:
    fetchMocker.mockResponse((req) => {
      if (req.url.includes('acmgseqvar/delete')) {
        return Promise.resolve(JSON.stringify({ status: 500 }))
      }
      return Promise.resolve(JSON.stringify({ status: 400 }))
    })

    // act:
    const client = new AcmgSeqVarClient()
    const result = await client.deleteAcmgRating(seqVar)

    // assert:
    expect(result).toEqual({ status: 500 })
  })
})
