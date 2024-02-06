import { setupMountedComponents } from '@bihealth/reev-frontend-lib/lib/testUtils'
import { describe, expect, it } from 'vitest'

import PrivacyView from './PrivacyView.vue'

describe.concurrent('PrivacyView', async () => {
  it('renders the privacy policy link', async () => {
    // arrange:
    const { wrapper } = await setupMountedComponents(
      { component: PrivacyView },
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
    const privacyPolicyLink = wrapper.find('a[href="https://www.bihealth.org/en/privacy"]')
    expect(privacyPolicyLink.exists()).toBe(true)
    expect(privacyPolicyLink.text()).toMatch('privacy policy of the Berlin Institute of Health')
  })

  it('renders the main content', async () => {
    // arrange:
    const { wrapper } = await setupMountedComponents(
      { component: PrivacyView },
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
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.text()).toMatch('Privacy Policy')
  })
})
