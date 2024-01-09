import { beforeEach, describe, expect, it, vi } from 'vitest'
import createFetchMock from 'vitest-fetch-mock'
import { nextTick } from 'vue'

import ClinsigCard from '@/components/SeqvarDetails/ClinsigCard.vue'
import CriterionSwitch from '@/components/SeqvarDetails/ClinsigCard/CriterionSwitch.vue'
import SummarySheet from '@/components/SeqvarDetails/ClinsigCard/SummarySheet.vue'
import { AcmgCriteria, MultiSourceAcmgCriteriaState, Presence, StateSource } from '@/lib/acmgSeqvar'
import type { Seqvar } from '@/lib/genomicVars'
import { setupMountedComponents } from '@/lib/testUtils'
import { StoreState } from '@/stores/misc'

const seqvarInfo: Seqvar = {
  genomeBuild: 'grch37',
  chrom: '17',
  pos: 43044295,
  del: 'G',
  ins: 'A',
  userRepr: 'grch37-17-43044295-G-A'
}

/** Wrapper around `setupMountedComponents` that perform store setup. */
const makeWrapper = async () => {
  const acmgRating = new MultiSourceAcmgCriteriaState()
  acmgRating.setPresence(StateSource.InterVar, AcmgCriteria.PVS1, Presence.Present)

  return await setupMountedComponents(
    {
      component: ClinsigCard
    },
    {
      initialStoreState: {
        seqvarAcmgRating: {
          storeState: StoreState.Active,
          seqvar: structuredClone(seqvarInfo),
          acmgRating,
          acmgRatingStatus: true
        }
      },
      props: {
        seqvar: seqvarInfo
      }
    }
  )
}

describe.concurrent('SeqvarDetails/ClinsigCard', async () => {
  const fetchMocker = createFetchMock(vi)

  beforeEach(() => {
    fetchMocker.enableMocks()
    fetchMocker.resetMocks()
  })

  it('renders the AcmgRating info', async () => {
    // arrange:
    const { wrapper } = await makeWrapper()
    expect(wrapper.text()).toContain('Semi-Automated') // guard

    // act:
    const summarySheet = wrapper.findComponent(SummarySheet)
    expect(summarySheet.exists()).toBe(true) // guard
    const switchers = wrapper.findAllComponents(CriterionSwitch)
    expect(switchers.length).toBe(52) // guard
    // click show failed button
    const btnShowFailed = wrapper.findComponent('.show-failed')
    await btnShowFailed.trigger('click')
    await nextTick()

    // assert:
    // check again that more switches are displayed
    expect(wrapper.findAll('.v-switch').length).toBe(2)
  })

  it('should correctly update the AcmgRating info', async () => {
    // arrange:
    const { wrapper } = await makeWrapper()

    // act:
    const switch$ = wrapper.findComponent('.v-switch')
    await switch$.trigger('click')
    await nextTick()

    // assert:
    expect(wrapper.emitted('click')).toBeTruthy()
  })
})
