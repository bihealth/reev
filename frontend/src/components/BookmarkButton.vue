<script setup lang="ts">
import { onMounted, ref } from 'vue'

import { BookmarksClient } from '@/api/bookmarks'

// Import the BookmarksClient

export interface Props {
  type: string
  id: string
}

const props = withDefaults(defineProps<Props>(), {
  type: '',
  id: ''
})

const isBookmarked = ref(false)
const client = new BookmarksClient()

// Fetch existing bookmark for the given type and id on mount
onMounted(async () => {
  try {
    const bookmark = await client.fetchBookmark(props.type, props.id)
    if (bookmark) {
      isBookmarked.value = true
    }
  } catch (e) {
    console.error(e)
    isBookmarked.value = false
  }
})

// Function to toggle bookmark
const toggleBookmark = async () => {
  if (isBookmarked.value) {
    await client.deleteBookmark(props.type, props.id)
  } else {
    await client.createBookmark(props.type, props.id)
  }
  try {
    await client.fetchBookmark(props.type, props.id)
    isBookmarked.value = true
  } catch (e) {
    isBookmarked.value = false
  }
}
</script>

<template>
  <div class="ml=2">
    <span v-if="!isBookmarked">Bookmark this</span>
    <span v-else>Delete bookmark</span>
    <v-btn class="ml-2" :icon="!isBookmarked" @click="toggleBookmark">
      <v-icon>
        {{ isBookmarked ? 'mdi-star' : 'mdi-star-outline' }}
      </v-icon>
    </v-btn>
  </div>
</template>
