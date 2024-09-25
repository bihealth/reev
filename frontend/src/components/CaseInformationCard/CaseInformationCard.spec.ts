import { setupMountedComponents } from '@bihealth/reev-frontend-lib/lib/testUtils'
import { StoreState } from '@bihealth/reev-frontend-lib/stores'
import { describe, expect, it } from 'vitest'

import CaseInformationCard from './CaseInformationCard.vue'

describe.concurrent('CaseInformationCard.vue', () => {
  it.skip('renders information', async () => {
    // arrange:
    const { wrapper } = await setupMountedComponents(
      { component: CaseInformationCard },
      {
        initialStoreState: {
          case: {
            storeState: StoreState.Active
          },
          terms: {
            storeState: StoreState.Active
          },
          cadaPrio: {
            storeState: StoreState.Active
          }
        }
      }
    )

    // act: nothing, only test rendering

    // assert:
    expect(wrapper.text()).toContain('Case Information')
  })
})
