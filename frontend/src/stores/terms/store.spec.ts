import { StoreState } from '@bihealth/reev-frontend-lib/stores'
import fs from 'fs'
import path from 'path'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import createFetchMock from 'vitest-fetch-mock'

import { useTermsStore } from './store'

/** Mock `fetch()`. */
const fetchMocker = createFetchMock(vi)

/** Fixture with response from API. */
const responseResolveOmim616145Json = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, './fixture.resolveOmim.616145.json'), 'utf8')
)
const responseQueryOmimTermsByNameEarly = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, './fixture.queryOmimTermsByName.early.json'), 'utf8')
)
const responseResolveHpoTermById0000118 = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, './fixture.resolveHpoTermById.0000118.json'), 'utf8')
)
const responseResolveHpoTermByIdAbnormal = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, './fixture.resolveHpoTermByName.abnormal.json'), 'utf8')
)

describe('Terms Store', () => {
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
    store.hpoTerms = [{ termId: 'HP:0000118', name: 'Phenotypic abnormality' }]

    // act:
    store.clearData()

    // assert:
    expect(store.hpoTerms).toStrictEqual([])
  })

  it('fetches HPO terms by name', async () => {
    // arrange:
    fetchMocker.mockResponseOnce(JSON.stringify(responseResolveHpoTermByIdAbnormal))
    const store = useTermsStore()

    // act:
    await store.fetchHpoTerms('Phenotypic abnormality')

    // assert:
    expect(store.storeState).toBe(StoreState.Active)
    expect(store.hpoTerms).toMatchSnapshot()
  })

  it('fetches HPO term by ID', async () => {
    // arrange:
    fetchMocker.mockResponseOnce(JSON.stringify(responseResolveHpoTermById0000118))

    // act:
    const store = useTermsStore()
    await store.fetchHpoTerms('HP:0000118')

    // assert:
    expect(store.storeState).toBe(StoreState.Active)
    expect(store.hpoTerms).toMatchSnapshot()
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
    fetchMocker.mockResponseOnce(JSON.stringify(responseQueryOmimTermsByNameEarly))
    const store = useTermsStore()

    // act:
    await store.fetchOmimTerms('Example Disease')

    // assert:
    expect(store.storeState).toBe(StoreState.Active)
    expect(store.omimTerms).toMatchSnapshot()
  })

  it('fetches OMIM term by ID', async () => {
    // arrange:
    fetchMocker.mockResponseOnce(JSON.stringify(responseResolveOmim616145Json))
    const store = useTermsStore()

    // act:
    await store.fetchOmimTerms('OMIM:123456')

    // assert:
    expect(store.storeState).toBe(StoreState.Active)
    expect(store.omimTerms).toMatchSnapshot()
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
