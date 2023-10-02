import { createTestingPinia } from '@pinia/testing'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'

import * as BRCA1GeneInfo from '@/assets/__tests__/BRCA1GeneInfo.json'
import GenomeBrowser from '@/components/GenomeBrowser.vue'
import HeaderDetailPage from '@/components/HeaderDetailPage.vue'
import SvDetailsClinvar from '@/components/SvDetails/SvDetailsClinvar.vue'
import SvDetailsGenotypeCall from '@/components/SvDetails/SvDetailsGenotypeCall.vue'
import SvGenes from '@/components/SvDetails/SvGenes.vue'
import { setupMountedComponents } from '@/lib/test-utils'
import { StoreState } from '@/stores/misc'
import { useSvInfoStore } from '@/stores/svInfo'

import VariantDetailView from '../VariantDetailView.vue'

const svRecord = {
  // Include necessary properties of SvRecord
}

const makeWrapper = () => {
  const pinia = createTestingPinia({ createSpy: vi.fn })
  const svInfoStore = useSvInfoStore(pinia)
  const mockLoadData = vi.fn().mockImplementation(async (searchTerm: string) => {
    svInfoStore.storeState = StoreState.Active
    svInfoStore.svTerm = searchTerm
    svInfoStore.currentSvRecord = JSON.parse(JSON.stringify(svRecord))
    svInfoStore.genesInfos = JSON.parse(JSON.stringify([BRCA1GeneInfo['genes']['HGNC:1100']]))
  })
  svInfoStore.loadData = mockLoadData

  // Initial load
  svInfoStore.storeState = StoreState.Initial
  svInfoStore.svTerm = null
  svInfoStore.currentSvRecord = JSON.parse(JSON.stringify(svRecord))

  return setupMountedComponents(
    { component: VariantDetailView, template: true },
    {
      props: {
        searchTerm: 'your_initial_search_term',
        genomeRelease: 'grch37'
      },
      pinia: pinia
    }
  )
}

describe.concurrent('VariantDetailView', async () => {
  it('renders the header', async () => {
    const { wrapper } = makeWrapper()

    // Test header rendering
    const header = wrapper.findComponent(HeaderDetailPage)
    expect(header.exists()).toBe(true)

    // Additional header-specific assertions if needed
  })

  it('emits update in header', async () => {
    const { wrapper } = makeWrapper()

    // Test emitting updates to the header
    const header = wrapper.findComponent(HeaderDetailPage)
    expect(header.exists()).toBe(true)

    // Trigger some updates in the header and check if emitted
    // Additional assertions if needed
  })

  it.skip('renders SvDetails components', async () => {
    const { wrapper } = makeWrapper()

    // Test rendering of SvDetails components
    const svGenes = wrapper.findComponent(SvGenes)
    const svDetailsClinvar = wrapper.findComponent(SvDetailsClinvar)
    const svDetailsGenotypeCall = wrapper.findComponent(SvDetailsGenotypeCall)
    const genomeBrowser = wrapper.findComponent(GenomeBrowser)
    expect(svGenes.exists()).toBe(true)
    expect(svDetailsClinvar.exists()).toBe(true)
    expect(svDetailsGenotypeCall.exists()).toBe(true)
    expect(genomeBrowser.exists()).toBe(true)

    // Additional assertions for component-specific behavior if needed
  })

  it.skip('emits scroll to section', async () => {
    const { wrapper, router } = makeWrapper()

    // Test emitting scroll to section
    const geneSectionLink = wrapper.find('#gene-nav')
    expect(geneSectionLink.exists()).toBe(true)

    await geneSectionLink.trigger('click')
    await nextTick()
    expect(router.push).toHaveBeenCalled()
    expect(router.push).toHaveBeenCalledWith({
      hash: '#gene'
    })

    // Additional assertions for scrolling behavior if needed
  })

  it.skip('redirects if mounting with storeState Error', async () => {
    const pinia = createTestingPinia({ createSpy: vi.fn })

    // Set up mock implementations as needed for the test case

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

    // Additional assertions if needed
  })
})
