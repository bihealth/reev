import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from '@/router'

import { createTestingPinia } from '@pinia/testing'
import { useGeneInfoStore } from '@/stores/geneInfo'

import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import HeaderDetailPage from '../HeaderDetailPage.vue'
import { StoreState } from '@/stores/misc'

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

const makeWrapper = () => {
  return mount(
    { template: '<v-app><HeaderDetailPage /></v-app>' },
    {
      global: {
        plugins: [vuetify, router, createTestingPinia({ createSpy: vi.fn() })],
        components: {
          HeaderDetailPage
        }
      }
    }
  )
}

describe('HeaderDetailPage', async () => {
  it('renders the gene symbol and nav links', () => {
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

    const wrapper = makeWrapper()

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

  it('redirects if gene data is null', async () => {
    const store = useGeneInfoStore()
    store.storeState = StoreState.Initial
    store.geneSymbol = null
    store.geneInfo = null

    makeWrapper()

    expect(router.push).toHaveBeenCalled()
  })
})
