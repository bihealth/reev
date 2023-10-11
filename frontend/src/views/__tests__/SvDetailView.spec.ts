import { createTestingPinia } from '@pinia/testing'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'

import * as BRCA1GeneInfo from '@/assets/__tests__/BRCA1GeneInfo.json'
import * as CurrentSV from '@/assets/__tests__/ExampleSV.json'
import GenomeBrowser from '@/components/GenomeBrowser.vue'
import HeaderDetailPage from '@/components/HeaderDetailPage.vue'
import AcmgRating from '@/components/SvDetails/AcmgRating.vue'
import SvDetailsClinvar from '@/components/SvDetails/SvDetailsClinvar.vue'
import SvDetailsGenotypeCall from '@/components/SvDetails/SvDetailsGenotypeCall.vue'
import SvGenes from '@/components/SvDetails/SvGenes.vue'
import { setupMountedComponents } from '@/lib/test-utils'
import { StoreState } from '@/stores/misc'
import { useSvInfoStore } from '@/stores/svInfo'

import VariantDetailView from '../VariantDetailView.vue'

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
    { component: VariantDetailView, template: true },
    {
      props: {
        searchTerm: 'DEL:chr17:41176312:41277500',
        genomeRelease: 'grch37'
      },
      pinia: pinia
    }
  )
}

describe.concurrent('VariantDetailView', async () => {
  it('renders the header', async () => {
    const { wrapper } = makeWrapper()

    const header = wrapper.findComponent(HeaderDetailPage)
    expect(header.exists()).toBe(true)
  })

  it('renders the loading state', async () => {
    const { wrapper } = makeWrapper()

    const svInfoStore = useSvInfoStore()
    svInfoStore.storeState = StoreState.Loading
    await nextTick()
    const loading = wrapper.findComponent({ name: 'VProgressLinear' })
    expect(loading.exists()).toBe(true)
  })

  it.skip('renders SvDetails info', async () => {
    const { wrapper } = makeWrapper()

    const svGenes = wrapper.findComponent(SvGenes)
    const svDetailsClinvar = wrapper.findComponent(SvDetailsClinvar)
    const svDetailsGenotypeCall = wrapper.findComponent(SvDetailsGenotypeCall)
    const acmgRating = wrapper.findComponent(AcmgRating)
    const genomeBrowser = wrapper.findComponent(GenomeBrowser)
    expect(svGenes.exists()).toBe(true)
    expect(svDetailsClinvar.exists()).toBe(true)
    expect(svDetailsGenotypeCall.exists()).toBe(true)
    expect(acmgRating.exists()).toBe(true)
    expect(genomeBrowser.exists()).toBe(true)
  })
})
