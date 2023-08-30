import { nextTick } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory, type Router } from 'vue-router'
import { routes } from '@/router'

import { createTestingPinia } from '@pinia/testing'
import { useGeneInfoStore } from '@/stores/geneInfo'

import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import HomeView from '../HomeView.vue'
import SearchBar from '../../components/SearchBar.vue'
import { StoreState } from '@/stores/geneInfo'

const vuetify = createVuetify({
  components,
  directives
})

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

const makeWrapper = (router: Router) => {
  return mount(
    {
      template: '<v-app><HomeView /></v-app>'
    },
    {
      global: {
        plugins: [vuetify, router, createTestingPinia({ createSpy: vi.fn() })],
        components: {
          HomeView
        }
      }
    }
  )
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes
})
// Mock router push
router.push = vi.fn()

describe('HomeView with mocked router', async () => {
  it('renders the header', () => {
    const wrapper = makeWrapper(router)
    const store = useGeneInfoStore()
    store.storeState = StoreState.Active
    store.geneSymbol = geneData.geneSymbol
    store.geneInfo = JSON.parse(JSON.stringify(geneData.geneInfo))

    const logo = wrapper.find('#logo')
    const aboutLink = wrapper.find('#about')
    const contactLink = wrapper.find('#contact')
    expect(logo.exists()).toBe(true)
    expect(aboutLink.exists()).toBe(true)
    expect(contactLink.exists()).toBe(true)
  })

  it('renders the search bar', () => {
    const wrapper = makeWrapper(router)
    const store = useGeneInfoStore()
    store.storeState = StoreState.Active
    store.geneSymbol = geneData.geneSymbol
    store.geneInfo = JSON.parse(JSON.stringify(geneData.geneInfo))

    const textField = wrapper.find('.v-text-field')
    const select = wrapper.find('.v-select')
    const searchButton = wrapper.find('#search')
    expect(textField.exists()).toBe(true)
    expect(select.exists()).toBe(true)
    expect(searchButton.exists()).toBe(true)
  })

  it('renders example search terms', () => {
    const wrapper = makeWrapper(router)
    const store = useGeneInfoStore()
    store.storeState = StoreState.Active
    store.geneSymbol = geneData.geneSymbol
    store.geneInfo = JSON.parse(JSON.stringify(geneData.geneInfo))

    const subtitle = wrapper.find('h2')
    const exampleTerms = wrapper.findAll('.example')
    expect(subtitle.exists()).toBe(true)
    expect(exampleTerms.length).toBe(6)
  })

  it('uses example by click', async () => {
    const wrapper = makeWrapper(router)
    const store = useGeneInfoStore()
    store.storeState = StoreState.Active
    store.geneSymbol = geneData.geneSymbol
    store.geneInfo = JSON.parse(JSON.stringify(geneData.geneInfo))

    const exampleTerm = wrapper.find('.example')
    expect(exampleTerm.exists()).toBe(true)
    expect(exampleTerm.text()).toBe('BRCA1')
    await exampleTerm.trigger('click')
    await nextTick()
    expect(store.geneSymbol).toBe('BRCA1')
  })

  it('renders correctly uses the router', async () => {
    const wrapper = makeWrapper(router)
    const store = useGeneInfoStore()
    store.storeState = StoreState.Active
    store.geneSymbol = geneData.geneSymbol
    store.geneInfo = JSON.parse(JSON.stringify(geneData.geneInfo))

    // search bar value is updated to "HGNC:1100"
    const searchBar = wrapper.findComponent(SearchBar)
    await searchBar.setValue('HGNC:1100', 'searchTerm')

    // press search
    const button = wrapper.findComponent('#search') as any
    await button.trigger('click')

    await nextTick()

    expect(router.push).toHaveBeenCalledOnce()
    expect(router.push).toHaveBeenCalledWith({ name: 'gene', params: { searchTerm: 'HGNC:1100' } })
  })
})
