<script setup lang="ts">
import { type Ref, computed, ref, watch } from 'vue'
import { onMounted } from 'vue'

import Entry from '@/components/SvDetails/GeneListCard/Entry.vue'
import VariantDetailsGene from '@/components/VariantDetails/VariantGene.vue'
import { search } from '@/lib/utils'
import router from '@/router'
import { StoreState } from '@/stores/misc'

/** `GeneInfo` is a type alias for easier future interface definition. */
type GeneInfo = any

const props = withDefaults(
  defineProps<{
    currentSvRecord?: any
    genesInfos?: GeneInfo[]
    storeState?: StoreState
    selectedGeneHgncId: string | null
  }>(),
  {
    selectedGeneHgncId: null
  }
)

const emit = defineEmits(['update:selectedGeneHgncId'])

/**
 * Perform a search based on the input gene symbol and current genome release.
 *
 * If a route is found for the search term then redirect to that route.
 * Otherwise log an error.
 *
 * @param geneSymbol Gene symbol to search for
 */
const performSearch = async (geneSymbol: string) => {
  const routeLocation: any = await search(geneSymbol, 'grch37')
  if (routeLocation) {
    router.push(routeLocation)
  } else {
    console.error(`no route found for ${geneSymbol}`)
  }
}

/** Available items per page. */
const itemsPerPageChoices = [5, 10, 20, 50]
/** Items per page for data iterator. */
const itemsPerPage = ref<number>(10)
/** Current page. */
const currentPage = ref<number>(1)

/** Whether the list of genes is currently loading. */
const isLoading = computed<boolean>(() => {
  return (
    props.storeState === undefined ||
    [StoreState.Initial, StoreState.Loading].includes(props.storeState)
  )
})

/** Mapping from transcript effect to label. */
const TX_EFFECT_LABELS: { [key: string]: string } = {
  transcript_variant: 'whole tx',
  exon_variant: 'exonic',
  splice_region_variant: 'splicing',
  intron_variant: 'intronic',
  upstream_variant: 'upstream',
  downstream_variant: 'downstream',
  other: 'other'
}

/** Helper mapping from gene HGNC ID to worst transcript effect. */
const hgncToEffect = computed<{ [key: string]: string }>(() => {
  const hgncToEffect: { [key: string]: string } = {}
  for (const result of props.currentSvRecord.result ?? []) {
    const txEffect = result.transcript_effects[0]
    if (txEffect) {
      hgncToEffect[result.hgnc_id] = TX_EFFECT_LABELS[txEffect]
    }
  }
  return hgncToEffect
})

/** `v-model` for the selected effect */
// TODO: also display regions and filter
/** `v-model` for the sort key, order */
const sortKey = ref<string>('hgnc.symbol')
const sortOrder = ref<'asc' | 'desc'>('asc')
const sortItems = [
  {
    label: 'symbol',
    key: 'hgnc.symbol'
  },
  {
    label: 'ClinGen Haplo.',
    key: 'clingen.haploinsufficiencyScore'
  },
  {
    label: 'ClinGen Triplo.',
    key: 'clingen.triplosensitivityScore'
  },
  {
    label: 'gnomAD pLI',
    key: 'gnomadConstraints.pli'
  },
  {
    label: 'gnomAD LOEUF',
    key: 'gnomadConstraints.oeLofUpper'
  },
  {
    label: 'DECIPHER HI',
    key: 'decipherHi.pHi'
  },
  {
    label: 'RCNV pHaplo',
    key: 'rcnv.pHaplo'
  },
  {
    label: 'RCNV pTriplo',
    key: 'rcnv.pTriplo'
  }
]

/** Custom key sorting, undefined is `+infinity` */
const _sortNumberNaGreater = (a: number | undefined, b: number | undefined): number => {
  if (a === undefined && b === undefined) {
    return 0
  } else if (a === undefined) {
    return 1
  } else if (b === undefined) {
    return -1
  } else {
    return a - b
  }
}

