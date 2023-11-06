import { createTestingPinia } from '@pinia/testing'
import { describe, expect, it, vi } from 'vitest'

import BookmarkButton from '@/components/BookmarkButton.vue'
import { setupMountedComponents } from '@/lib/test-utils'
import { type BookmarkData, useBookmarksStore } from '@/stores/bookmarks'

const exampleBookmark: BookmarkData = {
  user: '2c0a153e-5e8c-11ee-8c99-0242ac120002',
  obj_type: 'seqvar',
  obj_id: 'HGNC:1100',
  id: '2c0a153e-5e8c-11ee-8c99-0242ac120001'
}

describe.concurrent('BookmarkButton.vue', () => {
  it('renders information', () => {
    const pinia = createTestingPinia({ createSpy: vi.fn })
    const bookmarkStore = useBookmarksStore(pinia)
    const mockFetchBookmark = vi.fn().mockImplementation(async () => {
      bookmarkStore.bookmarks = [exampleBookmark]
    })
    bookmarkStore.fetchBookmark = mockFetchBookmark
    const { wrapper } = setupMountedComponents(
      { component: BookmarkButton, template: false },
      {
        initialStoreState: {
          bookmarks: {
            bookmarks: [exampleBookmark]
          }
        },
        props: {
          type: 'seqvar',
          id: 'HGNC:1100'
        },
        pinia: pinia
      }
    )
    expect(wrapper.html()).toBeTruthy()
  })
})
