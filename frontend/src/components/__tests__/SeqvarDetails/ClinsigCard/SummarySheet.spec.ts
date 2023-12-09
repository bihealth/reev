import { describe, expect, it } from 'vitest'

import SummarySheet from '@/components/SeqvarDetails/ClinsigCard/SummarySheet.vue'
import { setupMountedComponents } from '@/lib/test-utils'

describe.concurrent('SummarySheet', async () => {
  it('renders the SummarySheet', async () => {
    const { wrapper } = await setupMountedComponents(
      { component: SummarySheet, template: false },
      {
        props: {
          calculatedAcmgClass: 'Pathogenic'
        }
      }
    )

    expect(wrapper.text()).contains('Semi-Automated ACMG Pathogenicity Prediction')
    expect(wrapper.text()).contains('Pathogenic')
  })
})
