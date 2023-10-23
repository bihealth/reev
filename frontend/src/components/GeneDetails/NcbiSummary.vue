<script setup lang="ts">
export interface Props {
  ncbiSummary: any
  geneId: string
}

const props = withDefaults(defineProps<Props>(), {
  ncbiSummary: null
})
</script>

<template>
  <v-card>
    <v-card-title>NCBI Summary</v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <div class="overflow-auto" style="max-height: 250px; font-size: 90%">
        {{ props.ncbiSummary }}
        <a :href="`https://www.ncbi.nlm.nih.gov/gene/${props.geneId}`" target="_blank">
          <v-icon>mdi-launch</v-icon>
          source
        </a>
      </div>
    </v-card-text>
  </v-card>
</template>
