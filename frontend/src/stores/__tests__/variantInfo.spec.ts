import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import createFetchMock from 'vitest-fetch-mock'

import * as BRCA1Clinvar from '@/assets/__tests__/BRCA1ClinVar.json'
import * as BRCA1GeneInfo from '@/assets/__tests__/BRCA1GeneInfo.json'
import * as BRCA1TxInfo from '@/assets/__tests__/BRCA1TxInfo.json'
import * as BRCA1VariantInfo from '@/assets/__tests__/BRCA1VariantInfo.json'

import { StoreState } from '../misc'
import { useVariantInfoStore } from '../variantInfo'

const fetchMocker = createFetchMock(vi)

const smallVariantInfo = {
  release: 'grch37',
  chromosome: 'chr17',
  start: '43044295',
  end: '43044295',
  reference: 'G',
  alternative: 'A',
  hgnc_id: 'HGNC:1100'
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
    expect(store.variantTerm).toBe(null)
    expect(store.smallVariant).toBe(null)
    expect(store.varAnnos).toBe(null)
    expect(store.geneInfo).toBe(null)
    expect(store.txCsq).toBe(null)
  })

  it('should clear state', () => {
    const store = useVariantInfoStore()
    store.storeState = StoreState.Active
    store.variantTerm = 'chr1:12345:A:T'
    store.smallVariant = JSON.parse(JSON.stringify(smallVariantInfo))
    store.varAnnos = JSON.parse(JSON.stringify(BRCA1VariantInfo))
    store.geneInfo = JSON.parse(JSON.stringify(BRCA1GeneInfo))
    store.txCsq = JSON.parse(JSON.stringify(BRCA1TxInfo))

    store.clearData()

    expect(store.storeState).toBe(StoreState.Initial)
    expect(store.variantTerm).toBe(null)
    expect(store.smallVariant).toBe(null)
    expect(store.varAnnos).toBe(null)
    expect(store.geneInfo).toBe(null)
    expect(store.txCsq).toBe(null)
  })

  it('should load data', async () => {
    const store = useVariantInfoStore()
    fetchMocker.mockResponse((req) => {
      if (req.url.includes('annos/variant')) {
        return Promise.resolve(JSON.stringify(BRCA1VariantInfo))
      } else if (req.url.includes('tx/csq')) {
        return Promise.resolve(JSON.stringify(BRCA1TxInfo))
      } else if (req.url.includes('genes/info')) {
        return Promise.resolve(JSON.stringify(BRCA1GeneInfo))
      } else if (req.url.includes('clinvar')) {
        return Promise.resolve(JSON.stringify(BRCA1Clinvar))
      } else {
        return Promise.resolve(JSON.stringify({ status: 400 }))
      }
    })

    await store.loadData('chr17:43044295:G:A', 'grch37')

    expect(store.storeState).toBe(StoreState.Active)
    expect(store.variantTerm).toBe('chr17:43044295:G:A')
    expect(store.smallVariant).toEqual(smallVariantInfo)
    expect(store.varAnnos).toEqual(BRCA1VariantInfo.result)
    expect(store.geneInfo).toEqual(BRCA1GeneInfo.genes['HGNC:1100'])
    expect(store.txCsq).toEqual(BRCA1TxInfo.result)
  })

  it('should fail to load data with invalid request', async () => {
    // Disable error logging
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const store = useVariantInfoStore()
    fetchMocker.mockResponseOnce(JSON.stringify({ foo: 'bar' }), { status: 400 })

    await store.loadData('invalid', 'grch37')

    expect(store.storeState).toBe(StoreState.Error)
    expect(store.variantTerm).toBe(null)
    expect(store.smallVariant).toBe(null)
    expect(store.varAnnos).toBe(null)
    expect(store.geneInfo).toBe(null)
    expect(store.txCsq).toBe(null)
  })

  it('should fail to load data with invalid fetchVariantInfo response', async () => {
    // Disable error logging
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const store = useVariantInfoStore()
    fetchMocker.mockResponse((req) => {
      if (req.url.includes('annos/variant')) {
        return Promise.resolve(
          JSON.stringify({ result: { cadd: null, dbnsfp: null, dbscsnv: null } })
        )
      } else if (req.url.includes('tx/csq')) {
        return Promise.resolve(JSON.stringify(BRCA1TxInfo))
      } else if (req.url.includes('genes/info')) {
        return Promise.resolve(JSON.stringify(BRCA1GeneInfo))
      } else if (req.url.includes('clinvar')) {
        return Promise.resolve(JSON.stringify(BRCA1Clinvar))
      } else {
        return Promise.resolve(JSON.stringify({ status: 400 }))
      }
    })

    await store.loadData('chr17:43044295:G:A', 'grch37')

    expect(console.error).toHaveBeenCalled()
    expect(console.error).toHaveBeenCalledWith(
      'There was an error loading the variant data.',
      new Error('No variant data found.')
    )
    expect(store.storeState).toBe(StoreState.Error)
    expect(store.variantTerm).toBe(null)
    expect(store.smallVariant).toBe(null)
    expect(store.varAnnos).toBe(null)
    expect(store.geneInfo).toBe(null)
    expect(store.txCsq).toBe(null)
  })

  it('should fail to load data with invalid retrieveTxCsq response', async () => {
    // Disable error logging
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const store = useVariantInfoStore()
    fetchMocker.mockResponse((req) => {
      if (req.url.includes('annos/variant')) {
        return Promise.resolve(JSON.stringify(BRCA1VariantInfo))
      } else if (req.url.includes('tx/csq')) {
        return Promise.resolve(JSON.stringify({ result: [] }))
      } else if (req.url.includes('genes/info')) {
        return Promise.resolve(JSON.stringify(BRCA1GeneInfo))
      } else if (req.url.includes('clinvar')) {
        return Promise.resolve(JSON.stringify(BRCA1Clinvar))
      } else {
        return Promise.resolve(JSON.stringify({ status: 400 }))
      }
    })

    await store.loadData('chr17:43044295:G:A', 'grch37')

    expect(console.error).toHaveBeenCalled()
    expect(console.error).toHaveBeenCalledWith(
      'There was an error loading the variant data.',
      new Error('No transcript consequence data found.')
    )
    expect(store.storeState).toBe(StoreState.Error)
    expect(store.variantTerm).toBe(null)
    expect(store.smallVariant).toBe(null)
    expect(store.varAnnos).toBe(null)
    expect(store.geneInfo).toBe(null)
    expect(store.txCsq).toBe(null)
  })

  it('should fail to load data with invalid fetchGeneInfo response', async () => {
    // Disable error logging
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const store = useVariantInfoStore()
    fetchMocker.mockResponse((req) => {
      if (req.url.includes('annos/variant')) {
        return Promise.resolve(JSON.stringify(BRCA1VariantInfo))
      } else if (req.url.includes('tx/csq')) {
        return Promise.resolve(JSON.stringify(BRCA1TxInfo))
      } else if (req.url.includes('genes/info')) {
        return Promise.resolve(JSON.stringify({ genes: null }))
      } else if (req.url.includes('clinvar')) {
        return Promise.resolve(JSON.stringify(BRCA1Clinvar))
      } else {
        return Promise.resolve(JSON.stringify({ status: 400 }))
      }
    })

    await store.loadData('chr17:43044295:G:A', 'grch37')

    expect(console.error).toHaveBeenCalled()
    expect(console.error).toHaveBeenCalledWith(
      'There was an error loading the variant data.',
      new Error('No gene data found.')
    )
    expect(store.storeState).toBe(StoreState.Error)
    expect(store.variantTerm).toBe(null)
    expect(store.smallVariant).toBe(null)
    expect(store.varAnnos).toBe(null)
    expect(store.geneInfo).toBe(null)
    expect(store.txCsq).toBe(null)
  })

  it('should not load data if variant is the same', async () => {
    const store = useVariantInfoStore()
    fetchMocker.mockResponse((req) => {
      if (req.url.includes('annos/variant')) {
        return Promise.resolve(JSON.stringify(BRCA1VariantInfo))
      } else if (req.url.includes('tx/csq')) {
        return Promise.resolve(JSON.stringify(BRCA1TxInfo))
      } else if (req.url.includes('genes/info')) {
        return Promise.resolve(JSON.stringify(BRCA1GeneInfo))
      } else if (req.url.includes('clinvar')) {
        return Promise.resolve(JSON.stringify(BRCA1Clinvar))
      } else {
        return Promise.resolve(JSON.stringify({ status: 400 }))
      }
    })

    await store.loadData('chr17:43044295:G:A', 'grch37')

    expect(store.storeState).toBe(StoreState.Active)
    expect(store.variantTerm).toBe('chr17:43044295:G:A')
    expect(store.smallVariant).toEqual(smallVariantInfo)
    expect(store.varAnnos).toEqual(BRCA1VariantInfo.result)
    expect(store.geneInfo).toEqual(BRCA1GeneInfo.genes['HGNC:1100'])
    expect(store.txCsq).toEqual(BRCA1TxInfo.result)

    await store.loadData('chr17:43044295:G:A', 'grch37')

    expect(fetchMocker.mock.calls.length).toBe(4)
  })
})
