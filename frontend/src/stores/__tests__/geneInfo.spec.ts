import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import createFetchMock from 'vitest-fetch-mock'

import { useGeneInfoStore } from '../geneInfo'
import { StoreState } from '../misc'

const fetchMocker = createFetchMock(vi)

describe.concurrent('geneInfo Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    fetchMocker.enableMocks()
    fetchMocker.resetMocks()
  })

  it('should have initial state', () => {
    // arrange:
    const store = useGeneInfoStore()

    // act: nothing to do

    // assert:
    expect(store.storeState).toBe(StoreState.Initial)
    expect(store.hgncId).toBe(null)
    expect(store.geneInfo).toBe(null)
    expect(store.geneClinvar).toBe(null)
    expect(store.transcripts).toBe(null)
  })

  it('should clear state', () => {
    // arrange:
    const store = useGeneInfoStore()
    store.storeState = StoreState.Active
    store.hgncId = 'BRCA1'
    store.geneInfo = JSON.parse(JSON.stringify({ gene: 'info' }))

    // act:
    store.clearData()

    // assert:
    expect(store.storeState).toBe(StoreState.Initial)
    expect(store.hgncId).toBe(null)
    expect(store.geneInfo).toBe(null)
    expect(store.geneClinvar).toBe(null)
    expect(store.transcripts).toBe(null)
  })

  it('should load data', async () => {
    // arrange:
    const store = useGeneInfoStore()
    fetchMocker.mockResponse((req) => {
      if (req.url.includes('info')) {
        return Promise.resolve(JSON.stringify({ genes: { 'HGNC:1100': { gene: 'info' } } }))
      } else if (req.url.includes('clinvar')) {
        return Promise.resolve(JSON.stringify({ genes: { 'HGNC:1100': { gene: 'info' } } }))
      } else if (req.url.includes('find-transcripts')) {
        return Promise.resolve(JSON.stringify({ transcripts: { 'HGNC:1100': { gene: 'info' } } }))
      } else {
        return Promise.resolve(JSON.stringify({ status: 400 }))
      }
    })

    // act:
    await store.loadData('HGNC:1100', 'GRCh37')

    // assert:
    expect(store.storeState).toBe(StoreState.Active)
    expect(store.hgncId).toBe('HGNC:1100')
    expect(store.geneInfo).toEqual({ gene: 'info' })
    expect(store.geneClinvar).toEqual({ gene: 'info' })
    expect(store.transcripts).toEqual({ transcripts: { 'HGNC:1100': { gene: 'info' } } })
  })

  it('should fail to load data with invalid request to gene info', async () => {
    // arrange:
    // Disable error logging
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const store = useGeneInfoStore()
    fetchMocker.mockResponse((req) => {
      if (req.url.includes('info')) {
        return Promise.resolve(JSON.stringify({ foo: 'bar' }))
      } else if (req.url.includes('clinvar')) {
        return Promise.resolve(JSON.stringify({ genes: { 'HGNC:1100': { gene: 'info' } } }))
      } else if (req.url.includes('find-transcripts')) {
        return Promise.resolve(JSON.stringify({ transcripts: { 'HGNC:1100': { gene: 'info' } } }))
      } else {
        return Promise.resolve(JSON.stringify({ status: 400 }))
      }
    })

    // act:
    await store.loadData('invalid', 'invalid')

    // assert:
    expect(store.storeState).toBe(StoreState.Error)
    expect(store.hgncId).toBe(null)
    expect(store.geneInfo).toBe(null)
    expect(store.geneClinvar).toBe(null)
    expect(store.transcripts).toBe(null)
  })

  it('should fail to load data with invalid request to clinvar info', async () => {
    // arrange:
    // Disable error logging
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const store = useGeneInfoStore()
    fetchMocker.mockResponse((req) => {
      if (req.url.includes('info')) {
        return Promise.resolve(JSON.stringify({ genes: { 'HGNC:1100': { gene: 'info' } } }))
      } else if (req.url.includes('clinvar')) {
        return Promise.resolve(JSON.stringify({ foo: 'bar' }))
      } else if (req.url.includes('find-transcripts')) {
        return Promise.resolve(JSON.stringify({ transcripts: { 'HGNC:1100': { gene: 'info' } } }))
      } else {
        return Promise.resolve(JSON.stringify({ status: 400 }))
      }
    })

    // act:
    await store.loadData('invalid', 'invalid')

    // assert:
    expect(store.storeState).toBe(StoreState.Error)
    expect(store.hgncId).toBe(null)
    expect(store.geneInfo).toBe(null)
    expect(store.geneClinvar).toBe(null)
    expect(store.transcripts).toBe(null)
  })

  it('should not load data if gene symbol is the same', async () => {
    // arrange:
    const store = useGeneInfoStore()
    fetchMocker.mockResponse(JSON.stringify({ genes: { 'HGNC:1100': { gene: 'info' } } }))

    // act:
    await store.loadData('HGNC:1100', 'GRCh37')

    // assert:
    expect(store.storeState).toBe(StoreState.Active)
    expect(store.hgncId).toBe('HGNC:1100')
    expect(store.geneInfo).toEqual({ gene: 'info' })
    expect(store.geneClinvar).toEqual({ gene: 'info' })
    expect(store.hgncId).toBe('HGNC:1100')

    // act2:
    await store.loadData('HGNC:1100', 'GRCh37')

    // assert2:
    expect(fetchMocker.mock.calls.length).toBe(4)
  })
})
