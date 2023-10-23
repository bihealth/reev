<script setup lang="ts">
export interface Props {
  hgnc: any
}

const props = withDefaults(defineProps<Props>(), {
  hgnc: null
})
</script>

<template>
  <v-card>
    <v-card-title>Locus-Specific Databases</v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <div v-if="props.hgnc?.lsdb?.length">
        <div v-for="{ name, url } in props.hgnc.lsdb" :key="name">
          <a :href="name" target="_blank">
            <v-icon>mdi-launch</v-icon>
            {{ url }}
          </a>
        </div>
        <div>
          <a
            :href="`https://www.kegg.jp/kegg-bin/search_pathway_text?map=map&keyword=${props.hgnc?.symbol}&mode=1&viewImage=true`"
            target="_blank"
          >
            <v-icon>mdi-launch</v-icon>
            KEGG
          </a>
        </div>
      </div>
      <div v-else>No locus-specific database available for gene.</div>
    </v-card-text>
  </v-card>
</template>
