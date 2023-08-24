import { beforeEach, describe, it, expect, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useGeneInfoStore, StoreState } from '@/stores/geneInfo'
import { AnnonarsClient } from '@/api/annonars'

const mockFetchGeneInfo = (hgncId: string) => {
    expect(hgncId).toBe('BRCA1')
    return Promise.resolve({ gene: 'info' })
}

class MockAnnonarsClient {
    fetchGeneInfo = mockFetchGeneInfo
}

// vi.mock('@/api/annonars', () => ({
//     const Client = vi.fn().mockImplementation(MockAnnonarsClient)
//     return { Client }
// }))

describe('geneInfo Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should have initial state', () => {
    const store = useGeneInfoStore()

    expect(store.storeState).toBe(StoreState.Initial)
    expect(store.geneSymbol).toBe(null)
    expect(store.geneInfo).toBe(null)
  })

  it.skip('should clear state', () => {
    const store = useGeneInfoStore()

    store.storeState = StoreState.Active
    store.geneSymbol = 'BRCA1'
    store.geneInfo = { gene: 'info' }

    store.$clear()

    expect(store.storeState).toBe(StoreState.Initial)
    expect(store.geneSymbol).toBe(null)
    expect(store.geneInfo).toBe(null)
  })

  it.skip('should load data', async () => {
    const store = useGeneInfoStore()

    await store.loadData('BRCA1')

    expect(store.storeState).toBe(StoreState.Active)
    expect(store.geneSymbol).toBe('BRCA1')
    expect(store.geneInfo).toEqual({ gene: 'info' })
  })

  it('should fail to load data with invalid request', async () => {
    const store = useGeneInfoStore()

    await store.loadData('123')

    expect(store.storeState).toBe(StoreState.Error)
    expect(store.geneSymbol).toBe(null)
    expect(store.geneInfo).toBe(null)
  })

  it.skip('should not load data if gene symbol is the same', async () => {
    const store = useGeneInfoStore()

    const mockFetch = (url: string, options: any) => {
      expect(url).toBe('/proxy/annonars/genes/info?hgnc-id=BRCA1')
      expect(options.method).toBe('GET')
      return Promise.resolve({
        json: () => Promise.resolve({ gene: 'info' })
      })
    }

    globalThis.fetch = mockFetch

    await store.loadData('BRCA1')
    await store.loadData('BRCA1')

    expect(store.storeState).toBe(StoreState.Active)
    expect(store.geneSymbol).toBe('BRCA1')
    expect(store.geneInfo).toEqual({ gene: 'info' })
  })
})