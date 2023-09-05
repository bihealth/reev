import { beforeEach, describe, it, expect, vi } from 'vitest'
import createFetchMock from 'vitest-fetch-mock'

import { setActivePinia, createPinia } from 'pinia'

import { StoreState } from '../misc'
import { useGenesListStore } from '../genesList'

const fetchMocker = createFetchMock(vi)

describe('geneInfo Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    fetchMocker.enableMocks()
    fetchMocker.resetMocks()
  })

  it('should have initial state', () => {
    const store = useGenesListStore()

    expect(store.storeState).toBe(StoreState.Initial)
    expect(store.query).toBe(null)
    expect(store.genesList).toBe(null)
    expect(store.redirectHgncId).toBe(null)
  })

  it('should clear state', () => {
    const store = useGenesListStore()
    store.storeState = StoreState.Active
    store.query = 'q=BRCA1&fields=symbol'
    store.genesList = JSON.parse(JSON.stringify({ gene: 'info' }))

    store.clearData()

    expect(store.storeState).toBe(StoreState.Initial)
    expect(store.query).toBe(null)
    expect(store.genesList).toBe(null)
  })

  //   it('should load data', async () => {
  //     const store = useGenesListStore()
  //     fetchMocker.mockResponses(JSON.stringify({ result: { BRCA1: { gene: 'info' } } }))

  //     await store.loadData('q=BRCA1&fields=symbol')

  //     expect(store.storeState).toBe(StoreState.Active)
  //     expect(store.query).toBe('q=BRCA1&fields=symbol')
  //     expect(store.genesList).toEqual({ gene: 'info' })
  //   })

  //   it('should fail to load data with invalid request', async () => {
  //     // Disable error logging
  //     vi.spyOn(console, 'error').mockImplementation(() => {})
  //     const store = useGeneInfoStore()
  //     fetchMocker.mockResponseOnce(JSON.stringify({ foo: 'bar' }), { status: 400 })

  //     await store.loadData('invalid')

  //     expect(store.storeState).toBe(StoreState.Error)
  //     expect(store.geneSymbol).toBe(null)
  //     expect(store.geneInfo).toBe(null)
  //   })

  //   it('should not load data if gene symbol is the same', async () => {
  //     const store = useGeneInfoStore()
  //     fetchMocker.mockResponse(JSON.stringify({ genes: { BRCA1: { gene: 'info' } } }))

  //     await store.loadData('BRCA1')

  //     expect(store.storeState).toBe(StoreState.Active)
  //     expect(store.geneSymbol).toBe('BRCA1')
  //     expect(store.geneInfo).toEqual({ gene: 'info' })

  //     await store.loadData('BRCA1')

  //     expect(fetchMocker.mock.calls.length).toBe(1)
  //   })
})
