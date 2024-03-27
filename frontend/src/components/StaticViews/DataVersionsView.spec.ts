import { setupMountedComponents } from '@bihealth/reev-frontend-lib/lib/testUtils'
import { describe, expect, it, vi } from 'vitest'

import { StoreState } from '@/stores'

import DataVersionsView from './DataVersionsView.vue'

describe.concurrent('DataVersionsView', async () => {
  it('renders the main content', async () => {
    // arrange:
    const mockInitialize = vi.fn().mockImplementation(async () => {})
    const { wrapper } = await setupMountedComponents(
      { component: DataVersionsView },
      {
        initialStoreState: {
          misc: {
            storeState: StoreState.Active,
            appVersion: 'v0.0.0',
            dataVersions: {
              alphamissense: '2021-01-01',
              clingen_gene: '2021-01-01'
            },
            initialize: mockInitialize
          }
        }
      }
    )

    // act: nothing, only test rendering

    // assert:
    console.log(wrapper.html())
  })
})
