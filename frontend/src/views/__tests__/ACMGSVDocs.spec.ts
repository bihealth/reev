import { describe, expect, it } from 'vitest'

import { setupMountedComponents } from '@/lib/test-utils'

import ACMGSVDocs from '../ACMGSVDocs.vue'

describe.concurrent('ACMGSVDocs', async () => {
  it('renders the header', () => {
    const { wrapper } = setupMountedComponents(
      { component: ACMGSVDocs, template: true },
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
      { component: ACMGSVDocs, template: true },
      {
        initialStoreState: {
          misc: {
            appVersion: 'v0.0.0'
          }
        }
      }
    )

    const mainContent = wrapper.find('.docs-view')
    expect(mainContent.exists()).toBe(true)
    expect(mainContent.html()).toMatch('Copy-number loss')
    expect(mainContent.html()).toMatch('Copy-number gain')
    expect(mainContent.html()).toMatch('Loss 1A')
  })
})
