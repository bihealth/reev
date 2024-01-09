import { createTestingPinia } from '@pinia/testing'
import { describe, expect, it, vi } from 'vitest'

import SeqVarACMGCard from '@/components/Profile/SeqVarsACMGCard.vue'
import { setupMountedComponents } from '@/lib/testUtils'
import { StoreState } from '@/stores/misc'
import { useSeqVarAcmgRatingStore } from '@/stores/seqvarAcmgRating'

// Example ACMG Rating data
const exampleAcmgRating = {
  user: 'user-id',
  seqvar_name: 'chr17:41197728:G:T',
  acmg_rank: {
    criterias: [
      // Include only the criterias with "Presence: 'Present'" as per your component logic
      { criteria: 'Pm2', presence: 'Present', evidence: 'Pathogenic Moderate' },
      { criteria: 'Pp3', presence: 'Present', evidence: 'Pathogenic Supporting' }
    ]
  },
  id: 'rating-id'
}

describe.concurrent('SeqVarACMGCard', async () => {
  it('renders the SeqVarACMGCard information with ACMG ratings.', async () => {
    const pinia = createTestingPinia({ createSpy: vi.fn })
    const acmgRatingStore = useSeqVarAcmgRatingStore(pinia)
    const mockListAcmgRatings = vi.fn().mockImplementation(() => {
      acmgRatingStore.acmgRatings = [exampleAcmgRating]
    })
    acmgRatingStore.listAcmgRatings = mockListAcmgRatings
    const { wrapper } = await setupMountedComponents(
      { component: SeqVarACMGCard },
      {
        initialStoreState: {
          seqVarAcmgRating: {
            storeState: StoreState.Active,
            acmgRatings: []
          }
        },
        pinia: pinia
      }
    )

    expect(wrapper.text()).toContain('ACMG Sequence Variant Interpretation')
  })

  it('renders the SeqVarACMGCard information with no ACMG ratings.', async () => {
    const pinia = createTestingPinia({ createSpy: vi.fn })
    const acmgRatingStore = useSeqVarAcmgRatingStore(pinia)
    const mockListAcmgRatings = vi.fn().mockImplementation(() => {
      acmgRatingStore.acmgRatings = []
    })
    acmgRatingStore.listAcmgRatings = mockListAcmgRatings
    const { wrapper } = await setupMountedComponents(
      { component: SeqVarACMGCard },
      {
        initialStoreState: {
          seqVarAcmgRating: {
            storeState: StoreState.Active,
            acmgRatings: []
          }
        },
        pinia: pinia
      }
    )

    expect(wrapper.text()).toContain('No ACMG ratings available.')
  })
})
