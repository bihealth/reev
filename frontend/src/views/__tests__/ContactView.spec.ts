import { describe, expect, it } from 'vitest'

import { setupMountedComponents } from '@/lib/test-utils'

import ContactView from '../ContactView.vue'

describe.concurrent('ContactView', async () => {
  it('renders the header', () => {
    const { wrapper } = setupMountedComponents(
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
    const aboutLink = wrapper.find('#about')
    const contactLink = wrapper.find('#contact')
    expect(logo.exists()).toBe(true)
    expect(aboutLink.exists()).toBe(true)
    expect(contactLink.exists()).toBe(true)
  })

  it('renders the main content', () => {
    const { wrapper } = setupMountedComponents(
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
