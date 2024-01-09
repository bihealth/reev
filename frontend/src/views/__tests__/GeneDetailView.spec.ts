import { beforeEach, describe, expect, it, vi } from 'vitest'
import createFetchMock from 'vitest-fetch-mock'
import { nextTick } from 'vue'

import * as BRCA1ClinVar from '@/assets/__tests__/BRCA1ClinVar.json'
import * as BRCA1geneInfo from '@/assets/__tests__/BRCA1GeneInfo.json'
import * as BRCA1Transcripts from '@/assets/__tests__/BRCA1Transcripts.json'
import { setupMountedComponents } from '@/lib/testUtils'
import { StoreState } from '@/stores/misc'
import GeneDetailView from '@/views/GeneDetailView.vue'

/** Local helper that performs store setup and selective stubbing. */
const makeWrapper = (geneInfoStoreState: StoreState) => {
  return setupMountedComponents(
    {
      component: GeneDetailView,
      shallow: true,
      stubs: {
        GeneDetailView: false,
        VAlert: false
      }
    },
    {
      initialStoreState: {
        geneInfo: {
          storeState: geneInfoStoreState,
          hgncId: 'HGNC:1100',
          geneInfo: structuredClone(BRCA1geneInfo).genes['HGNC:1100'],
          geneClinvar: structuredClone(BRCA1ClinVar).genes['HGNC:1100'],
          transcripts: structuredClone(BRCA1Transcripts)
        },
        pubtator: {
          storeState: StoreState.Active,
          hgncId: 'HGNC:1100'
        }
      },
      props: {
        hgncSymbol: 'BRCA1'
      }
    }
  )
}

describe.concurrent('GeneDetailView', async () => {
  const fetchMocker = createFetchMock(vi)

  beforeEach(() => {
    // Setup the fetchMocker to capture any `fetch()` requests.
    fetchMocker.enableMocks()
    fetchMocker.resetMocks()
  })

  it('looks up gene and renders stubbed components', async () => {
    // arrange:
    fetchMock.mockResponse((req) => {
      if (req.url === '/internal/proxy/annonars/genes/search?q=BRCA1') {
        return 'HGNC:1100'
      } else {
        return 'default mock response'
      }
    })

    const { wrapper } = await makeWrapper(StoreState.Active)

    // act: nothing, just wait for the next tick
    await nextTick()

    // assert:
    expect(wrapper.html()).toContain('<bookmark-list-item-stub id="HGNC:1100" type="gene">')
    expect(wrapper.html()).toContain(
      '<overview-card-stub gene-info="[object Object]" show-gene-details-link="false">'
    )
    expect(wrapper.html()).toContain('<pathogenicity-card-stub gene-info="[object Object]">')
    expect(wrapper.html()).toContain('<conditions-card-stub gene-info="[object Object]"')
    expect(wrapper.html()).toContain('<expression-card-stub gene-symbol="BRCA1"')
    expect(wrapper.html()).toContain(
      '<clinvar-card-stub gene-clinvar="[object Object]" transcripts="[object Object]" genome-build="grch37" gene-info="[object Object]"'
    )
    expect(wrapper.html()).toContain('<literature-card-stub gene-info="[object Object]">')

    expect(fetchMock).toHaveBeenCalledOnce()
  })
})
