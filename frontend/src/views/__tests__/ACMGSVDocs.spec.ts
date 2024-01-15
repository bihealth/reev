import { describe, expect, it } from 'vitest'
import { VMenu } from 'vuetify/components'

import { setupMountedComponents } from '@/lib/testUtils'
import ACMGSVDocs from '@/views/ACMGSVDocs.vue'

describe.concurrent('ACMGSVDocs', async () => {
  it('renders the header', async () => {
    // arrange:
    const { wrapper } = await setupMountedComponents(
      { component: ACMGSVDocs },
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
    const logo = wrapper.find('#logo')
    const menu = wrapper.findComponent(VMenu)
    expect(logo.exists()).toBe(true)
    expect(menu.exists()).toBe(true)
  })

  it('renders the main content', async () => {
    // arrange:
    const { wrapper } = await setupMountedComponents(
      { component: ACMGSVDocs },
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
    const mainContent = wrapper.find('.docs-view')
    expect(mainContent.exists()).toBe(true)
    expect(mainContent.html()).toMatch('Copy-number loss')
    expect(mainContent.html()).toMatch('Copy-number gain')
    expect(mainContent.html()).toMatch('Loss 1A')
  })
})
