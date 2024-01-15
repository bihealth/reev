import { describe, expect, it } from 'vitest'

import SummarySheet from '@/components/SeqvarDetails/ClinsigCard/SummarySheet.vue'
import { setupMountedComponents } from '@/lib/testUtils'

describe.concurrent('SummarySheet', async () => {
  it('renders the SummarySheet', async () => {
    // arrange:
    const { wrapper } = await setupMountedComponents(
      { component: SummarySheet },
      {
        props: {
          calculatedAcmgClass: 'Pathogenic'
        }
      }
    )

    // act: nothing, only test rendering

    // assert:
    expect(wrapper.text()).contains('Semi-Automated ACMG Pathogenicity Prediction')
    expect(wrapper.text()).contains('Pathogenic')
  })
})
