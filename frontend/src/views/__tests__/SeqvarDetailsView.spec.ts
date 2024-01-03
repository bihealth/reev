import { createTestingPinia } from '@pinia/testing'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { VMenu } from 'vuetify/components'

import * as BRCA1ClinVar from '@/assets/__tests__/BRCA1ClinVar.json'
import * as BRCA1GeneInfo from '@/assets/__tests__/BRCA1GeneInfo.json'
import * as BRCA1TxInfo from '@/assets/__tests__/BRCA1TxInfo.json'
import * as BRCA1VariantInfo from '@/assets/__tests__/BRCA1VariantInfo.json'
import ConditionsCard from '@/components/GeneDetails/ConditionsCard.vue'
import ExpressionCard from '@/components/GeneDetails/ExpressionCard.vue'
import GeneOverviewCard from '@/components/GeneDetails/OverviewCard.vue'
import PathogenicityCard from '@/components/GeneDetails/PathogenicityCard.vue'
import PageHeader from '@/components/PageHeader.vue'
import SearchBar from '@/components/SearchBar.vue'
import BeaconNetworkCard from '@/components/SeqvarDetails/BeaconNetworkCard.vue'
import ClinsigCard from '@/components/SeqvarDetails/ClinsigCard.vue'
import ClinvarCard from '@/components/SeqvarDetails/ClinvarCard.vue'
import FreqsCard from '@/components/SeqvarDetails/FreqsCard.vue'
import TxCsqCard from '@/components/SeqvarDetails/TxCsqCard.vue'
import VariantScoresCard from '@/components/SeqvarDetails/VariantScoresCard.vue'
import VariantToolsCard from '@/components/SeqvarDetails/VariantToolsCard.vue'
import VariantValidatorCard from '@/components/SeqvarDetails/VariantValidatorCard.vue'
import { AcmgCriteria, MultiSourceAcmgCriteriaState, Presence, StateSource } from '@/lib/acmgSeqVar'
import { type Seqvar } from '@/lib/genomicVars'
import { setupMountedComponents } from '@/lib/test-utils'
import { StoreState } from '@/stores/misc'
import { useSeqVarAcmgRatingStore } from '@/stores/seqVarAcmgRating'
import { useSeqVarInfoStore } from '@/stores/seqVarInfo'

import SeqvarDetailsView from '../SeqvarDetailsView.vue'

const seqvarInfo: Seqvar = {
  genomeBuild: 'grch37',
  chrom: '17',
  pos: 43044295,
  del: 'G',
  ins: 'A',
  userRepr: 'grch37-17-43044295-G-A'
}

const seqvarData = {
  storeState: StoreState.Active,
  seqvar: seqvarInfo,
  varAnnos: JSON.parse(JSON.stringify(BRCA1VariantInfo)).result,
  geneClinvar: JSON.parse(JSON.stringify(BRCA1ClinVar)).genes['HGNC:1100'], //.variants[0].variants[0],
  geneInfo: JSON.parse(JSON.stringify(BRCA1GeneInfo)).genes['HGNC:1100'],
  txCsq: JSON.parse(JSON.stringify(BRCA1TxInfo)).result,
  loadDataRes: null
}

