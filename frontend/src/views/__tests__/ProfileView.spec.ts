import { describe, expect, it } from 'vitest'

import PageHeader from '@/components/PageHeader.vue'
import ProfileInformationCard from '@/components/Profile/ProfileInformationCard.vue'
import { setupMountedComponents } from '@/lib/testUtils'
import { type UserData } from '@/stores/user'

import ProfileView from '../ProfileView.vue'

const adminUser: UserData = {
  id: '2c0a153e-5e8c-11ee-8c99-0242ac120002',
  email: 'admin@example.com',
  is_active: true,
  is_superuser: true,
  is_verified: true,
  oauth_accounts: []
}

describe.concurrent('Profile view', async () => {
  it('renders the header', async () => {
    const { wrapper } = await setupMountedComponents({ component: ProfileView }, {})

    const header = wrapper.findComponent(PageHeader)
    expect(header.exists()).toBe(true)
  })

  it('renders the main content if logged in', async () => {
    const { wrapper } = await setupMountedComponents(
      { component: ProfileView },
      {
        initialStoreState: {
          user: {
            currentUser: adminUser
          }
        }
      }
    )

    expect(wrapper.html()).toMatch('User Profile')
    expect(wrapper.text()).toMatch('Bookmarks')
    expect(wrapper.text()).toMatch('Case Info')

    const profileInformationCard = wrapper.findComponent(ProfileInformationCard)
    expect(profileInformationCard.exists()).toBe(true)
  })

  it('renders the main content if not logged in', async () => {
    const { wrapper } = await setupMountedComponents(
      { component: ProfileView },
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
