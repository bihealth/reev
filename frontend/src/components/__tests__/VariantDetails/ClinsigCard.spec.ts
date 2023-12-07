import { createTestingPinia } from '@pinia/testing'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'

import ClinsigCard from '@/components/SeqvarDetails/ClinsigCard.vue'
import { AcmgCriteria, MultiSourceAcmgCriteriaState, Presence, StateSource } from '@/lib/acmgSeqVar'
import type { Seqvar } from '@/lib/genomicVars'
import { deepCopy, setupMountedComponents } from '@/lib/test-utils'
import { StoreState } from '@/stores/misc'
import { useVariantAcmgRatingStore } from '@/stores/variantAcmgRating'

const seqvarInfo: Seqvar = {
  genomeBuild: 'grch37',
  chrom: '17',
  pos: 43044295,
  del: 'G',
  ins: 'A',
  userRepr: 'grch37-17-43044295-G-A'
}

const smallVariantInfo = {
  release: 'grch37',
  chromosome: 'chr17',
  start: '43044295',
  end: '43044295',
  reference: 'G',
  alternative: 'A',
  hgnc_id: 'HGNC:1100'
}

const makeWrapper = () => {
  const pinia = createTestingPinia({ createSpy: vi.fn })
  const store = useVariantAcmgRatingStore(pinia)

  const mockRetrieveAcmgRating = vi.fn().mockImplementation(async () => {
    store.storeState = StoreState.Active
    store.seqvar = deepCopy(seqvarInfo)
    store.acmgRating = new MultiSourceAcmgCriteriaState()
    store.acmgRating.setPresence(StateSource.InterVar, AcmgCriteria.Pvs1, Presence.Present)
    store.acmgRatingStatus = true
  })
  store.fetchAcmgRating = mockRetrieveAcmgRating

  store.storeState = StoreState.Active
  store.seqvar = deepCopy(seqvarInfo)
  store.acmgRating = new MultiSourceAcmgCriteriaState()
  store.acmgRating.setPresence(StateSource.InterVar, AcmgCriteria.Pvs1, Presence.Present)
  store.acmgRatingStatus = true

  return setupMountedComponents(
    {
      component: ClinsigCard,
      template: true
    },
    {
      props: {
        smallVariant: smallVariantInfo
      },
      pinia: pinia
    }
  )
}

describe.concurrent('AcmgRating', async () => {
  it('renders the AcmgRating info', async () => {
    const { wrapper } = await makeWrapper()
    expect(wrapper.text()).toContain('Semi-Automated')

    const switchers = wrapper.findAll('.v-switch')
    expect(switchers.length).toBe(2)

    // click show failed button
    const btnShowFailed = wrapper.findAll('.show-failed')
    await btnShowFailed[0].trigger('click')
    await nextTick()
    // check again that more switches are displayed
    expect(wrapper.findAll('.v-switch').length).toBe(56)
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
