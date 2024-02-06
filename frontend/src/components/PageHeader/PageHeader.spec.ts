import { setupMountedComponents } from '@bihealth/reev-frontend-lib/lib/testUtils'
import { StoreState } from '@bihealth/reev-frontend-lib/stores'
import { useGeneInfoStore } from '@bihealth/reev-frontend-lib/stores/geneInfo'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'

import PageHeader from './PageHeader.vue'

/** Example gene related data */
const geneData = {
  storeState: 'active',
  geneSymbol: 'BRCA1',
  geneInfo: {
    symbol: 'BRCA1',
    name: 'Test Gene',
    hgncId: '12345',
    ensemblId: 'ENSG00000000000001',
    entrezId: '12345'
  }
}

const routes = [
  {
    path: '/',
    name: 'home',
    component: h('div', { innerHTML: 'for testing' })
  },
  {
    path: '/login',
    name: 'login',
    component: h('div', { innerHTML: 'for testing' })
  }
]

describe.concurrent('PageHeader', async () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders the gene symbol and nav links', async () => {
    // arrange:
    const { wrapper } = await setupMountedComponents(
      { component: PageHeader },
      {
        initialStoreState: geneData,
        routes
      }
    )
    const store = useGeneInfoStore()
    store.storeState = StoreState.Active
    store.hgncId = geneData.geneSymbol
    store.geneInfo = JSON.parse(JSON.stringify(geneData.geneInfo))

    // act: nothing, only test rendering

    // assert:
    const logo = wrapper.find('#logo')
    const menu = wrapper.findComponent({ name: 'VMenu' })
    expect(logo.exists()).toBe(true)
    expect(menu.exists()).toBe(true)
  })

  it('renders the search bar', async () => {
    // arrange:
    const { wrapper } = await setupMountedComponents(
      { component: PageHeader },
      {
        initialStoreState: geneData,
        routes
      }
    )
    const store = useGeneInfoStore()
    store.storeState = StoreState.Active
    store.hgncId = geneData.geneSymbol
    store.geneInfo = JSON.parse(JSON.stringify(geneData.geneInfo))

    // act: nothing, only test rendering

    // assert:
    // search bar value is updated to "HGNC:1100"
    const searchBar = wrapper.findComponent({ name: 'SearchBar' })
    expect(searchBar.exists()).toBe(true)
  })

  it.skip('correctly emits search', async () => {
    // arrange:
    // Mock fetch
    global.fetch = vi.fn((): any =>
      Promise.resolve({ ok: true, json: () => Promise.resolve({ success: false, value: null }) })
    )

    const { wrapper, router } = await setupMountedComponents(
      { component: PageHeader },
      {
        initialStoreState: geneData,
        routes
      }
    )
    const store = useGeneInfoStore()
    store.storeState = StoreState.Active
    store.hgncId = geneData.geneSymbol
    store.geneInfo = JSON.parse(JSON.stringify(geneData.geneInfo))

    // act:
    // search bar value is updated to "HGNC:1100"
    const searchBar = wrapper.findComponent({ name: 'SearchBar' })
    await searchBar.setValue('HGNC:1100', 'searchTerm')
    await searchBar.setValue('grch37', 'genomeRelease')

    // press search
    const button = wrapper.findComponent('#search') as any
    await button.trigger('click')

    await nextTick()

    // assert:
    expect(router.push).toHaveBeenCalledOnce()
    expect(router.push).toHaveBeenCalledWith({
      name: 'gene-details',
      params: { gene: 'BRCA1' }
    })
  })
})
