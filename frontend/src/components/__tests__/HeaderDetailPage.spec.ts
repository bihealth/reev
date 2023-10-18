import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'

import { DottyClient } from '@/api/dotty'
import SearchBar from '@/components/SearchBar.vue'
import { setupMountedComponents } from '@/lib/test-utils'
import { useGeneInfoStore } from '@/stores/geneInfo'
import { StoreState } from '@/stores/misc'

import HeaderDetailPage from '../HeaderDetailPage.vue'

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

describe.concurrent('HeaderDetailPage', async () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders the gene symbol and nav links', () => {
    const { wrapper } = setupMountedComponents(
      { component: HeaderDetailPage, template: true },
      {
        initialStoreState: geneData
      }
    )

    const store = useGeneInfoStore()
    store.storeState = StoreState.Active
    store.geneSymbol = geneData.geneSymbol
    store.geneInfo = JSON.parse(JSON.stringify(geneData.geneInfo))

    const logo = wrapper.find('#logo')
    const menu = wrapper.find('#menu')
    expect(logo.exists()).toBe(true)
    expect(menu.exists()).toBe(true)
  })

  it('renders the search bar', async () => {
    const { wrapper } = setupMountedComponents(
      { component: HeaderDetailPage, template: true },
      {
        initialStoreState: geneData
      }
    )
    const store = useGeneInfoStore()
    store.storeState = StoreState.Active
    store.geneSymbol = geneData.geneSymbol
    store.geneInfo = JSON.parse(JSON.stringify(geneData.geneInfo))

    // search bar value is updated to "HGNC:1100"
    const searchBar = wrapper.findComponent(SearchBar)
    expect(searchBar.exists()).toBe(true)
  })

  it('correctly emits search', async () => {
    // we make `DottyClient.toSpdi` return null / fail
    vi.spyOn(DottyClient.prototype, 'toSpdi').mockResolvedValue(null)

    const { wrapper, router } = setupMountedComponents(
      { component: HeaderDetailPage, template: true },
      {
        initialStoreState: geneData
      }
    )
    const store = useGeneInfoStore()
    store.storeState = StoreState.Active
    store.geneSymbol = geneData.geneSymbol
    store.geneInfo = JSON.parse(JSON.stringify(geneData.geneInfo))

    // search bar value is updated to "HGNC:1100"
    const searchBar = wrapper.findComponent(SearchBar)
    await searchBar.setValue('HGNC:1100', 'searchTerm')
    await searchBar.setValue('grch37', 'genomeRelease')

    // press search
    const button = wrapper.findComponent('#search') as any
    await button.trigger('click')

    await nextTick()

    expect(router.push).toHaveBeenCalledOnce()
    expect(router.push).toHaveBeenCalledWith({
      name: 'gene',
      params: { searchTerm: 'HGNC:1100', genomeRelease: 'grch37' }
    })
  })
})
