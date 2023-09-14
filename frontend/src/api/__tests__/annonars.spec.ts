import { beforeEach, describe, it, expect, vi } from 'vitest'
import createFetchMock from 'vitest-fetch-mock'

import { AnnonarsClient } from '../annonars'
import * as BRCA1geneInfo from '@/assets/__tests__/BRCA1GeneInfo.json'
import * as BRCA1VariantInfo from '@/assets/__tests__/BRCA1VariantInfo.json'
import * as EMPSearchInfo from '@/assets/__tests__/EMPSearchInfo.json'

const fetchMocker = createFetchMock(vi)

describe.concurrent('Annonars Client', () => {
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

  it('fails to fetch gene info with wrong HGNC id', async () => {
    fetchMocker.mockResponse((req) => {
      if (req.url.includes('hgnc_id=BRCA1')) {
        return Promise.resolve(JSON.stringify(BRCA1geneInfo))
      }
      return Promise.resolve(JSON.stringify({ status: 400 }))
    })

    const client = new AnnonarsClient()
    const result = await client.fetchGeneInfo('123')
    expect(JSON.stringify(result)).toEqual(JSON.stringify({ status: 400 }))
  })

  it('fetches variant info correctly', async () => {
    fetchMocker.mockResponseOnce(JSON.stringify(BRCA1VariantInfo))

    const client = new AnnonarsClient()
    const result = await client.fetchVariantInfo('grch37', 'chr17', 43044295, 'A', 'G')
    expect(JSON.stringify(result)).toEqual(JSON.stringify(BRCA1VariantInfo))
  })

  it('do removes chr prefix from chromosome if genome release is grch38', async () => {
    fetchMocker.mockResponse((req) => {
      if (req.url.includes('chr')) {
        return Promise.resolve(JSON.stringify(BRCA1VariantInfo))
      }
      return Promise.resolve(JSON.stringify({ status: 400 }))
    })

    const client = new AnnonarsClient()
    const result = await client.fetchVariantInfo('grch38', 'chr17', 43044295, 'A', 'G')
    expect(JSON.stringify(result)).toEqual(JSON.stringify(BRCA1VariantInfo))
  })

  it('fails to fetch variant info with wrong variant', async () => {
    fetchMocker.mockResponse((req) => {
      if (req.url.includes('alternative=G')) {
        return Promise.resolve(JSON.stringify(BRCA1VariantInfo))
      }
      return Promise.resolve(JSON.stringify({ status: 400 }))
    })

    const client = new AnnonarsClient()
    const result = await client.fetchVariantInfo('grch37', 'chr17', 43044295, 'A', 'T')
    expect(JSON.stringify(result)).toEqual(JSON.stringify({ status: 400 }))
  })

  it('fetches gene clinvar info correctly', async () => {
    fetchMocker.mockResponseOnce(JSON.stringify(BRCA1geneInfo))

    const client = new AnnonarsClient()
    const result = await client.fetchGeneClinvarInfo('BRCA1')
    expect(JSON.stringify(result)).toEqual(JSON.stringify(BRCA1geneInfo))
  })

  it('fails to fetch gene clinvar info with wrong HGNC id', async () => {
    fetchMocker.mockResponse((req) => {
      if (req.url.includes('hgnc_id=BRCA1')) {
        return Promise.resolve(JSON.stringify(BRCA1geneInfo))
      }
      return Promise.resolve(JSON.stringify({ status: 400 }))
    })

    const client = new AnnonarsClient()
    const result = await client.fetchGeneClinvarInfo('123')
    expect(JSON.stringify(result)).toEqual(JSON.stringify({ status: 400 }))
  })

  it('fetches genes correctly', async () => {
    fetchMocker.mockResponseOnce(JSON.stringify(EMPSearchInfo))

    const client = new AnnonarsClient()
    const result = await client.fetchGenes(
      'q=BRCA1&fields=hgnc_id,ensembl_gene_id,ncbi_gene_id,symbol'
    )
    expect(JSON.stringify(result)).toEqual(JSON.stringify(EMPSearchInfo))
  })

  it('fails to fetch genes with wrong query', async () => {
    fetchMocker.mockResponse((req) => {
      if (req.url.includes('q=BRCA1')) {
        return Promise.resolve(JSON.stringify(EMPSearchInfo))
      }
      return Promise.resolve(JSON.stringify({ status: 400 }))
    })

    const client = new AnnonarsClient()
    const result = await client.fetchGenes(
      'q=BRCA2&fields=hgnc_id,ensembl_gene_id,ncbi_gene_id,symbol'
    )
    expect(JSON.stringify(result)).toEqual(JSON.stringify({ status: 400 }))
  })
})
