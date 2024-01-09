import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import createFetchMock from 'vitest-fetch-mock'

import { useCadaPrioStore } from '../cadaPrio'
import { StoreState } from '../misc'

const fetchMocker = createFetchMock(vi)

describe.concurrent('Cada Prio Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    fetchMocker.enableMocks()
    fetchMocker.resetMocks()
  })

  it('should have initial state', () => {
    const store = useCadaPrioStore()

    expect(store.storeState).toBe(StoreState.Initial)
    expect(store.geneRanking).toBe(null)
  })

  it('should predict gene impact', async () => {
    const store = useCadaPrioStore()
    fetchMocker.mockResponse(JSON.stringify({ result: 'pathogenic' }))

    await store.loadData(['HP:0000001'])

    expect(store.storeState).toBe(StoreState.Active)
    expect(store.geneRanking).toStrictEqual({ result: 'pathogenic' })
  })

  it('should handle error when predicting gene impact', async () => {
    // Disable error logging
    vi.spyOn(console, 'error').mockImplementation(() => {})

    const store = useCadaPrioStore()
    fetchMocker.mockReject(new Error('Internal Server Error'))

    await store.loadData(['HP:0000001'])

    expect(store.storeState).toBe(StoreState.Error)
    expect(store.geneRanking).toBe(null)
  })
})