/** Custom key sorting, undefined is `-infinity` */
const _sortNumberNaLess = (a: number | undefined, b: number | undefined): number => {
  if (a === undefined && b === undefined) {
    return 0
  } else if (a === undefined) {
    return -1
  } else if (b === undefined) {
    return 1
  } else {
    return a - b
  }
}
type DataTableCompareFunction<T = any> = (a: T, b: T) => number
const customKeySort: { [key: string]: DataTableCompareFunction } = {
  'gnomadConstraints.pli': _sortNumberNaGreater,
  'gnomadConstraints.oeLofUpper': _sortNumberNaGreater,
  'decipherHi.pHi': _sortNumberNaLess,
  'rcnv.pHaplo': _sortNumberNaLess,
  'rcnv.pTriplo': _sortNumberNaLess
}

/** State for selected item in iterator */
const selectedItems = computed<any[]>({
  get() {
    return [props.selectedGeneHgncId]
  },
  set(arr) {
    emit('update:selectedGeneHgncId', arr[0])
  }
})

/** Select first element in iterator */
const selectFirst = (storeState: StoreState | undefined) => {
  if (storeState === StoreState.Active && props.genesInfos?.length) {
    selectedItems.value = [props.genesInfos[0].hgnc.agr]
  }
}

/** Watch store for state change to active */
watch(
  () => props.storeState,
  (newStoreState) => selectFirst(newStoreState)
)

/** Select first on being mounted if the store is already active */
onMounted(() => selectFirst(props.storeState))
</script>

<template>
  <v-card>
    <v-card-title class="pb-0"> Gene List </v-card-title>
    <v-card-subtitle class="text-overline"> Overlapping and Contained Genes </v-card-subtitle>
    <v-card-text>
      <v-data-iterator
        v-model="selectedItems"
        v-model:items-per-page="itemsPerPage"
        :items="genesInfos"
        item-value="hgnc.agr"
        :loading="isLoading"
        :page="currentPage"
        :sort-by="[{ key: sortKey, order: sortOrder }]"
        :custom-key-sort="customKeySort"
        :must-sort="true"
        select-strategy="single"
        loading-text="foo"
        buttons-pagination
        show-index
        item-key="dbnsfp.geneName"
      >
        <template v-slot:header>
          <v-toolbar class="px-2 rounded-t-lg border bg-grey-lighten-2">
            <v-spacer></v-spacer>
            <div style="width: 220px">
              <v-select
                label="sort by"
                item-title="label"
                item-value="key"
                :items="sortItems"
                v-model="sortKey"
                density="compact"
                :hide-details="true"
                variant="outlined"
              />
            </div>
            <v-btn @click="sortOrder = sortOrder == 'asc' ? 'desc' : 'asc'">
              {{ sortOrder }}
              <v-icon
                :icon="sortOrder == 'asc' ? 'mdi-sort-ascending' : 'mdi-sort-descending'"
                class="pl-3"
              />
            </v-btn>
          </v-toolbar>
        </template>

        <template v-slot:default="{ items, isSelected, toggleSelect }">
          <template v-for="item in items" :key="item.raw.hgnc.agr">
            <Entry
              :item="item"
              :hgncToEffect="hgncToEffect"
              :sort-key="sortKey"
              :sort-order="sortOrder"
              :is-selected="isSelected(item as any)"
              @toggle-selected="() => toggleSelect(item as any)"
            />
          </template>
        </template>
        <template v-slot:no-data>
          <template v-if="isLoading">
            <v-skeleton-loader class="mt-3 mx-auto border" type="heading,subtitle" />
            <v-skeleton-loader class="mt-3 mx-auto border" type="heading,subtitle" />
            <v-skeleton-loader class="mt-3 mx-auto border" type="heading,subtitle" />
          </template>
          <template v-else>
            <v-sheet rounded="lg" class="pa-3 text-center font-italic border">
              No overlapping gene.
            </v-sheet>
          </template>
        </template>

        <template v-slot:footer="{ pageCount }">
          <div
            class="d-flex align-center justify-center pa-3 mt-1 rounded-b-lg border bg-grey-lighten-2"
          >
            <v-select
              v-model="itemsPerPage"
              class="d-inline-flex flex-grow-0"
              label="page size"
              :items="itemsPerPageChoices"
              variant="outlined"
              density="compact"
              :hide-details="true"
            ></v-select>
            <v-pagination
              v-model="currentPage"
              :length="pageCount"
              :total-visible="7"
              density="compact"
            ></v-pagination>
          </div>
        </template>
      </v-data-iterator>
    </v-card-text>
  </v-card>
</template>
