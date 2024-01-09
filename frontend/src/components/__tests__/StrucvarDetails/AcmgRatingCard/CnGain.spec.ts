import { describe, expect, it } from 'vitest'

import * as CurrentSV from '@/assets/__tests__/ExampleSV.json'
import CnGain from '@/components/StrucvarDetails/ClinsigCard/CnGain.vue'
import { setupMountedComponents } from '@/lib/testUtils'

describe.concurrent('CnGain', async () => {
  it('renders the CnGain info', async () => {
    const { wrapper } = await setupMountedComponents(
      { component: CnGain },
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

    const table = wrapper.findComponent({ name: 'VTable' })
    expect(table.exists()).toBe(true)
    expect(wrapper.text()).toContain('Evidence')
    expect(wrapper.text()).toContain('Description')
    expect(wrapper.text()).toContain('Suggested points')
    expect(wrapper.text()).toContain('Max score')
  })
})
