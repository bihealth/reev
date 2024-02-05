import { setupMountedComponents } from '@bihealth/reev-frontend-lib/lib/testUtils'
import { StoreState } from '@bihealth/reev-frontend-lib/stores'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { h } from 'vue'
import { VMenu } from 'vuetify/components'

import FooterDefault from '@/components/FooterDefault/FooterDefault.vue'
import PageHeader from '@/components/PageHeader/PageHeader.vue'

import HomeView from './HomeView.vue'

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
  },
  {
    path: '/info',
    name: 'info',
    component: h('div', { innerHTML: 'for testing' })
  },
  {
    path: '/query',
    name: 'query',
    component: h('div', { innerHTML: 'for testing' })
  }
]

describe.concurrent('HomeView with mocked router', async () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders the header and the footer', async () => {
    // arrange:
    const { wrapper } = await setupMountedComponents(
      {
        component: HomeView
      },
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
        },
        routes
      }
    )

    // act: nothing, only test rendering

    // assert:
    const header = wrapper.findComponent(PageHeader)
    expect(header.exists()).toBe(true)
    const footer = wrapper.findComponent(FooterDefault)
    expect(footer.exists()).toBe(true)

    const logo = wrapper.find('#logo')
    expect(logo.exists()).toBe(true)
    const menu = wrapper.findComponent(VMenu)
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
        },
        routes
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
        },
        routes
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
        },
        routes
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
