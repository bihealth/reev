import { StoreState } from '@bihealth/reev-frontend-lib/stores'
import { flushPromises } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'

import * as BRCA1GeneInfo from '@/assets/__tests__/BRCA1GeneInfo.json'
import * as CurrentSV from '@/assets/__tests__/ExampleSV.json'
import { setupMountedComponents } from '@/lib/testUtils'
import StrucvarDetailsView from '@/views/StrucvarDetailsView.vue'

const makeWrapper = (strucvarDetailsStoreState: StoreState) => {
  const mockLoadData = vi.fn().mockImplementation(async () => {})

  return setupMountedComponents(
    {
      component: StrucvarDetailsView,
      shallow: true,
      stubs: {
        StrucvarDetailsView: false,
        VAlert: false,
        VProgressLinear: false
      }
    },
    {
      initialStoreState: {
        strucvarInfo: {
          storeState: strucvarDetailsStoreState,
          strucvar: undefined,
          csq: JSON.parse(JSON.stringify(CurrentSV)).result,
          genesInfos: JSON.parse(JSON.stringify([BRCA1GeneInfo['genes']['HGNC:1100']])),
          loadData: mockLoadData
        }
      },
      props: {
        strucvarDesc: 'DEL-grch37-17-41176312-41277500'
      }
    }
  )
}

describe.concurrent('StrucvarDetailsView', async () => {
  it('renders the header', async () => {
    // arrange:
    const { wrapper } = await makeWrapper(StoreState.Active)

    // act: nothing, only test rendering

    // assert:
    const header = wrapper.findComponent({ name: 'PageHeader' })
    expect(header.exists()).toBe(true)
  })

  it('renders the loading state', async () => {
    // arrange:
    const { wrapper } = await makeWrapper(StoreState.Loading)

    // act: nothing, just wait for next tick
    await nextTick()

    // assert:
    expect(wrapper.html()).toContain(
      '<gene-list-card-stub csq="[object Object],[object Object],[object Object],[object Object]" genes-infos="[object Object]" store-state="loading"></gene-list-card-stub>'
    )
  })

  it('renders SvDetails info-cards', async () => {
    // arrange:
    const { wrapper } = await makeWrapper(StoreState.Active)

    // act: nothing, just wait for flushPromises
    await flushPromises()

    // assert:
    expect(wrapper.html()).toContain(
      '<bookmark-list-item-stub type="strucvar"></bookmark-list-item-stub>'
    )
    expect(wrapper.html()).toContain('<gene-list-card-stub csq="[object Object],[object Object],')
    expect(wrapper.html()).toContain(
      '<strucvar-clinvar-card-stub strucvar="[object Object]"></strucvar-clinvar-card-stub>'
    )
    expect(wrapper.html()).toContain(
      '<variant-tools-card-stub strucvar="[object Object]"></variant-tools-card-stub>'
    )
    expect(wrapper.html()).toContain(
      '<clinsig-card-stub strucvar="[object Object]"></clinsig-card-stub>'
    )
    expect(wrapper.html()).toContain('<clinvarsub-card-stub></clinvarsub-card-stub>')
    expect(wrapper.html()).toContain(
      '<genome-browser-stub genome-build="grch37" locus="17:41175312-41278500"></genome-browser-stub>'
    )
  })
})
