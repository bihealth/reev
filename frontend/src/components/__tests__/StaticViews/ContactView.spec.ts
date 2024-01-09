import { describe, expect, it } from 'vitest'

import ContactView from '@/components/StaticViews/ContactView.vue'
import { setupMountedComponents } from '@/lib/testUtils'

describe.concurrent('ContactView', async () => {
  it('renders the main content', async () => {
    const { wrapper } = await setupMountedComponents(
      { component: ContactView },
      {
        initialStoreState: {
          misc: {
            appVersion: 'v0.0.0'
          }
        }
      }
    )

    const githubLink = wrapper.find('.mdi-github')
    const emailLink = wrapper.find('.mdi-email')
    expect(wrapper.html()).toMatch(
      'Feel free to reach out to us through any of the following channels:'
    )
    expect(githubLink.exists()).toBe(true)
    expect(emailLink.exists()).toBe(true)
  })
})
