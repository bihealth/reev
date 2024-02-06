import { setupMountedComponents } from '@bihealth/reev-frontend-lib/lib/testUtils'
import { describe, expect, it } from 'vitest'

import AboutView from './AboutView.vue'

describe.concurrent('AboutView', async () => {
  it('renders the main content', async () => {
    // arrange:
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

    // act: nothing, only test rendering

    // assert:
    expect(wrapper.html()).toMatch('REEV Explains and Evaluates Variants')
    // Acknowledgements
    expect(wrapper.html()).toMatch('ClinVar is a freely accessible, public archive')
    expect(wrapper.html()).toMatch('Coral emoji from OpenMoji')
  })
})
