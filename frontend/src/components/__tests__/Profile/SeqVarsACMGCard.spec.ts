import { describe, expect, it, vi } from 'vitest'

import SeqVarACMGCard from '@/components/Profile/SeqVarsACMGCard.vue'
import { setupMountedComponents } from '@/lib/testUtils'
import { StoreState } from '@/stores/misc'

describe.concurrent('SeqVarACMGCard', async () => {
  it('renders the SeqVarACMGCard information with ACMG ratings.', async () => {
    const mockListAcmgRatings = vi.fn().mockImplementation(() => {})
    const { wrapper } = await setupMountedComponents(
      { component: SeqVarACMGCard },
      {
        initialStoreState: {
          seqvarAcmgRating: {
            storeState: StoreState.Active,
            acmgRatings: [],
            listAcmgRatings: mockListAcmgRatings
          }
        }
      }
    )

    expect(wrapper.text()).toContain('ACMG Sequence Variant Interpretation')
  })

  it('renders the SeqVarACMGCard information with no ACMG ratings.', async () => {
    const mockListAcmgRatings = vi.fn().mockImplementation(() => {})
    const { wrapper } = await setupMountedComponents(
      { component: SeqVarACMGCard },
      {
        initialStoreState: {
          seqvarAcmgRating: {
            storeState: StoreState.Active,
            acmgRatings: [],
            listAcmgRatings: mockListAcmgRatings
          }
        }
      }
    )

    expect(wrapper.text()).toContain('No ACMG ratings available.')
  })
})
