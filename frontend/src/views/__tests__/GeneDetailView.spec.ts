import { createTestingPinia } from '@pinia/testing'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { VMenu } from 'vuetify/components'

import * as BRCA1ClinVar from '@/assets/__tests__/BRCA1ClinVar.json'
import * as BRCA1geneInfo from '@/assets/__tests__/BRCA1GeneInfo.json'
import * as BRCA1Transcripts from '@/assets/__tests__/BRCA1Transcripts.json'
import AlternativeIdentifiers from '@/components/GeneDetails/AlternativeIdentifiers.vue'
import ClinVarFreqPlot from '@/components/GeneDetails/ClinVarFreqPlot.vue'
import ClinvarImpact from '@/components/GeneDetails/ClinvarImpact.vue'
import DiseaseAnnotation from '@/components/GeneDetails/DiseaseAnnotation.vue'
import ExternalResources from '@/components/GeneDetails/ExternalResources.vue'
import GeneRifs from '@/components/GeneDetails/GeneRifs.vue'
import LocusDatabases from '@/components/GeneDetails/LocusDatabases.vue'
import NcbiSummary from '@/components/GeneDetails/NcbiSummary.vue'
import SupplementaryList from '@/components/GeneDetails/SupplementaryList.vue'
import VariationLandscape from '@/components/GeneDetails/VariationLandscape.vue'
import HeaderDetailPage from '@/components/HeaderDetailPage.vue'
import SearchBar from '@/components/SearchBar.vue'
import { setupMountedComponents } from '@/lib/test-utils'
import { useGeneInfoStore } from '@/stores/geneInfo'
import { StoreState } from '@/stores/misc'

import GeneDetailView from '../GeneDetailView.vue'

const geneData = {
  storeState: StoreState.Active,
  geneSymbol: 'HGNC:1100',
  geneInfo: JSON.parse(JSON.stringify(BRCA1geneInfo)).genes['HGNC:1100'],
  geneClinvar: JSON.parse(JSON.stringify(BRCA1ClinVar)).genes['HGNC:1100'],
  transcripts: JSON.parse(JSON.stringify(BRCA1Transcripts))
}

const makeWrapper = () => {
  const pinia = createTestingPinia({ createSpy: vi.fn })
  const geneInfoStore = useGeneInfoStore(pinia)
  const mockLoadData = vi.fn().mockImplementation(async (geneSymbol: string) => {
    geneInfoStore.storeState = StoreState.Active
    geneInfoStore.geneSymbol = geneSymbol
    geneInfoStore.geneInfo = JSON.parse(JSON.stringify(geneData.geneInfo))
    geneInfoStore.geneClinvar = JSON.parse(JSON.stringify(geneData.geneClinvar))
    geneInfoStore.transcripts = JSON.parse(JSON.stringify(geneData.transcripts))
  })
  geneInfoStore.loadData = mockLoadData

  geneInfoStore.storeState = StoreState.Active
  geneInfoStore.geneSymbol = geneData.geneSymbol
  geneInfoStore.geneInfo = JSON.parse(JSON.stringify(geneData.geneInfo))
  geneInfoStore.geneClinvar = JSON.parse(JSON.stringify(geneData.geneClinvar))
  geneInfoStore.transcripts = JSON.parse(JSON.stringify(geneData.transcripts))

  return setupMountedComponents(
    {
      component: GeneDetailView,
      template: true
    },
    {
      props: {
        searchTerm: 'HGNC:1100',
        genomeRelease: 'grch37'
      },
      pinia: pinia
    }
  )
}

