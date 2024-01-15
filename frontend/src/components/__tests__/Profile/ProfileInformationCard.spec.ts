import { describe, expect, it } from 'vitest'

import ProfileInformationCard from '@/components/Profile/ProfileInformationCard.vue'
import { setupMountedComponents } from '@/lib/testUtils'
import { StoreState } from '@/stores/misc'
import { type UserData } from '@/stores/user'

/** Example user data */
const adminUser: UserData = {
  id: '2c0a153e-5e8c-11ee-8c99-0242ac120002',
  email: 'admin@example.com',
  is_active: true,
  is_superuser: true,
  is_verified: true,
  oauth_accounts: []
}

describe.concurrent('ProfileInformationCard', async () => {
  it('renders the ProfileInformationCard information.', async () => {
    // arrange:
    const { wrapper } = await setupMountedComponents(
      { component: ProfileInformationCard },
      {
        initialStoreState: {
          user: {
            storeState: StoreState.Active,
            currentUser: adminUser
          }
        }
      }
    )

    // act: nothing, only test rendering

    // assert:
    expect(wrapper.text()).toMatch('Profile Information')
    expect(wrapper.text()).toMatch('User Profile')
    const vForm = wrapper.findComponent({ name: 'VForm' })
    expect(vForm.exists()).toBe(true)
  })

  it('renders the ProfileInformationCard information with no user.', async () => {
    // arrange:
    const { wrapper } = await setupMountedComponents(
      { component: ProfileInformationCard },
      {
        initialStoreState: {
          user: {
            storeState: StoreState.Active,
            currentUser: null
          }
        }
      }
    )

    // act: nothing, only test rendering

    // assert:
    expect(wrapper.html()).toBeTruthy()
    expect(wrapper.text()).not.toContain('Profile Information')
  })
})
