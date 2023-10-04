import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'

import { DottyClient } from '@/api/dotty'
import FooterDefault from '@/components/FooterDefault.vue'
import HeaderDefault from '@/components/HeaderDefault.vue'
import SearchBar from '@/components/SearchBar.vue'
import { setupMountedComponents } from '@/lib/test-utils'
import { useGeneInfoStore } from '@/stores/geneInfo'
import { StoreState } from '@/stores/misc'

import HomeView from '../HomeView.vue'

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

describe.concurrent('HomeView with mocked router', async () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders the header and the footer', () => {
    const { wrapper } = setupMountedComponents(
      { component: HomeView, template: true },
      {
        initialStoreState: {
          geneInfo: {
            storeState: StoreState.Active,
            geneSymbol: geneData.geneSymbol,
            geneInfo: JSON.parse(JSON.stringify(geneData.geneInfo))
          },
          misc: {
            appVersion: 'v0.0.0'
          }
        }
      }
    )
    const header = wrapper.findComponent(HeaderDefault)
    const footer = wrapper.findComponent(FooterDefault)
    expect(header.exists()).toBe(true)
    expect(footer.exists()).toBe(true)

    const logo = wrapper.find('#logo')
    const aboutLink = wrapper.find('#about')
    const contactLink = wrapper.find('#contact')
    expect(logo.exists()).toBe(true)
    expect(aboutLink.exists()).toBe(true)
    expect(contactLink.exists()).toBe(true)
  })

  it('renders the search bar', () => {
    const { wrapper } = setupMountedComponents(
      { component: HomeView, template: true },
      {
        initialStoreState: {
          geneInfo: {
            storeState: StoreState.Active,
            geneSymbol: geneData.geneSymbol,
            geneInfo: JSON.parse(JSON.stringify(geneData.geneInfo))
          },
          misc: {
            appVersion: 'v0.0.0'
          }
        }
      }
    )

    const textField = wrapper.find('.v-text-field')
    const select = wrapper.find('.v-select')
    const searchButton = wrapper.find('#search')
    expect(textField.exists()).toBe(true)
    expect(select.exists()).toBe(true)
    expect(searchButton.exists()).toBe(true)
  })

  it('renders example search terms', () => {
    const { wrapper } = setupMountedComponents(
      { component: HomeView, template: true },
      {
        initialStoreState: {
          geneInfo: {
            storeState: StoreState.Active,
            geneSymbol: geneData.geneSymbol,
            geneInfo: JSON.parse(JSON.stringify(geneData.geneInfo))
          },
          misc: {
            appVersion: 'v0.0.0'
          }
        }
      }
    )

    const subtitle = wrapper.find('h2')
    const exampleTerms = wrapper.findAll('.example')
    expect(subtitle.exists()).toBe(true)
    expect(exampleTerms.length).toBe(8)
  })

  it('uses example by click', async () => {
    const { wrapper } = setupMountedComponents(
      { component: HomeView, template: true },
      {
        initialStoreState: {
          geneInfo: {
            storeState: StoreState.Active,
            geneSymbol: geneData.geneSymbol,
            geneInfo: JSON.parse(JSON.stringify(geneData.geneInfo))
          },
          misc: {
            appVersion: 'v0.0.0'
          }
        }
      }
    )
    const store = useGeneInfoStore()

    const exampleTerm = wrapper.find('.example')
    expect(exampleTerm.exists()).toBe(true)
    expect(exampleTerm.text()).toBe('BRCA1')
    await exampleTerm.trigger('click')
    await nextTick()
    expect(store.geneSymbol).toBe('BRCA1')
  })

  it('correctly uses the router', async () => {
    vi.spyOn(DottyClient.prototype, 'toSpdi').mockResolvedValue(null)

    const { wrapper, router } = setupMountedComponents(
      { component: HomeView, template: true },
      {
        initialStoreState: {
          geneInfo: {
            storeState: StoreState.Active,
            geneSymbol: geneData.geneSymbol,
            geneInfo: JSON.parse(JSON.stringify(geneData.geneInfo))
          },
          misc: {
            appVersion: 'v0.0.0'
          }
        }
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
