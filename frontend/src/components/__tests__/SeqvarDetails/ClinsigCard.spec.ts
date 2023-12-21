import { createTestingPinia } from '@pinia/testing'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'

import ClinsigCard from '@/components/SeqvarDetails/ClinsigCard.vue'
import SummarySheet from '@/components/SeqvarDetails/ClinsigCard/SummarySheet.vue'
import { AcmgCriteria, MultiSourceAcmgCriteriaState, Presence, StateSource } from '@/lib/acmgSeqVar'
import type { Seqvar } from '@/lib/genomicVars'
import { setupMountedComponents } from '@/lib/test-utils'
import { deepCopy } from '@/lib/utils'
import { StoreState } from '@/stores/misc'
import { useSeqVarAcmgRatingStore } from '@/stores/seqVarAcmgRating'

const seqvarInfo: Seqvar = {
  genomeBuild: 'grch37',
  chrom: '17',
  pos: 43044295,
  del: 'G',
  ins: 'A',
  userRepr: 'grch37-17-43044295-G-A'
}

const makeWrapper = () => {
  const pinia = createTestingPinia({ createSpy: vi.fn })
  const store = useSeqVarAcmgRatingStore(pinia)

  const mockRetrieveAcmgRating = vi.fn().mockImplementation(async () => {
    store.storeState = StoreState.Active
    store.seqvar = deepCopy(seqvarInfo)
    store.acmgRating = new MultiSourceAcmgCriteriaState()
    store.acmgRating.setPresence(StateSource.InterVar, AcmgCriteria.PVS1, Presence.Present)
    store.acmgRatingStatus = true
  })
  store.fetchAcmgRating = mockRetrieveAcmgRating

  store.storeState = StoreState.Active
  store.seqvar = deepCopy(seqvarInfo)
  store.acmgRating = new MultiSourceAcmgCriteriaState()
  store.acmgRating.setPresence(StateSource.InterVar, AcmgCriteria.PVS1, Presence.Present)
  store.acmgRatingStatus = true

  return setupMountedComponents(
    {
      component: ClinsigCard,
      template: false
    },
    {
      props: {
        seqvar: seqvarInfo
      },
      pinia: pinia
    }
  )
}

describe.concurrent('AcmgRating', async () => {
  it('renders the AcmgRating info', async () => {
    const { wrapper } = await makeWrapper()
    expect(wrapper.text()).toContain('Semi-Automated')

    const summarySheet = wrapper.findComponent(SummarySheet)
    expect(summarySheet.exists()).toBe(true)
    const switchers = wrapper.findAllComponents({ name: 'CriterionSwitch' })
    expect(switchers.length).toBe(52)

    // click show failed button
    const btnShowFailed = wrapper.findAll('.show-failed')
    await btnShowFailed[0].trigger('click')
    await nextTick()
    // check again that more switches are displayed
    expect(wrapper.findAll('.v-switch').length).toBe(2)
  })

  it('should correctly update the AcmgRating info', async () => {
    const { wrapper } = await makeWrapper()

    const switchers = wrapper.findAll('.v-switch')
    const switcher = switchers[0]
    await switcher.trigger('click')
    await nextTick()
    expect(wrapper.emitted('click')).toBeTruthy()
  })
})
