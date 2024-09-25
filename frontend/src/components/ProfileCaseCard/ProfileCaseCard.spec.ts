import { setupMountedComponents } from '@bihealth/reev-frontend-lib/lib/testUtils'
import { StoreState } from '@bihealth/reev-frontend-lib/stores'
import { describe, expect, it } from 'vitest'

import CaseCard from './ProfileCaseCard.vue'

describe.concurrent('CaseCard', async () => {
  it.skip('renders the CaseCard information.', async () => {
    // arrange:
    const { wrapper } = await setupMountedComponents(
      { component: CaseCard },
      {
        initialStoreState: {
          caseInfo: {
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
    const vForm = wrapper.findComponent({ name: 'VForm' })
    expect(vForm.exists()).toBe(true)
  })

  it('renders the CaseCard while loading', async () => {
    // arrange:
    const { wrapper } = await setupMountedComponents(
      { component: CaseCard },
      {
        initialStoreState: {
          caseInfo: {
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

    // act: nothing, only test rendering

    // assert:
    const vProgressCircular = wrapper.findComponent({ name: 'VProgressCircular' })
    expect(vProgressCircular.exists()).toBe(true)
  })

  it('renders the CaseCard with error State.', async () => {
    // arrange:
    const { wrapper } = await setupMountedComponents(
      { component: CaseCard },
      {
        initialStoreState: {
          caseInfo: {
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

    // act: nothing, only test rendering

    // assert:
    expect(wrapper.text()).not.toContain('Case Information')
    expect(wrapper.text()).toContain('Error loading data')
  })
})
