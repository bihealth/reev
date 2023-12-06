import { describe, expect, it } from 'vitest'

import CaseCard from '@/components/Profile/CaseCard.vue'
import { setupMountedComponents } from '@/lib/test-utils'
import { StoreState } from '@/stores/misc'

describe.concurrent('CaseCard', async () => {
  it('renders the CaseCard information.', async () => {
    const { wrapper } = await setupMountedComponents(
      { component: CaseCard, template: false },
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

    expect(wrapper.text()).toContain('Case Information')
  })
})
