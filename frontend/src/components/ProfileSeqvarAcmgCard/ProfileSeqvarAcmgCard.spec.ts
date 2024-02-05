import { setupMountedComponents } from '@bihealth/reev-frontend-lib/lib/testUtils'
import { StoreState } from '@bihealth/reev-frontend-lib/stores'
import { describe, expect, it, vi } from 'vitest'

import ProfileSeqvarAcmgCard from './ProfileSeqvarAcmgCard.vue'

describe.concurrent('ProfileSeqvarAcmgCard', async () => {
  it('renders the SeqVarACMGCard information with ACMG ratings.', async () => {
    const mockListAcmgRatings = vi.fn().mockImplementation(() => {})
    const { wrapper } = await setupMountedComponents(
      { component: ProfileSeqvarAcmgCard },
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

  it('renders the ProfileSeqvarAcmgCard information with no ACMG ratings.', async () => {
    const mockListAcmgRatings = vi.fn().mockImplementation(() => {})
    const { wrapper } = await setupMountedComponents(
      { component: ProfileSeqvarAcmgCard },
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
