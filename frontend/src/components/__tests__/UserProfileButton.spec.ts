import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'

import { setupMountedComponents } from '@/components/__tests__/utils'
import { type UserData, useUserStore } from '@/stores/user'

import UserProfileButton from '../UserProfileButton.vue'

const adminUser: UserData = {
  id: '2c0a153e-5e8c-11ee-8c99-0242ac120002',
  email: 'admin@example.com',
  is_active: true,
  is_superuser: true,
  is_verified: true
}

describe.concurrent('UserProfileButton', () => {
  it('displays Login button without any user', () => {
    const { wrapper } = setupMountedComponents(
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

  it('displays Profile button with a user', () => {
    const { wrapper } = setupMountedComponents(
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
    const { wrapper } = setupMountedComponents(
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
    console.log(userStore.currentUser)

    await nextTick()

    loginButton = wrapper.findComponent('#login')
    expect(loginButton.exists()).toBe(false)
    logoutButton = wrapper.findComponent('#profile')
    expect(logoutButton.exists()).toBe(true)
  })
})
