import { describe, expect, it } from 'vitest'

import * as BRCA1GeneInfo from '@/assets/__tests__/BRCA1GeneInfo.json'
import OverviewCard from '@/components/GeneDetails/OverviewCard.vue'
import { setupMountedComponents } from '@/lib/testUtils'

describe.concurrent('OverviewCard', async () => {
  it('renders the OverviewCard information.', async () => {
    // arrange:
    const { wrapper } = await setupMountedComponents(
      { component: OverviewCard },
      {
        props: {
          geneInfo: BRCA1GeneInfo['genes']['HGNC:1100']
        }
      }
    )

    // act: nothing, only test rendering

    // assert:
    expect(wrapper.text()).toContain('BRCA1')
    expect(wrapper.text()).toContain('This gene encodes a 190')
    expect(wrapper.text()).toContain('BRCA1 DNA repair')
  })

  it('expands the OverviewCard information.', async () => {
    // arrange:
    const { wrapper } = await setupMountedComponents(
      { component: OverviewCard },
      {
        props: {
          geneInfo: BRCA1GeneInfo['genes']['HGNC:1100']
        }
      }
    )

    // act:
    expect(wrapper.text()).not.toContain('Alternative Identifiers') // guard
    const expandButton = wrapper.find('#overview-card-expand-button')
    expect(expandButton.exists()).toBe(true)
    await expandButton.trigger('click')

    // assert:
    expect(wrapper.text()).toContain('Alternative Identifiers')
    expect(wrapper.text()).toContain('External Resources')
    expect(wrapper.text()).toContain('Locus-Specific Databases')
    expect(wrapper.text()).toContain('NCBI References Into Function')
  })
})
