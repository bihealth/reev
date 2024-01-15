import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import createFetchMock from 'vitest-fetch-mock'

import { StoreState } from '../misc'
import { useTermsStore } from '../terms'

const fetchMocker = createFetchMock(vi)

describe.concurrent('Terms Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    fetchMocker.enableMocks()
    fetchMocker.resetMocks()
  })

  it('initial state', () => {
    // arrange:
    const store = useTermsStore()

    // act: nothing to do

    // assert:
    expect(store.storeState).toBe(StoreState.Initial)
    expect(store.hpoTerms).toStrictEqual([])
    expect(store.omimTerms).toStrictEqual([])
  })

  it('clears data', () => {
    // arrange:
    const store = useTermsStore()
    store.hpoTerms = [{ term_id: 'HP:0000118', name: 'Phenotypic abnormality' }]

    // act:
    store.clearData()

    // assert:
    expect(store.hpoTerms).toStrictEqual([])
  })

  it('fetches HPO terms by name', async () => {
    // arrange:
    const mockHpoTerms = [{ term_id: 'HP:0000118', name: 'Phenotypic abnormality' }]
    fetchMocker.mockResponseOnce(JSON.stringify({ result: mockHpoTerms }))
    const store = useTermsStore()

    // act:
    await store.fetchHpoTerms('Phenotypic abnormality')

    // assert:
    expect(store.storeState).toBe(StoreState.Active)
    expect(store.hpoTerms).toEqual(mockHpoTerms)
  })

  it('fetches HPO term by ID', async () => {
    // arrange:
    const mockHpoTerms = [{ term_id: 'HP:0000118', name: 'Phenotypic abnormality' }]
    fetchMocker.mockResponseOnce(JSON.stringify({ result: mockHpoTerms }))

    // act:
    const store = useTermsStore()
    await store.fetchHpoTerms('HP:0000118')

    // assert:
    expect(store.storeState).toBe(StoreState.Active)
    expect(store.hpoTerms).toEqual(mockHpoTerms)
  })

  it('handles error when fetching HPO terms', async () => {
    // arrange:
    // Disable error logging
    vi.spyOn(console, 'error').mockImplementation(() => {})
    fetchMocker.mockResponseOnce(JSON.stringify({}), { status: 500 })
    const store = useTermsStore()

    // act:
    await store.fetchHpoTerms('InvalidQuery')

    // assert:
    expect(store.storeState).toBe(StoreState.Error)
    expect(store.hpoTerms).toStrictEqual([])
  })

  it('fetches OMIM terms by name', async () => {
    // arrange:
    // Disable error logging
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const mockOmimTerms = [{ term_id: 'OMIM:123456', name: 'Example Disease' }]
    fetchMocker.mockResponseOnce(JSON.stringify({ result: mockOmimTerms }))
    const store = useTermsStore()

    // act:
    await store.fetchOmimTerms('Example Disease')

    // assert:
    expect(store.storeState).toBe(StoreState.Active)
    expect(store.omimTerms).toEqual(mockOmimTerms)
  })

  it('fetches OMIM term by ID', async () => {
    // arrange:
    const mockOmimTerm = { term_id: 'OMIM:123456', name: 'Example Disease' }
    fetchMocker.mockResponseOnce(JSON.stringify({ result: mockOmimTerm }))
    const store = useTermsStore()

    // act:
    await store.fetchOmimTerms('OMIM:123456')

    // assert:
    expect(store.storeState).toBe(StoreState.Active)
    expect(store.omimTerms).toEqual([mockOmimTerm])
  })

  it('handles error when fetching OMIM terms', async () => {
    // arrange:
    // Disable error logging
    vi.spyOn(console, 'error').mockImplementation(() => {})
    fetchMocker.mockResponseOnce(JSON.stringify({}), { status: 500 })
    const store = useTermsStore()

    // act:
    await store.fetchOmimTerms('InvalidQuery')

    // assert:
    expect(store.storeState).toBe(StoreState.Error)
    expect(store.omimTerms).toStrictEqual([])
  })
})
