<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

import { search } from '@/lib/utils'
import { useVariantAcmgRatingStore } from '@/stores/variantAcmgRating'

const acmgRatingStore = useVariantAcmgRatingStore()
const router = useRouter()

const getPresentCriterias = (criterias: any) =>
  criterias.filter((criteria: any) => criteria.presence === 'Present')

/**
 * Perform a search based on the seqvar name.
 *
 * If a route is found for the search term then redirect to that route.
 * Otherwise log an error.
 *
 * @param query Query to search for
 */
const performSearch = async (query: string) => {
  const routeLocation: any = await search(query, 'grch38')
  if (routeLocation) {
    router.push(routeLocation)
  } else {
    console.error(`no route found for ${query}`)
  }
}

onMounted(() => {
  acmgRatingStore.listAcmgRatings()
})
</script>

<template>
  <v-card class="mt-2">
    <v-card-title>ACMG Sequence Variant Interpretation</v-card-title>

    <v-card-text>
      <div v-if="acmgRatingStore.acmgRatings.length === 0">No ACMG ratings available.</div>

      <div v-else>
        <v-table>
          <thead>
            <tr>
              <th style="width: 20%">Variant Name</th>
              <th style="width: 60%">Active Criteria</th>
              <th style="width: 20%">Variant Link</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="rating in acmgRatingStore.acmgRatings" :key="rating.seqvar_name">
              <td>{{ rating.seqvar_name }}</td>
              <td>
                <div
                  v-for="criteria in getPresentCriterias(rating.acmg_rank.criterias)"
                  :key="criteria.criteria"
                >
                  {{ criteria.criteria }}: {{ criteria.evidence }}
                </div>
              </td>
              <td>
                <v-btn color="primary" @click="performSearch(rating.seqvar_name)">
                  {{ rating.seqvar_name }}
                </v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>
      </div>
    </v-card-text>
  </v-card>
</template>
