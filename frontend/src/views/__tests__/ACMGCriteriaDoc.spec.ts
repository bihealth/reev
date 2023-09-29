import { describe, expect, it } from 'vitest'

import { setupMountedComponents } from '@/lib/test-utils'

import ACMGCriteriaDocs from '../ACMGCriteriaDocs.vue'

describe.concurrent('ACMGCriteriaDocs', async () => {
  it('renders the header', () => {
    const { wrapper } = setupMountedComponents(
      { component: ACMGCriteriaDocs, template: true },
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
      { component: ACMGCriteriaDocs, template: true },
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
    expect(mainContent.html()).toMatch('PVS1')
    expect(mainContent.html()).toMatch('Benign Criteria')
    expect(mainContent.html()).toMatch('BP6')
  })
})
