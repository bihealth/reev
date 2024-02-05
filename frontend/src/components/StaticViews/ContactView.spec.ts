import { setupMountedComponents } from '@bihealth/reev-frontend-lib/lib/testUtils'
import { describe, expect, it } from 'vitest'

import ContactView from './ContactView.vue'

describe.concurrent('ContactView', async () => {
  it('renders the main content', async () => {
    // arrange:
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

    // act: nothing, only test rendering

    // assert:
    const githubLink = wrapper.find('.mdi-github')
    const emailLink = wrapper.find('.mdi-email')
    expect(wrapper.html()).toMatch(
      'Feel free to reach out to us through any of the following channels:'
    )
    expect(githubLink.exists()).toBe(true)
    expect(emailLink.exists()).toBe(true)
  })
})
