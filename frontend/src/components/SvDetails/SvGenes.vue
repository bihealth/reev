<script setup lang="ts">
import { type ComputedRef, type Ref, computed, ref } from 'vue'

import {
  CLINGEN_DOSAGE_LABELS,
  CLINGEN_DOSAGE_SCORES
} from '@/components/GeneDetails/ConstraintsCard.c'
import VariantDetailsGene from '@/components/VariantDetails/VariantGene.vue'
import { roundIt, search } from '@/lib/utils'
import router from '@/router'

/** `GeneInfo` is a type alias for easier future interface definition. */
type GeneInfo = any

const props = defineProps<{
  genesInfos?: GeneInfo[]
}>()

const currentGeneInfos: Ref<any> = ref(null)
const itemsPerPage = ref(10)

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
</script>

<template>
  <v-card>
    <v-card-title>Genes</v-card-title>
    <v-divider />
    <v-card-text>
      <div>
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
          <template v-slot:[`item.dbnsfp.geneName`]="{ item }">
            {{ item.dbnsfp.geneName }}
            <v-btn prepend-icon="mdi-open-in-new" @click="performSearch(item.dbnsfp.geneName)" />
          </template>

          <template v-slot:[`item.omim`]="{ value }">
            <template v-if="value?.omimDiseases?.length">
              <template v-for="(disease, idx) in value?.omimDiseases" :key="idx">
                <template v-if="idx > 0">, </template>
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

          <template v-slot:[`item.orpha`]="{ value }">
            <template v-if="value?.orphaDiseases?.length">
              <template v-for="(disease, idx) in value?.orphaDiseases" :key="idx">
                <template v-if="idx > 0">, </template>
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

          <template v-slot:[`item.gnomadConstraints.pli`]="{ value }">
            <template v-if="value">
              <span v-html="roundIt(value, 3)" />
            </template>
            <template v-else> &mdash; </template>
          </template>

          <template v-slot:[`item.gnomadConstraints.oeLofUpper`]="{ value }">
            <template v-if="value">
              <span v-html="roundIt(value, 3)" />
            </template>
            <template v-else> &mdash; </template>
          </template>

          <template v-slot:[`item.dbnsfp.haploinsufficiency`]="{ value }">
            <template v-if="value">
              <span v-html="roundIt(value, 3)" />
            </template>
            <template v-else> &mdash; </template>
          </template>

          <template v-slot:[`item.shet.sHet`]="{ value }">
            <template v-if="value">
              <span v-html="roundIt(value, 3)" />
            </template>
            <template v-else> &mdash; </template>
          </template>

          <template v-slot:[`item.rcnv.pHaplo`]="{ value }">
            <template v-if="value">
              <span v-html="roundIt(value, 3)"></span>
            </template>
            <template v-else> &mdash; </template>
          </template>

          <template v-slot:[`item.rcnv.pTriplo`]="{ value }">
            <template v-if="value">
              <span v-html="roundIt(value, 3)" />
            </template>
            <template v-else> &mdash; </template>
          </template>

          <template v-slot:[`item.clingen.haploinsufficiencyScore`]="{ value }">
            <template v-if="value">
              <abbr :title="CLINGEN_DOSAGE_LABELS[value]">{{ CLINGEN_DOSAGE_SCORES[value] }}</abbr>
            </template>
            <template v-else> &mdash; </template>
          </template>

          <template v-slot:[`item.clingen.triplosensitivityScore`]="{ value }">
            <template v-if="value">
              <abbr :title="CLINGEN_DOSAGE_LABELS[value]">{{ CLINGEN_DOSAGE_SCORES[value] }}</abbr>
            </template>
            <template v-else> &mdash; </template>
          </template>
        </v-data-table>
      </div>

      <div v-if="currentGeneInfos">
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
      </div>
    </v-card-text></v-card
  >
</template>
