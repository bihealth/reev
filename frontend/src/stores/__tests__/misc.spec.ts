import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import createFetchMock from 'vitest-fetch-mock'

import { StoreState, useMiscStore } from '../misc'

const fetchMocker = createFetchMock(vi)

describe.concurrent('miscInfo Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    fetchMocker.enableMocks()
    fetchMocker.resetMocks()
  })

  it('should have initial state', () => {
    const store = useMiscStore()

    expect(store.storeState).toBe(StoreState.Initial)
    expect(store.appVersion).toBe(null)
  })

  it('should load data', async () => {
    const store = useMiscStore()
    fetchMocker.mockResponseOnce('v0.0.0')

    await store.initialize()

    expect(store.storeState).toBe(StoreState.Active)
    expect(store.appVersion).toBe('v0.0.0')
  })

  it('should handle error', async () => {
    // Disable error logging
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const store = useMiscStore()
    fetchMocker.mockRejectOnce(new Error('error'))

    await store.initialize()

    expect(store.storeState).toBe(StoreState.Error)
    expect(store.appVersion).toBe(null)
  })
})
