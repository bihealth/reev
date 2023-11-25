import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'

import { setupMountedComponents } from '@/lib/test-utils'
import { type UserData, useUserStore } from '@/stores/user'

import UserProfileButton from '../UserProfileButton.vue'

const adminUser: UserData = {
  id: '2c0a153e-5e8c-11ee-8c99-0242ac120002',
  email: 'admin@example.com',
  is_active: true,
  is_superuser: true,
  is_verified: true,
  oauth_accounts: [
    {
      id: '2c0a153e-5e8c-11ee-8c99-0242ac120002',
      oauth_name: 'google',
      account_id: '1234567890',
      account_email: 'admin@example.com'
    }
  ]
}

describe.concurrent('UserProfileButton', () => {
  it('displays Login button without any user', async () => {
    const { wrapper } = await setupMountedComponents(
      { component: UserProfileButton, template: true },
      {
        initialStoreState: {
          user: {
            currentUser: null
          }
        }
      }
    )

    const loginButton = wrapper.findComponent('#login')
    expect(loginButton.exists()).toBe(true)
    const logoutButton = wrapper.findComponent('#profile')
    expect(logoutButton.exists()).toBe(false)
  })

  it('displays Profile button with a user', async () => {
    const { wrapper } = await setupMountedComponents(
      { component: UserProfileButton, template: true },
      {
        initialStoreState: {
          user: {
            currentUser: adminUser
          }
        }
      }
    )

    const loginButton = wrapper.findComponent('#login')
    expect(loginButton.exists()).toBe(false)
    const logoutButton = wrapper.findComponent('#profile')
    expect(logoutButton.exists()).toBe(true)
  })

  it('switches from Login to Profile button when store changes', async () => {
    // Note that we use an `async` test here as we need `await nextTick()` for the DOM
    // update to bubble through when updating the state property.
    const { wrapper } = await setupMountedComponents(
      { component: UserProfileButton, template: true },
      {
        initialStoreState: {
          user: {
            currentUser: null
          }
        }
      }
    )

    let loginButton = wrapper.findComponent('#login')
    expect(loginButton.exists()).toBe(true)
    let logoutButton = wrapper.findComponent('#profile')
    expect(logoutButton.exists()).toBe(false)

    const userStore = useUserStore()
    userStore.currentUser = adminUser
    // console.log(userStore.currentUser)

    await nextTick()

    loginButton = wrapper.findComponent('#login')
    expect(loginButton.exists()).toBe(false)
    logoutButton = wrapper.findComponent('#profile')
    expect(logoutButton.exists()).toBe(true)
  })
})
