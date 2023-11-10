import { describe, expect, it } from 'vitest'

import HeaderDefault from '@/components/HeaderDefault.vue'
import { setupMountedComponents } from '@/lib/test-utils'
import PrivacyView from '@/views/PrivacyView.vue'

describe.concurrent('PrivacyView', async () => {
  it('renders the header', async () => {
    const { wrapper } = await setupMountedComponents(
      { component: PrivacyView, template: true },
      {
        initialStoreState: {
          misc: {
            appVersion: 'v0.0.0'
          }
        }
      }
    )

    const header = wrapper.findComponent(HeaderDefault)
    expect(header.exists()).toBe(true)
  })

  it('renders the privacy policy link', async () => {
    const { wrapper } = await setupMountedComponents(
      { component: PrivacyView, template: true },
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
      { component: PrivacyView, template: true },
      {
        initialStoreState: {
          misc: {
            appVersion: 'v0.0.0'
          }
        }
      }
    )

    const mainContent = wrapper.find('.privacy-view')
    expect(mainContent.exists()).toBe(true)
    expect(mainContent.text()).toMatch('Privacy Policy')
  })
})
