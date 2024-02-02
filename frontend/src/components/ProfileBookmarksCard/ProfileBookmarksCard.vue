<script setup lang="ts">
import { onMounted } from 'vue'

import { bookmarkTo } from '@/lib/utils'
import { useBookmarksStore } from '@/stores/bookmarks'

const bookmarksStore = useBookmarksStore()

// Load bookmarks when mounted.
onMounted(() => bookmarksStore.loadBookmarks())
</script>

<template>
  <v-card class="mx-auto pa-4 pb-8 mt-3">
    <v-card-title>Your bookmarks</v-card-title>
    <v-card-text>
      <v-list v-if="bookmarksStore.bookmarks.length">
        <v-list-item
          v-for="bookmark in bookmarksStore.bookmarks"
          :key="bookmark.id"
          density="compact"
        >
          <v-list-item-title>
            <v-btn
              color="primary"
              :to="bookmarkTo(bookmark)"
              target="_blank"
              prepend-icon="mdi-launch"
              variant="tonal"
              rounded="sm"
              class="mr-2"
            >
              {{ bookmark.obj_id }}
            </v-btn>
            <v-btn
              color="secondary"
              icon
              size="small"
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
