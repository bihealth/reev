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
import * as BRCA1geneInfo from '@/assets/__tests__/BRCA1GeneInfo.json'

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

const geneData = {
  storeState: 'active',
  geneSymbol: 'BRCA1',
  geneInfo: BRCA1geneInfo
}

const makeWrapper = () => {
  const pinia = createTestingPinia({ createSpy: vi.fn() })
  const store = useGeneInfoStore(pinia)
  const mockLoadData = vi.fn().mockImplementation(async (geneSymbol: string) => {
    store.storeState = StoreState.Active
    store.geneSymbol = geneSymbol
    store.geneInfo = JSON.parse(JSON.stringify(geneData.geneInfo))
  })
  store.loadData = mockLoadData

  store.storeState = StoreState.Active
  store.geneSymbol = geneData.geneSymbol
  store.geneInfo = JSON.parse(JSON.stringify(geneData.geneInfo))

  return mount(
    {
      template: '<v-app><GeneDetailView /></v-app>'
    },
    {
      props: {
        searchTerm: 'BRCA1'
      },
      global: {
        plugins: [vuetify, router, pinia],
        components: {
          GeneDetailView
        }
      }
    }
  )
}

describe('GeneDetailView', async () => {
  it('renders the header', () => {
    const wrapper = makeWrapper()

    const logo = wrapper.find('#logo')
    const aboutLink = wrapper.find('#about')
    const contactLink = wrapper.find('#contact')
    expect(logo.exists()).toBe(true)
    expect(aboutLink.exists()).toBe(true)
    expect(contactLink.exists()).toBe(true)
  })

  it('renders info-cards and navigation drawer', () => {
    const wrapper = makeWrapper()

    const navigationDrawer = wrapper.find('.v-navigation-drawer')
    const hgnc = wrapper.find('#hgnc')
    const constraintsScores = wrapper.find('#constraints-scores')
    const ncbiSummary = wrapper.find('#ncbi-summary')
    const alternativeIdentifiers = wrapper.find('#alternative-identifiers')
    const externalResources = wrapper.find('#external-resources')
    const diseaseAnnotations = wrapper.find('#disease-annotation')
    const acmgList = wrapper.find('#acmg-list')
    const geneRifs = wrapper.find('#gene-rifs')
    const locusSpecificDatabases = wrapper.find('#locus-specific-databases')
    expect(navigationDrawer.exists()).toBe(true)
    expect(hgnc.exists()).toBe(true)
    expect(constraintsScores.exists()).toBe(true)
    expect(ncbiSummary.exists()).toBe(true)
    expect(alternativeIdentifiers.exists()).toBe(true)
    expect(externalResources.exists()).toBe(true)
    expect(diseaseAnnotations.exists()).toBe(true)
    expect(acmgList.exists()).toBe(true)
    expect(geneRifs.exists()).toBe(true)
    expect(locusSpecificDatabases.exists()).toBe(true)
  })
})
