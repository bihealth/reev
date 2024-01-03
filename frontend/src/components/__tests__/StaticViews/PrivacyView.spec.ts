import { describe, expect, it } from 'vitest'

import PrivacyView from '@/components/StaticViews/PrivacyView.vue'
import { setupMountedComponents } from '@/lib/test-utils'

describe.concurrent('PrivacyView', async () => {
  it('renders the privacy policy link', async () => {
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

    const privacyPolicyLink = wrapper.find('a[href="https://www.bihealth.org/en/privacy"]')
    expect(privacyPolicyLink.exists()).toBe(true)
    expect(privacyPolicyLink.text()).toMatch('privacy policy of the Berlin Institute of Health')
  })

  it('renders the main content', async () => {
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

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.text()).toMatch('Privacy Policy')
  })
})
