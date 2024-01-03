import { describe, expect, it } from 'vitest'

import { setupMountedComponents } from '@/lib/test-utils'

import FooterDefault from '../FooterDefault.vue'

describe.concurrent('FooterDefault.vue', () => {
  it('renders information', async () => {
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
    const footer = wrapper.find('footer')
    expect(footer.exists()).toBe(true)
    expect(footer.text()).toContain('REEV Explains and Evaluates Variants')
  })
})
