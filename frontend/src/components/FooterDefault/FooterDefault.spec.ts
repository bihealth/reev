import { setupMountedComponents } from '@bihealth/reev-frontend-lib/lib/testUtils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'

import FooterDefault from '@/components/FooterDefault/FooterDefault.vue'

/** Dummy routes for testing. */
const routes = [
  {
    path: '/',
    name: 'home',
    component: h('div', { innerHTML: 'for testing' })
  },
  {
    path: '/info',
    name: 'info',
    component: h('div', { innerHTML: 'for testing' })
  }
]

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
        },
        routes
      }
    )

    // act: nothing, only test rendering

    // assert:
    const footer = wrapper.find('footer')
    expect(footer.exists()).toBe(true)
    expect(footer.text()).toContain('REEV Explains and Evaluates Variants')
  })
})
