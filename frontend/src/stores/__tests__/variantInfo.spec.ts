import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import createFetchMock from 'vitest-fetch-mock'

import * as BRCA1Clinvar from '@/assets/__tests__/BRCA1ClinVar.json'
import * as BRCA1GeneInfo from '@/assets/__tests__/BRCA1GeneInfo.json'
import * as BRCA1TxInfo from '@/assets/__tests__/BRCA1TxInfo.json'
import * as BRCA1VariantInfo from '@/assets/__tests__/BRCA1VariantInfo.json'
import { type Seqvar } from '@/lib/genomicVars'

import { StoreState } from '../misc'
import { useSeqvarInfoStore } from '../seqvarInfo'

const fetchMocker = createFetchMock(vi)

/** Example Sequence Variant */
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
    // arrange:
    const store = useSeqvarInfoStore()

    // act: nothing to do

    // assert:
    expect(store.storeState).toBe(StoreState.Initial)
    expect(store.seqvar).toBe(undefined)
    expect(store.varAnnos).toBe(null)
    expect(store.geneInfo).toBe(null)
    expect(store.hpoTerms).toEqual([])
    expect(store.txCsq).toBe(null)
  })

  it('should clear state', () => {
    // arrange:
    const store = useSeqvarInfoStore()
    store.storeState = StoreState.Active
    store.seqvar = structuredClone(seqvarInfo)
    store.varAnnos = JSON.parse(JSON.stringify(BRCA1VariantInfo))
    store.geneInfo = JSON.parse(JSON.stringify(BRCA1GeneInfo))
    store.txCsq = JSON.parse(JSON.stringify(BRCA1TxInfo))

    // act:
    store.clearData()

    // assert:
    expect(store.storeState).toBe(StoreState.Initial)
    expect(store.seqvar).toBe(undefined)
    expect(store.varAnnos).toBe(null)
    expect(store.geneInfo).toBe(null)
    expect(store.txCsq).toBe(null)
  })

  it('should load data', async () => {
    // arrange:
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
    const store = useSeqvarInfoStore()

    // act:
    await store.loadData(structuredClone(seqvarInfo))

    // assert:
    expect(store.storeState).toBe(StoreState.Active)
    expect(store.seqvar).toStrictEqual(seqvarInfo)
    expect(store.varAnnos).toEqual(BRCA1VariantInfo.result)
    expect(store.geneInfo).toEqual(BRCA1GeneInfo.genes['HGNC:1100'])
    expect(store.txCsq).toEqual(BRCA1TxInfo.result)
  })

  it('should fail to load data with invalid request', async () => {
    // arrange:
    // Disable error logging
    vi.spyOn(console, 'error').mockImplementation(() => {})
    fetchMocker.mockResponseOnce(JSON.stringify({ foo: 'bar' }), { status: 400 })
    const store = useSeqvarInfoStore()

    // act:
    await store.loadData(structuredClone(seqvarInfo))

    // assert:
    expect(store.storeState).toBe(StoreState.Error)
    expect(store.seqvar).toBe(undefined)
    expect(store.varAnnos).toBe(null)
    expect(store.geneInfo).toBe(null)
    expect(store.txCsq).toBe(null)
  })

  it('should handle loading data with invalid fetchVariantInfo response', async () => {
    // arrange:
    // Disable error logging
    vi.spyOn(console, 'error').mockImplementation(() => {})
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
    const store = useSeqvarInfoStore()

    // act:
    await store.loadData(structuredClone(seqvarInfo))

    // assert:
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
    // arrange:
    // Disable error logging
    vi.spyOn(console, 'error').mockImplementation(() => {})
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
    const store = useSeqvarInfoStore()

    // act:
    await store.loadData(structuredClone(seqvarInfo))

    // assert:
    expect(store.storeState).toBe(StoreState.Active)
    expect(store.seqvar).toStrictEqual(seqvarInfo)
    expect(store.varAnnos).toStrictEqual(BRCA1VariantInfo.result)
    expect(store.geneInfo).toEqual(null)
    expect(store.txCsq).toStrictEqual([])
  })

  it('should fail to load data with invalid fetchGeneInfo response', async () => {
    // arrange:
    // Disable error logging
    vi.spyOn(console, 'error').mockImplementation(() => {})
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
    const store = useSeqvarInfoStore()

    // act:
    await store.loadData(structuredClone(seqvarInfo))

    // assert:
    expect(console.error).toHaveBeenCalled()
    expect(console.error).toHaveBeenCalledWith(
      'There was an error loading the variant data.',
      new TypeError("Cannot read properties of null (reading 'HGNC:1100')")
    )
    expect(store.storeState).toBe(StoreState.Error)
    expect(store.seqvar).toBe(undefined)
    expect(store.varAnnos).toBe(null)
    expect(store.geneInfo).toBe(null)
    expect(store.txCsq).toBe(null)
  })

  it('should not load data if variant is the same', async () => {
    // arrange:
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
    const store = useSeqvarInfoStore()

    // act:
    await store.loadData(structuredClone(seqvarInfo))

    // assert:
    expect(store.storeState).toBe(StoreState.Active)
    expect(store.seqvar).toStrictEqual(seqvarInfo)
    expect(store.varAnnos).toEqual(BRCA1VariantInfo.result)
    expect(store.geneInfo).toEqual(BRCA1GeneInfo.genes['HGNC:1100'])
    expect(store.txCsq).toEqual(BRCA1TxInfo.result)

    // act2:
    await store.loadData(structuredClone(seqvarInfo))

    // assert2:
    expect(fetchMocker.mock.calls.length).toBe(5)
  })
})
