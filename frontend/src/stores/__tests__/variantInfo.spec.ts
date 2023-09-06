import { beforeEach, describe, it, expect, vi } from 'vitest'
import createFetchMock from 'vitest-fetch-mock'

import { setActivePinia, createPinia } from 'pinia'

import { StoreState } from '@/stores/misc'
import { useVariantInfoStore } from '../variantInfo'
import * as BRCA1GeneInfo from '@/assets/__tests__/BRCA1GeneInfo.json'
import * as BRCA1VariantInfo from '@/assets/__tests__/BRCA1VariantInfo.json'
import * as BRCA1TxInfo from '@/assets/__tests__/BRCA1TxInfo.json'

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

  it('should not load data if variant is the same', async () => {
    const store = useVariantInfoStore()
    fetchMocker.mockResponse((req) => {
      if (req.url.includes('annos/variant')) {
        return Promise.resolve(JSON.stringify(BRCA1VariantInfo))
      } else if (req.url.includes('tx/csq')) {
        return Promise.resolve(JSON.stringify(BRCA1TxInfo))
      } else if (req.url.includes('genes/info')) {
        return Promise.resolve(JSON.stringify(BRCA1GeneInfo))
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

    expect(fetchMocker.mock.calls.length).toBe(3)
  })
})
