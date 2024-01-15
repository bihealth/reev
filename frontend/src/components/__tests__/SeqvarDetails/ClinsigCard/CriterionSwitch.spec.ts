import { describe, expect, it } from 'vitest'

import CriterionSwitch from '@/components/SeqvarDetails/ClinsigCard/CriterionSwitch.vue'
import {
  AcmgCriteria,
  AcmgEvidenceLevel,
  MultiSourceAcmgCriteriaState,
  Presence,
  StateSource
} from '@/lib/acmgSeqvar'
import { setupMountedComponents } from '@/lib/testUtils'

describe.concurrent('CriterionSwitch', async () => {
  it('renders the CriterionSwitch', async () => {
    // arrange:
    const acmgRating = new MultiSourceAcmgCriteriaState()
    acmgRating.setPresence(StateSource.User, AcmgCriteria.PM1, Presence.Present)
    const { wrapper } = await setupMountedComponents(
      { component: CriterionSwitch },
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

    // act: nothing, only test rendering

    // assert:
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
