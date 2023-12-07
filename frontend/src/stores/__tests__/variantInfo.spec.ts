import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import createFetchMock from 'vitest-fetch-mock'

import * as BRCA1Clinvar from '@/assets/__tests__/BRCA1ClinVar.json'
import * as BRCA1GeneInfo from '@/assets/__tests__/BRCA1GeneInfo.json'
import * as BRCA1TxInfo from '@/assets/__tests__/BRCA1TxInfo.json'
import * as BRCA1VariantInfo from '@/assets/__tests__/BRCA1VariantInfo.json'
import { type Seqvar } from '@/lib/genomicVars'
import { deepCopy } from '@/lib/test-utils'

import { StoreState } from '../misc'
import { useVariantInfoStore } from '../variantInfo'

const fetchMocker = createFetchMock(vi)

const seqvarInfo: Seqvar = {
  genomeBuild: 'grch37',
  chrom: '17',
  pos: 43044295,
  del: 'G',
  ins: 'A',
  userRepr: 'grch37-17-43044295-G-A'
}

describe.concurrent('geneInfo Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    fetchMocker.enableMocks()
    fetchMocker.resetMocks()
  })

  it('should have initial state', () => {
    const store = useVariantInfoStore()

    expect(store.storeState).toBe(StoreState.Initial)
    expect(store.seqvar).toBe(undefined)
    expect(store.varAnnos).toBe(null)
    expect(store.geneInfo).toBe(null)
    expect(store.txCsq).toBe(null)
  })

  it('should clear state', () => {
    const store = useVariantInfoStore()
    store.storeState = StoreState.Active
    store.seqvar = deepCopy(seqvarInfo)
    store.varAnnos = JSON.parse(JSON.stringify(BRCA1VariantInfo))
    store.geneInfo = JSON.parse(JSON.stringify(BRCA1GeneInfo))
    store.txCsq = JSON.parse(JSON.stringify(BRCA1TxInfo))

    store.clearData()

    expect(store.storeState).toBe(StoreState.Initial)
    expect(store.seqvar).toBe(undefined)
    expect(store.varAnnos).toBe(null)
    expect(store.geneInfo).toBe(null)
    expect(store.txCsq).toBe(null)
  })

  it('should load data', async () => {
    const store = useVariantInfoStore()
    fetchMocker.mockResponse((req) => {
      if (req.url.includes('annos/variant')) {
        return Promise.resolve(JSON.stringify(BRCA1VariantInfo))
      } else if (req.url.includes('seqvars/csq')) {
        return Promise.resolve(JSON.stringify(BRCA1TxInfo))
      } else if (req.url.includes('genes/info')) {
        return Promise.resolve(JSON.stringify(BRCA1GeneInfo))
      } else if (req.url.includes('clinvar')) {
        return Promise.resolve(JSON.stringify(BRCA1Clinvar))
      } else {
        return Promise.resolve(JSON.stringify({ status: 400 }))
      }
    })

    await store.loadData(deepCopy(seqvarInfo))

    expect(store.storeState).toBe(StoreState.Active)
    expect(store.seqvar).toStrictEqual(seqvarInfo)
    expect(store.varAnnos).toEqual(BRCA1VariantInfo.result)
    expect(store.geneInfo).toEqual(BRCA1GeneInfo.genes['HGNC:1100'])
    expect(store.txCsq).toEqual(BRCA1TxInfo.result)
  })

  it('should fail to load data with invalid request', async () => {
    // Disable error logging
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const store = useVariantInfoStore()
    fetchMocker.mockResponseOnce(JSON.stringify({ foo: 'bar' }), { status: 400 })

    await store.loadData(deepCopy(seqvarInfo))

    expect(store.storeState).toBe(StoreState.Error)
    expect(store.seqvar).toBe(undefined)
    expect(store.varAnnos).toBe(undefined)
    expect(store.geneInfo).toBe(undefined)
    expect(store.txCsq).toBe(undefined)
  })

  it('should handle loading data with invalid fetchVariantInfo response', async () => {
    // Disable error logging
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const store = useVariantInfoStore()
    fetchMocker.mockResponse((req) => {
      if (req.url.includes('annos/variant')) {
        return Promise.resolve(
          JSON.stringify({ result: { cadd: null, dbnsfp: null, dbscsnv: null } })
        )
      } else if (req.url.includes('seqvars/csq')) {
        return Promise.resolve(JSON.stringify(BRCA1TxInfo))
      } else if (req.url.includes('genes/info')) {
        return Promise.resolve(JSON.stringify(BRCA1GeneInfo))
      } else if (req.url.includes('clinvar')) {
        return Promise.resolve(JSON.stringify(BRCA1Clinvar))
      } else {
        return Promise.resolve(JSON.stringify({ status: 400 }))
      }
    })

    await store.loadData(deepCopy(seqvarInfo))

    expect(store.storeState).toBe(StoreState.Active)
    expect(store.seqvar).toStrictEqual(seqvarInfo)
    expect(store.varAnnos).toStrictEqual({
      cadd: null,
      dbnsfp: null,
      dbscsnv: null
    })
    expect(store.geneInfo).toStrictEqual(
      JSON.parse(JSON.stringify(BRCA1GeneInfo)).genes['HGNC:1100']
    )
    expect(store.txCsq).toStrictEqual(JSON.parse(JSON.stringify(BRCA1TxInfo)).result)
  })

  it('should handle loading data with invalid retrieveSeqvarsCsq response', async () => {
    // Disable error logging
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const store = useVariantInfoStore()
    fetchMocker.mockResponse((req) => {
      if (req.url.includes('annos/variant')) {
        return Promise.resolve(JSON.stringify(BRCA1VariantInfo))
      } else if (req.url.includes('seqvars/csq')) {
        return Promise.resolve(JSON.stringify({ result: [] }))
      } else if (req.url.includes('genes/info')) {
        return Promise.resolve(JSON.stringify(BRCA1GeneInfo))
      } else if (req.url.includes('clinvar')) {
        return Promise.resolve(JSON.stringify(BRCA1Clinvar))
      } else {
        return Promise.resolve(JSON.stringify({ status: 400 }))
      }
    })

    await store.loadData(deepCopy(seqvarInfo))

    expect(store.storeState).toBe(StoreState.Active)
    expect(store.seqvar).toStrictEqual(seqvarInfo)

    expect(store.varAnnos).toStrictEqual(BRCA1VariantInfo.result)
    expect(store.geneInfo).toEqual(null)
    expect(store.txCsq).toStrictEqual([])
  })

  it('should fail to load data with invalid fetchGeneInfo response', async () => {
    // Disable error logging
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const store = useVariantInfoStore()
    fetchMocker.mockResponse((req) => {
      if (req.url.includes('annos/variant')) {
        return Promise.resolve(JSON.stringify(BRCA1VariantInfo))
      } else if (req.url.includes('seqvars/csq')) {
        return Promise.resolve(JSON.stringify(BRCA1TxInfo))
      } else if (req.url.includes('genes/info')) {
        return Promise.resolve(JSON.stringify({ genes: null }))
      } else if (req.url.includes('clinvar')) {
        return Promise.resolve(JSON.stringify(BRCA1Clinvar))
      } else {
        return Promise.resolve(JSON.stringify({ status: 400 }))
      }
    })

    await store.loadData(deepCopy(seqvarInfo))

    expect(console.error).toHaveBeenCalled()
    expect(console.error).toHaveBeenCalledWith(
      'There was an error loading the variant data.',
      new Error('No gene data found.')
    )
    expect(store.storeState).toBe(StoreState.Error)
    expect(store.seqvar).toBe(undefined)
    expect(store.varAnnos).toBe(undefined)
    expect(store.geneInfo).toBe(undefined)
    expect(store.txCsq).toBe(undefined)
  })

  it('should not load data if variant is the same', async () => {
    const store = useVariantInfoStore()
    fetchMocker.mockResponse((req) => {
      if (req.url.includes('annos/variant')) {
        return Promise.resolve(JSON.stringify(BRCA1VariantInfo))
      } else if (req.url.includes('seqvars/csq')) {
        return Promise.resolve(JSON.stringify(BRCA1TxInfo))
      } else if (req.url.includes('genes/info')) {
        return Promise.resolve(JSON.stringify(BRCA1GeneInfo))
      } else if (req.url.includes('clinvar')) {
        return Promise.resolve(JSON.stringify(BRCA1Clinvar))
      } else {
        return Promise.resolve(JSON.stringify({ status: 400 }))
      }
    })

    await store.loadData(deepCopy(seqvarInfo))

    expect(store.storeState).toBe(StoreState.Active)
    expect(store.seqvar).toStrictEqual(seqvarInfo)
    expect(store.varAnnos).toEqual(BRCA1VariantInfo.result)
    expect(store.geneInfo).toEqual(BRCA1GeneInfo.genes['HGNC:1100'])
    expect(store.txCsq).toEqual(BRCA1TxInfo.result)

    await store.loadData(deepCopy(seqvarInfo))

    expect(fetchMocker.mock.calls.length).toBe(4)
  })
})
