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

  const deleteBookmark = async (obj_type: string, obj_id: string) => {
    storeState.value = StoreState.Loading
    try {
      const client = new BookmarksClient()
      await client.deleteBookmark(obj_type, obj_id)
      await loadBookmarks()
    } catch (e) {
      storeState.value = StoreState.Error
    }
  }

  const createBookmark = async (obj_type: string, obj_id: string) => {
    storeState.value = StoreState.Loading
    try {
      const client = new BookmarksClient()
      await client.createBookmark(obj_type, obj_id)
      await loadBookmarks()
    } catch (e) {
      storeState.value = StoreState.Error
    }
  }

  const fetchBookmark = async (obj_type: string, obj_id: string) => {
    try {
      const client = new BookmarksClient()
      const response = await client.fetchBookmark(obj_type, obj_id)
      if (response.detail === 'Unauthorized') {
        storeState.value = StoreState.Error
        return null
      }
      return response
    } catch (e) {
      return null
    }
  }

  return {
    storeState,
    bookmarks,
    loadBookmarks,
    createBookmark,
    fetchBookmark,
    deleteBookmark
  }
})
