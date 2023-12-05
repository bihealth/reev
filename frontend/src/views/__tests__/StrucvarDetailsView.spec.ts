import { createTestingPinia } from '@pinia/testing'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'

import * as BRCA1GeneInfo from '@/assets/__tests__/BRCA1GeneInfo.json'
import * as CurrentSV from '@/assets/__tests__/ExampleSV.json'
import GenomeBrowser from '@/components/GenomeBrowser.vue'
import HeaderDetailPage from '@/components/HeaderDetailPage.vue'
import ClinsigCard from '@/components/StrucvarDetails/ClinsigCard.vue'
import SvDetailsClinvar from '@/components/StrucvarDetails/ClinvarCard.vue'
import SvGenes from '@/components/StrucvarDetails/GeneListCard.vue'
import VariantToolsCard from '@/components/StrucvarDetails/VariantToolsCard.vue'
import { setupMountedComponents } from '@/lib/test-utils'
import { StoreState } from '@/stores/misc'
import { useSvInfoStore } from '@/stores/svInfo'

import SeqvarDetailsView from '../SeqvarDetailsView.vue'

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
    { component: SeqvarDetailsView, template: true },
    {
      props: {
        searchTerm: 'DEL:chr17:41176312:41277500',
        genomeRelease: 'grch37'
      },
      pinia: pinia
    }
  )
}

describe.concurrent('SeqvarDetailsView', async () => {
  it('renders the header', async () => {
    const { wrapper } = await makeWrapper()

    const header = wrapper.findComponent(HeaderDetailPage)
    expect(header.exists()).toBe(true)
  })

  it('renders the loading state', async () => {
    const { wrapper } = await makeWrapper()

    const svInfoStore = useSvInfoStore()
    svInfoStore.storeState = StoreState.Loading
    await nextTick()
    const loading = wrapper.findComponent({ name: 'VProgressLinear' })
    expect(loading.exists()).toBe(true)
  })

  it.skip('renders SvDetails info', async () => {
    const { wrapper } = await makeWrapper()

    const svGenes = wrapper.findComponent(SvGenes)
    const svTools = wrapper.findComponent(VariantToolsCard)
    const svDetailsClinvar = wrapper.findComponent(SvDetailsClinvar)
    const acmgRating = wrapper.findComponent(ClinsigCard)
    const genomeBrowser = wrapper.findComponent(GenomeBrowser)
    expect(svGenes.exists()).toBe(true)
    expect(svTools.exists()).toBe(true)
    expect(svDetailsClinvar.exists()).toBe(true)
    expect(acmgRating.exists()).toBe(true)
    expect(genomeBrowser.exists()).toBe(true)
  })
})
