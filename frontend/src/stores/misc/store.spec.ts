import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import createFetchMock from 'vitest-fetch-mock'

import { StoreState } from '@/ext/reev-frontend-lib/src/stores/types'

import { useMiscStore } from '../misc'

const fetchMocker = createFetchMock(vi)

describe('miscInfo Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    fetchMocker.enableMocks()
    fetchMocker.resetMocks()
  })

  it('should have initial state', () => {
    // arrange:
    const store = useMiscStore()

    // act: nothing to do

    // assert:
    expect(store.storeState).toBe(StoreState.Initial)
    expect(store.appVersion).toBe(null)
  })

  it('should load data', async () => {
    // arrange:
    fetchMocker.mockResponseOnce('v0.0.0')
    const store = useMiscStore()

    // act:
    await store.initialize()

    // assert:
    expect(store.storeState).toBe(StoreState.Active)
    expect(store.appVersion).toBe('v0.0.0')
  })

  it('should handle error', async () => {
    // arrange:
    // Disable error logging
    vi.spyOn(console, 'error').mockImplementation(() => {})
    fetchMocker.mockRejectOnce(new Error('error'))
    const store = useMiscStore()

    // act:
    await store.initialize()

    // assert:
    expect(store.storeState).toBe(StoreState.Error)
    expect(store.appVersion).toBe(null)
  })
})
