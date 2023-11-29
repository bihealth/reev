<script setup lang="ts">
import { roundIt } from '@/lib/utils'
import { computed, defineComponent, ref } from 'vue';

import GeneDosage from '@/components/SvDetails/GeneListCard/GeneDosage.vue'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps<{
  item: any
  hgncToEffect?: { [key: string]: string }
  sortKey?: string
  sortOrder?: 'asc' | 'desc'
  isSelected: boolean
}>()

const emit = defineEmits(['toggleSelected'])

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
  <v-sheet rounded="lg" class="pa-3 mt-3 border">
    <v-row no-gutter>
      <v-col cols="2" class="d-flex flex-row">
        <div class="flex-shrink-0 pl-0 pr-3 py-2" @click.prevent="emit('toggleSelected')">
          <v-icon :icon="isSelected ? 'mdi-magnify-expand' : 'mdi-crop-square'" />
        </div>
        <div class="flex-grow-0">
          <div class="text-h6">
            <v-icon
              v-if="sortKey === 'hgnc.symbol'"
              :icon="sortIcon"
              class="ml-n2 mr-n3"
            />
            {{ item.raw.hgnc.symbol }}
            <span class="text-caption">
              <template v-if="hgncToEffect">
                ({{ hgncToEffect[item.raw.hgnc.agr] ?? 'unknown' }})
              </template>
              <template v-else> N/A </template>
            </span>
          </div>
          <div>
            {{ pickRefSeqId(item.raw.dbnsfp?.refseqId) }}
          </div>
        </div>
      </v-col>
      <v-col cols="10" class="d-flex flex-column">
        <v-row no-gutter class="bg-grey-lighten-3">
          <v-col cols="3" class="pr-3 align-self-end">
            <table style="width: 280px">
              <tr>
                <td class="text-no-wrap" :class="{ 'text-decoration-underline': sortKey === 'clingen.haploinsufficiencyScore' }">
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
                <td class="text-no-wrap" :class="{ 'text-decoration-underline': sortKey === 'clingen.triplosensitivityScore' }">
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
          <v-col cols="3" class="pr-3 align-self-end">
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
                  <!-- eslint-disable vue/no-v-html -->
                  <span
                    v-html="roundIt(item.raw.gnomadConstraints?.pli)"
                    v-if="item.raw.gnomadConstraints"
                  />
                  <span class="font-weight-bold" v-else>N/A</span>
                  <!-- eslint-enable -->
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
                  <!-- eslint-disable vue/no-v-html -->
                  <span
                    v-html="roundIt(item.raw.gnomadConstraints?.oeLofUpper)"
                    v-if="item.raw.gnomadConstraints"
                  />
                  <span class="font-weight-bold" v-else>N/A</span>
                  <!-- eslint-enable -->
                </td>
              </tr>
            </table>
          </v-col>
          <v-col cols="3" class="pr-3 align-self-end">
            <table style="width: 280px">
              <tr>
                <td class="text-no-wrap" :class="{ 'text-decoration-underline': sortKey === 'decipherHi.pHi' }">
                  <v-icon
                    v-if="sortKey === 'decipherHi.pHi'"
                    :icon="sortIcon"
                    class="ml-n2 mr-n1"
                  />
                  DECIPHER HI
                </td>
                <td class="text-right text-no-wrap">
                  <!-- eslint-disable vue/no-v-html -->
                  <span v-html="roundIt(item.raw.decipherHi?.pHi)" v-if="item.raw.decipherHi" />
                  <span class="font-weight-bold" v-else>N/A</span>
                  <!-- eslint-enable -->
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
          <v-col cols="3" class="pr-3 align-self-end">
            <table style="width: 280px">
              <tr>
                <td class="text-no-wrap" :class="{ 'text-decoration-underline': sortKey === 'rcnv.pHaplo' }">
                  <v-icon
                    v-if="sortKey === 'rcnv.pHaplo'"
                    :icon="sortIcon"
                    class="ml-n2 mr-n1"
                  />
                  RCNV pHaplo
                </td>
                <td class="text-right text-no-wrap">
                  <!-- eslint-disable vue/no-v-html -->
                  <span v-html="roundIt(item.raw.rcnv?.pHaplo)" v-if="item.raw.rcnv" />
                  <span class="font-weight-bold" v-else>N/A</span>
                  <!-- eslint-enable -->
                </td>
              </tr>
              <tr>
                <td class="text-no-wrap" :class="{ 'text-decoration-underline': sortKey === 'rcnv.pTriplo' }">
                  <v-icon
                    v-if="sortKey === 'rcnv.pTriplo'"
                    :icon="sortIcon"
                    class="ml-n2 mr-n1"
                  />
                  RCNV pTriplo
                </td>
                <td class="text-right text-no-wrap">
                  <!-- eslint-disable vue/no-v-html -->
                  <span v-html="roundIt(item.raw.rcnv?.pTriplo)" v-if="item.raw.rcnv" />
                  <span class="font-weight-bold" v-else>N/A</span>
                  <!-- eslint-enable -->
                </td>
              </tr>
            </table>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-sheet>
</template>
