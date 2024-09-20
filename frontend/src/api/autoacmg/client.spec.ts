import { beforeEach, describe, expect, it, vi } from 'vitest'
import createFetchMock from 'vitest-fetch-mock'

import AUTOACMG_SEQVAR_RESULT from './brca1_seqvar.json'
import { AutoACMGClient } from './client'

const fetchMocker = createFetchMock(vi)

describe('AutoACMGClient', () => {
  beforeEach(() => {
    fetchMocker.enableMocks()
    fetchMocker.resetMocks()
  })

  it('should be created', () => {
    const client = new AutoACMGClient()
    expect(client).toBeDefined()
  })

  it('should classify a sequence variant', async () => {
    fetchMocker.mockResponseOnce(JSON.stringify(AUTOACMG_SEQVAR_RESULT))

    const client = new AutoACMGClient()
    const result = await client.classifySequenceVariant({
      genomeBuild: 'grch37',
      chrom: '17',
      pos: 41215920,
      del: 'G',
      ins: 'T',
      userRepr: 'chr17:41215920:G:T'
    })

    expect(result).toEqual(AUTOACMG_SEQVAR_RESULT['prediction'])
    expect(fetchMocker).toHaveBeenCalledTimes(1)
    expect(fetchMocker).toHaveBeenCalledWith(
      'http://localhost:8080/api/v1/proxy/autoacmg/api/v1/predict/seqvar?variant_name=chr17:41245466:G:A&genome_release=grch37',
      expect.objectContaining({
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
    )
  })

  it('should throw an error for non-200 response', async () => {
    fetchMocker.mockResponseOnce(JSON.stringify({ error: 'Not found' }), { status: 404 })

    const client = new AutoACMGClient()
    await expect(
      client.classifySequenceVariant({
        genomeBuild: 'grch37',
        chrom: '17',
        pos: 41245466,
        del: 'G',
        ins: 'A',
        userRepr: 'GRCh37-17-41245466-G-A'
      })
    ).rejects.toThrow('HTTP error! status: 404')
  })

  it('should throw an error for invalid JSON response', async () => {
    fetchMocker.mockResponseOnce('Invalid JSON')

    const client = new AutoACMGClient()
    await expect(
      client.classifySequenceVariant({
        genomeBuild: 'grch37',
        chrom: '17',
        pos: 41245466,
        del: 'G',
        ins: 'A',
        userRepr: 'GRCh37-17-41245466-G-A'
      })
    ).rejects.toThrow()
  })
})
