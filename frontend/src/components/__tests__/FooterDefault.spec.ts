import { describe, expect, it } from 'vitest'

import FooterDefault from '@/components/FooterDefault.vue'
import { setupMountedComponents } from '@/lib/test-utils'

describe.concurrent('FooterDefault.vue', () => {
  it('renders information', () => {
    const { wrapper } = setupMountedComponents(
      { component: FooterDefault, template: true },
      {
        initialStoreState: {
          misc: {
            appVersion: 'v0.0.0'
          }
        }
      }
    )
    const footer = wrapper.find('footer')
    expect(footer.exists()).toBe(true)
    expect(footer.text()).toContain('REEV: Explanation and Evaluation of Variants')
    expect(footer.text()).toContain('v0.0.0')
  })
})
