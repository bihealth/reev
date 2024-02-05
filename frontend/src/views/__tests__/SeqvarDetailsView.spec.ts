import { type Seqvar } from '@bihealth/reev-frontend-lib/lib/genomicVars'
import { setupMountedComponents } from '@bihealth/reev-frontend-lib/lib/testUtils'
import { StoreState } from '@bihealth/reev-frontend-lib/stores'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'

import * as BRCA1ClinVar from '@/assets/__tests__/BRCA1ClinVar.json'
import * as BRCA1GeneInfo from '@/assets/__tests__/BRCA1GeneInfo.json'
import * as BRCA1TxInfo from '@/assets/__tests__/BRCA1TxInfo.json'
import * as BRCA1VariantInfo from '@/assets/__tests__/BRCA1VariantInfo.json'
import { MultiSourceAcmgCriteriaState } from '@/lib/acmgSeqvar'
import SeqvarDetailsView from '@/views/SeqvarDetailsView.vue'

/** Example Sequence Variant */
const seqvarInfo: Seqvar = {
  genomeBuild: 'grch37',
  chrom: '17',
  pos: 43044295,
  del: 'G',
  ins: 'A',
  userRepr: 'grch37-17-43044295-G-A'
}

/** Example Sequence Variant record */
const seqvarData = {
  storeState: StoreState.Active,
  seqvar: seqvarInfo,
  varAnnos: JSON.parse(JSON.stringify(BRCA1VariantInfo)).result,
  geneClinvar: JSON.parse(JSON.stringify(BRCA1ClinVar)).genes['HGNC:1100'], //.variants[0].variants[0],
  geneInfo: JSON.parse(JSON.stringify(BRCA1GeneInfo)).genes['HGNC:1100'],
  txCsq: JSON.parse(JSON.stringify(BRCA1TxInfo)).result,
  loadDataRes: null
}

const makeWrapper = (seqvarDetailsStoreState: StoreState) => {
  const mockLoadData = vi.fn().mockImplementation(async () => {})
  const mockRetrieveAcmgRating = vi.fn().mockImplementation(async () => {})

  return setupMountedComponents(
    {
      component: SeqvarDetailsView,
      shallow: true,
      stubs: {
        SeqvarDetailsView: false,
        VAlert: false
      }
    },
    {
      initialStoreState: {
        seqvarInfo: {
          storeState: seqvarDetailsStoreState,
          seqvar: structuredClone(seqvarInfo),
          varAnnos: JSON.parse(JSON.stringify(seqvarData.varAnnos)),
          geneInfo: JSON.parse(JSON.stringify(seqvarData.geneInfo)),
          geneClinvar: JSON.parse(JSON.stringify(seqvarData.geneClinvar)),
          txCsq: JSON.parse(JSON.stringify(seqvarData.txCsq)),
          acmgRating: new MultiSourceAcmgCriteriaState(),
          loadData: mockLoadData
        },
        seqvarAcmgRating: {
          storeState: StoreState.Active,
          seqvar: structuredClone(seqvarInfo),
          acmgRating: new MultiSourceAcmgCriteriaState(),
          fetchAcmgRating: mockRetrieveAcmgRating
        }
      },
      props: {
        searchTerm: 'chr17:43044295:G:A',
        genomeRelease: 'grch37'
      }
    }
  )
}

describe.concurrent('SeqvarDetailsView', async () => {
  beforeEach(() => {
    // Disable Vue warn. This warning is caused by BookmarkListItem.vue due to
    // unproper mocking of the store and props passed to the component.
    const spy = vi.spyOn(console, 'warn')
    spy.mockImplementation(() => {})
    // Disable Vue error.
    const spy2 = vi.spyOn(console, 'error')
    spy2.mockImplementation(() => {})
  })

  it('renders the header', async () => {
    // arrange:
    const { wrapper } = await makeWrapper(StoreState.Active)

    // act: nothing, only test rendering

    // assert:
    const header = wrapper.findComponent({ name: 'PageHeader' })
    expect(header.exists()).toBe(true)
  }, 10000)

  it('renders seqvarDatails components', async () => {
    // arrange:
    const { wrapper } = await makeWrapper(StoreState.Active)

    // act: nothing, only test rendering

    // assert:
    expect(wrapper.html()).toContain(
      '<gene-overview-card-stub gene-info="[object Object]"></gene-overview-card-stub>'
    )
    expect(wrapper.html()).toContain(
      '<gene-pathogenicity-card-stub gene-info="[object Object]"></gene-pathogenicity-card-stub>'
    )
    expect(wrapper.html()).toContain(
      '<gene-conditions-card-stub gene-info="[object Object]" hpo-terms=""></gene-conditions-card-stub>'
    )
    expect(wrapper.html()).toContain(
      '<gene-expression-card-stub gene-symbol="BRCA1" expression-records="[object Object]'
    )
    expect(wrapper.html()).toContain('<literature-card-stub></literature-card-stub>')
    expect(wrapper.html()).toContain(
      '<clinsig-card-stub seqvar="[object Object]"></clinsig-card-stub>'
    )
    expect(wrapper.html()).toContain('<variant-details-tx-csq-stub tx-csq="[object Object],')
    expect(wrapper.html()).toContain(
      '<variant-details-clinvar-stub clinvar="[object Object]"></variant-details-clinvar-stub>'
    )
    expect(wrapper.html()).toContain(
      '<variant-scores-card-stub var-annos="[object Object]"></variant-scores-card-stub>'
    )
    expect(wrapper.html()).toContain(
      '<variant-details-freqs-stub seqvar="[object Object]" var-annos="[object Object]"></variant-details-freqs-stub>'
    )
    expect(wrapper.html()).toContain(
      '<variant-tools-card-stub seqvar="[object Object]" var-annos="[object Object]"></variant-tools-card-stub>'
    )
    expect(wrapper.html()).toContain(
      '<beacon-network-card-stub seqvar="[object Object]"></beacon-network-card-stub>'
    )
    expect(wrapper.html()).toContain(
      '<variant-validator-card-stub seqvar="[object Object]"></variant-validator-card-stub>'
    )
    expect(wrapper.html()).toContain(
      '<clinvarsub-card-stub seqvar="[object Object]"></clinvarsub-card-stub>'
    )
    expect(wrapper.html()).toContain('')
  })

  // Test is skipped because geneLink does not exist with shallow rendering.
  it.skip('emits scroll to section', async () => {
    // arrange:
    const { wrapper, router } = await makeWrapper(StoreState.Active)

    // act:
    const geneLink = wrapper.find('#seqvar-csq-nav')
    expect(geneLink.exists()).toBe(true) // guard

    await geneLink.trigger('click')
    await nextTick()

    // assert:
    expect(router.push).toHaveBeenCalled()
    expect(router.push).toHaveBeenCalledWith({
      hash: '#seqvar-csq'
    })

    // Check if hgnc triggered scrollIntoView()
    const hgncSection = wrapper.find('#seqvar-csq')
    expect(hgncSection.exists()).toBe(true)
    expect(hgncSection.element.scrollTop).toBe(0)
  })

  it('redirects if mounting with storeState Error', async () => {
    // arrange:
    const { wrapper } = await makeWrapper(StoreState.Error)

    // act: nothing, just wait for nextTick
    await nextTick()

    // assert:
    const errorMessage = wrapper.findComponent({ name: 'VAlert' })
    expect(errorMessage.exists()).toBe(true)
  })
})
