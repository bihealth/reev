import { describe, expect, it } from 'vitest'

import GeneDosage from '@/components/StrucvarDetails/GeneListCard/GeneDosage.vue'
import { setupMountedComponents } from '@/lib/testUtils'

describe.concurrent('GeneDosage', async () => {
  it('renders the GeneDosage info with CLINGEN_DOSAGE_SCORE_RECESSIVE', async () => {
    // arrange:
    const { wrapper } = await setupMountedComponents(
      { component: GeneDosage },
      {
        props: {
          geneSymbol: 'BRCA1',
          dosage: 'CLINGEN_DOSAGE_SCORE_RECESSIVE'
        }
      }
    )

    // act: nothing, only test rendering

    // assert:
    expect(wrapper.text()).toContain('AR')
    const launchButton = wrapper.findComponent({ name: 'VIcon' })
    expect(launchButton.exists()).toBe(true)
  })

  it('renders the GeneDosage info with CLINGEN_DOSAGE_SCORE_UNKNOWN', async () => {
    // arrange:
    const { wrapper } = await setupMountedComponents(
      { component: GeneDosage },
      {
        props: {
          geneSymbol: 'BRCA1',
          dosage: 'CLINGEN_DOSAGE_SCORE_UNKNOWN'
        }
      }
    )

    // act: nothing, only test rendering

    // assert:
    expect(wrapper.text()).toContain('N/A')
  })

  it('renders the GeneDosage info with CLINGEN_DOSAGE_SCORE_SUFFICIENT_EVIDENCE_AVAILABLE', async () => {
    // arrange:
    const { wrapper } = await setupMountedComponents(
      { component: GeneDosage },
      {
        props: {
          geneSymbol: 'BRCA1',
          dosage: 'CLINGEN_DOSAGE_SCORE_SUFFICIENT_EVIDENCE_AVAILABLE'
        }
      }
    )

    // act: nothing, only test rendering

    // assert:
    expect(wrapper.text()).toContain('3')
    const launchButton = wrapper.findComponent({ name: 'VIcon' })
    expect(launchButton.exists()).toBe(true)
  })
})
