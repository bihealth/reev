import { nextTick } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from '@/router'

import { createTestingPinia } from '@pinia/testing'
import { useGenesListStore } from '@/stores/genesList'

import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import GenesListView from '../GenesListView.vue'
import { StoreState } from '@/stores/misc'
import HeaderDetailPage from '@/components/HeaderDetailPage.vue'
import SearchBar from '@/components/SearchBar.vue'

const vuetify = createVuetify({
  components,
  directives
})

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes
})
// Mock router push
router.push = vi.fn()

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

const makeWrapper = () => {
  const pinia = createTestingPinia({ createSpy: vi.fn() })
  const store = useGenesListStore(pinia)
  const mockLoadData = vi.fn().mockImplementation(async (geneSymbol: string) => {
    store.storeState = StoreState.Active
    store.query = geneSymbol
    store.genesList = JSON.parse(JSON.stringify(exampleGenesList.genes))
  })
  store.loadData = mockLoadData

  store.storeState = StoreState.Active
  store.query = 'q=EMP&fields=hgnc_id,ensembl_gene_id,ncbi_gene_id,symbol'
  store.genesList = JSON.parse(JSON.stringify(exampleGenesList.genes))

  return mount(
    {
      template: '<v-app><GenesListView /></v-app>'
    },
    {
      query: {
        q: 'EMP',
        fields: 'hgnc_id,ensembl_gene_id,ncbi_gene_id,symbol'
      },
      global: {
        plugins: [vuetify, router, pinia],
        components: {
          GenesListView
        }
      }
    }
  )
}

