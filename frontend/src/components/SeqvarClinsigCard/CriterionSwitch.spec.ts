import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'

import { AcmgCriteria, MultiSourceAcmgCriteriaState, Presence, StateSource } from '@/lib/acmgSeqvar'
import { setupMountedComponents } from '@/lib/testUtils'

import CriterionSwitch from './CriterionSwitch.vue'

describe.concurrent('CriterionSwitch.vue', async () => {
  it('renders the AcmgRating info', async () => {
    // arrange:
    const acmgRating = new MultiSourceAcmgCriteriaState()
    acmgRating.setPresence(StateSource.InterVar, AcmgCriteria.PVS1, Presence.Present)
    const criteria = AcmgCriteria.PVS1
    const criteriaState = acmgRating.getCriteriaState(criteria)

    const { wrapper } = await setupMountedComponents(
      { component: CriterionSwitch },
      {
        props: {
          acmgRating: acmgRating,
          criteria: criteria,
          criteriaState: criteriaState
        }
      }
    )

    // act: nothing, only test rendering

    // assert:
    expect(wrapper.text()).toContain('Pathogenic')
    expect(wrapper.text()).toContain('PVS1')

    const switcher = wrapper.find('.v-switch')
    expect(switcher.text()).toContain('PVS1')

    const selection = wrapper.find('.v-select')
    expect(selection.text()).toContain('Pathogenic')
  })

  it('should correctly update the ClinsigCard info', async () => {
    // arrange:
    const acmgRating = new MultiSourceAcmgCriteriaState()
    acmgRating.setPresence(StateSource.InterVar, AcmgCriteria.PVS1, Presence.Present)
    const criteria = AcmgCriteria.PVS1
    const criteriaState = acmgRating.getCriteriaState(criteria)

    const { wrapper } = await setupMountedComponents(
      { component: CriterionSwitch },
      {
        props: {
          acmgRating: acmgRating,
          criteria: criteria,
          criteriaState: criteriaState
        }
      }
    )

    // act:
    const switchComponent = wrapper.findComponent({ name: 'VSwitch' })
    // expect(switchComponent.props('value')).toBe(undefined)
    expect(switchComponent.exists()).toBe(true)
    await switchComponent.trigger('click')
    await nextTick()

    // assert:
    expect(switchComponent.emitted()).toHaveProperty('click')
    expect(switchComponent.emitted('click')).toHaveProperty('length', 1)

    // act2:
    const selection = wrapper.find('.v-select')
    await selection.trigger('click')
    await nextTick()

    // assert2:
    expect(wrapper.emitted()).toHaveProperty('click')
  })
})
