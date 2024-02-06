<script setup lang="ts">
import { StoreState } from '@bihealth/reev-frontend-lib/stores'
import { onMounted, ref } from 'vue'

import { useBookmarksStore } from '@/stores/bookmarks'

// Import the BookmarksClient

export interface Props {
  type?: 'gene' | 'seqvar' | 'strucvar' | undefined
  id?: string | undefined
}

const props = defineProps<Props>()

const bookmarksStore = useBookmarksStore()

const isBookmarked = ref(false)

const loadDataToStore = async () => {
  await bookmarksStore.loadBookmarks()
}

// Fetch existing bookmark for the given type and id on mount
onMounted(async () => {
  await loadDataToStore()
  if (!props.type || !props.id) {
    console.error('type or id not defined')
    return
  }

  bookmarksStore
    .fetchBookmark(props.type, props.id)
    ?.then((bookmark) => {
      if (bookmark) {
        isBookmarked.value = true
      } else {
        isBookmarked.value = false
      }
    })
    .catch((e) => {
      isBookmarked.value = false
      console.error(e)
    })
})

// Function to toggle bookmark
const toggleBookmark = async () => {
  if (!props.type || !props.id) {
    console.error('type or id not defined')
    return
  }

  if (isBookmarked.value) {
    await bookmarksStore.deleteBookmark(props.type, props.id)
  } else {
    await bookmarksStore.createBookmark(props.type, props.id)
  }
  const retrievedBookmark = await bookmarksStore.fetchBookmark(props.type, props.id)
  if (retrievedBookmark) {
    isBookmarked.value = true
  } else {
    isBookmarked.value = false
  }
}
</script>

<template>
  <template v-if="id === undefined || type === undefined">
    <v-skeleton-loader type="list-item"></v-skeleton-loader>
  </template>
  <template v-else-if="bookmarksStore.storeState === StoreState.Error">
    <v-list-item class="text-caption"> Bookmarks available after login </v-list-item>
  </template>
  <template v-else>
    <v-list-item
      :prepend-icon="isBookmarked ? 'mdi-bookmark' : 'mdi-bookmark-outline'"
      @click="toggleBookmark()"
    >
      Bookmark
    </v-list-item>
  </template>
</template>
