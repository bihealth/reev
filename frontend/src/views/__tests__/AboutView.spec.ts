import { describe, expect, it } from 'vitest'
import { VMenu } from 'vuetify/components'

import { setupMountedComponents } from '@/lib/test-utils'

import AboutView from '../AboutView.vue'

describe.concurrent('AboutView', async () => {
  it('renders the header', async () => {
    const { wrapper } = await setupMountedComponents(
      { component: AboutView, template: true },
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
      { component: AboutView, template: true },
      {
        initialStoreState: {
          misc: {
            appVersion: 'v0.0.0'
          }
        }
      }
    )

    const mainContent = wrapper.find('.about-view')
    expect(mainContent.exists()).toBe(true)
    expect(mainContent.html()).toMatch('REEV Explains and Evaluates Variants')
    // Acknowledgements
    expect(mainContent.html()).toMatch('ClinVar is a freely accessible, public archive')
    expect(mainContent.html()).toMatch('Coral emoji from OpenMoji')
  })
})
