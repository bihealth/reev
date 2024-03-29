import { setupMountedComponents } from '@bihealth/reev-frontend-lib/lib/testUtils'
import { StoreState } from '@bihealth/reev-frontend-lib/stores'
import { describe, expect, it, vi } from 'vitest'
import { h } from 'vue'

import { type BookmarkData } from '@/stores/bookmarks'

import BookmarksCard from './ProfileBookmarksCard.vue'

/** Example bookmark */
const exampleBookmark: BookmarkData = {
  user: '2c0a153e-5e8c-11ee-8c99-0242ac120002',
  obj_type: 'seqvar',
  obj_id: 'HGNC:1100',
  id: '2c0a153e-5e8c-11ee-8c99-0242ac120001'
}

/** Dummy routes for testing. */
const dummyRoutes = [
  {
    path: '/',
    name: 'home',
    component: h('div', { innerHTML: 'for testing' })
  },
  {
    path: '/seqvar-details/:seqvar',
    name: 'seqvar-details',
    component: h('div', { innerHTML: 'for testing' })
  }
]

describe.concurrent('BookmarksCard', async () => {
  it('renders the BookmarksCard information with no bookmarks.', async () => {
    // arrange:
    const mockFetchBookmark = vi.fn().mockImplementation(async () => {})
    const { wrapper } = await setupMountedComponents(
      { component: BookmarksCard },
      {
        initialStoreState: {
          bookmarks: {
            storeState: StoreState.Active,
            bookmarks: [],
            fetchBookmark: mockFetchBookmark
          }
        },
        routes: dummyRoutes
      }
    )

    // act: nothing, only test rendering

    // assert:
    expect(wrapper.text()).toContain('You have no bookmarks yet.')
  })

  it('correctrly renders the BookmarksCard information', async () => {
    // arrange:
    const mockFetchBookmark = vi.fn().mockImplementation(async () => {})
    const { wrapper } = await setupMountedComponents(
      { component: BookmarksCard },
      {
        initialStoreState: {
          bookmarks: {
            storeState: StoreState.Active,
            bookmarks: [exampleBookmark],
            fetchBookmark: mockFetchBookmark
          }
        },
        routes: dummyRoutes
      }
    )

    // act: nothing, only test rendering

    // assert:
    expect(wrapper.text()).toContain('Your bookmarks')
    expect(wrapper.text()).toContain('HGNC:1100')
  })
})
