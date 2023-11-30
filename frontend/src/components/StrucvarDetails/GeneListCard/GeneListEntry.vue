<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import GeneDosage from '@/components/StrucvarDetails/GeneListCard/GeneDosage.vue'
import ScoreChip from '@/components/StrucvarDetails/GeneListCard/ScoreChip.vue'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps<{
  item: any
  hgncToEffect?: { [key: string]: string }
  sortKey?: string
  sortOrder?: 'asc' | 'desc'
  isSelected: boolean
  genomeRelease?: 'grch37' | 'grch38'
}>()

const emit = defineEmits(['toggleSelected'])

const router = useRouter()

/**
 * Pick smallest of the shortest RefSeq transcript IDs.
 *
 * @param refseqIds RefSeq transcript IDs to pick from
 */
const pickRefSeqId = (refseqIds: string[] | undefined): string => {
  if (!refseqIds) {
    return 'N/A'
  }
  refseqIds.sort((a, b) => {
    if (a.length < b.length) {
      return -1
    } else if (a.length > b.length) {
      return 1
    } else {
      return a.localeCompare(b)
    }
  })
  return refseqIds[0]
}

/** Return icon name for sorting */
const sortIcon = computed<string>(() => {
  return props.sortOrder === 'desc' ? 'mdi-triangle-small-down' : 'mdi-triangle-small-up'
})
</script>

