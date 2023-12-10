import { createTestingPinia } from '@pinia/testing'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { VMenu } from 'vuetify/components'

import * as BRCA1ClinVar from '@/assets/__tests__/BRCA1ClinVar.json'
import * as BRCA1geneInfo from '@/assets/__tests__/BRCA1GeneInfo.json'
import * as BRCA1Transcripts from '@/assets/__tests__/BRCA1Transcripts.json'
import ClinvarCard from '@/components/GeneDetails/ClinvarCard.vue'
import ConditionsCard from '@/components/GeneDetails/ConditionsCard.vue'
import ExpressionCard from '@/components/GeneDetails/ExpressionCard.vue'
import OverviewCard from '@/components/GeneDetails/OverviewCard.vue'
import PathogenicityCard from '@/components/GeneDetails/PathogenicityCard.vue'
import PageHeader from '@/components/PageHeader.vue'
import SearchBar from '@/components/SearchBar.vue'
import { setupMountedComponents } from '@/lib/test-utils'
import { usegeneInfoStore } from '@/stores/geneInfo'
import { StoreState } from '@/stores/misc'
import GeneDetailView from '@/views/GeneDetailView.vue'

const geneData = {
  storeState: StoreState.Active,
  geneSymbol: 'HGNC:1100',
  geneInfo: JSON.parse(JSON.stringify(BRCA1geneInfo)).genes['HGNC:1100'],
  geneClinvar: JSON.parse(JSON.stringify(BRCA1ClinVar)).genes['HGNC:1100'],
  transcripts: JSON.parse(JSON.stringify(BRCA1Transcripts))
}

const makeWrapper = () => {
  const pinia = createTestingPinia({ createSpy: vi.fn })
  const geneInfoStore = usegeneInfoStore(pinia)
  const mockLoadData = vi.fn().mockImplementation(async (geneSymbol: string) => {
    geneInfoStore.storeState = StoreState.Active
    geneInfoStore.hgncId = geneSymbol
    geneInfoStore.geneInfo = JSON.parse(JSON.stringify(geneData.geneInfo))
    geneInfoStore.geneClinvar = JSON.parse(JSON.stringify(geneData.geneClinvar))
    geneInfoStore.transcripts = JSON.parse(JSON.stringify(geneData.transcripts))
  })
  geneInfoStore.loadData = mockLoadData

  geneInfoStore.storeState = StoreState.Active
  geneInfoStore.hgncId = geneData.geneSymbol
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

describe.concurrent('GeneDetailView', async () => {
  beforeEach(() => {
    // Disable Vue warn. This warning is caused by BookmarkListItem.vue due to
    // unproper mocking of the store and props passed to the component.
    const spy = vi.spyOn(console, 'warn')
    spy.mockImplementation(() => {})
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
  })

  it('renders info-cards and navigation drawer', async () => {
    const { wrapper } = await makeWrapper()

    const navigationDrawer = wrapper.find('.v-navigation-drawer')
    expect(navigationDrawer.exists()).toBe(true)

    // Renders the anchors
    const geneOverview = wrapper.find('#gene-overview')
    const genePathogencity = wrapper.find('#gene-pathogenicity')
    const geneConditions = wrapper.find('#gene-conditions')
    const geneExpression = wrapper.find('#gene-expression')
    const geneClinvar = wrapper.find('#gene-clinvar')
    expect(geneOverview.exists()).toBe(true)
    expect(genePathogencity.exists()).toBe(true)
    expect(geneConditions.exists()).toBe(true)
    expect(geneExpression.exists()).toBe(true)
    expect(geneClinvar.exists()).toBe(true)

    // Renders the main content
    const overviewCard = wrapper.findComponent(OverviewCard)
    const pathogencityCard = wrapper.findComponent(PathogenicityCard)
    const conditionsCard = wrapper.findComponent(ConditionsCard)
    const expressionCard = wrapper.findComponent(ExpressionCard)
    const clinvarCard = wrapper.findComponent(ClinvarCard)
    expect(overviewCard.exists()).toBe(true)
    expect(pathogencityCard.exists()).toBe(true)
    expect(conditionsCard.exists()).toBe(true)
    expect(expressionCard.exists()).toBe(true)
    expect(clinvarCard.exists()).toBe(true)
  })

  it('emits update in header', async () => {
    const { wrapper } = await makeWrapper()

    const header = wrapper.findComponent(PageHeader)
    expect(header.exists()).toBe(true)
    await header.setValue('HGNC:1100', 'searchTermRef')
    await header.setValue('grch37', 'genomeReleaseRef')
    expect(header.emitted()).toHaveProperty('update:searchTermRef')
    expect(header.emitted()).toHaveProperty('update:genomeReleaseRef')
    expect(header.vm.$props).toStrictEqual({ hideSearchBar: false })

    const searchBar = wrapper.findComponent(SearchBar)
    expect(searchBar.exists()).toBe(true)
    await searchBar.setValue('HGNC:1100', 'searchTerm')
    await searchBar.setValue('grch37', 'genomeRelease')
    expect(searchBar.emitted()).toHaveProperty('update:searchTerm')
    expect(searchBar.emitted()).toHaveProperty('update:genomeRelease')
    expect(searchBar.vm.$props).toContain({ searchTerm: 'HGNC:1100', genomeRelease: 'grch37' })
  })

  it('emits scroll to section', async () => {
    const { wrapper, router } = await makeWrapper()

    const geneOverviewLink = wrapper.find('#gene-overview-nav')
    expect(geneOverviewLink.exists()).toBe(true)

    await geneOverviewLink.trigger('click')
    await nextTick()
    expect(router.push).toHaveBeenCalled()
    expect(router.push).toHaveBeenCalledWith({
      hash: '#gene-overview',
      query: { genomeBuild: 'grch37' }
    })

    // Check if hgnc triggered scrollIntoView()
    const geneOverviewCard = wrapper.find('#gene-overview')
    expect(geneOverviewCard.exists()).toBe(true)
    expect(geneOverviewCard.element.scrollTop).toBe(0)
  })

  it('shows the Error message', async () => {
    const pinia = createTestingPinia({ createSpy: vi.fn })
    const store = usegeneInfoStore(pinia)
    const mockLoadData = vi.fn().mockImplementation(async (geneSymbol: string) => {
      store.storeState = StoreState.Error
      store.hgncId = geneSymbol
      store.geneInfo = JSON.parse(JSON.stringify(geneData.geneInfo))
      store.geneClinvar = JSON.parse(JSON.stringify(geneData.geneClinvar))
      store.transcripts = JSON.parse(JSON.stringify(geneData.transcripts))
    })
    const mockClearData = vi.fn().mockImplementation(() => {
      store.storeState = StoreState.Initial
      store.hgncId = ''
      store.geneInfo = {}
      store.geneClinvar = {}
      store.transcripts = {}
    })
    store.loadData = mockLoadData
    store.clearData = mockClearData

    store.storeState = StoreState.Active
    store.hgncId = geneData.geneSymbol
    store.geneInfo = JSON.parse(JSON.stringify(geneData.geneInfo))
    store.geneClinvar = JSON.parse(JSON.stringify(geneData.geneClinvar))
    store.transcripts = JSON.parse(JSON.stringify(geneData.transcripts))

    const { wrapper } = await setupMountedComponents(
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

    const errorMessage = wrapper.findComponent({ name: 'VAlert' })
    expect(errorMessage.exists()).toBe(true)
    expect(errorMessage.text()).toContain('Error:')
  })
})
