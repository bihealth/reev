<script setup lang="ts">
import { type Ref, computed, ref } from 'vue'

import Entry from '@/components/SvDetails/GeneListCard/Entry.vue'
import VariantDetailsGene from '@/components/VariantDetails/VariantGene.vue'
import { roundIt, search } from '@/lib/utils'
import router from '@/router'
import { StoreState } from '@/stores/misc'

/** `GeneInfo` is a type alias for easier future interface definition. */
type GeneInfo = any

const props = defineProps<{
  currentSvRecord?: any
  genesInfos?: GeneInfo[]
  storeState?: StoreState
}>()

const headers = [
  {
    title: 'symbol',
    key: 'dbnsfp.geneName',
    width: 150,
    sortable: true
  },
  {
    title: 'name',
    key: 'dbnsfp.geneFullName',
    width: 200
  },
  {
    title: 'OMIM',
    key: 'omim',
    sortable: true
  },
  {
    title: 'Orphanet',
    key: 'orpha',
    sortable: true
  },
  {
    title: 'pLI',
    key: 'gnomadConstraints.pli',
    width: 50,
    sortable: true
  },
  {
    title: 'o/e LoF (upper)',
    key: 'gnomadConstraints.oeLofUpper',
    width: 100,
    sortable: true
  },
  {
    title: 'P(HI)',
    width: 50,
    key: 'dbnsfp.haploinsufficiency'
  },
  {
    title: 'sHet',
    width: 100,
    key: 'shet.sHet',
    sortable: true
  },
  {
    title: 'pHaplo',
    width: 100,
    key: 'rcnv.pHaplo',
    sortable: true
  },
  {
    title: 'pTriplo',
    width: 100,
    key: 'rcnv.pTriplo',
    sortable: true
  },
  {
    title: 'ClinGen HI',
    width: 100,
    key: 'clingen.haploinsufficiencyScore'
  },
  {
    title: 'ClinGen TS',
    width: 100,
    key: 'clingen.triplosensitivityScore'
  }
]

/** Show gene info on click. */
const onRowClicked = (event: Event, { item }: { item: GeneInfo }): void => {
  currentGeneInfos.value = item
}

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

/** Currently selected gene infos. */
const currentGeneInfos: Ref<any> = ref(null)
/** Available items per page. */
const itemsPerPageChoices = [10, 20, 50]
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
  transcript_variant: 'whole transcript',
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
type DataTableCompareFunction<T = any> = (a: T, b: T) => number;
const customKeySort: {[key: string]: DataTableCompareFunction} = {
  'gnomadConstraints.pli': _sortNumberNaGreater,
  'gnomadConstraints.oeLofUpper': _sortNumberNaGreater,
  'decipherHi.pHi': _sortNumberNaLess,
  'rcnv.pHaplo': _sortNumberNaLess,
  'rcnv.pTriplo': _sortNumberNaLess,
}
</script>

