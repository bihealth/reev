import { describe, expect, it } from 'vitest'

import CriterionSwitch from '@/components/SeqvarDetails/ClinsigCard/CriterionSwitch.vue'
import {
  AcmgCriteria,
  AcmgEvidenceLevel,
  MultiSourceAcmgCriteriaState,
  Presence,
  StateSource
} from '@/lib/acmgSeqVar'
import { setupMountedComponents } from '@/lib/test-utils'

describe.concurrent('CriterionSwitch', async () => {
  it('renders the CriterionSwitch', async () => {
    const acmgRating = new MultiSourceAcmgCriteriaState()
    acmgRating.setPresence(StateSource.User, AcmgCriteria.PM1, Presence.Present)
    const { wrapper } = await setupMountedComponents(
      { component: CriterionSwitch, template: false },
      {
        props: {
          acmgRating: acmgRating,
          criteria: AcmgCriteria.PM1,
          criteriaState: {
            criteria: AcmgCriteria.PM1,
            presence: Presence.Present,
            evidenceLevel: AcmgEvidenceLevel.PathogenicModerate
          }
        }
      }
    )

    expect(wrapper.text()).contains('PM1')
    expect(wrapper.text()).contains('Pathogenic Moderate')
    const vSwitch = wrapper.findComponent({ name: 'VSwitch' })
    const vTooltip = wrapper.findComponent({ name: 'VTooltip' })
    const vSelect = wrapper.findComponent({ name: 'VSelect' })
    expect(vSwitch.exists()).toBe(true)
    expect(vTooltip.exists()).toBe(true)
    expect(vSelect.exists()).toBe(true)
  })
})
