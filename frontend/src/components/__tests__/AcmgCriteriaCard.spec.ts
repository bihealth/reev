import { describe, expect, it } from 'vitest'

import AcmgCriteriaCard from '@/components/AcmgCriteriaCard.vue'
import { AcmgCriteria, MultiSourceAcmgCriteriaState, Presence, StateSource } from '@/lib/acmgSeqVar'
import { setupMountedComponents } from '@/lib/test-utils'

describe.concurrent('AcmgCriteriaCard', async () => {
  it('renders the AcmgRating info', async () => {
    const acmgRating = new MultiSourceAcmgCriteriaState()
    acmgRating.setPresence(StateSource.InterVar, AcmgCriteria.Pvs1, Presence.Present)
    const criteria = AcmgCriteria.Pvs1
    const criteriaState = acmgRating.getCriteriaState(criteria)

    const { wrapper } = setupMountedComponents(
      { component: AcmgCriteriaCard, template: false },
      {
        props: {
          acmgRating: acmgRating,
          criteria: criteria,
          criteriaState: criteriaState
        }
      }
    )
    expect(wrapper.text()).toContain('Pathogenic')
    expect(wrapper.text()).toContain('Pvs1')

    const switcher = wrapper.find('.v-switch')
    expect(switcher.text()).toContain('Pvs1')

    const selection = wrapper.find('.v-select')
    expect(selection.text()).toContain('Pathogenic')
  })

  it('should correctly update the AcmgCriteriaCard info', async () => {
    const acmgRating = new MultiSourceAcmgCriteriaState()
    acmgRating.setPresence(StateSource.InterVar, AcmgCriteria.Pvs1, Presence.Present)
    const criteria = AcmgCriteria.Pvs1
    const criteriaState = acmgRating.getCriteriaState(criteria)

    const { wrapper } = setupMountedComponents(
      { component: AcmgCriteriaCard, template: false },
      {
        props: {
          acmgRating: acmgRating,
          criteria: criteria,
          criteriaState: criteriaState
        }
      }
    )
    const switcher = wrapper.find('.v-switch')
    await switcher.trigger('click')

    const selection = wrapper.find('.v-select')
    await selection.trigger('click')
  })
})
