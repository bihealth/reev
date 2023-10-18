import { describe, expect, it } from 'vitest'

import { setupMountedComponents } from '@/lib/test-utils'

import AboutView from '../AboutView.vue'

describe.concurrent('AboutView', async () => {
  it('renders the header', () => {
    const { wrapper } = setupMountedComponents(
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
    const menu = wrapper.find('#menu')
    expect(logo.exists()).toBe(true)
    expect(menu.exists()).toBe(true)
  })

  it('renders the main content', () => {
    const { wrapper } = setupMountedComponents(
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
    expect(mainContent.html()).toMatch('REEV: Explanation and Evaluation of Variants')
    // Acknowledgements
    expect(mainContent.html()).toMatch('ClinVar is a freely accessible, public archive')
    expect(mainContent.html()).toMatch('Coral emoji from OpenMoji')
  })
})
