import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import AcmgCriteriaCard from '@/components/AcmgCriteriaCard.vue'
import { AcmgCriteria, MultiSourceAcmgCriteriaState, Presence, StateSource } from '@/lib/acmgSeqVar'
import { routes } from '@/router'

const vuetify = createVuetify({
  components,
  directives
})

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes
})
// Mock router push
router.push = vi.fn()

const makeWrapper = () => {
  const acmgRating = new MultiSourceAcmgCriteriaState()
  acmgRating.setPresence(StateSource.InterVar, AcmgCriteria.Pvs1, Presence.Present)
  const criteria = AcmgCriteria.Pvs1
  const criteriaState = acmgRating.getCriteriaState(criteria)

  return mount(AcmgCriteriaCard, {
    props: {
      acmgRating: acmgRating,
      criteria: criteria,
      criteriaState: criteriaState
    },
    global: {
      plugins: [vuetify, router],
      components: {
        AcmgCriteriaCard
      }
    }
  })
}

describe.concurrent('AcmgCriteriaCard', async () => {
  it('renders the AcmgRating info', async () => {
    const wrapper = makeWrapper()
    expect(wrapper.text()).toContain('Pathogenic')
    expect(wrapper.text()).toContain('Pvs1')

    const switcher = wrapper.find('.v-switch')
    expect(switcher.text()).toContain('Pvs1')

    const selection = wrapper.find('.v-select')
    expect(selection.text()).toContain('Pathogenic')
  })

  it('should correctly update the AcmgCriteriaCard info', async () => {
    const wrapper = makeWrapper()
    const switcher = wrapper.find('.v-switch')
    await switcher.trigger('click')

    const selection = wrapper.find('.v-select')
    await selection.trigger('click')
  })
})
