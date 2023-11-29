<script setup lang="ts">
import { type Ref, computed, ref } from 'vue'

import {
  CLINGEN_DOSAGE_LABELS,
  CLINGEN_DOSAGE_SCORES
} from '@/components/GeneDetails/PathogenicityCard.c'
import VariantDetailsGene from '@/components/VariantDetails/VariantGene.vue'
import { roundIt, search } from '@/lib/utils'
import router from '@/router'
import { StoreState } from '@/stores/misc'

/** `GeneInfo` is a type alias for easier future interface definition. */
type GeneInfo = any

const props = defineProps<{
  currentSvRecord?: any,
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
const TX_EFFECT_LABELS: {[key: string]: string} = {
  transcript_variant: "whole transcript",
  exon_variant: "exonic",
  splice_region_variant: "splicing",
  intron_variant: "intronic",
  upstream_variant: "upstream",
  downstream_variant: "downstream",
  other: "other",
}

/** Helper mapping from gene HGNC ID to worst transcript effect. */
const hgncToEffect = computed<{[key: string]: string}>(() => {
  const hgncToEffect: {[key: string]: string} = {}
  for (const result of props.currentSvRecord.result ?? []) {
    const txEffect = result.transcript_effects[0]
    if (txEffect) {
      hgncToEffect[result.hgnc_id] = TX_EFFECT_LABELS[txEffect]
    }
  }
  return hgncToEffect
})

const pickRefSeqId = (refseqIds: string[] | undefined): string => {
  if (!refseqIds) {
    return 'N/A'
  }
  refseqIds.sort((a, b) => {
    if (a.length < b.length) {
      return -1;
    } else if (a.length > b.length) {
      return 1;
    } else {
      return a.localeCompare(b);
    }
  })
  return refseqIds[0]
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
        loading-text="foo"
        buttons-pagination
        show-index
        item-key="dbnsfp.geneName"
      >
        <template v-slot:header>
          <v-toolbar class="px-2">
            <v-text-field
              v-model="search"
              clearable
              density="compact"
              hide-details
              placeholder="Search"
              prepend-inner-icon="mdi-magnify"
              style="max-width: 300px"
              variant="solo"
            ></v-text-field>
          </v-toolbar>
        </template>

        <template v-slot:default="{ items }">
          <template v-for="(item, idx) in items" :key="idx">
            <v-sheet rounded="lg" class="pa-3 mt-3 border">
              <v-row no-gutter>
                <v-col>
                  <div class="text-h6">
                    {{ item.raw.hgnc.symbol }}
                    <span class="text-caption">
                      ({{ hgncToEffect[item.raw.hgnc.agr] ?? "unknown" }})
                    </span>
                  </div>
                  <div>
                    {{ pickRefSeqId(item.raw.dbnsfp?.refseqId) }}
                  </div>
                </v-col>
              </v-row>
              <v-row no-gutter class="mt-3 bg-grey-lighten-3 rounded-be-lg rounded-bs-lg">
                <v-col cols="3" class="pr-3">
                  <table style="width: 250px;">
                    <tr>
                      <td class="text-no-wrap">
                        ClinGen haploinsufficiency
                      </td>
                      <td class="text-right text-no-wrap">
                        <template v-if="item.raw.clingen">
                          {{ CLINGEN_DOSAGE_SCORES[item.raw.clingen?.haploinsufficiencyScore] ?? "N/A" }}
                        </template>
                        <span class="font-weight-bold" v-else>N/A</span>
                      </td>
                    </tr>
                    <tr>
                      <td class="text-no-wrap">
                        ClinGen triplosensitivity
                      </td>
                      <td class="text-right text-no-wrap">
                        <template v-if="item.raw.clingen">
                          {{ CLINGEN_DOSAGE_SCORES[item.raw.clingen?.triplosensitivityScore] ?? "N/A" }}
                        </template>
                        <span class="font-weight-bold" v-else>N/A</span>
                      </td>
                    </tr>
                  </table>
                </v-col>
                <v-col cols="3" class="pr-3">
                  <table style="width: 250px;">
                    <tr>
                      <td class="text-no-wrap">
                        gnomAD pLI
                      </td>
                      <td class="text-right text-no-wrap">
                        <!-- eslint-disable vue/no-v-html -->
                        <span v-html="roundIt(item.raw.gnomadConstraints?.pli)" v-if="item.raw.gnomadConstraints"/>
                        <span class="font-weight-bold" v-else>N/A</span>
                        <!-- eslint-enable -->
                      </td>
                    </tr>
                    <tr>
                      <td class="text-no-wrap">
                        gnomAD LOEUF
                      </td>
                      <td class="text-right text-no-wrap">
                        <!-- eslint-disable vue/no-v-html -->
                        <span v-html="roundIt(item.raw.gnomadConstraints?.oeLofUpper)" v-if="item.raw.gnomadConstraints"/>
                        <span class="font-weight-bold" v-else>N/A</span>
                        <!-- eslint-enable -->
                      </td>
                    </tr>
                  </table>
                </v-col>
                <v-col cols="3" class="pr-3">
                  <table style="width: 250px;">
                    <tr>
                      <td class="text-no-wrap">
                        DECIPHER HI
                      </td>
                      <td class="text-right text-no-wrap">
                        <!-- eslint-disable vue/no-v-html -->
                        <span v-html="roundIt(item.raw.decipherHi?.pHi)" v-if="item.raw.decipherHi"/>
                        <span class="font-weight-bold" v-else>N/A</span>
                        <!-- eslint-enable -->
                      </td>
                    </tr>
                  </table>
                </v-col>
                <v-col cols="3">
                  <table style="width: 250px;">
                    <tr>
                      <td class="text-no-wrap">
                        RCNV pHaplo
                      </td>
                      <td class="text-right text-no-wrap">
                        <!-- eslint-disable vue/no-v-html -->
                        <span v-html="roundIt(item.raw.rcnv?.pHaplo)" v-if="item.raw.rcnv"/>
                        <span class="font-weight-bold" v-else>N/A</span>
                        <!-- eslint-enable -->
                      </td>
                    </tr>
                    <tr>
                      <td class="text-no-wrap">
                        RCNV pTriplo
                      </td>
                      <td class="text-right text-no-wrap">
                        <!-- eslint-disable vue/no-v-html -->
                        <span v-html="roundIt(item.raw.rcnv?.pTriplo)" v-if="item.raw.rcnv"/>
                        <span class="font-weight-bold" v-else>N/A</span>
                        <!-- eslint-enable -->
                      </td>
                    </tr>
                  </table>
                </v-col>
              </v-row>
            </v-sheet>
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
