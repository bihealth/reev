<script setup lang="ts">
import { CLINGEN_DOSAGE_LABELS_SHORT } from '@/components/GeneDetails/PathogenicityCard.c'
import { roundIt } from '@/lib/utils'

export interface Props {
  geneInfo: any
}

const props = withDefaults(defineProps<Props>(), {
  geneInfo: null
})
</script>

<template>
  <v-card class="mt-3">
    <v-card-title class="pb-0"> Gene Pathogenicity </v-card-title>
    <v-card-subtitle class="text-overline">
      Intolerance Constraints and Annotations
    </v-card-subtitle>
    <v-card-text class="pt-3">
      <!-- no constraints symbol => display loader -->
      <template v-if="!geneInfo?.gnomadConstraints?.expSyn">
        <v-skeleton-loader
          class="mt-3 mx-auto border"
          type="heading,subtitle,text,text"
        ></v-skeleton-loader>
      </template>
      <!-- otherwise, display actual card -->
      <template v-else>
        <v-row no-gutters class="d-flex flex-row">
          <v-col cols="3">
            <v-sheet rounded="lg" class="pa-3 bg-grey-lighten-2 mr-2 h-100">
              <template v-if="geneInfo?.clingen">
                <div class="text-subtitle-1">
                  ClinGen
                  <small>
                    <a
                      :href="`https://search.clinicalgenome.org/kb/genes/${geneInfo?.hgnc.hgnc_id}`"
                    >
                      <v-icon>mdi-launch</v-icon>
                    </a>
                  </small>
                </div>
                <v-table density="compact" class="bg-transparent">
                  <tbody>
                    <tr>
                      <td class="pa-0">haploinsufficiency</td>
                      <td class="pa-0 text-right">
                        {{ CLINGEN_DOSAGE_LABELS_SHORT[geneInfo?.clingen.haploinsufficiencyScore] }}
                      </td>
                    </tr>
                    <tr>
                      <td class="pa-0">triplosensitivity</td>
                      <td class="pa-0 text-right">
                        {{ CLINGEN_DOSAGE_LABELS_SHORT[geneInfo?.clingen.triplosensitivityScore] }}
                      </td>
                    </tr>
                  </tbody>
                </v-table>
              </template>
              <template v-else> No ClinGen data </template>
            </v-sheet>
          </v-col>

          <v-col cols="3">
            <v-sheet rounded="lg" class="pa-3 bg-grey-lighten-2 mx-1 h-100">
              <template v-if="geneInfo?.gnomadConstraints">
                <div class="text-subtitle-1">
                  gnomAD
                  <small> v2.1.1 </small>
                  <small v-if="geneInfo?.hgnc?.ensemblGeneId?.length">
                    <a
                      :href="`https://gnomad.broadinstitute.org/gene/${geneInfo?.hgnc.ensemblGeneId}?dataset=gnomad_r4`"
                    >
                      <v-icon>mdi-launch</v-icon>
                    </a>
                  </small>
                </div>
                <v-table density="compact" class="bg-transparent">
                  <tbody>
                    <tr>
                      <td class="pa-0 text-subtitle-2 text-center" colspan="2">Loss of Function</td>
                    </tr>
                    <tr>
                      <td class="pa-0">
                        <abbr title="predicted probability that the gene is LoF intolerant">
                          pLI
                        </abbr>
                      </td>
                      <td class="pa-0 text-right">
                        <span v-html="roundIt(geneInfo?.gnomadConstraints.pli)" />
                      </td>
                    </tr>
                    <tr>
                      <td class="pa-0">
                        <abbr title="LoF observed/expected upper bound fraction"> LOEUF </abbr>
                      </td>
                      <td class="pa-0 text-right">
                        <span v-html="roundIt(geneInfo?.gnomadConstraints.oeLofUpper)" />
                      </td>
                    </tr>
                    <tr>
                      <td class="pa-0 text-subtitle-2 text-center" colspan="2">Missense</td>
                    </tr>
                    <tr>
                      <td class="pa-0">
                        <abbr title="Missense observed/expected upper bound fraction">
                          o/e (upper)
                        </abbr>
                      </td>
                      <td class="pa-0 text-right">
                        <span v-html="roundIt(geneInfo?.gnomadConstraints.oeMisUpper)" />
                      </td>
                    </tr>
                    <tr>
                      <td class="pa-0">
                        <abbr title="Z-score of observed/expected missense variant count">
                          o/e Z-score
                        </abbr>
                      </td>
                      <td class="pa-0 text-right">
                        <span v-html="roundIt(geneInfo?.gnomadConstraints.misZ)" />
                      </td>
                    </tr>
                  </tbody>
                </v-table>
              </template>
              <template v-else> No gnomAD constraints </template>
            </v-sheet>
          </v-col>

          <v-col cols="3">
            <v-sheet rounded="lg" class="pa-3 bg-grey-lighten-2 mx-1 h-100">
              <template v-if="true">
                <div class="text-subtitle-1">
                  DECIPHER
                  <small v-if="geneInfo?.hgnc?.symbol?.length">
                    <a
                      :href="`https://www.deciphergenomics.org/gene/${geneInfo?.hgnc?.symbol}/overview/clinical-info`"
                    >
                      <v-icon>mdi-launch</v-icon>
                    </a>
                  </small>
                </div>
                <v-table density="compact" class="bg-transparent">
                  <tbody>
                    <tr>
                      <td class="pa-0">
                        <abbr
                          :title="`haploinsufficiency prediction percentile (raw score=${geneInfo?.decipherHi?.hiIndex})`"
                        >
                          %HI
                        </abbr>
                      </td>
                      <td class="pa-0 text-right">
                        <span v-html="roundIt(geneInfo?.decipherHi?.pHi)" />
                      </td>
                    </tr>
                    <tr>
                      <td class="pa-0">sHet</td>
                      <td class="pa-0 text-right">
                        <span v-html="roundIt(geneInfo?.shet.sHet)" v-if="geneInfo?.shet" />
                        <span v-else> N/A </span>
                      </td>
                    </tr>
                    <tr>
                      <td class="pa-0">pHaplo</td>
                      <td class="pa-0 text-right">
                        <span v-html="roundIt(geneInfo?.rcnv.pHaplo)" v-if="geneInfo?.rcnv" />
                        <span v-else> N/A </span>
                      </td>
                    </tr>
                    <tr>
                      <td class="pa-0">pTriplo</td>
                      <td class="pa-0 text-right">
                        <span v-html="roundIt(geneInfo?.rcnv.pTriplo)" v-if="geneInfo?.rcnv" />
                        <span v-else> N/A </span>
                      </td>
                    </tr>
                  </tbody>
                </v-table>
              </template>
              <template v-else> No gnomAD constraints </template>
            </v-sheet>
          </v-col>
        </v-row>
      </template>
    </v-card-text>
  </v-card>
</template>
