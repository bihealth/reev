import { beforeEach, describe, it, expect, vi } from 'vitest'
import createFetchMock from 'vitest-fetch-mock'

import { setActivePinia, createPinia } from 'pinia'

import { StoreState } from '../misc'
import { useVariantAcmgRatingStore } from '../variantAcmgRating'

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
    const store = useVariantAcmgRatingStore()

    expect(store.storeState).toBe(StoreState.Initial)
    expect(store.acmgRatingComputed).toBe(null)
    expect(store.acmgRatingCustom).toBe(null)
    expect(store.smallVariant).toBe(null)
  })

  it('should clear state', () => {
    const store = useVariantAcmgRatingStore()
    store.storeState = StoreState.Active
    store.acmgRatingComputed = JSON.parse(JSON.stringify({ acmg: 'rating' }))
    store.smallVariant = JSON.parse(JSON.stringify({ gene: 'info' }))

    store.clearData()

    expect(store.storeState).toBe(StoreState.Initial)
    expect(store.acmgRatingComputed).toBe(null)
    expect(store.smallVariant).toBe(null)
  })

  it('should correctly retrieve data', async () => {
    const store = useVariantAcmgRatingStore()
    fetchMocker.mockResponseOnce(JSON.stringify({ acmg: 'rating' }))

    await store.retrieveAcmgRating(smallVariantInfo)

    expect(store.storeState).toBe(StoreState.Active)
    expect(store.acmgRatingComputed).toStrictEqual(JSON.parse(JSON.stringify({ acmg: 'rating' })))
    expect(store.smallVariant).toStrictEqual(JSON.parse(JSON.stringify(smallVariantInfo)))
  })

  it('should fail to load data with invalid request', async () => {
    // Disable error logging
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const store = useVariantAcmgRatingStore()
    fetchMocker.mockResponseOnce(JSON.stringify({ foo: 'bar' }), { status: 400 })

    await store.retrieveAcmgRating(smallVariantInfo)

    expect(store.storeState).toBe(StoreState.Error)
    expect(store.acmgRatingComputed).toBe(null)
    expect(store.smallVariant).toBe(null)
  })

  it('should not load data if small variant is the same', async () => {
    const store = useVariantAcmgRatingStore()
    fetchMocker.mockResponse(JSON.stringify({ acmg: 'rating' }))
    await store.retrieveAcmgRating(smallVariantInfo)

    expect(store.storeState).toBe(StoreState.Active)
    expect(store.acmgRatingComputed).toStrictEqual(JSON.parse(JSON.stringify({ acmg: 'rating' })))
    expect(store.smallVariant).toStrictEqual(JSON.parse(JSON.stringify(smallVariantInfo)))

    await store.retrieveAcmgRating(store.smallVariant)

    expect(fetchMocker.mock.calls.length).toBe(1)
  })
})
