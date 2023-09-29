import { createTestingPinia } from '@pinia/testing'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'

import * as BRCA1geneInfo from '@/assets/__tests__/BRCA1GeneInfo.json'
import HeaderDetailPage from '@/components/HeaderDetailPage.vue'
import SearchBar from '@/components/SearchBar.vue'
import { setupMountedComponents } from '@/lib/test-utils'
import { useGeneInfoStore } from '@/stores/geneInfo'
import { StoreState } from '@/stores/misc'
import GeneDetailView from '@/views/GeneDetailView.vue'

const geneData = {
  storeState: 'active',
  geneSymbol: 'BRCA1',
  geneInfo: BRCA1geneInfo.genes['HGNC:1100']
}

const makeWrapper = (geneDataExample: Object) => {
  const pinia = createTestingPinia({ createSpy: vi.fn })
  const store = useGeneInfoStore(pinia)
  const mockLoadData = vi.fn().mockImplementation(async (geneSymbol: string) => {
    store.storeState = StoreState.Active
    store.geneSymbol = geneSymbol
    store.geneInfo = JSON.parse(JSON.stringify(geneData.geneInfo))
  })
  store.loadData = mockLoadData

  store.storeState = StoreState.Active
  store.geneSymbol = geneData.geneSymbol
  store.geneInfo = JSON.parse(JSON.stringify(geneDataExample))

  return setupMountedComponents(
    {
      component: GeneDetailView,
      template: true
    },
    {
      props: {
        searchTerm: 'BRCA1'
      },
      pinia: pinia
    }
  )
}

describe.concurrent('GeneDetailView', async () => {
  it('renders the page with invalid data', async () => {
    const { wrapper } = makeWrapper(geneData)

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

    const launchImage = wrapper.findAll('.mdi-launch')
    expect(launchImage.length).toBe(14)
  })

  it('renders the header', async () => {
    const { wrapper } = makeWrapper(geneData.geneInfo)

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

  it('renders info-cards and navigation drawer', () => {
    const { wrapper } = makeWrapper(geneData.geneInfo)

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

    const launchImage = wrapper.findAll('.mdi-launch')
    expect(launchImage.length).toBe(2573)
  })

  it('emits update in header', async () => {
    const { wrapper } = makeWrapper(geneData.geneInfo)

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
    const { wrapper, router } = makeWrapper(geneData.geneInfo)

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
    })
    const mockClearData = vi.fn().mockImplementation(() => {
      store.storeState = StoreState.Initial
      store.geneSymbol = ''
      store.geneInfo = {}
    })
    store.loadData = mockLoadData
    store.clearData = mockClearData

    store.storeState = StoreState.Active
    store.geneSymbol = geneData.geneSymbol
    store.geneInfo = JSON.parse(JSON.stringify(geneData.geneInfo))

    const { router } = setupMountedComponents(
      {
        component: GeneDetailView,
        template: true
      },
      {
        props: {
          searchTerm: 'BRCA1'
        },
        pinia: pinia
      }
    )

    await nextTick()
    expect(router.push).toHaveBeenCalledOnce()
    expect(router.push).toHaveBeenCalledWith({ name: 'home' })
  })
})
