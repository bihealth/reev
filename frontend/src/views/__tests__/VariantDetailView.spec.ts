import { nextTick } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from '@/router'

import { createTestingPinia } from '@pinia/testing'
import { useVariantInfoStore } from '@/stores/variantInfo'

import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import VariantDetailView from '../VariantDetailView.vue'
import { StoreState } from '@/stores/misc'
import * as BRCA1GeneInfo from '@/assets/__tests__/BRCA1GeneInfo.json'
import * as BRCA1VariantInfo from '@/assets/__tests__/BRCA1VariantInfo.json'
import * as BRCA1TxInfo from '@/assets/__tests__/BRCA1TxInfo.json'
import HeaderDetailPage from '@/components/HeaderDetailPage.vue'
import SearchBar from '@/components/SearchBar.vue'
import VariantGene from '@/components/VariantDetails/VariantGene.vue'
import BeaconNetwork from '@/components/VariantDetails/BeaconNetwork.vue'
import ClinVar from '@/components/VariantDetails/ClinVar.vue'
import VariantFreqs from '@/components/VariantDetails/VariantFreqs.vue'
import VariantConservation from '@/components/VariantDetails/VariantConservation.vue'
import VariantTools from '@/components/VariantDetails/VariantTools.vue'
import VariantValidator from '@/components/VariantDetails/VariantValidator.vue'
import TxCsq from '@/components/VariantDetails/TxCsq.vue'

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

const smallVariantInfo = {
  release: 'grch37',
  chromosome: 'chr17',
  start: '43044295',
  end: '43044295',
  reference: 'G',
  alternative: 'A',
  hgnc_id: 'HGNC:1100'
}

const variantData = {
  storeState: StoreState.Active,
  variantTerm: 'chr17:12345:A:T',
  smallVariant: smallVariantInfo,
  varAnnos: JSON.parse(JSON.stringify(BRCA1VariantInfo)),
  geneInfo: JSON.parse(JSON.stringify(BRCA1GeneInfo)),
  txCsq: JSON.parse(JSON.stringify(BRCA1TxInfo))
}

const makeWrapper = () => {
  const pinia = createTestingPinia({ createSpy: vi.fn() })
  const store = useVariantInfoStore(pinia)
  const mockLoadData = vi.fn().mockImplementation(async (variantTerm: string) => {
    store.storeState = StoreState.Active
    store.variantTerm = variantTerm
    store.smallVariant = JSON.parse(JSON.stringify(smallVariantInfo))
    store.varAnnos = JSON.parse(JSON.stringify(variantData.varAnnos))
    store.geneInfo = JSON.parse(JSON.stringify(variantData.geneInfo))
    store.txCsq = JSON.parse(JSON.stringify(variantData.txCsq))
  })
  store.loadData = mockLoadData

  store.storeState = StoreState.Active
  store.variantTerm = 'chr17:12345:A:T'
  store.smallVariant = JSON.parse(JSON.stringify(smallVariantInfo))
  store.varAnnos = JSON.parse(JSON.stringify(variantData.varAnnos))
  store.geneInfo = JSON.parse(JSON.stringify(variantData.geneInfo))
  store.txCsq = JSON.parse(JSON.stringify(variantData.txCsq))

  return mount(
    {
      template: '<v-app><VariantDetailView /></v-app>'
    },
    {
      props: {
        searchTerm: 'chr17:43044295:G:A',
        genomeRelease: 'grch37'
      },
      global: {
        plugins: [vuetify, router, pinia],
        components: {
          VariantDetailView
        }
      }
    }
  )
}

