import { describe, expect, it } from 'vitest'

import FooterDefault from '@/components/FooterDefault/FooterDefault.vue'
import { setupMountedComponents } from '@/lib/testUtils'

describe.concurrent('FooterDefault.vue', () => {
  it('renders information', async () => {
    // arrange:
    const { wrapper } = await setupMountedComponents(
      { component: FooterDefault },
      {
        initialStoreState: {
          misc: {
            appVersion: 'v0.0.0'
          }
        }
      }
    )

    // act: nothing, only test rendering

    // assert:
    const footer = wrapper.find('footer')
    expect(footer.exists()).toBe(true)
    expect(footer.text()).toContain('REEV Explains and Evaluates Variants')
  })
})
