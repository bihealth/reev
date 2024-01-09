import { createTestingPinia } from '@pinia/testing'
import { describe, expect, it, vi } from 'vitest'

import BookmarksCard from '@/components/Profile/BookmarksCard.vue'
import { setupMountedComponents } from '@/lib/testUtils'
import { type BookmarkData, useBookmarksStore } from '@/stores/bookmarks'
import { StoreState } from '@/stores/misc'

const exampleBookmark: BookmarkData = {
  user: '2c0a153e-5e8c-11ee-8c99-0242ac120002',
  obj_type: 'seqvar',
  obj_id: 'HGNC:1100',
  id: '2c0a153e-5e8c-11ee-8c99-0242ac120001'
}

describe.concurrent('BookmarksCard', async () => {
  it('renders the BookmarksCard information with no bookmarks.', async () => {
    const pinia = createTestingPinia({ createSpy: vi.fn })
    const bookmarkStore = useBookmarksStore(pinia)
    const mockFetchBookmark = vi.fn().mockImplementation(async () => {
      bookmarkStore.bookmarks = [exampleBookmark]
    })
    bookmarkStore.fetchBookmark = mockFetchBookmark
    const { wrapper } = await setupMountedComponents(
      { component: BookmarksCard },
      {
        initialStoreState: {
          bookmarks: {
            storeState: StoreState.Active,
            bookmarks: [exampleBookmark]
          }
        },
        pinia: pinia
      }
    )

    expect(wrapper.text()).toContain('You have no bookmarks yet.')
  })
})