describe.concurrent('VariantDetailView', async () => {
  it('renders the header', async () => {
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

  it('emits update in header', async () => {
    const wrapper = makeWrapper()

    const header = wrapper.findComponent(HeaderDetailPage)
    expect(header.exists()).toBe(true)
    await header.setValue('HGNC:1100', 'searchTermRef')
    await header.setValue('grch37', 'genomeReleaseRef')
    expect(header.emitted()).toHaveProperty('update:searchTermRef')
    expect(header.emitted()).toHaveProperty('update:genomeReleaseRef')
    expect(header.vm.$props).toStrictEqual({ searchTerm: '', genomeRelease: 'grch37' })

    const searchBar = wrapper.findComponent(SearchBar)
    expect(searchBar.exists()).toBe(true)
    await searchBar.setValue('HGNC:1100', 'searchTerm')
    await searchBar.setValue('grch37', 'genomeRelease')
    expect(searchBar.emitted()).toHaveProperty('update:searchTerm')
    expect(searchBar.emitted()).toHaveProperty('update:genomeRelease')
    expect(searchBar.vm.$props).toContain({ searchTerm: 'HGNC:1100', genomeRelease: 'grch37' })
  })

  it('renders VariantDatails components', () => {
    const wrapper = makeWrapper()

    const variantInfo = wrapper.findComponent(VariantGene)
    const beaconNetwork = wrapper.findComponent(BeaconNetwork)
    const clinVar = wrapper.findComponent(ClinVar)
    const variantFreqs = wrapper.findComponent(VariantFreqs)
    const variantConservation = wrapper.findComponent(VariantConservation)
    const variantTools = wrapper.findComponent(VariantTools)
    const variantValidator = wrapper.findComponent(VariantValidator)
    const txCsq = wrapper.findComponent(TxCsq)
    expect(variantInfo.exists()).toBe(true)
    expect(beaconNetwork.exists()).toBe(true)
    expect(clinVar.exists()).toBe(true)
    expect(variantFreqs.exists()).toBe(true)
    expect(variantConservation.exists()).toBe(true)
    expect(variantTools.exists()).toBe(true)
    expect(variantValidator.exists()).toBe(true)
    expect(txCsq.exists()).toBe(true)
  })

  it('emits scroll to section', async () => {
    const wrapper = makeWrapper()

    const geneLink = wrapper.find('#gene-nav')
    expect(geneLink.exists()).toBe(true)

    await geneLink.trigger('click')
    await nextTick()
    expect(router.push).toHaveBeenCalled()
    expect(router.push).toHaveBeenCalledWith({
      hash: '#gene'
    })

    // Check if hgnc triggered scrollIntoView()
    const hgncSection = wrapper.find('#gene')
    expect(hgncSection.exists()).toBe(true)
    expect(hgncSection.element.scrollTop).toBe(0)
  })

  it('redirects if mounting with storeState Error', async () => {
    const pinia = createTestingPinia({ createSpy: vi.fn() })
    const store = useVariantInfoStore(pinia)
    const mockLoadData = vi.fn().mockImplementation(async (variantTerm: string) => {
      store.storeState = StoreState.Error
      store.variantTerm = variantTerm
      store.smallVariant = JSON.parse(JSON.stringify(smallVariantInfo))
      store.varAnnos = JSON.parse(JSON.stringify(variantData.varAnnos))
      store.geneInfo = JSON.parse(JSON.stringify(variantData.geneInfo))
      store.txCsq = JSON.parse(JSON.stringify(variantData.txCsq))
    })
    const mockClearData = vi.fn().mockImplementation(() => {
      store.storeState = StoreState.Initial
      store.variantTerm = ''
      store.smallVariant = null
      store.varAnnos = null
      store.geneInfo = null
      store.txCsq = null
    })
    store.loadData = mockLoadData
    store.clearData = mockClearData

    store.storeState = StoreState.Active
    store.variantTerm = 'chr17:12345:A:T'
    store.smallVariant = JSON.parse(JSON.stringify(smallVariantInfo))
    store.varAnnos = JSON.parse(JSON.stringify(variantData.varAnnos))
    store.geneInfo = JSON.parse(JSON.stringify(variantData.geneInfo))
    store.txCsq = JSON.parse(JSON.stringify(variantData.txCsq))

    mount(
      {
        template: '<v-app><VariantDetailView /></v-app>'
      },
      {
        props: {
          searchTerm: 'chr17:43044295:G:A',
          genomeRelease: 'grch37'
        },
        global: {
          plugins: [vuetify, router, pinia],
          components: {
            VariantDetailView
          }
        }
      }
    )
    await nextTick()
    expect(router.push).toHaveBeenCalledWith({ name: 'home' })
  })
})
