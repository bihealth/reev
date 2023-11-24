<script setup lang="ts">
export interface Props {
  ncbi: any
}

const props = withDefaults(defineProps<Props>(), {
  ncbi: null
})
</script>

<template>
  <v-card id="gene-rifs" class="gene-item">
    <v-card-title>GeneRIFs</v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <ul
        class="overflow-auto"
        style="max-height: 200px; font-size: 90%"
        v-if="props.ncbi?.rifEntries?.length"
      >
        <template v-for="entry in props.ncbi.rifEntries" :key="entry">
          <li v-if="entry?.text?.length">
            {{ entry.text }}
            <a
              :href="'https://www.ncbi.nlm.nih.gov/pubmed/?term=' + entry.pmids.join('+')"
              target="_blank"
            >
              <v-icon>mdi-launch</v-icon>
              PubMed
            </a>
          </li>
        </template>
      </ul>
      <div v-else>No GeneRIFs available for gene.</div>
    </v-card-text>
  </v-card>
</template>
