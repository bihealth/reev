<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

import { AuthClient } from '@/api/auth'
import HeaderDefault from '@/components/HeaderDefault.vue'
import { search } from '@/lib/utils'
import { useBookmarksStore } from '@/stores/bookmarks'
import { useUserStore } from '@/stores/user'

const bookmarksStore = useBookmarksStore()
const userStore = useUserStore()

const router = useRouter()

const logout = async () => {
  const authClient = new AuthClient()
  await authClient.logout()

  userStore.loadCurrentUser()

  router.push('/')
}

/**
 * Perform a search based on the bookmark id.
 *
 * If a route is found for the search term then redirect to that route.
 * Otherwise log an error.
 *
 * @param geneSymbol Gene symbol to search for
 */
const performSearch = async (geneSymbol: string) => {
  const routeLocation: any = await search(geneSymbol, 'grch37')
  if (routeLocation) {
    router.push(routeLocation)
  } else {
    console.error(`no route found for ${geneSymbol}`)
  }
}

const loadDataToStore = async () => {
  await bookmarksStore.loadBookmarks()
}

onMounted(() => {
  userStore.initialize()
  loadDataToStore()
})
</script>

<template>
  <HeaderDefault />
  <v-container fill-height fluid>
    <v-row class="align-center fill-height" justify="center" v-if="userStore.currentUser">
      <v-card
        class="mx-auto pa-4 pb-8 mt-12"
        elevation="8"
        min-width="400"
        max-width="448"
        rounded="lg"
      >
        <v-card-item>
          <v-card-title>User Profile</v-card-title>

          <v-card-subtitle> You are currently logged in... </v-card-subtitle>
        </v-card-item>

        <v-card-text>
          <v-form class="mt-3">
            <v-text-field v-model="userStore.currentUser.email" label="Email" readonly />
            <v-checkbox
              label="is superuser"
              readonly
              v-model="userStore.currentUser.is_superuser"
              v-if="userStore.currentUser.is_superuser"
            />
            <v-checkbox
              label="verified email"
              readonly
              v-model="userStore.currentUser.is_verified"
            />
            <v-checkbox label="active user" readonly v-model="userStore.currentUser.is_active" />
          </v-form>

          <v-row class="pt-6" justify="center">
            <v-btn prepend-icon="mdi-key-variant" id="login" @click="logout"> Logout </v-btn>
          </v-row>
        </v-card-text>
      </v-card>
      <v-card
        class="mx-auto pa-4 pb-8 mt-12"
        elevation="8"
        min-width="400"
        max-width="800"
        rounded="lg"
      >
        <v-card-item>
          <v-card-title>Your bookmarks:</v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item v-for="bookmark in bookmarksStore.bookmarks" :key="bookmark.id">
                <v-card-text>
                  <v-btn @click="performSearch(bookmark.obj_id)">{{ bookmark.obj_id }}</v-btn>
                  <v-btn class="ma-2" icon @click="bookmarksStore.deleteBookmark(bookmark)">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </v-card-text>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card-item>
      </v-card>
    </v-row>

    <v-row v-else>
      <v-card
        class="mx-auto pa-4 pb-8 mt-12"
        elevation="8"
        min-width="400"
        max-width="448"
        rounded="lg"
      >
        <v-card-item>
          <v-card-title>User Profile</v-card-title>

          <v-card-subtitle>You are not logged in</v-card-subtitle>
        </v-card-item>

        <v-card-text>
          <v-row class="pt-6" justify="center">
            <v-btn prepend-icon="mdi-key-variant" id="login" color="success" to="/login">
              Login
            </v-btn>
          </v-row>
        </v-card-text>
      </v-card>
    </v-row>
  </v-container>
</template>
