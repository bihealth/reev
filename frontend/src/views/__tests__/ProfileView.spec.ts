import { describe, expect, it } from 'vitest'

import HeaderDefault from '@/components/HeaderDefault.vue'
import { setupMountedComponents } from '@/lib/test-utils'
import { type UserData } from '@/stores/user'

import ProfileView from '../ProfileView.vue'

const adminUser: UserData = {
  id: '2c0a153e-5e8c-11ee-8c99-0242ac120002',
  email: 'admin@example.com',
  is_active: true,
  is_superuser: true,
  is_verified: true
}

describe.concurrent('Profile view', async () => {
  it('renders the header', () => {
    const { wrapper } = setupMountedComponents({ component: ProfileView, template: true }, {})

    const header = wrapper.findComponent(HeaderDefault)
    expect(header.exists()).toBe(true)
  })

  it('renders the main content if logged in', () => {
    const { wrapper } = setupMountedComponents(
      { component: ProfileView, template: true },
      {
        initialStoreState: {
          user: {
            currentUser: adminUser
          }
        }
      }
    )

    expect(wrapper.html()).toMatch('User Profile')
    expect(wrapper.text()).toMatch('You are currently logged in...')
  })

  it('renders the main content if not logged in', () => {
    const { wrapper } = setupMountedComponents(
      { component: ProfileView, template: true },
      {
        initialStoreState: {
          user: {
            currentUser: null
          }
        }
      }
    )

    expect(wrapper.html()).toMatch('User Profile')
    expect(wrapper.text()).toMatch('You are not logged in')
  })
})
