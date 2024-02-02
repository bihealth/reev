import { StoreState } from '@bihealth/reev-frontend-lib/stores'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import createFetchMock from 'vitest-fetch-mock'

import { useGenesListStore } from '../genesList'

const fetchMocker = createFetchMock(vi)

/** Example list of genes */
const exampleGenesList = {
  genes: [
    {
      score: 0.75,
      data: {
        hgnc_id: 'HGNC:3333',
        symbol: 'EMP1',
        name: 'epithelial membrane protein 1',
        alias_symbol: ['TMP', 'CL-20'],
        alias_name: [],
        ensembl_gene_id: 'ENSG00000134531',
        ncbi_gene_id: '2012'
      }
    },
    {
      score: 0.75,
      data: {
        hgnc_id: 'HGNC:3334',
        symbol: 'EMP2'
      }
    }
  ]
}

describe('geneInfo Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    fetchMocker.enableMocks()
    fetchMocker.resetMocks()
  })

  it('should have initial state', () => {
    // arrange:
    const store = useGenesListStore()

    // act: nothing to do

    // assert:
    expect(store.storeState).toBe(StoreState.Initial)
    expect(store.query).toBe(undefined)
    expect(store.genesList).toBe(undefined)
    expect(store.redirectHgncId).toBe(undefined)
  })

  it('should clear state', () => {
    // arrange:
    const store = useGenesListStore()
    store.storeState = StoreState.Active
    store.query = 'q=BRCA1&fields=symbol'
    store.genesList = JSON.parse(JSON.stringify({ gene: 'info' }))

    // act:
    store.clearData()

    // assert:
    expect(store.storeState).toBe(StoreState.Initial)
    expect(store.query).toBe(undefined)
    expect(store.genesList).toBe(undefined)
  })

  it('should load data', async () => {
    // arrange:
    fetchMocker.mockResponse(JSON.stringify(exampleGenesList))
    const store = useGenesListStore()

    // act:
    await store.loadData({ q: 'EMP', fields: 'hgnc_id,ensembl_gene_id,ncbi_gene_id,symbol' })

    // assert:
    expect(store.storeState).toBe(StoreState.Active)
    expect(store.query).toBe('q=EMP&fields=hgnc_id,ensembl_gene_id,ncbi_gene_id,symbol')
    expect(store.genesList).matchSnapshot()
  })

  it('should fail to load data with invalid request', async () => {
    // arrange:
    // Disable error logging
    vi.spyOn(console, 'error').mockImplementation(() => {})
    fetchMocker.mockResponseOnce(JSON.stringify({ foo: 'bar' }), { status: 400 })
    const store = useGenesListStore()

    // act:
    await store.loadData({ q: 'XXX', fields: 'hgnc_id,ensembl_gene_id,ncbi_gene_id,symbol' })

    // assert:
    expect(store.storeState).toBe(StoreState.Error)
    expect(store.query).toBe(undefined)
    expect(store.genesList).toBe(undefined)
  })

  it('should fail to load data with invalid fetchGenes response', async () => {
    // arrange:
    // Disable error logging
    vi.spyOn(console, 'error').mockImplementation(() => {})
    fetchMocker.mockResponseOnce(JSON.stringify({ genes: [] }))
    const store = useGenesListStore()

    // act:
    await store.loadData({ q: 'EMP', fields: 'hgnc_id,ensembl_gene_id,ncbi_gene_id,symbol' })

    // assert:
    expect(console.error).toHaveBeenCalled()
    expect(console.error).toHaveBeenCalledWith(
      'There was an error while searching for genes.',
      new Error('No data returned from API.')
    )
    expect(store.storeState).toBe(StoreState.Error)
    expect(store.query).toBe(undefined)
    expect(store.genesList).toBe(undefined)
  })

  it('should not load data if gene symbol is the same', async () => {
    // arrange:
    fetchMocker.mockResponse(JSON.stringify(exampleGenesList))
    const store = useGenesListStore()

    // act:
    await store.loadData({ q: 'EMP', fields: 'hgnc_id,ensembl_gene_id,ncbi_gene_id,symbol' })

    // assert:
    expect(store.storeState).toBe(StoreState.Active)
    expect(store.query).toBe('q=EMP&fields=hgnc_id,ensembl_gene_id,ncbi_gene_id,symbol')
    expect(store.genesList).matchSnapshot()

    // act2:
    await store.loadData({ q: 'EMP', fields: 'hgnc_id,ensembl_gene_id,ncbi_gene_id,symbol' })

    // assert2:
    expect(fetchMocker.mock.calls.length).toBe(1)
  })

  it('should redirect if the searchTerm matched symbol', async () => {
    // arrange:
    fetchMocker.mockResponse(JSON.stringify(exampleGenesList))
    const store = useGenesListStore()

    // act:
    await store.loadData({ q: 'EMP1', fields: 'hgnc_id,ensembl_gene_id,ncbi_gene_id,symbol' })

    // assert:
    expect(store.storeState).toBe(StoreState.Redirect)
    expect(store.redirectHgncId).toBe('HGNC:3333')
    expect(store.query).toBe('q=EMP1&fields=hgnc_id,ensembl_gene_id,ncbi_gene_id,symbol')
    expect(store.genesList).matchSnapshot()
    expect(fetchMocker.mock.calls.length).toBe(1)
  })

  it('should redirect if the searchTerm matched hgnc_id', async () => {
    // arrange:
    fetchMocker.mockResponse(JSON.stringify(exampleGenesList))
    const store = useGenesListStore()

    // act:
    await store.loadData({ q: 'HGNC:3333', fields: 'hgnc_id,ensembl_gene_id,ncbi_gene_id,symbol' })

    // assert:
    expect(store.storeState).toBe(StoreState.Redirect)
    expect(store.redirectHgncId).toBe('HGNC:3333')
    expect(store.query).toBe('q=HGNC:3333&fields=hgnc_id,ensembl_gene_id,ncbi_gene_id,symbol')
    expect(store.genesList).matchSnapshot()
    expect(fetchMocker.mock.calls.length).toBe(1)
  })

  it('should redirect if the searchTerm matched ensembl_gene_id', async () => {
    // arrange:
    fetchMocker.mockResponse(JSON.stringify(exampleGenesList))
    const store = useGenesListStore()

    // act:
    await store.loadData({
      q: 'ENSG00000134531',
      fields: 'hgnc_id,ensembl_gene_id,ncbi_gene_id,symbol'
    })

    // assert:
    expect(store.storeState).toBe(StoreState.Redirect)
    expect(store.redirectHgncId).toBe('HGNC:3333')
    expect(store.query).toBe('q=ENSG00000134531&fields=hgnc_id,ensembl_gene_id,ncbi_gene_id,symbol')
    expect(store.genesList).matchSnapshot()
    expect(fetchMocker.mock.calls.length).toBe(1)
  })

  it('should redirect if the searchTerm matched ncbi_gene_id', async () => {
    // arrange:
    fetchMocker.mockResponse(JSON.stringify(exampleGenesList))
    const store = useGenesListStore()

    // act:
    await store.loadData({ q: '2012', fields: 'hgnc_id,ensembl_gene_id,ncbi_gene_id,symbol' })

    // assert:
    expect(store.storeState).toBe(StoreState.Redirect)
    expect(store.redirectHgncId).toBe('HGNC:3333')
    expect(store.query).toBe('q=2012&fields=hgnc_id,ensembl_gene_id,ncbi_gene_id,symbol')
    expect(store.genesList).toMatchSnapshot()
    expect(fetchMocker.mock.calls.length).toBe(1)
  })
})
