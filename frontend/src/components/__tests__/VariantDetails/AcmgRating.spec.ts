import { createTestingPinia } from '@pinia/testing'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'

import AcmgRating from '@/components/VariantDetails/AcmgRating.vue'
import { AcmgCriteria, MultiSourceAcmgCriteriaState, Presence, StateSource } from '@/lib/acmgSeqVar'
import { setupMountedComponents } from '@/lib/test-utils'
import { StoreState } from '@/stores/misc'
import { useVariantAcmgRatingStore } from '@/stores/variantAcmgRating'

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
    store.smallVariant = JSON.parse(JSON.stringify(smallVariantInfo))
    store.acmgRating = new MultiSourceAcmgCriteriaState()
    store.acmgRating.setPresence(StateSource.InterVar, AcmgCriteria.Pvs1, Presence.Present)
    store.acmgRatingStatus = true
  })
  store.setAcmgRating = mockRetrieveAcmgRating

  store.storeState = StoreState.Active
  store.smallVariant = JSON.parse(JSON.stringify(smallVariantInfo))
  store.acmgRating = new MultiSourceAcmgCriteriaState()
  store.acmgRating.setPresence(StateSource.InterVar, AcmgCriteria.Pvs1, Presence.Present)
  store.acmgRatingStatus = true

  return setupMountedComponents(
    {
      component: AcmgRating,
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
    expect(wrapper.text()).toContain('Pathogenic')
    expect(wrapper.text()).toContain('Benign')

    const switchers = wrapper.findAll('.v-switch')
    expect(switchers.length).toBe(29)
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
