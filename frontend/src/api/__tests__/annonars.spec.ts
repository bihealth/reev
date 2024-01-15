import { beforeEach, describe, expect, it, vi } from 'vitest'
import createFetchMock from 'vitest-fetch-mock'

import { AnnonarsClient } from '@/api/annonars'
import * as BRCA1geneInfo from '@/assets/__tests__/BRCA1GeneInfo.json'
import * as BRCA1VariantInfo from '@/assets/__tests__/BRCA1VariantInfo.json'
import * as EMPSearchInfo from '@/assets/__tests__/EMPSearchInfo.json'
import { SeqvarImpl } from '@/lib/genomicVars'

const fetchMocker = createFetchMock(vi)

// Test data
const seqVar = new SeqvarImpl('grch37', '1', 123, 'A', 'G')

describe.concurrent('Annonars Client', () => {
  beforeEach(() => {
    fetchMocker.enableMocks()
    fetchMocker.resetMocks()
  })

  it('fetches gene info correctly', async () => {
    // arrange:
    fetchMocker.mockResponseOnce(JSON.stringify(BRCA1geneInfo))

    // act:
    const client = new AnnonarsClient()
    const result = await client.fetchGeneInfo('BRCA1')

    // assert:
    expect(JSON.stringify(result)).toEqual(JSON.stringify(BRCA1geneInfo))
  })

  it('fails to fetch gene info with wrong HGNC id', async () => {
    // arrange:
    fetchMocker.mockResponse((req) => {
      if (req.url.includes('hgnc_id=BRCA1')) {
        return Promise.resolve(JSON.stringify(BRCA1geneInfo))
      }
      return Promise.resolve(JSON.stringify({ status: 400 }))
    })

    // act:
    const client = new AnnonarsClient()
    const result = await client.fetchGeneInfo('123')

    // assert:
    expect(JSON.stringify(result)).toEqual(JSON.stringify({ status: 400 }))
  })

  it('fetches variant info correctly', async () => {
    // arrange:
    fetchMocker.mockResponseOnce(JSON.stringify(BRCA1VariantInfo))

    // act:
    const client = new AnnonarsClient()
    const result = await client.fetchVariantInfo(seqVar)

    // assert:
    expect(JSON.stringify(result)).toEqual(JSON.stringify(BRCA1VariantInfo))
  })

  it('do removes chr prefix from chromosome if genome release is grch38', async () => {
    // arrange:
    fetchMocker.mockResponse((req) => {
      if (req.url.includes('chr')) {
        return Promise.resolve(JSON.stringify(BRCA1VariantInfo))
      }
      return Promise.resolve(JSON.stringify({ status: 400 }))
    })

    // act:
    const client = new AnnonarsClient()
    const result = await client.fetchVariantInfo(seqVar)

    // assert:
    expect(JSON.stringify(result)).toEqual(JSON.stringify(BRCA1VariantInfo))
  })

  it('fails to fetch variant info with wrong variant', async () => {
    // arrange:
    const seqVarInvalid = new SeqvarImpl('grch37', '1', 123, 'A', 'T')
    fetchMocker.mockResponse((req) => {
      if (req.url.includes('alternative=G')) {
        return Promise.resolve(JSON.stringify(BRCA1VariantInfo))
      }
      return Promise.resolve(JSON.stringify({ status: 400 }))
    })

    // act:
    const client = new AnnonarsClient()
    const result = await client.fetchVariantInfo(seqVarInvalid)

    // assert:
    expect(JSON.stringify(result)).toEqual(JSON.stringify({ status: 400 }))
  })

  it('fetches gene clinvar info correctly', async () => {
    // arrange:
    fetchMocker.mockResponseOnce(JSON.stringify(BRCA1geneInfo))

    // act:
    const client = new AnnonarsClient()
    const result = await client.fetchGeneClinvarInfo('BRCA1')

    // assert:
    expect(JSON.stringify(result)).toEqual(JSON.stringify(BRCA1geneInfo))
  })

  it('fails to fetch gene clinvar info with wrong HGNC id', async () => {
    // arrange:
    fetchMocker.mockResponse((req) => {
      if (req.url.includes('hgnc_id=BRCA1')) {
        return Promise.resolve(JSON.stringify(BRCA1geneInfo))
      }
      return Promise.resolve(JSON.stringify({ status: 400 }))
    })

    // act:
    const client = new AnnonarsClient()
    const result = await client.fetchGeneClinvarInfo('123')

    // assert:
    expect(JSON.stringify(result)).toEqual(JSON.stringify({ status: 400 }))
  })

  it('fetches genes correctly', async () => {
    // arrange:
    fetchMocker.mockResponseOnce(JSON.stringify(EMPSearchInfo))

    // act:
    const client = new AnnonarsClient()
    const result = await client.fetchGenes(
      'q=BRCA1&fields=hgnc_id,ensembl_gene_id,ncbi_gene_id,symbol'
    )

    // assert:
    expect(JSON.stringify(result)).toEqual(JSON.stringify(EMPSearchInfo))
  })

  it('fails to fetch genes with wrong query', async () => {
    // arrange:
    fetchMocker.mockResponse((req) => {
      if (req.url.includes('q=BRCA1')) {
        return Promise.resolve(JSON.stringify(EMPSearchInfo))
      }
      return Promise.resolve(JSON.stringify({ status: 400 }))
    })

    // act:
    const client = new AnnonarsClient()
    const result = await client.fetchGenes(
      'q=BRCA2&fields=hgnc_id,ensembl_gene_id,ncbi_gene_id,symbol'
    )

    // assert:
    expect(JSON.stringify(result)).toEqual(JSON.stringify({ status: 400 }))
  })

  it('fetches gene infos correctly', async () => {
    // arrange:
    fetchMocker.mockResponse(JSON.stringify(BRCA1geneInfo))

    // act:
    const client = new AnnonarsClient()
    const result = await client.fetchGeneInfos(['BRCA1', 'BRCA2'])

    // assert:
    expect(JSON.stringify(result)).toMatch(JSON.stringify(BRCA1geneInfo['genes']['HGNC:1100']))
  })

  it.fails('fails to fetch gene infos with wrong HGNC id', async () => {
    // arrange:
    fetchMocker.mockResponse(() => {
      return Promise.resolve(JSON.stringify({ status: 500 }))
    })

    // act:
    const client = new AnnonarsClient()
    const result = await client.fetchGeneInfos(['123', 'BRCA2'])

    // assert:
    expect(JSON.stringify(result)).toEqual(JSON.stringify({ status: 500 }))
  })
})
