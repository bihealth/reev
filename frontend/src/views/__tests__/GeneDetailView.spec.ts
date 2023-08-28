import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from '@/router'
import { createTestingPinia } from '@pinia/testing'
import { useGeneInfoStore } from '@/stores/geneInfo'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import GeneDetailView from '../GeneDetailView.vue'
import { StoreState } from '@/stores/geneInfo'
import { before, beforeEach } from 'node:test'

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

global.ResizeObserver = require('resize-observer-polyfill')

describe('GeneDetailView', async () => {
  beforeEach(() => {
    createTestingPinia({ createSpy: vi.fn() })
  })
  it.skip('renders the header', () => {
    const geneData = {
      storeState: 'active',
      geneSymbol: 'BRCA1',
      geneInfo: {
        genes: {
          BRCA1: {
            symbol: 'BRCA1',
            name: 'Test Gene',
            hgncId: '12345',
            ensemblId: 'ENSG00000000000001',
            entrezId: '12345'
          }
        }
      }
    }

    const store = useGeneInfoStore()
    store.storeState = StoreState.Active
    store.geneSymbol = geneData.geneSymbol
    store.geneInfo = JSON.parse(JSON.stringify(geneData.geneInfo))

    const wrapper = mount(
      {
        template: '<v-app><GeneDetailView /></v-app>'
      },
      {
        global: {
          plugins: [vuetify, router, createTestingPinia({ createSpy: vi.fn() })],
          components: {
            GeneDetailView
          }
        }
      }
    )

    const logo = wrapper.find('#logo')
    const aboutLink = wrapper.find('#about')
    const contactLink = wrapper.find('#contact')
    expect(logo.exists()).toBe(true)
    expect(aboutLink.exists()).toBe(true)
    expect(contactLink.exists()).toBe(true)
  })

  it.skip('renders the search bar', () => {
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

    const wrapper = mount(
      {
        template: '<v-app><GeneDetailView /></v-app>'
      },
      {
        global: {
          plugins: [vuetify, router, createTestingPinia({ createSpy: vi.fn() })],
          components: {
            GeneDetailView
          }
        }
      }
    )

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
})
