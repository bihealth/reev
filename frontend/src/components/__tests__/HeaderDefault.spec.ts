import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { VMenu } from 'vuetify/components'

import HeaderDefault from '@/components/HeaderDefault.vue'
import { setupMountedComponents } from '@/lib/test-utils'

describe.concurrent('HeaderDefault.vue', () => {
  it('renders the logo and title', async () => {
    const { wrapper } = await setupMountedComponents(
      { component: HeaderDefault, template: true },
      {
        initialStoreState: {
          user: {
            currentUser: null
          }
        },
        props: {
          caseInformation: true
        }
      }
    )

    const logo = wrapper.find('#logo')
    const title = wrapper.find('a[href="/"]')
    expect(logo.exists()).toBe(true)
    expect(title.exists()).toBe(true)
    expect(wrapper.text()).toContain('REEV Explains and Evaluates Variants')
  })

  it('renders the navigation links', async () => {
    const { wrapper } = await setupMountedComponents(
      { component: HeaderDefault, template: true },
      {
        initialStoreState: {
          user: {
            currentUser: null
          }
        },
        props: {
          caseInformation: true
        }
      }
    )

    const menu = wrapper.findComponent(VMenu)
    expect(menu.exists()).toBe(true)
    await menu.trigger('click')
    await nextTick()
  })
})
