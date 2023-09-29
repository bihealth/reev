import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import createFetchMock from 'vitest-fetch-mock'

import * as geneInfo from '@/assets/__tests__/BRCA1GeneInfo.json'
import { StoreState } from '@/stores/misc'
import { useSvInfoStore } from '@/stores/svInfo'

const fetchMocker = createFetchMock(vi)

describe.concurrent('miscInfo Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    fetchMocker.enableMocks()
    fetchMocker.resetMocks()
  })

  it('should have initial state', () => {
    const store = useSvInfoStore()

    expect(store.storeState).toBe(StoreState.Initial)
    expect(store.svTerm).toBe(null)
    expect(store.currentSvRecord).toBe(null)
    expect(store.genesInfos).toStrictEqual(Array())
  })

  it('should clear state', () => {
    const store = useSvInfoStore()
    store.storeState = StoreState.Active
    store.svTerm = 'chr1:12345:A:T'
    store.genesInfos = JSON.parse(JSON.stringify([geneInfo['genes']['HGNC:1100']]))

    store.clearData()

    expect(store.storeState).toBe(StoreState.Initial)
    expect(store.svTerm).toBe(null)
    expect(store.currentSvRecord).toBe(null)
    expect(store.genesInfos).toStrictEqual(Array())
  })

  it.skip('should load data', async () => {
    const store = useSvInfoStore()
    fetchMocker.mockResponse((req) => {
      if (req.url.includes('info')) {
        return Promise.resolve(JSON.stringify({ genes: { 'HGNC:1100': { gene: 'info' } } }))
      } else if (req.url.includes('clinvar')) {
        return Promise.resolve(JSON.stringify({ genes: { 'HGNC:1100': { gene: 'info' } } }))
      } else {
        return Promise.resolve(JSON.stringify({ status: 400 }))
      }
    })
    await store.loadData('HGNC:1100', 'grch37')

    expect(store.storeState).toBe(StoreState.Active)
    expect(store.svTerm).toBe('HGNC:1100')
    expect(store.currentSvRecord).toEqual({ gene: 'info' })
    expect(store.genesInfos).toEqual([geneInfo['genes']['HGNC:1100']])
  })
})
