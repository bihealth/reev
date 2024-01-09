import { describe, expect, it } from 'vitest'

import CaseCard from '@/components/Profile/CaseCard.vue'
import { setupMountedComponents } from '@/lib/testUtils'
import { StoreState } from '@/stores/misc'

describe.concurrent('CaseCard', async () => {
  it('renders the CaseCard information.', async () => {
    const { wrapper } = await setupMountedComponents(
      { component: CaseCard },
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

    const vForm = wrapper.findComponent({ name: 'VForm' })
    expect(vForm.exists()).toBe(true)
  })

  it('renders the CaseCard while loading', async () => {
    const { wrapper } = await setupMountedComponents(
      { component: CaseCard },
      {
        initialStoreState: {
          case: {
            storeState: StoreState.Loading
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

    const vProgressCircular = wrapper.findComponent({ name: 'VProgressCircular' })
    expect(vProgressCircular.exists()).toBe(true)
  })

  it('renders the CaseCard with error State.', async () => {
    const { wrapper } = await setupMountedComponents(
      { component: CaseCard },
      {
        initialStoreState: {
          case: {
            storeState: StoreState.Error
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

    expect(wrapper.text()).not.toContain('Case Information')
    expect(wrapper.text()).toContain('Error loading data')
  })
})