describe.concurrent('GenesListView', async () => {
  it('renders the header, footer and searchBar', async () => {
    const wrapper = makeWrapper()

    const header = wrapper.findComponent(HeaderDetailPage)
    const searchBar = wrapper.findComponent(SearchBar)
    expect(header.exists()).toBe(true)
    expect(searchBar.exists()).toBe(true)

    const logo = wrapper.find('#logo')
    const aboutLink = wrapper.find('#about')
    const contactLink = wrapper.find('#contact')
    expect(logo.exists()).toBe(true)
    expect(aboutLink.exists()).toBe(true)
    expect(contactLink.exists()).toBe(true)
  })

  it('renders the search results', async () => {
    const wrapper = makeWrapper()
    expect(wrapper.html()).toContain('Search results for:')
    expect(wrapper.html()).toContain('Search term:')

    const searchResults = wrapper.findAll('.gene-item')
    expect(searchResults.length).toBe(2)

    const searchResult = wrapper.find('.gene-item')
    expect(searchResult.text()).toContain('EMP1')
    expect(searchResult.text()).toContain('HGNC:3333')
    expect(searchResult.text()).toContain('Full name')
    expect(searchResult.text()).toContain('Alias')
    expect(searchResult.text()).toContain('Ensembl id:')
    expect(searchResult.text()).toContain('NCBI id:')
  })

  it('emits update in header', async () => {
    const wrapper = makeWrapper()

    const header = wrapper.findComponent(HeaderDetailPage)
    expect(header.exists()).toBe(true)
    await header.setValue('HGNC:1100', 'searchTermRef')
    await header.setValue('grch37', 'genomeReleaseRef')
    expect(header.emitted()).toHaveProperty('update:searchTermRef')
    expect(header.emitted()).toHaveProperty('update:genomeReleaseRef')
    expect(header.vm.$props).toStrictEqual({ searchTerm: 'undefined', genomeRelease: 'grch37' })

    const searchBar = wrapper.findComponent(SearchBar)
    expect(searchBar.exists()).toBe(true)
    await searchBar.setValue('HGNC:1100', 'searchTerm')
    await searchBar.setValue('grch37', 'genomeRelease')
    expect(searchBar.emitted()).toHaveProperty('update:searchTerm')
    expect(searchBar.emitted()).toHaveProperty('update:genomeRelease')
    expect(searchBar.vm.$props).toContain({ searchTerm: 'HGNC:1100', genomeRelease: 'grch37' })
  })

  it('uses example by click', async () => {
    const pinia = createTestingPinia({ createSpy: vi.fn() })
    const store = useGenesListStore(pinia)
    const mockLoadData = vi.fn().mockImplementation(async () => {
      store.storeState = StoreState.Error
    })
    const mockClearData = vi.fn().mockImplementation(() => {
      store.storeState = StoreState.Initial
      store.query = null
      store.redirectHgncId = null
    })
    store.loadData = mockLoadData
    store.clearData = mockClearData

    store.storeState = StoreState.Error
    const wrapper = mount(
      {
        template: '<v-app><GenesListView /></v-app>'
      },
      {
        props: {
          q: 'EMP',
          fields: 'hgnc_id,ensembl_gene_id,ncbi_gene_id,symbol'
        },
        global: {
          plugins: [vuetify, router, pinia],
          components: {
            GenesListView
          }
        }
      }
    )
    await nextTick()

    const exampleTerm = wrapper.find('.example')
    expect(exampleTerm.exists()).toBe(true)
    expect(exampleTerm.text()).toBe('BRCA')
    await exampleTerm.trigger('click')
    await nextTick()

    expect(wrapper.emitted()).toHaveProperty('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('renders info page if storeState is Loading', async () => {
    const pinia = createTestingPinia({ createSpy: vi.fn() })
    const store = useGenesListStore(pinia)
    const mockLoadData = vi.fn().mockImplementation(async () => {
      store.storeState = StoreState.Loading
      store.query = 'q=EMP&fields=hgnc_id,ensembl_gene_id,ncbi_gene_id,symbol'
      store.redirectHgncId = 'HGNC:3333'
    })
    const mockClearData = vi.fn().mockImplementation(() => {
      store.storeState = StoreState.Initial
      store.query = null
      store.redirectHgncId = null
    })
    store.loadData = mockLoadData
    store.clearData = mockClearData

    store.storeState = StoreState.Loading
    store.query = 'q=EMP&fields=hgnc_id,ensembl_gene_id,ncbi_gene_id,symbol'
    store.redirectHgncId = 'HGNC:3333'
    const wrapper = mount(
      {
        template: '<v-app><GenesListView /></v-app>'
      },
      {
        query: {
          q: 'EMP1',
          fields: 'hgnc_id,ensembl_gene_id,ncbi_gene_id,symbol'
        },
        global: {
          plugins: [vuetify, router, pinia],
          components: {
            GenesListView
          }
        }
      }
    )
    await nextTick()

    expect(wrapper.html()).toContain('Searching for genes')
  })

  it.skip('redirects to gene info page if storeState is Redirect', async () => {
    const pinia = createTestingPinia({ createSpy: vi.fn() })
    const store = useGenesListStore(pinia)
    const mockLoadData = vi.fn().mockImplementation(async () => {
      store.storeState = StoreState.Redirect
      store.query = 'q=EMP1&fields=hgnc_id,ensembl_gene_id,ncbi_gene_id,symbol'
      store.redirectHgncId = 'HGNC:3333'
    })
    const mockClearData = vi.fn().mockImplementation(() => {
      store.storeState = StoreState.Redirect
      store.query = null
      store.redirectHgncId = null
    })
    store.loadData = mockLoadData
    store.clearData = mockClearData

    store.storeState = StoreState.Redirect
    store.query = 'q=EMP1&fields=hgnc_id,ensembl_gene_id,ncbi_gene_id,symbol'
    store.redirectHgncId = 'HGNC:3333'
    mount(
      {
        template: '<v-app><GenesListView /></v-app>'
      },
      {
        query: {
          q: 'EMP1',
          fields: 'hgnc_id,ensembl_gene_id,ncbi_gene_id,symbol'
        },
        global: {
          plugins: [vuetify, router, pinia],
          components: {
            GenesListView
          }
        }
      }
    )
    await nextTick()

    expect(router.push).toHaveBeenCalledWith({
      name: 'gene',
      params: { searchTerm: 'HGNC:3333', genomeRelease: 'grch37' }
    })
  })
})
