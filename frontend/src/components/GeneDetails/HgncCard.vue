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
    <v-card-title>HGNC</v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <div>
        <div>
          <strong>symbol:</strong>
          {{ props.hgnc?.symbol }}
        </div>
        <div>
          <strong>name:</strong>
          {{ props.hgnc?.name }}
        </div>
        <div>
          <strong>cytoband:</strong>
          {{ props.hgnc?.location }}
        </div>
        <div>
          <strong>aliases:</strong>
          {{ props.hgnc?.aliasName?.join(', ') }}
        </div>
        <div>
          <strong>synonyms:</strong>
          {{ props.hgnc?.aliasSymbol?.join(', ') }}
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>