const makeWrapper = () => {
  const pinia = createTestingPinia({ createSpy: vi.fn })
  const seqvarInfoStore = useSeqVarInfoStore(pinia)
  const seqvarAcmgStore = useSeqVarAcmgRatingStore(pinia)
  const mockLoadData = vi.fn().mockImplementation(async (seqvar: Seqvar) => {
    seqvarInfoStore.storeState = StoreState.Active
    seqvarInfoStore.seqvar = structuredClone(seqvar)
    seqvarInfoStore.varAnnos = JSON.parse(JSON.stringify(seqvarData.varAnnos))
    seqvarInfoStore.geneInfo = JSON.parse(JSON.stringify(seqvarData.geneInfo))
    seqvarInfoStore.geneClinvar = JSON.parse(JSON.stringify(seqvarData.geneClinvar))
    seqvarInfoStore.txCsq = JSON.parse(JSON.stringify(seqvarData.txCsq))
  })
  seqvarInfoStore.loadData = mockLoadData

  const mockRetrieveAcmgRating = vi.fn().mockImplementation(async () => {
    seqvarAcmgStore.storeState = StoreState.Active
    seqvarInfoStore.seqvar = structuredClone(seqvarInfo)
    seqvarAcmgStore.acmgRating = new MultiSourceAcmgCriteriaState()
    seqvarAcmgStore.acmgRating.setPresence(
      StateSource.InterVar,
      AcmgCriteria.PVS1,
      Presence.Present
    )
  })
  seqvarAcmgStore.fetchAcmgRating = mockRetrieveAcmgRating

  // Initial load
  seqvarInfoStore.storeState = StoreState.Active
  seqvarInfoStore.seqvar = structuredClone(seqvarInfo)
  seqvarInfoStore.varAnnos = JSON.parse(JSON.stringify(seqvarData.varAnnos))
  seqvarInfoStore.geneInfo = JSON.parse(JSON.stringify(seqvarData.geneInfo))
  seqvarInfoStore.geneClinvar = JSON.parse(JSON.stringify(seqvarData.geneClinvar))
  seqvarInfoStore.txCsq = JSON.parse(JSON.stringify(seqvarData.txCsq))
  seqvarAcmgStore.storeState = StoreState.Active
  seqvarInfoStore.seqvar = structuredClone(seqvarInfo)
  seqvarAcmgStore.acmgRating = new MultiSourceAcmgCriteriaState()

  return setupMountedComponents(
    { component: SeqvarDetailsView, template: true },
    {
      props: {
        searchTerm: 'chr17:43044295:G:A',
        genomeRelease: 'grch37'
      },
      pinia: pinia
    }
  )
}

