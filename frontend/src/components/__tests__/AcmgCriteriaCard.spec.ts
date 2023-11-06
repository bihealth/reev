import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { VSwitch } from 'vuetify/components'

import { AcmgCriteria, MultiSourceAcmgCriteriaState, Presence, StateSource } from '@/lib/acmgSeqVar'
import { setupMountedComponents } from '@/lib/test-utils'

import AcmgCriteriaCard from '../AcmgCriteriaCard.vue'

describe.concurrent('AcmgCriteriaCard', async () => {
  it('renders the AcmgRating info', async () => {
    const acmgRating = new MultiSourceAcmgCriteriaState()
    acmgRating.setPresence(StateSource.InterVar, AcmgCriteria.Pvs1, Presence.Present)
    const criteria = AcmgCriteria.Pvs1
    const criteriaState = acmgRating.getCriteriaState(criteria)

    const { wrapper } = await setupMountedComponents(
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

    const { wrapper } = await setupMountedComponents(
      { component: AcmgCriteriaCard, template: false },
      {
        props: {
          acmgRating: acmgRating,
          criteria: criteria,
          criteriaState: criteriaState
        }
      }
    )

    const switchComponent = wrapper.findComponent(VSwitch)
    // expect(switchComponent.props('value')).toBe(undefined)
    expect(switchComponent.exists()).toBe(true)
    await switchComponent.trigger('click')
    await nextTick()
    expect(switchComponent.emitted()).toHaveProperty('click')
    expect(switchComponent.emitted('click')).toHaveProperty('length', 1)

    const selection = wrapper.find('.v-select')
    await selection.trigger('click')
    await nextTick()
    expect(wrapper.emitted()).toHaveProperty('click')
  })
})
