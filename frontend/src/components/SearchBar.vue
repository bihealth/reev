<script setup lang="ts">
export interface GenomeReleaseChoice {
  value: string
  label: string
}

export interface Props {
  searchTerm?: string
  genomeRelease?: string
  genomeReleaseChoices?: GenomeReleaseChoice[]
}

const props = withDefaults(defineProps<Props>(), {
  searchTerm: '',
  genomeRelease: 'grch37',
  genomeReleaseChoices: () => [
    { value: 'grch37', label: 'GRCh37' },
    { value: 'grch38', label: 'GRCh38' }
  ]
})
</script>

<template>
  <v-toolbar floating id="search-bar">
    <v-text-field
      variant="outlined"
      hide-details
      single-line
      :model-value="props.searchTerm"
      @input="$emit('update:searchTerm', $event.target.value)"
      label="Enter search term"
      id="search-term"
    ></v-text-field>
    <div>
      <v-select
        variant="outlined"
        hide-details
        single-line
        :model-value="props.genomeRelease"
        @update:model-value="$emit('update:genomeRelease', $event)"
        :items="props.genomeReleaseChoices"
        item-title="label"
        item-value="value"
        label="Genome Release"
        id="genome-release"
      ></v-select>
    </div>

    <v-btn
      id="search"
      @click="$emit('clickSearch', props.searchTerm, props.genomeRelease)"
      color="primary"
    >
      <v-icon>mdi-magnify</v-icon>
      search
    </v-btn>
  </v-toolbar>
</template>

<style scoped>
#search-bar {
  background-color: white;
  padding: 0 10px;
}

#search {
  margin-left: 10px;
}
</style>
