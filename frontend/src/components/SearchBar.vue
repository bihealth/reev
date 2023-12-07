<script setup lang="ts">
/**
 * Search bar component that allows to search for variants and genes.
 *
 * The `queryTerm` and `genomeRelease` are are model values.
 *
 * The `clickSearch` event is emitted when the search button is clicked.
 */
import { GENOME_BUILD_LABELS, type GenomeBuild } from '@/lib/genomeBuilds'

/** Type definition for component's props. */
interface Props {
  searchTerm?: string
  genomeRelease?: GenomeBuild
  density?: 'default' | 'comfortable' | 'compact'
}

/** Define the component's props. */
const props = withDefaults(defineProps<Props>(), {
  searchTerm: '',
  genomeRelease: 'grch37',
  density: 'default'
})

/** Define the emits. */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const emit = defineEmits<{
  (event: 'update:searchTerm', value: string): void
  (event: 'update:genomeRelease', value: GenomeBuild): void
  (event: 'clickSearch', searchTerm: string, genomeRelease: string): void
}>()

/** Launch search if any term has been entered. */
const runSearch = async () => {
  if (props.searchTerm) {
    emit('clickSearch', props.searchTerm, props.genomeRelease)
  }
}
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
              {{ GENOME_BUILD_LABELS[genomeRelease] ?? genomeRelease }}
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="value in Object.keys(GENOME_BUILD_LABELS)"
              :key="value"
              :value="value"
              @click="() => $emit('update:genomeRelease', value as GenomeBuild)"
            >
              <v-list-item-title>{{ GENOME_BUILD_LABELS[value] }}</v-list-item-title>
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
