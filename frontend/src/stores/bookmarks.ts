/**
 * Store for information regarding the current user.
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'

import { BookmarksClient } from '@/api/bookmarks'
import { StoreState } from '@/stores/misc'

export interface BookmarkData {
  user: string
  obj_type: string
  obj_id: string
  id: string
}

export const useBookmarksStore = defineStore('bookmarks', () => {
  /* The current store state. */
  const storeState = ref<StoreState>(StoreState.Initial)

  /* The bookmarks list for current user. */
  const bookmarks = ref<BookmarkData[]>([])

  const loadBookmarks = async () => {
    storeState.value = StoreState.Loading
    try {
      const client = new BookmarksClient()
      bookmarks.value = await client.fetchBookmarks()
      storeState.value = StoreState.Active
    } catch (e) {
      storeState.value = StoreState.Error
    }
  }

  const deleteBookmark = async (bookmark: BookmarkData) => {
    storeState.value = StoreState.Loading
    try {
      const client = new BookmarksClient()
      await client.deleteBookmark(bookmark.obj_type, bookmark.obj_id)
      await loadBookmarks()
    } catch (e) {
      storeState.value = StoreState.Error
    }
  }

  return {
    storeState,
    bookmarks,
    loadBookmarks,
    deleteBookmark
  }
})
