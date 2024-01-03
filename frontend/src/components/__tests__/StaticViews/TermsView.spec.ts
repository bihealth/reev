import { describe, expect, it } from 'vitest'

import TermsView from '@/components/StaticViews/TermsView.vue'
import { setupMountedComponents } from '@/lib/test-utils'

describe.concurrent('TermsView', async () => {
  it('renders the terms of use content', async () => {
    const { wrapper } = await setupMountedComponents(
      { component: TermsView },
      {
        initialStoreState: {
          misc: {
            appVersion: 'v0.0.0'
          }
        }
      }
    )

    expect(wrapper.text()).toContain('REEV is for research use only software')
    expect(wrapper.text()).toContain(
      'The software is provided "as is," without warranty of any kind'
    )
  })
})
