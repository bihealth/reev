import { describe, expect, it } from 'vitest'

import SummarySheet from '@/components/StrucvarDetails/ClinsigCard/SummarySheet.vue'
import { setupMountedComponents } from '@/lib/testUtils'

describe.concurrent('SummarySheet', async () => {
  it('renders the SummarySheet info', async () => {
    // arrange:
    const { wrapper } = await setupMountedComponents(
      { component: SummarySheet },
      {
        props: {
          calculatedAcmgClass: 'Pathogenic',
          calculatedAcmgScore: 3
        }
      }
    )

    // act: nothing, only test rendering

    // assert:
    expect(wrapper.text()).toContain('Semi-Automated ACMG Pathogenicity Prediction')
    const sheet = wrapper.findComponent({ name: 'VSheet' })
    expect(sheet.exists()).toBe(true)
    // Buttons
    const buttons = wrapper.findAllComponents({ name: 'VBtn' })
    expect(buttons.length).toBe(2)
    expect(buttons[0].text()).toContain('Reset to Auto')
    expect(buttons[1].text()).toContain('Documentation')
  })
})
