<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

import { AuthClient } from '@/api/auth'
import HeaderDefault from '@/components/HeaderDefault.vue'
import { search } from '@/lib/utils'
import { useBookmarksStore } from '@/stores/bookmarks'
import { useCaseStore } from '@/stores/case'
import { useUserStore } from '@/stores/user'

const bookmarksStore = useBookmarksStore()
const caseStore = useCaseStore()
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

const loadDataToStore = async () => {
  await bookmarksStore.loadBookmarks()
  await caseStore.loadCase()
}

onMounted(() => {
  userStore.initialize()
  loadDataToStore()
})
</script>

<template>
  <HeaderDefault />
  <v-container fill-height fluid>
    <div v-if="userStore.currentUser">
      <v-row class="align-center fill-height" justify="center">
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

        <v-card class="mx-auto pa-4 pb-8 mt-12" elevation="8" min-width="600" rounded="lg">
          <v-card-title>
            <v-row class="align-center fill-height" justify="center">
              <v-card-title>Case Information:</v-card-title>
            </v-row>
          </v-card-title>
          <v-card-text>
            <v-table>
              <thead>
                <tr>
                  <th>Field</th>
                  <th>Current value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Pseudonym</td>
                  <td>{{ caseStore.caseInfo.pseudonym ? caseStore.caseInfo.pseudonym : 'N/A' }}</td>
                </tr>
                <tr>
                  <td>Diseases</td>
                  <td v-if="caseStore.caseInfo.diseases?.length">
                    <v-chip
                      v-for="disease in caseStore.caseInfo.diseases"
                      :key="disease.term_id"
                      label
                      color="primary"
                    >
                      {{ disease }}
                    </v-chip>
                  </td>
                  <td v-else>N/A</td>
                </tr>
                <tr>
                  <td>HPO Terms</td>
                  <td v-if="caseStore.caseInfo.hpoTerms?.length">
                    <v-chip
                      v-for="term in caseStore.caseInfo.hpoTerms"
                      :key="term.term_id"
                      label
                      color="primary"
                    >
                      {{ term }}
                    </v-chip>
                  </td>
                  <td v-else>N/A</td>
                </tr>
                <tr>
                  <td>Inheritance</td>
                  <td>
                    {{ caseStore.caseInfo.inheritance ? caseStore.caseInfo.inheritance : 'N/A' }}
                  </td>
                </tr>
                <tr>
                  <td>Affected Family Members</td>
                  <td>
                    {{
                      caseStore.caseInfo.affectedFamilyMembers
                        ? caseStore.caseInfo.affectedFamilyMembers
                        : 'N/A'
                    }}
                  </td>
                </tr>
                <tr>
                  <td>Sex</td>
                  <td>{{ caseStore.caseInfo.sex }}</td>
                </tr>
                <tr>
                  <td>Age of onset (month)</td>
                  <td>
                    {{
                      caseStore.caseInfo.ageOfOnsetMonths
                        ? caseStore.caseInfo.ageOfOnsetMonths
                        : 'N/A'
                    }}
                  </td>
                </tr>
                <tr>
                  <td>Ethnicity</td>
                  <td>{{ caseStore.caseInfo.ethnicity }}</td>
                </tr>
                <tr>
                  <td>Zygosity</td>
                  <td>{{ caseStore.caseInfo.zygosity }}</td>
                </tr>
                <tr>
                  <td>Family Segregation</td>
                  <td>
                    {{
                      caseStore.caseInfo.familySegregation
                        ? caseStore.caseInfo.familySegregation
                        : 'N/A'
                    }}
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>

        <v-card
          class="mx-auto pa-4 pb-8 mt-12"
          elevation="8"
          min-width="200"
          max-width="600"
          rounded="lg"
        >
          <v-card-item>
            <v-card-title>Your bookmarks:</v-card-title>
            <v-card-text>
              <v-list>
                <v-list-item v-for="bookmark in bookmarksStore.bookmarks" :key="bookmark.id">
                  <v-card-text>
                    <v-btn @click="performSearch(bookmark.obj_id)">{{ bookmark.obj_id }}</v-btn>
                    <v-btn
                      class="ma-2"
                      icon
                      @click="bookmarksStore.deleteBookmark(bookmark.obj_type, bookmark.obj_id)"
                    >
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </v-card-text>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card-item>
        </v-card>
      </v-row>
    </div>

    <div v-else>
      <v-row>
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
    </div>
  </v-container>
</template>