<template>
  <v-sheet rounded="sm" class="pa-3 mt-1 border">
    <v-row no-gutter>
      <v-col
        cols="2"
        class="d-flex flex-row pa-1"
        @click.prevent="
          () => {
            if (!isSelected) {
              emit('toggleSelected')
            }
          }
        "
      >
        <div class="flex-shrink-0 pl-0 pr-3 py-2">
          <v-icon :icon="isSelected ? 'mdi-magnify-expand' : 'mdi-crop-square'" />
        </div>
        <div class="flex-grow-0">
          <div class="text-h6">
            <v-icon v-if="sortKey === 'hgnc.symbol'" :icon="sortIcon" class="ml-n2 mr-n3" />
            {{ item.raw.hgnc.symbol }}
            <span class="text-caption text-no-wrap">
              <template v-if="hgncToEffect">
                ({{ hgncToEffect[item.raw.hgnc.agr] ?? 'unknown' }})
              </template>
              <template v-else> N/A </template>
            </span>
          </div>
          <div>
            {{ pickRefSeqId(item.raw.dbnsfp?.refseqId) }}
            |
            <a
              style="cursor: pointer"
              title="go to Gene details page"
              @click.prevent="
                router.push({
                  name: 'gene',
                  params: { searchTerm: item.raw.hgnc.agr, genomeRelease: genomeRelease }
                })
              "
            >
              <v-icon>mdi-arrow-right-circle-outline</v-icon>
            </a>
          </div>
        </div>
      </v-col>
      <v-col cols="10" class="d-flex flex-column pa-0">
        <v-row no-gutter class="bg-grey-lighten-3 ma-0">
          <v-col cols="3" class="pr-3 align-self-end pa-1">
            <table style="width: 280px">
              <tr>
                <td
                  class="text-no-wrap"
                  :class="{
                    'text-decoration-underline': sortKey === 'clingen.haploinsufficiencyScore'
                  }"
                >
                  <v-icon
                    v-if="sortKey === 'clingen.haploinsufficiencyScore'"
                    :icon="sortIcon"
                    class="ml-n2 mr-n1"
                  />
                  ClinGen haploinsufficiency
                </td>
                <td class="text-right text-no-wrap">
                  <GeneDosage
                    :dosage="item.raw.clingen?.haploinsufficiencyScore"
                    :gene-symbol="item.raw.hgnc?.symbol"
                  />
                </td>
              </tr>
              <tr>
                <td
                  class="text-no-wrap"
                  :class="{
                    'text-decoration-underline': sortKey === 'clingen.triplosensitivityScore'
                  }"
                >
                  <v-icon
                    v-if="sortKey === 'clingen.triplosensitivityScore'"
                    :icon="sortIcon"
                    class="ml-n2 mr-n1"
                  />
                  ClinGen triplosensitivity
                </td>
                <td class="text-right text-no-wrap">
                  <GeneDosage
                    :dosage="item.raw.clingen?.triplosensitivityScore"
                    :gene-symbol="item.raw.hgnc?.symbol"
                  />
                </td>
              </tr>
            </table>
          </v-col>
          <v-col cols="3" class="pr-3 align-self-end pa-1">
            <table style="width: 280px">
              <tr>
                <td
                  class="text-no-wrap"
                  :class="{ 'text-decoration-underline': sortKey === 'gnomadConstraints.pli' }"
                >
                  <v-icon
                    v-if="sortKey === 'gnomadConstraints.pli'"
                    :icon="sortIcon"
                    class="ml-n2 mr-n1"
                  />
                  gnomAD pLI
                </td>
                <td class="text-right text-no-wrap">
                  <ScoreChip
                    :value="item.raw.gnomadConstraints?.pli"
                    :href-url="
                      item.raw.hgnc.ensemblGeneId
                        ? `https://gnomad.broadinstitute.org/gene/${item.raw.hgnc.ensemblGeneId}?dataset=gnomad_r2_1`
                        : undefined
                    "
                    :range-gray="[-9999, 0.9]"
                    :range-red="[0.9, 9999]"
                  />
                </td>
              </tr>
              <tr>
                <td class="text-no-wrap">
                  <v-icon
                    v-if="sortKey === 'gnomadConstraints.oeLofUpper'"
                    :icon="sortIcon"
                    class="ml-n2 mr-n1"
                  />
                  gnomAD LOEUF
                </td>
                <td class="text-right text-no-wrap">
                  <ScoreChip
                    :value="item.raw.gnomadConstraints?.oeLofUpper"
                    :href-url="
                      item.raw.hgnc.ensemblGeneId
                        ? `https://gnomad.broadinstitute.org/gene/${item.raw.hgnc.ensemblGeneId}?dataset=gnomad_r2_1`
                        : undefined
                    "
                    :range-gray="[-9999, 0.6]"
                    :range-red="[0.6, 9999]"
                  />
                </td>
              </tr>
            </table>
          </v-col>
          <v-col cols="3" class="pr-3 align-self-end pa-1">
            <!--
              https://europepmc.org/article/MED/20976243

              ClinGen Dosage Sensitivity Single Gene Evaluation Process v1.0 => >=0.9

            -->
            <table style="width: 280px">
              <tr>
                <td
                  class="text-no-wrap"
                  :class="{ 'text-decoration-underline': sortKey === 'decipherHi.pHi' }"
                >
                  <v-icon
                    v-if="sortKey === 'decipherHi.pHi'"
                    :icon="sortIcon"
                    class="ml-n2 mr-n1"
                  />
                  DECIPHER HI
                </td>
                <td class="text-right text-no-wrap">
                  <ScoreChip
                    :value="item.raw.decipherHi?.pHi"
                    :href-url="
                      item.raw.hgnc.symbol
                        ? `https://www.deciphergenomics.org/gene/${item.raw.hgnc.symbol}/`
                        : undefined
                    "
                    :range-gray="[-9999, 0.9]"
                    :range-red="[0.9, 9999]"
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <!-- placeholder-->
                  &nbsp;
                </td>
              </tr>
            </table>
          </v-col>
          <v-col cols="3" class="pr-3 align-self-end pa-1">
            <!--
              https://europepmc.org/article/MED/35917817
            -->
            <table style="width: 280px">
              <tr>
                <td
                  class="text-no-wrap"
                  :class="{ 'text-decoration-underline': sortKey === 'rcnv.pHaplo' }"
                >
                  <v-icon v-if="sortKey === 'rcnv.pHaplo'" :icon="sortIcon" class="ml-n2 mr-n1" />
                  RCNV pHaplo
                </td>
                <td class="text-right text-no-wrap">
                  <ScoreChip
                    :value="item.raw.rcnv?.pHaplo"
                    :href-url="
                      item.raw.hgnc.symbol
                        ? `https://www.deciphergenomics.org/gene/${item.raw.hgnc.symbol}/`
                        : undefined
                    "
                    :range-green="[0.0, 0.2]"
                    :range-gray="[0.2, 0.7]"
                    :range-orange="[0.7, 0.86]"
                    :range-red="[0.86, 1.0]"
                  />
                </td>
              </tr>
              <tr>
                <td
                  class="text-no-wrap"
                  :class="{ 'text-decoration-underline': sortKey === 'rcnv.pTriplo' }"
                >
                  <v-icon v-if="sortKey === 'rcnv.pTriplo'" :icon="sortIcon" class="ml-n2 mr-n1" />
                  RCNV pTriplo
                </td>
                <td class="text-right text-no-wrap">
                  <ScoreChip
                    :value="item.raw.rcnv?.pTriplo"
                    :href-url="
                      item.raw.hgnc.symbol
                        ? `https://www.deciphergenomics.org/gene/${item.raw.hgnc.symbol}/`
                        : undefined
                    "
                    :range-green="[0.0, 0.2]"
                    :range-gray="[0.2, 0.8]"
                    :range-orange="[0.8, 0.94]"
                    :range-red="[0.94, 1.0]"
                  />
                </td>
              </tr>
            </table>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-sheet>
</template>
