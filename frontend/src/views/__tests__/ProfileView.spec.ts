import { describe, expect, it } from 'vitest'

import PageHeader from '@/components/PageHeader.vue'
import { setupMountedComponents } from '@/lib/test-utils'
import type { BookmarkData } from '@/stores/bookmarks'
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

const exampleBookmark: BookmarkData = {
  user: '2c0a153e-5e8c-11ee-8c99-0242ac120002',
  obj_type: 'seqvar',
  obj_id: 'HGNC:1100',
  id: '2c0a153e-5e8c-11ee-8c99-0242ac120001'
}

describe.concurrent('Profile view', async () => {
  it('renders the header', async () => {
    const { wrapper } = await setupMountedComponents({ component: ProfileView, template: true }, {})

    const header = wrapper.findComponent(PageHeader)
    expect(header.exists()).toBe(true)
  })

  it('renders the main content if logged in', async () => {
    const { wrapper } = await setupMountedComponents(
      { component: ProfileView, template: true },
      {
        initialStoreState: {
          user: {
            currentUser: adminUser
          },
          bookmarks: {
            bookmarks: [exampleBookmark]
          }
        }
      }
    )

    expect(wrapper.html()).toMatch('User Profile')
    expect(wrapper.text()).toMatch('You are currently logged in...')
    expect(wrapper.text()).toMatch('Your bookmarks:')
  })

  it('renders the main content if not logged in', async () => {
    const { wrapper } = await setupMountedComponents(
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
