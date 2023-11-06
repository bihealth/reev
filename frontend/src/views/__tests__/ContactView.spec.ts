import { describe, expect, it } from 'vitest'
import { VMenu } from 'vuetify/components'

import { setupMountedComponents } from '@/lib/test-utils'

import ContactView from '../ContactView.vue'

describe.concurrent('ContactView', async () => {
  it('renders the header', async () => {
    const { wrapper } = await setupMountedComponents(
      { component: ContactView, template: true },
      {
        initialStoreState: {
          misc: {
            appVersion: 'v0.0.0'
          }
        }
      }
    )

    const logo = wrapper.find('#logo')
    const menu = wrapper.findComponent(VMenu)
    expect(logo.exists()).toBe(true)
    expect(menu.exists()).toBe(true)
  })

  it('renders the main content', async () => {
    const { wrapper } = await setupMountedComponents(
      { component: ContactView, template: true },
      {
        initialStoreState: {
          misc: {
            appVersion: 'v0.0.0'
          }
        }
      }
    )

    const mainContent = wrapper.find('.contact-view')
    const githubLink = wrapper.find('.mdi-github')
    const emailLink = wrapper.find('.mdi-email')
    expect(mainContent.exists()).toBe(true)
    expect(mainContent.html()).toMatch(
      'Feel free to reach out to us through any of the following channels:'
    )
    expect(githubLink.exists()).toBe(true)
    expect(emailLink.exists()).toBe(true)
  })
})
