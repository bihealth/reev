import { beforeEach, describe, expect, it, vi } from 'vitest'
import createFetchMock from 'vitest-fetch-mock'

import { AcmgSeqVarClient } from '@/api/acmgseqvar'
import { SeqvarImpl } from '@/lib/genomicVars'
import { type AcmgRatingBackend } from '@/stores/seqVarAcmgRating'

const fetchMocker = createFetchMock(vi)

const seqVar = new SeqvarImpl('grch37', '1', 123, 'A', 'G')
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
    fetchMocker.mockResponse(JSON.stringify([mockAcmgRating]))

    const client = new AcmgSeqVarClient()
    const result = await client.listAcmgRatings()

    expect(result).toEqual([mockAcmgRating])
  })

  it('fails to list ACMG ratings', async () => {
    fetchMocker.mockResponse((req) => {
      if (req.url.includes('acmgseqvar/list')) {
        return Promise.resolve(JSON.stringify({ status: 500 }))
      }
      return Promise.resolve(JSON.stringify({ status: 400 }))
    })

    const client = new AcmgSeqVarClient()
    const result = await client.listAcmgRatings()

    expect(result).toEqual({ status: 500 })
  })

  it('fetches ACMG rating correctly', async () => {
    fetchMocker.mockResponse(JSON.stringify(mockAcmgRating))

    const client = new AcmgSeqVarClient()
    const result = await client.fetchAcmgRating(seqVar.toName())

    expect(result).toEqual(mockAcmgRating)
  })

  it('fails to fetch ACMG rating', async () => {
    fetchMocker.mockResponse((req) => {
      if (req.url.includes('acmgseqvar/get')) {
        return Promise.resolve(JSON.stringify({ status: 500 }))
      }
      return Promise.resolve(JSON.stringify({ status: 400 }))
    })

    const client = new AcmgSeqVarClient()
    const result = await client.fetchAcmgRating(seqVar.toName())

    expect(result).toEqual({ status: 500 })
  })

  it('saves ACMG rating correctly', async () => {
    fetchMocker.mockResponse(JSON.stringify(mockAcmgRating))

    const client = new AcmgSeqVarClient()
    const result = await client.saveAcmgRating(seqVar.toName(), mockAcmgRating)

    expect(result).toEqual(mockAcmgRating)
  })

  it('fails to save ACMG rating', async () => {
    fetchMocker.mockResponse((req) => {
      if (req.url.includes('acmgseqvar/create')) {
        return Promise.resolve(JSON.stringify({ status: 500 }))
      }
      return Promise.resolve(JSON.stringify({ status: 400 }))
    })

    const client = new AcmgSeqVarClient()
    const result = await client.saveAcmgRating(seqVar.toName(), mockAcmgRating)

    expect(result).toEqual({ status: 500 })
  })

  it('updates ACMG rating correctly', async () => {
    fetchMocker.mockResponse(JSON.stringify(mockAcmgRating))

    const client = new AcmgSeqVarClient()
    const result = await client.updateAcmgRating(seqVar.toName(), mockAcmgRating)

    expect(result).toEqual(mockAcmgRating)
  })

  it('fails to update ACMG rating', async () => {
    fetchMocker.mockResponse((req) => {
      if (req.url.includes('acmgseqvar/update')) {
        return Promise.resolve(JSON.stringify({ status: 500 }))
      }
      return Promise.resolve(JSON.stringify({ status: 400 }))
    })

    const client = new AcmgSeqVarClient()
    const result = await client.updateAcmgRating(seqVar.toName(), mockAcmgRating)

    expect(result).toEqual({ status: 500 })
  })

  it('deletes ACMG rating correctly', async () => {
    fetchMocker.mockResponse(JSON.stringify({}))

    const client = new AcmgSeqVarClient()
    const result = await client.deleteAcmgRating(seqVar.toName())

    expect(result).toEqual({})
  })

  it('fails to delete ACMG rating', async () => {
    fetchMocker.mockResponse((req) => {
      if (req.url.includes('acmgseqvar/delete')) {
        return Promise.resolve(JSON.stringify({ status: 500 }))
      }
      return Promise.resolve(JSON.stringify({ status: 400 }))
    })

    const client = new AcmgSeqVarClient()
    const result = await client.deleteAcmgRating(seqVar.toName())

    expect(result).toEqual({ status: 500 })
  })
})
