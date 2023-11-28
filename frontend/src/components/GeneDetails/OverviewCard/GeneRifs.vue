<script setup lang="ts">
export interface Props {
  ncbi: any
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = withDefaults(defineProps<Props>(), {
  ncbi: null
})
</script>

<template>
  <div class="d-flex flex-column">
    <div class="d-flex flex-column">
      <div class="text-subtitle-1">
        NCBI References Into Function
        <small>({{ ncbi?.rifEntries?.length ?? 0 }})</small>
      </div>
    </div>
    <ul v-if="ncbi?.rifEntries?.length" class="d-flex flex-column flex-grow-1">
      <ul class="h-auto overflow-auto" style="max-height: 200px; font-size: 90%; height: 100%">
        <template v-for="entry in ncbi.rifEntries" :key="entry">
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
    </ul>
    <div v-else>No GeneRIFs available for gene.</div>
  </div>
</template>
