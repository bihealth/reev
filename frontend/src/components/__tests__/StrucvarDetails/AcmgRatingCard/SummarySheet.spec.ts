import { describe, expect, it } from 'vitest'

import SummarySheet from '@/components/StrucvarDetails/ClinsigCard/SummarySheet.vue'
import { setupMountedComponents } from '@/lib/test-utils'

describe.concurrent('SummarySheet', async () => {
  it('renders the SummarySheet info', async () => {
    const { wrapper } = await setupMountedComponents(
      { component: SummarySheet, template: false },
      {
        props: {
          calculatedAcmgClass: 'Pathogenic',
          calculatedAcmgScore: 3
        }
      }
    )

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
