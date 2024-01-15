import { describe, expect, it } from 'vitest'

import * as CurrentSV from '@/assets/__tests__/ExampleSV.json'
import CnLoss from '@/components/StrucvarDetails/ClinsigCard/CnLoss.vue'
import { setupMountedComponents } from '@/lib/testUtils'

describe.concurrent('CnLoss', async () => {
  it('renders the CnLoss info', async () => {
    // arrange:
    const { wrapper } = await setupMountedComponents(
      { component: CnLoss },
      {
        props: {
          showConflictingSections: false
        },
        initialStoreState: {
          svAcmgRating: {
            svRecord: JSON.parse(JSON.stringify(CurrentSV))
          }
        }
      }
    )

    // act: nothing, only test rendering

    // assert:
    const table = wrapper.findComponent({ name: 'VTable' })
    expect(table.exists()).toBe(true)
    expect(wrapper.text()).toContain('Evidence')
    expect(wrapper.text()).toContain('Description')
    expect(wrapper.text()).toContain('Suggested points')
    expect(wrapper.text()).toContain('Max score')
  })
})
