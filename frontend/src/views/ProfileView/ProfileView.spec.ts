import { setupMountedComponents } from '@bihealth/reev-frontend-lib/lib/testUtils'
import { describe, expect, it } from 'vitest'
import { h, nextTick } from 'vue'

import { type UserData } from '@/stores/user'

import ProfileView from './ProfileView.vue'

/** Example user data */
const adminUser: UserData = {
  id: '2c0a153e-5e8c-11ee-8c99-0242ac120002',
  email: 'admin@example.com',
  is_active: true,
  is_superuser: true,
  is_verified: true,
  oauth_accounts: []
}

const routes = [
  {
    path: '/',
    name: 'home',
    component: h('div', { innerHTML: 'for testing' })
  },
  {
    path: '/info#terms-of-use',
    name: 'info-terms-of-use',
    component: h('div', { innerHTML: 'for testing' })
  },
  {
    path: '/login',
    name: 'login',
    component: h('div', { innerHTML: 'for testing' })
  },
  {
    path: '/profile',
    name: 'profile',
    component: h('div', { innerHTML: 'for testing' })
  }
]

describe.concurrent('Profile view', async () => {
  it('renders the header', async () => {
    // arrange:
    const { wrapper } = await setupMountedComponents(
      { component: ProfileView, stubs: { PageHeader: true, FooterDefault: true } },
      { routes }
    )

    // act: nothing, just wait for the next tick
    await nextTick()

    // assert:
    const header = wrapper.findComponent({ name: 'PageHeader' })
    expect(header.exists()).toBe(true)
  })

  it('renders the main content if logged in', async () => {
    // arrange:
    const { wrapper } = await setupMountedComponents(
      { component: ProfileView, stubs: { PageHeader: true, FooterDefault: true } },
      {
        initialStoreState: {
          user: {
            currentUser: adminUser
          }
        },
        routes
      }
    )

    // act: nothing, just wait for the next tick
    await nextTick()

    // assert:
    expect(wrapper.html()).toMatch('User Profile')
    expect(wrapper.text()).toMatch('Bookmarks')
    const profileInformationCard = wrapper.findComponent({ name: 'ProfileInformationCard' })
    expect(profileInformationCard.exists()).toBe(true)
  })

  it('renders the main content if not logged in', async () => {
    // arrange:
    const { wrapper } = await setupMountedComponents(
      { component: ProfileView, stubs: { PageHeader: true, FooterDefault: true } },
      {
        initialStoreState: {
          user: {
            currentUser: null
          }
        },
        routes
      }
    )

    // act: nothing, just wait for the next tick
    await nextTick()

    // assert:
    expect(wrapper.html()).toMatch('User Profile')
    expect(wrapper.text()).toMatch('You are not logged in')
  })
})
