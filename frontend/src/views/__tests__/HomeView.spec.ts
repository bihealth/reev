import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { VMenu } from 'vuetify/components'

import FooterDefault from '@/components/FooterDefault.vue'
import PageHeader from '@/components/PageHeader.vue'
import SearchBar from '@/components/SearchBar.vue'
import { setupMountedComponents } from '@/lib/test-utils'
import { usegeneInfoStore } from '@/stores/geneInfo'
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

  it('renders the header and the footer', async () => {
    const { wrapper } = await setupMountedComponents(
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
    const header = wrapper.findComponent(PageHeader)
    const footer = wrapper.findComponent(FooterDefault)
    expect(header.exists()).toBe(true)
    expect(footer.exists()).toBe(true)

    const logo = wrapper.find('#logo')
    const menu = wrapper.findComponent(VMenu)
    expect(logo.exists()).toBe(true)
    expect(menu.exists()).toBe(true)
  })

  it('renders the search bar', async () => {
    const { wrapper } = await setupMountedComponents(
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
    const genomeReleaseButton = wrapper.find('.genome-release-menu')
    const searchButton = wrapper.find('.start-search')
    expect(textField.exists()).toBe(true)
    expect(genomeReleaseButton.exists()).toBe(true)
    expect(searchButton.exists()).toBe(true)
  })

  it('renders example search terms', async () => {
    const { wrapper } = await setupMountedComponents(
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

    const exampleTermsCard = wrapper.find('#examples')
    expect(exampleTermsCard.exists()).toBe(true)
    const exampleTerms = exampleTermsCard.findAll('.v-btn')
    expect(exampleTerms.length).toBe(12)
  })

  it('searches for example by click', async () => {
    global.fetch = vi.fn((): any =>
      Promise.resolve({ ok: true, json: () => Promise.resolve({ success: false, value: null }) })
    )

    const { wrapper } = await setupMountedComponents(
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

    const exampleTermsCard = wrapper.find('#examples')
    expect(exampleTermsCard.exists()).toBe(true)
    const exampleTerm = exampleTermsCard.find('.example')
    await exampleTerm.trigger('click')
  })

  it.skip('correctly uses the router', async () => {
    global.fetch = vi.fn((): any =>
      Promise.resolve({ ok: true, json: () => Promise.resolve({ success: false, value: null }) })
    )

    const { wrapper, router } = await setupMountedComponents(
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
    const store = usegeneInfoStore()
    store.storeState = StoreState.Active
    store.hgncId = geneData.geneSymbol
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
      name: 'gene-details',
      params: { gene: 'BRCA1' }
    })
  })
})
