<script setup lang="ts">
export interface Props {
  dbnsfp: any
}

const props = withDefaults(defineProps<Props>(), {
  dbnsfp: null
})
</script>

<template>
  <v-card>
    <v-card-title>Disease Annotation</v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <v-table>
        <thead>
          <tr>
            <th>Orphanet Disorders</th>
            <th>OMIM Diseases</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>
              <div v-if="props.dbnsfp?.orphanetDisorder?.length">
                {{ props.dbnsfp.orphanetDisorder.join(', ') }}
              </div>
              <div v-else>No Orphanet disorders annotated in dbNSFP.</div>
            </th>
            <th>
              <div v-if="props.dbnsfp?.mimDisease?.length">
                {{ props.dbnsfp.mimDisease.join(', ') }}
              </div>
              <div v-else>No OMIM diseases annotated in dbNSFP.</div>
            </th>
          </tr>
        </tbody>
      </v-table></v-card-text
    >
  </v-card>
</template>
