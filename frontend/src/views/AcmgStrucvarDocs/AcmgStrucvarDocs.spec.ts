import { setupMountedComponents } from '@bihealth/reev-frontend-lib/lib/testUtils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import { VMenu } from 'vuetify/components'

import AcmgStrucvarDocs from '@/views/AcmgStrucvarDocs/AcmgStrucvarDocs.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: h('div', { innerHTML: 'for testing' })
  },
  {
    path: '/login',
    name: 'login',
    component: h('div', { innerHTML: 'for testing' })
  }
]

describe.concurrent('AcmgStrucvarDocs', async () => {
  it('renders the header', async () => {
    // arrange:
    const { wrapper } = await setupMountedComponents(
      { component: AcmgStrucvarDocs },
      {
        initialStoreState: {
          misc: {
            appVersion: 'v0.0.0'
          }
        },
        routes
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
      { component: AcmgStrucvarDocs },
      {
        initialStoreState: {
          misc: {
            appVersion: 'v0.0.0'
          }
        },
        routes
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
