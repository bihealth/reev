import { createTestingPinia } from '@pinia/testing'
import { flushPromises } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { VMenu } from 'vuetify/components'

import * as BRCA1GeneInfo from '@/assets/__tests__/BRCA1GeneInfo.json'
import * as CurrentSV from '@/assets/__tests__/ExampleSV.json'
import ClinvarCard from '@/components/GeneDetails/ClinvarCard.vue'
import ConditionsCard from '@/components/GeneDetails/ConditionsCard.vue'
import ExpressionCard from '@/components/GeneDetails/ExpressionCard.vue'
import OverviewCard from '@/components/GeneDetails/OverviewCard.vue'
import PathogenicityCard from '@/components/GeneDetails/PathogenicityCard.vue'
import GenomeBrowser from '@/components/GenomeBrowser.vue'
import HeaderDetailPage from '@/components/HeaderDetailPage.vue'
import SearchBar from '@/components/SearchBar.vue'
import ClinsigCard from '@/components/StrucvarDetails/ClinsigCard.vue'
import StrucvarClinvarCard from '@/components/StrucvarDetails/ClinvarCard.vue'
import GeneListCard from '@/components/StrucvarDetails/GeneListCard.vue'
import VariantToolsCard from '@/components/StrucvarDetails/VariantToolsCard.vue'
import { setupMountedComponents } from '@/lib/test-utils'
import { StoreState } from '@/stores/misc'
import { useSvInfoStore } from '@/stores/svInfo'

import StrucvarDetailsView from '../StrucvarDetailsView.vue'

const makeWrapper = () => {
  const pinia = createTestingPinia({ createSpy: vi.fn })
  const svInfoStore = useSvInfoStore(pinia)
  const mockLoadData = vi.fn().mockImplementation(async (searchTerm: string) => {
    svInfoStore.storeState = StoreState.Active
    svInfoStore.svTerm = searchTerm
    svInfoStore.currentSvRecord = JSON.parse(JSON.stringify(CurrentSV))
    svInfoStore.genesInfos = JSON.parse(JSON.stringify([BRCA1GeneInfo['genes']['HGNC:1100']]))
  })
  svInfoStore.loadData = mockLoadData

  // Initial load
  svInfoStore.storeState = StoreState.Loading
  svInfoStore.svTerm = null
  svInfoStore.currentSvRecord = null
  svInfoStore.genesInfos = JSON.parse(JSON.stringify([BRCA1GeneInfo['genes']['HGNC:1100']]))

  return setupMountedComponents(
    { component: StrucvarDetailsView, template: true },
    {
      props: {
        searchTerm: 'DEL:chr17:41176312:41277500',
        genomeRelease: 'grch37'
      },
      pinia: pinia
    }
  )
}

