<script setup lang="ts">
import { onMounted, ref } from 'vue'

import { useBookmarksStore } from '@/stores/bookmarks'
import { StoreState } from '@/stores/misc'

// Import the BookmarksClient

export interface Props {
  type: string
  id: string
}

const props = withDefaults(defineProps<Props>(), {
  type: '',
  id: ''
})

const bookmarksStore = useBookmarksStore()

const isBookmarked = ref(false)

const loadDataToStore = async () => {
  await bookmarksStore.loadBookmarks()
}

// Fetch existing bookmark for the given type and id on mount
onMounted(async () => {
  loadDataToStore()
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
  <template v-if="bookmarksStore.storeState === StoreState.Error">
    <v-list-item class="text-caption"> Bookmarks available after login </v-list-item>
  </template>
  <template v-else class="mb-2">
    <v-list-item
      :prepend-icon="isBookmarked ? 'mdi-bookmark' : 'mdi-bookmark-outline'"
      @click="toggleBookmark()"
    >
      Bookmark
    </v-list-item>
  </template>
</template>
