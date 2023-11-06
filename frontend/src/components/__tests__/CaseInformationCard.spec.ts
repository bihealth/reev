import { describe, expect, it } from 'vitest'

import { setupMountedComponents } from '@/lib/test-utils'
import { StoreState } from '@/stores/misc'

import CaseInformationCard from '../CaseInformationCard.vue'

describe.concurrent('CaseInformationCard.vue', () => {
  it('renders information', async () => {
    const { wrapper } = await setupMountedComponents(
      { component: CaseInformationCard, template: false },
      {
        initialStoreState: {
          case: {
            storeState: StoreState.Active
          }
        }
      }
    )
    expect(wrapper.text()).toContain('Case Information')
  })
})
