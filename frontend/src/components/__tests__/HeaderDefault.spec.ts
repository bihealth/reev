import { describe, expect, it } from 'vitest'

import { setupMountedComponents } from '@/lib/test-utils'

import HeaderDefault from '../HeaderDefault.vue'

describe.concurrent('HeaderDefault.vue', () => {
  it('renders the logo and title', () => {
    const { wrapper } = setupMountedComponents(
      { component: HeaderDefault, template: true },
      {
        initialStoreState: {
          user: {
            currentUser: null
          }
        }
      }
    )

    const logo = wrapper.find('#logo')
    const title = wrapper.find('a[href="/"]')
    expect(logo.exists()).toBe(true)
    expect(title.text()).toBe('REEV: Explanation and Evaluation of Variants')
  })

  it('renders the navigation links', () => {
    const { wrapper } = setupMountedComponents(
      { component: HeaderDefault, template: true },
      {
        initialStoreState: {
          user: {
            currentUser: null
          }
        }
      }
    )

    const menu = wrapper.find('#menu')
    expect(menu.exists()).toBe(true)
  })
})
