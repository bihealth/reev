<script setup lang="ts">
import { onMounted } from 'vue'

import { useSeqvarAcmgRatingStore } from '@/stores/seqvarAcmgRating'

const acmgRatingStore = useSeqvarAcmgRatingStore()

const getPresentCriterias = (criterias: any) =>
  criterias.filter((criteria: any) => criteria.presence === 'Present')

/** Return route for seqvar name. */
const seqvarNameTo = (seqvarName: string) => {
  const seqvar = 'grch37-' + seqvarName.replace(/:/g, '-')
  return {
    name: 'seqvar-details',
    params: { seqvar }
  }
}

// Load ACMG ratings when mounted.
onMounted(() => acmgRatingStore.listAcmgRatings())
</script>

<template>
  <v-card class="mt-2">
    <v-card-title>ACMG Sequence Variant Interpretation</v-card-title>

    <v-card-text>
      <div v-if="acmgRatingStore.acmgRatings.length === 0">No ACMG ratings available.</div>

      <div v-else>
        <v-table density="compact">
          <thead>
            <tr>
              <th style="width: 20%">Variant Name</th>
              <th style="width: 80%">Active Criteria</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="rating in acmgRatingStore.acmgRatings" :key="rating.seqvar_name">
              <td>
                <v-btn variant="text" :to="seqvarNameTo(rating.seqvar_name)">
                  {{ rating.seqvar_name }}
                  <v-icon class="pl-1">mdi-arrow-right-circle-outline</v-icon>
                </v-btn>
              </td>
              <td>
                <div
                  v-for="criteria in getPresentCriterias(rating.acmg_rank.criterias)"
                  :key="criteria.criteria"
                >
                  {{ criteria.criteria }}: {{ criteria.evidence }}
                </div>
              </td>
            </tr>
          </tbody>
        </v-table>
      </div>
    </v-card-text>
  </v-card>
</template>
