import { beforeEach, describe, expect, it, vi } from 'vitest'
import createFetchMock from 'vitest-fetch-mock'

import { DottyClient, type DottyResponse } from '@/api/dotty'

const fetchMocker = createFetchMock(vi)

describe.concurrent('DottyClient', () => {
  beforeEach(() => {
    fetchMocker.enableMocks()
    fetchMocker.resetMocks()
  })

  it('should resolve to SPDI successfully', async () => {
    const mockData: DottyResponse = {
      success: true,
      value: {
        assembly: 'GRCh38',
        contig: '13',
        pos: 32319283,
        reference_deleted: 'C',
        alternate_inserted: 'A'
      }
    }
    fetchMocker.mockResponseOnce(JSON.stringify(mockData), { status: 200 })

    const client = new DottyClient()
    const result = await client.toSpdi('NM_000059.3:c.274G>A')

    expect(result).toEqual(mockData)
  })

  it('should load transcripts successfully', async () => {
    const mockData = {
      transcripts: {
        'HGNC:1100': {
          gene: 'info'
        }
      }
    }
    fetchMocker.mockResponseOnce(JSON.stringify(mockData), { status: 200 })

    const client = new DottyClient()
    const result = await client.fetchTranscripts('HGNC:1100', 'GRCh37')

    expect(result).toEqual(mockData)
  })
})
