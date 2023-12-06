import { describe, expect, it } from 'vitest'

import ProfileInformationCard from '@/components/Profile/ProfileInformationCard.vue'
import { setupMountedComponents } from '@/lib/test-utils'
import { StoreState } from '@/stores/misc'
import { type UserData } from '@/stores/user'

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
    const { wrapper } = await setupMountedComponents(
      { component: ProfileInformationCard, template: false },
      {
        initialStoreState: {
          user: {
            storeState: StoreState.Active,
            currentUser: adminUser
          }
        }
      }
    )

    expect(wrapper.text()).toMatch('Profile Information')
  })
})
