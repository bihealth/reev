import { beforeEach, describe, it, expect, vi } from 'vitest'
import createFetchMock from 'vitest-fetch-mock'

import { setActivePinia, createPinia } from 'pinia'

import { StoreState } from '../misc'
import { useGenesListStore } from '../genesList'

const fetchMocker = createFetchMock(vi)

const exampleGenesList = {
  genes: [
    {
      score: 0.75,
      data: {
        hgnc_id: 'HGNC:3333',
        symbol: 'EMP1'
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

  it('should load data', async () => {
    const store = useGenesListStore()
    fetchMocker.mockResponse(JSON.stringify(exampleGenesList))

    await store.loadData({ q: 'EMP', fields: 'hgnc_id,ensembl_gene_id,ncbi_gene_id,symbol' })

    expect(store.storeState).toBe(StoreState.Active)
    expect(store.query).toBe('q=EMP&fields=hgnc_id,ensembl_gene_id,ncbi_gene_id,symbol')
    expect(store.genesList).toEqual(exampleGenesList.genes)
  })

  it('should fail to load data with invalid request', async () => {
    // Disable error logging
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const store = useGenesListStore()
    fetchMocker.mockResponseOnce(JSON.stringify({ foo: 'bar' }), { status: 400 })

    await store.loadData('invalid')

    expect(store.storeState).toBe(StoreState.Error)
    expect(store.query).toBe(null)
    expect(store.genesList).toBe(null)
  })

  it('should not load data if gene symbol is the same', async () => {
    const store = useGenesListStore()
    fetchMocker.mockResponse(JSON.stringify(exampleGenesList))

    await store.loadData({ q: 'EMP', fields: 'hgnc_id,ensembl_gene_id,ncbi_gene_id,symbol' })

    expect(store.storeState).toBe(StoreState.Active)
    expect(store.query).toBe('q=EMP&fields=hgnc_id,ensembl_gene_id,ncbi_gene_id,symbol')
    expect(store.genesList).toEqual(exampleGenesList.genes)

    await store.loadData({ q: 'EMP', fields: 'hgnc_id,ensembl_gene_id,ncbi_gene_id,symbol' })

    expect(fetchMocker.mock.calls.length).toBe(1)
  })

  it('should redirect if the searchTerm has match', async () => {
    const store = useGenesListStore()
    fetchMocker.mockResponse(JSON.stringify(exampleGenesList))

    await store.loadData({ q: 'EMP1', fields: 'hgnc_id,ensembl_gene_id,ncbi_gene_id,symbol' })

    expect(store.storeState).toBe(StoreState.Redirect)
    expect(store.redirectHgncId).toBe('HGNC:3333')
    expect(store.query).toBe('q=EMP1&fields=hgnc_id,ensembl_gene_id,ncbi_gene_id,symbol')
    expect(store.genesList).toEqual(exampleGenesList.genes)

    expect(fetchMocker.mock.calls.length).toBe(1)
  })
})
