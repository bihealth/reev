import { describe, expect, it } from 'vitest'

import AboutView from '@/components/StaticViews/AboutView.vue'
import { setupMountedComponents } from '@/lib/testUtils'

describe.concurrent('AboutView', async () => {
  it('renders the main content', async () => {
    const { wrapper } = await setupMountedComponents(
      { component: AboutView },
      {
        initialStoreState: {
          misc: {
            appVersion: 'v0.0.0'
          }
        }
      }
    )

    expect(wrapper.html()).toMatch('REEV Explains and Evaluates Variants')
    // Acknowledgements
    expect(wrapper.html()).toMatch('ClinVar is a freely accessible, public archive')
    expect(wrapper.html()).toMatch('Coral emoji from OpenMoji')
  })
})