describe.concurrent('SeqvarDetailsView', async () => {
  beforeEach(() => {
    // Disable Vue warn. This warning is caused by BookmarkListItem.vue due to
    // unproper mocking of the store and props passed to the component.
    const spy = vi.spyOn(console, 'warn')
    spy.mockImplementation(() => {})
    // Disable Vue error.
    const spy2 = vi.spyOn(console, 'error')
    spy2.mockImplementation(() => {})
  })

  it('renders the header', async () => {
    const { wrapper } = await makeWrapper()

    const header = wrapper.findComponent(PageHeader)
    const searchBar = wrapper.findComponent(SearchBar)
    expect(header.exists()).toBe(true)
    expect(searchBar.exists()).toBe(true)

    const logo = wrapper.find('#logo')
    const menu = wrapper.findComponent(VMenu)
    expect(logo.exists()).toBe(true)
    expect(menu.exists()).toBe(true)
  }, 10000)

  it('renders seqvarDatails components', async () => {
    const { wrapper } = await makeWrapper()

    const geneOverviewCard = wrapper.findComponent(GeneOverviewCard)
    const conditionsCard = wrapper.findComponent(ConditionsCard)
    const expressionCard = wrapper.findComponent(ExpressionCard)
    const beaconNetwork = wrapper.findComponent(BeaconNetworkCard)
    const clinvarCard = wrapper.findComponent(ClinvarCard)
    const clinsigCard = wrapper.findComponent(ClinsigCard)
    const freqsCard = wrapper.findComponent(FreqsCard)
    const pathogenicityCard = wrapper.findComponent(PathogenicityCard)
    const variantScoresCard = wrapper.findComponent(VariantScoresCard)
    const variantTools = wrapper.findComponent(VariantToolsCard)
    const variantValidator = wrapper.findComponent(VariantValidatorCard)
    const txCsqCard = wrapper.findComponent(TxCsqCard)
    expect(geneOverviewCard.exists()).toBe(true)
    expect(conditionsCard.exists()).toBe(true)
    expect(expressionCard.exists()).toBe(true)
    expect(beaconNetwork.exists()).toBe(true)
    expect(clinvarCard.exists()).toBe(true)
    expect(clinsigCard.exists()).toBe(true)
    expect(freqsCard.exists()).toBe(true)
    expect(pathogenicityCard.exists()).toBe(true)
    expect(variantScoresCard.exists()).toBe(true)
    expect(variantTools.exists()).toBe(true)
    expect(variantValidator.exists()).toBe(true)
    expect(txCsqCard.exists()).toBe(true)
  })

  it('emits scroll to section', async () => {
    const { wrapper, router } = await makeWrapper()

    const geneLink = wrapper.find('#seqvar-csq-nav')
    expect(geneLink.exists()).toBe(true)

    await geneLink.trigger('click')
    await nextTick()
    expect(router.push).toHaveBeenCalled()
    expect(router.push).toHaveBeenCalledWith({
      hash: '#seqvar-csq'
    })

    // Check if hgnc triggered scrollIntoView()
    const hgncSection = wrapper.find('#seqvar-csq')
    expect(hgncSection.exists()).toBe(true)
    expect(hgncSection.element.scrollTop).toBe(0)
  })

  it('redirects if mounting with storeState Error', async () => {
    const pinia = createTestingPinia({ createSpy: vi.fn })
    const seqvarInfoStore = useSeqVarInfoStore(pinia)
    const seqvarAcmgStore = useSeqVarAcmgRatingStore(pinia)

    const mockLoadData = vi.fn().mockImplementation(async (seqvar: Seqvar) => {
      seqvarInfoStore.storeState = StoreState.Error
      seqvarInfoStore.seqvar = seqvar
      seqvarInfoStore.varAnnos = JSON.parse(JSON.stringify(seqvarData.varAnnos))
      seqvarInfoStore.geneInfo = JSON.parse(JSON.stringify(seqvarData.geneInfo))
      seqvarInfoStore.geneClinvar = JSON.parse(JSON.stringify(seqvarData.geneClinvar))
      seqvarInfoStore.txCsq = JSON.parse(JSON.stringify(seqvarData.txCsq))
    })
    const mockClearData = vi.fn().mockImplementation(() => {
      seqvarInfoStore.storeState = StoreState.Initial
      seqvarInfoStore.seqvar = undefined
      seqvarInfoStore.varAnnos = null
      seqvarInfoStore.geneInfo = null
      seqvarInfoStore.geneClinvar = null
      seqvarInfoStore.txCsq = null
    })
    seqvarInfoStore.loadData = mockLoadData
    seqvarInfoStore.clearData = mockClearData

    const mockRetrieveAcmgRating = vi.fn().mockImplementation(async () => {
      seqvarAcmgStore.storeState = StoreState.Active
      seqvarAcmgStore.seqvar = structuredClone(seqvarInfo)
      seqvarAcmgStore.acmgRating = new MultiSourceAcmgCriteriaState()
    })
    seqvarAcmgStore.fetchAcmgRating = mockRetrieveAcmgRating

    // Initial load
    seqvarInfoStore.storeState = StoreState.Active
    seqvarAcmgStore.seqvar = structuredClone(seqvarInfo)
    seqvarInfoStore.varAnnos = JSON.parse(JSON.stringify(seqvarData.varAnnos))
    seqvarInfoStore.geneInfo = JSON.parse(JSON.stringify(seqvarData.geneInfo))
    seqvarInfoStore.geneClinvar = JSON.parse(JSON.stringify(seqvarData.geneClinvar))
    seqvarInfoStore.txCsq = JSON.parse(JSON.stringify(seqvarData.txCsq))
    seqvarAcmgStore.storeState = StoreState.Active
    seqvarAcmgStore.seqvar = structuredClone(seqvarInfo)
    seqvarAcmgStore.acmgRating = new MultiSourceAcmgCriteriaState()

    const { wrapper } = await setupMountedComponents(
      {
        component: SeqvarDetailsView,
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
    const errorMessage = wrapper.findComponent({ name: 'VAlert' })
    expect(errorMessage.exists()).toBe(true)
  })
})