describe.concurrent('StrucvarDetailsView', async () => {
  it('renders the header', async () => {
    const { wrapper } = await makeWrapper()

    const header = wrapper.findComponent(HeaderDetailPage)
    const searchBar = wrapper.findComponent(SearchBar)
    expect(header.exists()).toBe(true)
    expect(searchBar.exists()).toBe(true)

    const logo = wrapper.find('#logo')
    const menu = wrapper.findComponent(VMenu)
    expect(logo.exists()).toBe(true)
    expect(menu.exists()).toBe(true)
  })

  it('renders the loading state', async () => {
    const { wrapper } = await makeWrapper()

    const svInfoStore = useSvInfoStore()
    svInfoStore.storeState = StoreState.Loading
    await nextTick()
    const loading = wrapper.findComponent({ name: 'VProgressLinear' })
    expect(loading.exists()).toBe(true)
  })

  it('renders SvDetails info-cards and navigation drawer', async () => {
    const { wrapper } = await makeWrapper()
    await flushPromises()

    const navigationDrawer = wrapper.find('.v-navigation-drawer')
    expect(navigationDrawer.exists()).toBe(true)

    // Renders the anchors
    const geneList = wrapper.find('#gene-list')
    const geneOverview = wrapper.find('#gene-overview')
    const genePathogencity = wrapper.find('#gene-pathogenicity')
    const geneConditions = wrapper.find('#gene-conditions')
    const geneExpression = wrapper.find('#gene-expression')
    // const geneClinvar = wrapper.find('#gene-clinvar')
    const strucvarClinvar = wrapper.find('#strucvar-clinvar')
    const strucvarTools = wrapper.find('#strucvar-tools')
    // const strucvarAcmg = wrapper.find('#strucvar-acmg')
    const strucvarGenomeBrowser = wrapper.find('#strucvar-genomebrowser')
    expect(geneList.exists()).toBe(true)
    expect(geneOverview.exists()).toBe(true)
    expect(genePathogencity.exists()).toBe(true)
    expect(geneConditions.exists()).toBe(true)
    expect(geneExpression.exists()).toBe(true)
    // expect(geneClinvar.exists()).toBe(true)
    expect(strucvarClinvar.exists()).toBe(true)
    expect(strucvarTools.exists()).toBe(true)
    // expect(strucvarAcmg.exists()).toBe(true)
    expect(strucvarGenomeBrowser.exists()).toBe(true)

    // Renders the cards
    const geneListCard = wrapper.findComponent(GeneListCard)
    const overviewCard = wrapper.findComponent(OverviewCard)
    const pathogencityCard = wrapper.findComponent(PathogenicityCard)
    const conditionsCard = wrapper.findComponent(ConditionsCard)
    const expressionCard = wrapper.findComponent(ExpressionCard)
    // const clinvarCard = wrapper.findComponent(ClinvarCard)
    const strucvarClinvarCard = wrapper.findComponent(StrucvarClinvarCard)
    const strucvarToolsCard = wrapper.findComponent(VariantToolsCard)
    // const strucvarAcmgCard = wrapper.findComponent(ClinsigCard)
    const strucvarGenomeBrowserCard = wrapper.findComponent(GenomeBrowser)
    expect(geneListCard.exists()).toBe(true)
    expect(overviewCard.exists()).toBe(true)
    expect(pathogencityCard.exists()).toBe(true)
    expect(conditionsCard.exists()).toBe(true)
    expect(expressionCard.exists()).toBe(true)
    // expect(clinvarCard.exists()).toBe(true)
    expect(strucvarClinvarCard.exists()).toBe(true)
    expect(strucvarToolsCard.exists()).toBe(true)
    // expect(strucvarAcmgCard.exists()).toBe(true)
    expect(strucvarGenomeBrowserCard.exists()).toBe(true)
  })

  it.skip('emits update in header', async () => {
    const { wrapper } = await makeWrapper()

    const header = wrapper.findComponent(HeaderDetailPage)
    expect(header.exists()).toBe(true)
    await header.setValue('DEL:chr17:41176312:41277500', 'searchTermRef')
    await header.setValue('grch37', 'genomeReleaseRef')
    expect(header.emitted()).toHaveProperty('update:searchTermRef')
    expect(header.emitted()).toHaveProperty('update:genomeReleaseRef')
    expect(header.vm.$props).toContain({ searchTerm: '', genomeRelease: 'grch37' })

    const searchBar = wrapper.findComponent(SearchBar)
    expect(searchBar.exists()).toBe(true)
    await searchBar.setValue('DEL:chr17:41176312:41277500', 'searchTermRef')
    await searchBar.setValue('grch37', 'genomeReleaseRef')
    expect(searchBar.emitted()).toHaveProperty('update:searchTermRef')
    expect(searchBar.emitted()).toHaveProperty('update:genomeReleaseRef')
    expect(searchBar.vm.$props).toContain({ searchTerm: '', genomeRelease: 'grch37' })
  })

  it.skip('emits update in gene list', async () => {
    const { wrapper } = await makeWrapper()

    const geneList = wrapper.findComponent(GeneListCard)
    expect(geneList.exists()).toBe(true)

    await geneList.setValue('HGNC:1100', 'selectedGeneHgncId')
    expect(wrapper.emitted()).toHaveProperty('update:selectedGeneHgncId')
    expect(wrapper.vm.$props).toContain({ selectedGeneHgncId: 'HGNC:1100' })
  })

  it.skip('emits update in genome browser', async () => {
    const { wrapper } = await makeWrapper()

    const genomeBrowser = wrapper.findComponent(GenomeBrowser)
    expect(genomeBrowser.exists()).toBe(true)

    await genomeBrowser.setValue('chr17', 'selectedChromosome')
    await genomeBrowser.setValue(41176312, 'selectedStart')
    await genomeBrowser.setValue(41277500, 'selectedEnd')
    expect(wrapper.emitted()).toHaveProperty('update:selectedChromosome')
    expect(wrapper.emitted()).toHaveProperty('update:selectedStart')
    expect(wrapper.emitted()).toHaveProperty('update:selectedEnd')
    expect(wrapper.vm.$props).toContain({
      selectedChromosome: 'chr17',
      selectedStart: 41176312,
      selectedEnd: 41277500
    })
  })
})
