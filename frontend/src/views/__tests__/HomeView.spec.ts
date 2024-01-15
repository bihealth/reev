import { afterEach, describe, expect, it, vi } from 'vitest'
import { VMenu } from 'vuetify/components'

import FooterDefault from '@/components/FooterDefault.vue'
import PageHeader from '@/components/PageHeader.vue'
import { setupMountedComponents } from '@/lib/testUtils'
import { StoreState } from '@/stores/misc'
import HomeView from '@/views/HomeView.vue'

/** Example gene Data */
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
    // arrange:
    const { wrapper } = await setupMountedComponents(
      { component: HomeView },
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

    // act: nothing, only test rendering

    // assert:
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
    // arrange:
    const { wrapper } = await setupMountedComponents(
      { component: HomeView },
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

    // act: nothing, only test rendering

    // assert:
    const textField = wrapper.find('.v-text-field')
    const genomeReleaseButton = wrapper.find('.genome-release-menu')
    const searchButton = wrapper.find('.start-search')
    expect(textField.exists()).toBe(true)
    expect(genomeReleaseButton.exists()).toBe(true)
    expect(searchButton.exists()).toBe(true)
  })

  it('renders example search terms', async () => {
    // arrange:
    const { wrapper } = await setupMountedComponents(
      { component: HomeView },
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

    // act: nothing, only test rendering

    // assert:
    const exampleTermsCard = wrapper.find('#examples')
    expect(exampleTermsCard.exists()).toBe(true)
    const exampleTerms = exampleTermsCard.findAll('.v-btn')
    expect(exampleTerms.length).toBe(13)
  })

  it('examples have correct href', async () => {
    // arrange:
    global.fetch = vi.fn((): any =>
      Promise.resolve({ ok: true, json: () => Promise.resolve({ success: false, value: null }) })
    )

    const { wrapper } = await setupMountedComponents(
      { component: HomeView },
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

    // act: nothing, only test rendering

    // assert:
    const exampleTermsCard = wrapper.find('#examples')
    expect(exampleTermsCard.exists()).toBe(true)
    const exampleTerm = exampleTermsCard.find('.example')
    expect(exampleTerm.attributes().href).toEqual('/query?q=BRCA1&genomeBuild=grch37')
  })
})
