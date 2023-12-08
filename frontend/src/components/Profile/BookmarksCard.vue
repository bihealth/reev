<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

import { search } from '@/lib/utils'
import { useBookmarksStore } from '@/stores/bookmarks'

const bookmarksStore = useBookmarksStore()
const router = useRouter()

/**
 * Perform a search based on the bookmark id.
 *
 * If a route is found for the search term then redirect to that route.
 * Otherwise log an error.
 *
 * @param query Query to search for
 */
const performSearch = async (query: string) => {
  const routeLocation: any = await search(query, 'grch37')
  if (routeLocation) {
    router.push(routeLocation)
  } else {
    console.error(`no route found for ${query}`)
  }
}

onMounted(async () => {
  await bookmarksStore.loadBookmarks()
})
</script>

<template>
  <v-card class="mx-auto pa-4 pb-8 mt-3" rounded="lg">
    <v-card-title>Your bookmarks:</v-card-title>
    <v-card-text>
      <v-list v-if="bookmarksStore.bookmarks.length">
        <v-list-item
          v-for="bookmark in bookmarksStore.bookmarks"
          :key="bookmark.id"
          density="compact"
        >
          <v-list-item-title>
            <v-btn color="primary" @click="performSearch(bookmark.obj_id)">
              {{ bookmark.obj_id }}
            </v-btn>
            <v-btn
              class="ma-2"
              color="secondary"
              icon
              @click="bookmarksStore.deleteBookmark(bookmark.obj_type, bookmark.obj_id)"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-list-item-title>
        </v-list-item>
      </v-list>
      <v-card-subtitle v-else> You have no bookmarks yet. </v-card-subtitle>
    </v-card-text>
  </v-card>
</template>
