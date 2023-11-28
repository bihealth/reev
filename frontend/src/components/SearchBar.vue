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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const emit = defineEmits<{
  (event: 'update:searchTerm' | 'update:genomeRelease', value: string): void
  clickSearch: (searchTerm: string, genomeRelease: string) => void
}>()

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
  <v-toolbar id="search-bar" floating>
    <v-text-field
      id="search-term"
      variant="outlined"
      hide-details
      single-line
      :model-value="props.searchTerm"
      label="Enter search term"
      @input="$emit('update:searchTerm', $event.target.value)"
      @keydown.enter="$emit('clickSearch', props.searchTerm, props.genomeRelease)"
    />
    <div>
      <v-select
        id="genome-release"
        variant="outlined"
        hide-details
        single-line
        :model-value="props.genomeRelease"
        :items="props.genomeReleaseChoices"
        item-title="label"
        item-value="value"
        label="Genome Release"
        @update:model-value="$emit('update:genomeRelease', $event)"
      />
    </div>

    <v-btn
      id="search"
      color="primary"
      @click="$emit('clickSearch', props.searchTerm, props.genomeRelease)"
    >
      <v-icon>mdi-magnify</v-icon>
      search
    </v-btn>
  </v-toolbar>
</template>

<style scoped>
#search-bar {
  background-color: white;
  border: 1px solid #455a64;
  border-radius: 10px;
  padding: 0 10px;
}

#search {
  margin-left: 10px;
}
</style>