describe('GeneDetailView', async () => {
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

  it('renders info-cards and navigation drawer', () => {
    const { wrapper } = makeWrapper()

    const navigationDrawer = wrapper.find('.v-navigation-drawer')
    expect(navigationDrawer.exists()).toBe(true)

    const hgnc = wrapper.find('#hgnc')
    const constraintsScores = wrapper.find('#constraints-scores')
    const ncbiSummary = wrapper.find('#ncbi-summary')
    const alternativeIdentifiers = wrapper.find('#alternative-identifiers')
    const externalResources = wrapper.find('#external-resources')
    const diseaseAnnotations = wrapper.find('#disease-annotation')
    const acmgList = wrapper.find('#acmg-list')
    const geneRifs = wrapper.find('#gene-rifs')
    const locusSpecificDatabases = wrapper.find('#locus-specific-databases')
    expect(hgnc.exists()).toBe(true)
    expect(constraintsScores.exists()).toBe(true)
    expect(ncbiSummary.exists()).toBe(true)
    expect(alternativeIdentifiers.exists()).toBe(true)
    expect(externalResources.exists()).toBe(true)
    expect(diseaseAnnotations.exists()).toBe(true)
    expect(acmgList.exists()).toBe(true)
    expect(geneRifs.exists()).toBe(true)
    expect(locusSpecificDatabases.exists()).toBe(true)

    // Renders the main content
    const alternativeIdentifiersCard = wrapper.findComponent(AlternativeIdentifiers)
    const externalResourcesCard = wrapper.findComponent(ExternalResources)
    const clinVarFreqPlotCard = wrapper.findComponent(ClinVarFreqPlot)
    const clinVarImpactCard = wrapper.findComponent(ClinvarImpact)
    const diseaseAnnotationCard = wrapper.findComponent(DiseaseAnnotation)
    const geneRifsCard = wrapper.findComponent(GeneRifs)
    const locusDatabasesCard = wrapper.findComponent(LocusDatabases)
    const ncbiSummaryCard = wrapper.findComponent(NcbiSummary)
    const supplementaryListCard = wrapper.findComponent(SupplementaryList)
    const variationLandscapeCard = wrapper.findComponent(VariationLandscape)
    expect(alternativeIdentifiersCard.exists()).toBe(true)
    expect(externalResourcesCard.exists()).toBe(true)
    expect(clinVarFreqPlotCard.exists()).toBe(true)
    expect(clinVarImpactCard.exists()).toBe(true)
    expect(diseaseAnnotationCard.exists()).toBe(true)
    expect(geneRifsCard.exists()).toBe(true)
    expect(locusDatabasesCard.exists()).toBe(true)
    expect(ncbiSummaryCard.exists()).toBe(true)
    expect(supplementaryListCard.exists()).toBe(true)
    expect(variationLandscapeCard.exists()).toBe(true)

    const launchImage = wrapper.findAll('.mdi-launch')
    expect(launchImage.length).toBe(2573)
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

  it('emits scroll to section', async () => {
    const { wrapper, router } = makeWrapper()

    const hgncLink = wrapper.find('#hgnc-nav')
    expect(hgncLink.exists()).toBe(true)

    await hgncLink.trigger('click')
    await nextTick()
    expect(router.push).toHaveBeenCalled()
    expect(router.push).toHaveBeenCalledWith({
      hash: '#hgnc'
    })

    // Check if hgnc triggered scrollIntoView()
    const hgncSection = wrapper.find('#hgnc')
    expect(hgncSection.exists()).toBe(true)
    expect(hgncSection.element.scrollTop).toBe(0)
  })

  it('redirects if mounting with storeState Error', async () => {
    const pinia = createTestingPinia({ createSpy: vi.fn })
    const store = useGeneInfoStore(pinia)
    const mockLoadData = vi.fn().mockImplementation(async (geneSymbol: string) => {
      store.storeState = StoreState.Error
      store.geneSymbol = geneSymbol
      store.geneInfo = JSON.parse(JSON.stringify(geneData.geneInfo))
      store.geneClinvar = JSON.parse(JSON.stringify(geneData.geneClinvar))
      store.transcripts = JSON.parse(JSON.stringify(geneData.transcripts))
    })
    const mockClearData = vi.fn().mockImplementation(() => {
      store.storeState = StoreState.Initial
      store.geneSymbol = ''
      store.geneInfo = {}
      store.geneClinvar = {}
      store.transcripts = {}
    })
    store.loadData = mockLoadData
    store.clearData = mockClearData

    store.storeState = StoreState.Active
    store.geneSymbol = geneData.geneSymbol
    store.geneInfo = JSON.parse(JSON.stringify(geneData.geneInfo))
    store.geneClinvar = JSON.parse(JSON.stringify(geneData.geneClinvar))
    store.transcripts = JSON.parse(JSON.stringify(geneData.transcripts))

    const { router } = setupMountedComponents(
      {
        component: GeneDetailView,
        template: true
      },
      {
        props: {
          searchTerm: 'HGNC:1100',
          genomeRelease: 'grch37'
        },
        pinia: pinia
      }
    )

    await nextTick()
    expect(router.push).toHaveBeenCalledOnce()
    expect(router.push).toHaveBeenCalledWith({ name: 'home' })
  })
})
