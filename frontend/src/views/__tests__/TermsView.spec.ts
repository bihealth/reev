import { setupMountedComponents } from '@bihealth/reev-frontend-lib/lib/testUtils'
import { describe, expect, it } from 'vitest'

import TermsView from '@/components/StaticViews/TermsView.vue'

describe.concurrent('TermsView', async () => {
  it('renders the terms of use content', async () => {
    // arrange:
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

    // act: nothing, only test rendering

    // assert:
    expect(wrapper.text()).toContain('REEV is for research use only software')
    expect(wrapper.text()).toContain(
      'The software is provided "as is," without warranty of any kind'
    )
  })
})
