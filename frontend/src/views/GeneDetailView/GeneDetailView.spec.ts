import { setupMountedComponents } from '@bihealth/reev-frontend-lib/lib/testUtils'
import { StoreState } from '@bihealth/reev-frontend-lib/stores'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import createFetchMock from 'vitest-fetch-mock'
import { h, nextTick } from 'vue'

import * as BRCA1ClinVar from '@/assets/__tests__/BRCA1ClinVar.json'
import * as BRCA1geneInfo from '@/assets/__tests__/BRCA1GeneInfo.json'
import * as BRCA1Transcripts from '@/assets/__tests__/BRCA1Transcripts.json'

import GeneDetailView from './GeneDetailView.vue'

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
      },
      routes: [
        {
          path: '/',
          name: 'home',
          component: h('div', { innerHTML: 'for testing' })
        },
        {
          path: '/login',
          name: 'login',
          component: h('div', { innerHTML: 'for testing' })
        }
      ]
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
      '<gene-overview-card-stub gene-info="[object Object]" show-gene-details-link="false"'
    )
    expect(wrapper.html()).toContain('<gene-pathogenicity-card-stub gene-info="[object Object]">')
    expect(wrapper.html()).toContain('<gene-conditions-card-stub gene-info="[object Object]"')
    expect(wrapper.html()).toContain('<gene-expression-card-stub gene-symbol="BRCA1"')
    expect(wrapper.html()).toContain(
      '<gene-clinvar-card-stub gene-clinvar="[object Object]" transcripts="[object Object]" genome-build="grch37" gene-info="[object Object]"'
    )
    expect(wrapper.html()).toContain('<gene-literature-card-stub gene-info="[object Object]">')

    expect(fetchMock).toHaveBeenCalledOnce()
  })
})