<template>
  <v-card>
    <v-card-title class="pb-0"> Gene List </v-card-title>
    <v-card-subtitle class="text-overline"> Overlapping and Contained Genes </v-card-subtitle>
    <v-card-text>
      <v-data-iterator
        v-model:items-per-page="itemsPerPage"
        :items="genesInfos"
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
          <v-toolbar class="px-2">
            <v-spacer></v-spacer>
            <v-select
              style="width: 220px;"
              label="sort by"
              item-title="label"
              item-value="key"
              :items="sortItems"
              v-model="sortKey"
              density="compact"
              :hide-details="true"
              class="d-inline-flex flex-grow-0"
              variant="outlined"
            />
            <v-btn @click="sortOrder = sortOrder == 'asc' ? 'desc' : 'asc'">
              {{ sortOrder }}
              <v-icon :icon="sortOrder == 'asc' ? 'mdi-sort-ascending' : 'mdi-sort-descending'" class="pl-3" />
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
              @toggle-selected="() => {console.log(item); return toggleSelect(item as any)}"
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
          <div class="d-flex align-center justify-center pa-3 mt-3">
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

      <!-- <div>
        <v-data-table
          v-model:items-per-page="itemsPerPage"
          :headers="headers"
          :items="props.genesInfos ?? []"
          :loading="!props.genesInfos?.length"
          buttons-pagination
          show-index
          item-key="dbnsfp.geneName"
          @click:row="onRowClicked"
        >
          <template #[`item.dbnsfp.geneName`]="{ item }">
            {{ item.dbnsfp.geneName }}
            <v-btn prepend-icon="mdi-open-in-new" @click="performSearch(item.dbnsfp.geneName)" />
          </template>

          <template #[`item.omim`]="{ value }">
            <template v-if="value?.omimDiseases?.length">
              <template v-for="(disease, idx) in value?.omimDiseases" :key="idx">
                <template v-if="idx > 0"> , </template>
                <a
                  :href="`https://www.omim.org/entry/${disease.omimId.replace('OMIM:', '')}`"
                  target="_blank"
                >
                  {{ disease.label }}
                </a>
              </template>
            </template>
            <template v-else> &mdash; </template>
          </template>

          <template #[`item.orpha`]="{ value }">
            <template v-if="value?.orphaDiseases?.length">
              <template v-for="(disease, idx) in value?.orphaDiseases" :key="idx">
                <template v-if="idx > 0"> , </template>
                <a
                  :href="`https://www.orpha.net/consor/cgi-bin/OC_Exp.php?Expert=${disease.orphaId.replace(
                    'ORPHA:',
                    ''
                  )}`"
                  target="_blank"
                >
                  {{ disease.label }}
                </a>
              </template>
            </template>
            <template v-else> &mdash; </template>
          </template>

          <template #[`item.gnomadConstraints.pli`]="{ value }">
            <template v-if="value">
              <!## eslint-disable vue/no-v-html ##>
              <span v-html="roundIt(value, 3)" />
              <!## eslint-enable ##>
            </template>
            <template v-else> &mdash; </template>
          </template>

          <template #[`item.gnomadConstraints.oeLofUpper`]="{ value }">
            <template v-if="value">
              <!## eslint-disable vue/no-v-html ##>
              <span v-html="roundIt(value, 3)" />
              <!## eslint-enable ##>
            </template>
            <template v-else> &mdash; </template>
          </template>

          <template #[`item.dbnsfp.haploinsufficiency`]="{ value }">
            <template v-if="value">
              <!## eslint-disable vue/no-v-html ##>
              <span v-html="roundIt(value, 3)" />
              <!## eslint-enable ##>
            </template>
            <template v-else> &mdash; </template>
          </template>

          <template #[`item.shet.sHet`]="{ value }">
            <template v-if="value">
              <!## eslint-disable vue/no-v-html ##>
              <span v-html="roundIt(value, 3)" />
              <!## eslint-enable ##>
            </template>
            <template v-else> &mdash; </template>
          </template>

          <template #[`item.rcnv.pHaplo`]="{ value }">
            <template v-if="value">
              <!## eslint-disable vue/no-v-html ##>
              <span v-html="roundIt(value, 3)" />
              <!## eslint-enable ##>
            </template>
            <template v-else> &mdash; </template>
          </template>

          <template #[`item.rcnv.pTriplo`]="{ value }">
            <template v-if="value">
              <!## eslint-disable vue/no-v-html ##>
              <span v-html="roundIt(value, 3)" />
              <!## eslint-enable ##>
            </template>
            <template v-else> &mdash; </template>
          </template>

          <template #[`item.clingen.haploinsufficiencyScore`]="{ value }">
            <template v-if="value">
              <abbr :title="CLINGEN_DOSAGE_LABELS[value]">{{ CLINGEN_DOSAGE_SCORES[value] }}</abbr>
            </template>
            <template v-else> &mdash; </template>
          </template>

          <template #[`item.clingen.triplosensitivityScore`]="{ value }">
            <template v-if="value">
              <abbr :title="CLINGEN_DOSAGE_LABELS[value]">{{ CLINGEN_DOSAGE_SCORES[value] }}</abbr>
            </template>
            <template v-else> &mdash; </template>
          </template>
        </v-data-table>
      </div> -->

      <!-- <div v-if="currentGeneInfos">
        <div
          class="ml-2 mr-2"
          style="font-weight: bolder; font-size: 120%; border-bottom: 1px solid #aaaaaa"
        >
          Gene Details: {{ currentGeneInfos.hgnc.symbol }}
        </div>
        <VariantDetailsGene :gene="currentGeneInfos" />
      </div>
      <div v-else class="text-muted text-center font-italic pt-2">
        Select gene in table above to see details.
      </div> -->
    </v-card-text>
  </v-card>
</template>
