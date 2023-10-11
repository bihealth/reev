import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import createFetchMock from 'vitest-fetch-mock'

import * as geneInfo from '@/assets/__tests__/BRCA1GeneInfo.json'

import { StoreState } from '../misc'
import { useSvInfoStore } from '../svInfo'

const fetchMocker = createFetchMock(vi)

describe.concurrent('svInfo Store', () => {
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
    store.svTerm = 'DEL:chr17:41176312:41277500'
    store.genesInfos = JSON.parse(JSON.stringify([geneInfo['genes']['HGNC:1100']]))

    store.clearData()

    expect(store.storeState).toBe(StoreState.Initial)
    expect(store.svTerm).toBe(null)
    expect(store.currentSvRecord).toBe(null)
    expect(store.genesInfos).toStrictEqual(Array())
  })

  it('should load data', async () => {
    const store = useSvInfoStore()
    fetchMocker.mockResponse((req) => {
      if (req.url.includes('csq')) {
        return Promise.resolve(JSON.stringify({ result: [{ hgnc_id: 'HGNC:1100' }] }))
      } else {
        return Promise.resolve(JSON.stringify(geneInfo))
      }
    })
    await store.loadData('DEL:chr17:41176312:41277500', 'grch37')

    expect(store.storeState).toBe(StoreState.Active)
    expect(store.svTerm).toBe('DEL:chr17:41176312:41277500')
    expect(store.currentSvRecord).toEqual({
      chromosome: 'chr17',
      svType: 'DEL',
      start: '41176312',
      end: '41277500',
      release: 'grch37',
      result: [
        {
          hgnc_id: 'HGNC:1100'
        }
      ]
    })
    expect(store.genesInfos).toStrictEqual([geneInfo['genes']['HGNC:1100']])
  })

  it('should correctly handle errors', async () => {
    // Disable console.error
    const spy = vi.spyOn(console, 'error')
    spy.mockImplementation(() => {})

    const store = useSvInfoStore()
    fetchMocker.mockResponse((req) => {
      if (req.url.includes('csq')) {
        return Promise.resolve(JSON.stringify({ status: 400 }))
      } else {
        return Promise.resolve(JSON.stringify({ status: 400 }))
      }
    })
    await store.loadData('DEL:chr17:41176312:41277500', 'grch37')

    expect(store.storeState).toBe(StoreState.Error)
    expect(store.svTerm).toBe(null)
    expect(store.genesInfos).toStrictEqual(Array())
  })
})
