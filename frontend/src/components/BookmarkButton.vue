<script setup lang="ts">
import { onMounted, ref } from 'vue'

import { useBookmarksStore } from '@/stores/bookmarks'

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
  bookmarksStore.fetchBookmark(props.type, props.id).then((bookmark) => {
    if (bookmark) {
      isBookmarked.value = true
    } else {
      isBookmarked.value = false
    }
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
  <div class="ml=2">
    <span v-if="!isBookmarked">Bookmark this</span>
    <span v-else>Delete bookmark</span>
    <v-btn class="ml-2" :icon="!isBookmarked" @click="toggleBookmark()">
      <v-icon>
        {{ isBookmarked ? 'mdi-star' : 'mdi-star-outline' }}
      </v-icon>
    </v-btn>
  </div>
</template>
