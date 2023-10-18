import { createTestingPinia } from '@pinia/testing'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { VMenu } from 'vuetify/components'

import * as BRCA1ClinVar from '@/assets/__tests__/BRCA1ClinVar.json'
import * as BRCA1GeneInfo from '@/assets/__tests__/BRCA1GeneInfo.json'
import * as BRCA1TxInfo from '@/assets/__tests__/BRCA1TxInfo.json'
import * as BRCA1VariantInfo from '@/assets/__tests__/BRCA1VariantInfo.json'
import HeaderDetailPage from '@/components/HeaderDetailPage.vue'
import SearchBar from '@/components/SearchBar.vue'
import BeaconNetwork from '@/components/VariantDetails/BeaconNetwork.vue'
import ClinVar from '@/components/VariantDetails/ClinVar.vue'
import TxCsq from '@/components/VariantDetails/TxCsq.vue'
import VariantConservation from '@/components/VariantDetails/VariantConservation.vue'
import VariantFreqs from '@/components/VariantDetails/VariantFreqs.vue'
import VariantGene from '@/components/VariantDetails/VariantGene.vue'
import VariantTools from '@/components/VariantDetails/VariantTools.vue'
import VariantValidator from '@/components/VariantDetails/VariantValidator.vue'
import { AcmgCriteria, MultiSourceAcmgCriteriaState, Presence, StateSource } from '@/lib/acmgSeqVar'
import { setupMountedComponents } from '@/lib/test-utils'
import { StoreState } from '@/stores/misc'
import { useVariantAcmgRatingStore } from '@/stores/variantAcmgRating'
import { useVariantInfoStore } from '@/stores/variantInfo'

import VariantDetailView from '../VariantDetailView.vue'

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
  varAnnos: JSON.parse(JSON.stringify(BRCA1VariantInfo)).result,
  geneInfo: JSON.parse(JSON.stringify(BRCA1GeneInfo)).genes['HGNC:1100'],
  clinvar: JSON.parse(JSON.stringify(BRCA1ClinVar)).genes['HGNC:1100'],
  txCsq: JSON.parse(JSON.stringify(BRCA1TxInfo)).result
}

const makeWrapper = () => {
  const pinia = createTestingPinia({ createSpy: vi.fn })
  const variantInfoStore = useVariantInfoStore(pinia)
  const variantAcmgStore = useVariantAcmgRatingStore(pinia)
  const mockLoadData = vi.fn().mockImplementation(async (variantTerm: string) => {
    variantInfoStore.storeState = StoreState.Active
    variantInfoStore.variantTerm = variantTerm
    variantInfoStore.smallVariant = JSON.parse(JSON.stringify(smallVariantInfo))
    variantInfoStore.varAnnos = JSON.parse(JSON.stringify(variantData.varAnnos))
    variantInfoStore.geneInfo = JSON.parse(JSON.stringify(variantData.geneInfo))
    variantInfoStore.geneClinvar = JSON.parse(JSON.stringify(variantData.clinvar))
    variantInfoStore.txCsq = JSON.parse(JSON.stringify(variantData.txCsq))
  })
  variantInfoStore.loadData = mockLoadData

  const mockRetrieveAcmgRating = vi.fn().mockImplementation(async () => {
    variantAcmgStore.storeState = StoreState.Active
    variantAcmgStore.smallVariant = JSON.parse(JSON.stringify(smallVariantInfo))
    variantAcmgStore.acmgRating = new MultiSourceAcmgCriteriaState()
    variantAcmgStore.acmgRating.setPresence(
      StateSource.InterVar,
      AcmgCriteria.Pvs1,
      Presence.Present
    )
  })
  variantAcmgStore.setAcmgRating = mockRetrieveAcmgRating

  // Initial load
  variantInfoStore.storeState = StoreState.Active
  variantInfoStore.variantTerm = 'chr17:12345:A:T'
  variantInfoStore.smallVariant = JSON.parse(JSON.stringify(smallVariantInfo))
  variantInfoStore.varAnnos = JSON.parse(JSON.stringify(variantData.varAnnos))
  variantInfoStore.geneInfo = JSON.parse(JSON.stringify(variantData.geneInfo))
  variantInfoStore.geneClinvar = JSON.parse(JSON.stringify(variantData.clinvar))
  variantInfoStore.txCsq = JSON.parse(JSON.stringify(variantData.txCsq))
  variantAcmgStore.storeState = StoreState.Active
  variantAcmgStore.smallVariant = JSON.parse(JSON.stringify(smallVariantInfo))
  variantAcmgStore.acmgRating = new MultiSourceAcmgCriteriaState()

  return setupMountedComponents(
    { component: VariantDetailView, template: true },
    {
      props: {
        searchTerm: 'chr17:43044295:G:A',
        genomeRelease: 'grch37'
      },
      pinia: pinia
    }
  )
}

