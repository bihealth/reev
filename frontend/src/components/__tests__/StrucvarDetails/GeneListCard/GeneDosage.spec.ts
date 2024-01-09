import { describe, expect, it } from 'vitest'

import GeneDosage from '@/components/StrucvarDetails/GeneListCard/GeneDosage.vue'
import { setupMountedComponents } from '@/lib/testUtils'

describe.concurrent('GeneDosage', async () => {
  it('renders the GeneDosage info with CLINGEN_DOSAGE_SCORE_RECESSIVE', async () => {
    const { wrapper } = await setupMountedComponents(
      { component: GeneDosage },
      {
        props: {
          geneSymbol: 'BRCA1',
          dosage: 'CLINGEN_DOSAGE_SCORE_RECESSIVE'
        }
      }
    )

    expect(wrapper.text()).toContain('AR')
    const launchButton = wrapper.findComponent({ name: 'VIcon' })
    expect(launchButton.exists()).toBe(true)
  })

  it('renders the GeneDosage info with CLINGEN_DOSAGE_SCORE_UNKNOWN', async () => {
    const { wrapper } = await setupMountedComponents(
      { component: GeneDosage },
      {
        props: {
          geneSymbol: 'BRCA1',
          dosage: 'CLINGEN_DOSAGE_SCORE_UNKNOWN'
        }
      }
    )

    expect(wrapper.text()).toContain('N/A')
  })

  it('renders the GeneDosage info with CLINGEN_DOSAGE_SCORE_SUFFICIENT_EVIDENCE_AVAILABLE', async () => {
    const { wrapper } = await setupMountedComponents(
      { component: GeneDosage },
      {
        props: {
          geneSymbol: 'BRCA1',
          dosage: 'CLINGEN_DOSAGE_SCORE_SUFFICIENT_EVIDENCE_AVAILABLE'
        }
      }
    )

    expect(wrapper.text()).toContain('3')
    const launchButton = wrapper.findComponent({ name: 'VIcon' })
    expect(launchButton.exists()).toBe(true)
  })
})
