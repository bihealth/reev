<script setup lang="ts">
/** Genome release string values. */
type GenomeRelease = 'grch37' | 'grch38'

/** Type for genome releases. */
interface GenomeReleaseChoice {
  value: GenomeRelease
  label: string
}

/** The choices of genomes available. */
const GENOME_RELEASES: GenomeReleaseChoice[] = [
  { value: 'grch37', label: 'GRCh37' },
  { value: 'grch38', label: 'GRCh38' }
]

/** Mapping from gennome release name to `GenomeReleaseChoice`. */
const GENOME_RELEASES_MAP: { [key: string]: GenomeReleaseChoice } = Object.fromEntries(
  GENOME_RELEASES.map((choice) => [choice.value, choice])
)

/** Type definition for component's props. */
interface Props {
  searchTerm?: string
  genomeRelease?: GenomeRelease
  density?: 'default' | 'comfortable' | 'compact'
}

/** Define the component's props. */
const props = withDefaults(defineProps<Props>(), {
  searchTerm: '',
  genomeRelease: 'grch37',
  density: 'default'
})

/** Launch search if any term has been entered. */
const runSearch = async () => {
  if (props.searchTerm) {
    emit('clickSearch', props.searchTerm, props.genomeRelease)
  }
}

/** Define the emits. */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const emit = defineEmits<{
  (event: 'update:searchTerm' | 'update:genomeRelease', value: string): void
  (event: 'clickSearch', searchTerm: string, genomeRelease: string): void
}>()
</script>

<template>
  <div class="d-flex d-flex-row">
    <v-text-field
      class="my-3 search-term"
      :label="props.density != 'compact' ? 'Search for variant or gene' : undefined"
      prepend-inner-icon="mdi-magnify"
      rounded="xl"
      variant="outlined"
      :density="props.density"
      clearable
      :hide-details="true"
      :model-value="searchTerm"
      @input="$emit('update:searchTerm', $event.target.value)"
      @keydown.enter="() => runSearch()"
    >
      <template #append-inner>
        <v-menu :transition="false">
          <template #activator="{ props: innerProps }">
            <v-btn
              color="black"
              v-bind="innerProps"
              rounded="xs"
              spacing="compact"
              append-icon="mdi-chevron-down"
              variant="text"
              class="genome-release-menu"
            >
              {{ GENOME_RELEASES_MAP[genomeRelease]?.label }}
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="{ value, label } in GENOME_RELEASES"
              :key="value"
              :value="value"
              @click.prevent="() => runSearch()"
            >
              <v-list-item-title>{{ label }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-btn variant="text" rounded="xl" class="start-search" @click.prevent="() => runSearch()">
          <v-icon>mdi-rocket-launch</v-icon>
        </v-btn>
      </template>
    </v-text-field>
  </div>
</template>
