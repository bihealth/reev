import { describe, expect, it } from 'vitest'
import { VMenu } from 'vuetify/components'

import { setupMountedComponents } from '@/lib/test-utils'

import ACMGCriteriaDocs from '../ACMGCriteriaDocs.vue'

describe.concurrent('ACMGCriteriaDocs', async () => {
  it('renders the header', async () => {
    const { wrapper } = await setupMountedComponents(
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
    const menu = wrapper.findComponent(VMenu)
    expect(logo.exists()).toBe(true)
    expect(menu.exists()).toBe(true)
  })

  it('renders the main content', async () => {
    const { wrapper } = await setupMountedComponents(
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
