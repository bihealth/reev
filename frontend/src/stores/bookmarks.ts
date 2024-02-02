/**
 * Store for information regarding the current user.
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'

import { BookmarksClient } from '@/api/bookmarks'
import { StoreState } from '@/stores/misc'

/** Allowed values for bookmark types. */
export type BookmarkType = 'seqvar' | 'strucvar' | 'gene'

/** Type for bookmarks in the API. */
export interface BookmarkData {
  /** The ID of the bookmark itself, only set when fetching. */
  id?: string
  /** The owner of the bookmark, only set when fetching. */
  user?: string
  /** Type of the bookmark. */
  obj_type: BookmarkType
  /** The bookmarked object identifier. */
  obj_id: string
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
      if (response === null) {
        return null
      } else if (response.detail === 'Unauthorized') {
        storeState.value = StoreState.Error
        return null
      } else {
        return response
      }
    } catch (e) {
      storeState.value = StoreState.Error
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
