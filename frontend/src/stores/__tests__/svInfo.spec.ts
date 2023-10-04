import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import createFetchMock from 'vitest-fetch-mock'

import * as geneInfo from '@/assets/__tests__/BRCA1GeneInfo.json'

import { StoreState } from '../misc'
import { useSvInfoStore } from '../svInfo'

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

  it('should load data', async () => {
    const store = useSvInfoStore()
    fetchMocker.mockResponse((req) => {
      if (req.url.includes('csq')) {
        return Promise.resolve(JSON.stringify({ result: [{ hgnc_id: 'HGNC:1100' }] }))
      } else {
        return Promise.resolve(JSON.stringify(geneInfo))
      }
    })
    await store.loadData('HGNC:1100', 'grch37')

    expect(store.storeState).toBe(StoreState.Active)
    expect(store.svTerm).toBe('HGNC:1100')
    expect(store.currentSvRecord).toEqual({
      chromosome: '1100',
      end: undefined,
      release: 'grch37',
      result: [
        {
          hgnc_id: 'HGNC:1100'
        }
      ],
      start: undefined,
      sv_type: 'HGNC'
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
    await store.loadData('HGNC:1100', 'grch37')

    expect(store.storeState).toBe(StoreState.Error)
    expect(store.svTerm).toBe(null)
    expect(store.genesInfos).toStrictEqual(Array())
  })
})
