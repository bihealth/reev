import { describe, expect, it } from 'vitest'

import HeaderDefault from '@/components/HeaderDefault.vue'
import { setupMountedComponents } from '@/lib/test-utils'
import TermsView from '@/views/TermsView.vue'

describe.concurrent('TermsView', async () => {
  it('renders the header', async () => {
    const { wrapper } = await setupMountedComponents(
      { component: TermsView, template: true },
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

  it('renders the terms of use content', async () => {
    const { wrapper } = await setupMountedComponents(
      { component: TermsView, template: true },
      {
        initialStoreState: {
          misc: {
            appVersion: 'v0.0.0'
          }
        }
      }
    )

    const termsContent = wrapper.find('.terms-view')
    expect(termsContent.exists()).toBe(true)
    expect(termsContent.text()).toContain('REEV is for research use only software')
    expect(termsContent.text()).toContain(
      'The software is provided "as is," without warranty of any kind'
    )
  })
})