describe('VariantDetailView', async () => {
  it('renders the header', async () => {
    const { wrapper } = makeWrapper()

    const header = wrapper.findComponent(HeaderDetailPage)
    const searchBar = wrapper.findComponent(SearchBar)
    expect(header.exists()).toBe(true)
    expect(searchBar.exists()).toBe(true)

    const logo = wrapper.find('#logo')
    const menu = wrapper.findComponent(VMenu)
    expect(logo.exists()).toBe(true)
    expect(menu.exists()).toBe(true)
  })

  it('emits update in header', async () => {
    const { wrapper } = makeWrapper()

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
    const { wrapper } = makeWrapper()

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
    const { wrapper, router } = makeWrapper()

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
    const pinia = createTestingPinia({ createSpy: vi.fn })
    const variantInfoStore = useVariantInfoStore(pinia)
    const variantAcmgStore = useVariantAcmgRatingStore(pinia)

    const mockLoadData = vi.fn().mockImplementation(async (variantTerm: string) => {
      variantInfoStore.storeState = StoreState.Error
      variantInfoStore.variantTerm = variantTerm
      variantInfoStore.smallVariant = JSON.parse(JSON.stringify(smallVariantInfo))
      variantInfoStore.varAnnos = JSON.parse(JSON.stringify(variantData.varAnnos))
      variantInfoStore.geneInfo = JSON.parse(JSON.stringify(variantData.geneInfo))
      variantInfoStore.geneClinvar = JSON.parse(JSON.stringify(variantData.clinvar))
      variantInfoStore.txCsq = JSON.parse(JSON.stringify(variantData.txCsq))
    })
    const mockClearData = vi.fn().mockImplementation(() => {
      variantInfoStore.storeState = StoreState.Initial
      variantInfoStore.variantTerm = ''
      variantInfoStore.smallVariant = null
      variantInfoStore.varAnnos = null
      variantInfoStore.geneInfo = null
      variantInfoStore.geneClinvar = null
      variantInfoStore.txCsq = null
    })
    variantInfoStore.loadData = mockLoadData
    variantInfoStore.clearData = mockClearData

    const mockRetrieveAcmgRating = vi.fn().mockImplementation(async () => {
      variantAcmgStore.storeState = StoreState.Active
      variantAcmgStore.smallVariant = JSON.parse(JSON.stringify(smallVariantInfo))
      variantAcmgStore.acmgRating = new MultiSourceAcmgCriteriaState()
    })
    variantAcmgStore.setAcmgRating = mockRetrieveAcmgRating

    // Initial load
    variantInfoStore.storeState = StoreState.Active
    variantInfoStore.variantTerm = 'chr17:12345:A:T'
    variantInfoStore.smallVariant = JSON.parse(JSON.stringify(smallVariantInfo))
    variantInfoStore.varAnnos = JSON.parse(JSON.stringify(variantData.varAnnos))
    variantInfoStore.geneInfo = JSON.parse(JSON.stringify(variantData.geneInfo))
    variantInfoStore.geneClinvar = JSON.parse(JSON.stringify(variantData.clinvar))
    variantInfoStore.txCsq = JSON.parse(JSON.stringify(variantData.txCsq))
    variantAcmgStore.storeState = StoreState.Active
    variantAcmgStore.smallVariant = JSON.parse(JSON.stringify(smallVariantInfo))
    variantAcmgStore.acmgRating = new MultiSourceAcmgCriteriaState()

    const { router } = setupMountedComponents(
      {
        component: VariantDetailView,
        template: true
      },
      {
        props: {
          searchTerm: 'chr17:43044295:G:A',
          genomeRelease: 'grch37'
        },
        pinia: pinia
      }
    )
    await nextTick()
    expect(router.push).toHaveBeenCalledWith({ name: 'home' })
  })
})
