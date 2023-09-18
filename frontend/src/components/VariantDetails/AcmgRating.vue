<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'

import { StoreState } from '@/stores/misc'
import { useVariantAcmgRatingStore } from '@/stores/variantAcmgRating'

// Defining props and store

const props = defineProps({
  smallVariant: Object
})

const acmgRatingStore = useVariantAcmgRatingStore()

// Defining data

const ScoreExplanation = {
  1: 'Benign',
  2: 'Likely benign',
  3: 'Uncertain significance',
  4: 'Likely pathogenic',
  5: 'Pathogenic'
}

const ACMGRankingScores = {
  PVS: {
    name: 'Very Strong',
    score: 8
  },
  PS: {
    name: 'Strong',
    score: 4
  },
  PM: {
    name: 'Moderate',
    score: 2
  },
  PP: {
    name: 'Supporting',
    score: 1
  },
  BA: {
    name: 'Stand alone',
    score: -8
  },
  BS: {
    name: 'Strong',
    score: -4
  },
  BP: {
    name: 'Supporting',
    score: -2
  }
}

const acmgRating = {
  pathogenic: {
    pvs1: {
      name: 'PVS1',
      id: 'pvs1',
      description:
        'Null variant (nonsense, frameshift, canonical ±1 or 2 splice sites, initiation codon, single or multi-exon deletion) in a gene where LOF is a known mechanism of disease',
      hint: 'null variant',
      score: ACMGRankingScores.PVS,
      scoreCustom: null,
      active: false
    },
    ps1: {
      name: 'PS1',
      id: 'ps1',
      description:
        'Same amino acid change as a previously established pathogenic variant regardless of nucleotide change',
      hint: 'literature: this AA exchange',
      score: ACMGRankingScores.PS,
      scoreCustom: null,
      active: false
    },
    ps2: {
      name: 'PS2',
      id: 'ps2',
      description:
        'De novo (both maternity and paternity confirmed) in a patient with the disease and no family history',
      hint: 'confirmed de novo',
      score: ACMGRankingScores.PS,
      scoreCustom: null,
      active: false
    },
    ps3: {
      name: 'PS3',
      id: 'ps3',
      description:
        'Well-established in vitro or in vivo functional studies supportive of a damaging effect on the gene or gene product',
      hint: 'supported by functional studies',
      score: ACMGRankingScores.PS,
      scoreCustom: null,
      active: false
    },
    ps4: {
      name: 'PS4',
      id: 'ps4',
      description:
        'The prevalence of the variant in affected individuals is significantly increased compared with the prevalence in controls',
      hint: 'prevalende in disease controls',
      score: ACMGRankingScores.PS,
      scoreCustom: null,
      active: false
    },
    pm1: {
      name: 'PM1',
      id: 'pm1',
      description:
        'Located in a mutational hot spot and/or critical and well-established functional domain (e.g., active site of an enzyme) without benign variation',
      hint: 'variant in horspot (missense)',
      score: ACMGRankingScores.PM,
      scoreCustom: null,
      active: false
    },
    pm2: {
      name: 'PM2',
      id: 'pm2',
      description:
        'Absent from controls (or at extremely low frequency if recessive) in Exome Sequencing Project, 1000 Genomes Project, or Exome Aggregation Consortium',
      hint: 'rare; < 1:20.000 in ExAC',
      score: ACMGRankingScores.PM,
      scoreCustom: null,
      active: false
    },
    pm3: {
      name: 'PM3',
      id: 'pm3',
      description: 'For recessive disorders, detected in trans with a pathogenic variant',
      hint: 'AR: trans with known pathogenic',
      score: ACMGRankingScores.PM,
      scoreCustom: null,
      active: false
    },
    pm4: {
      name: 'PM4',
      id: 'pm4',
      description:
        'Protein length changes as a result of in-frame deletions/insertions in a nonrepeat region or stop-loss variants',
      hint: 'protein length change',
      score: ACMGRankingScores.PM,
      scoreCustom: null,
      active: false
    },
    pm5: {
      name: 'PM5',
      id: 'pm5',
      description:
        'Novel missense change at an amino acid residue where a different missense change determined to be pathogenic has been seen before',
      hint: 'literature: AA exchange same pos',
      score: ACMGRankingScores.PM,
      scoreCustom: null,
      active: false
    },
    pm6: {
      name: 'PM6',
      id: 'pm6',
      description: 'Assumed de novo, but without confirmation of paternity and maternity',
      hint: 'assumed de novo',
      score: ACMGRankingScores.PM,
      scoreCustom: null,
      active: false
    },
    pp1: {
      name: 'PP1',
      id: 'pp1',
      description:
        'Cosegregation with disease in multiple affected family members in a gene definitively known to cause the disease',
      hint: 'cosegregates in family',
      score: ACMGRankingScores.PP,
      scoreCustom: null,
      active: false
    },
    pp2: {
      name: 'PP2',
      id: 'pp2',
      description:
        'Missense variant in a gene that has a low rate of benign missense variation and in which missense variants are a common mechanism of disease',
      hint: 'few missense in gene',
      score: ACMGRankingScores.PP,
      scoreCustom: null,
      active: false
    },
    pp3: {
      name: 'PP3',
      id: 'pp3',
      description:
        'Multiple lines of computational evidence support a deleterious effect on the gene or gene product (conservation, evolutionary, splicing impact, etc.)',
      hint: 'predicted pathogenic >= 2',
      score: ACMGRankingScores.PP,
      scoreCustom: null,
      active: false
    },
    pp4: {
      name: 'PP4',
      id: 'pp4',
      description:
        "Patient's phenotype or family history is highly specific for a disease with a single genetic etiology",
      hint: 'phenotype/pedigree match gene',
      score: ACMGRankingScores.PP,
      scoreCustom: null,
      active: false
    },
    pp5: {
      name: 'PP5',
      id: 'pp5',
      description:
        'Reputable source recently reports variant as pathogenic, but the evidence is not available to the laboratoryto perform an independent evaluation',
      hint: 'reliable source: pathogenic',
      score: ACMGRankingScores.PP,
      scoreCustom: null,
      active: false
    }
  },
  benign: {
    ba1: {
      name: 'BA1',
      id: 'ba1',
      description:
        'Allele frequency is >5% in Exome Sequencing Project, 1000 Genomes Project, or Exome Aggregation Consortium',
      hint: 'allele frequency > 5%',
      score: ACMGRankingScores.BA,
      scoreCustom: null,
      active: false
    },
    bs1: {
      name: 'BS1',
      id: 'bs1',
      description: 'Allele frequency is greater than expected for disorder',
      hint: 'disease: allele freq. too high',
      score: ACMGRankingScores.BS,
      scoreCustom: null,
      active: false
    },
    bs2: {
      name: 'BS2',
      id: 'bs2',
      description:
        'Observed in a healthy adult individual for a recessive (homozygous), dominant (heterozygous), or X-linked (hemizygous) disorder, with full penetrance expected at an early age',
      hint: 'observed in healthy individual',
      score: ACMGRankingScores.BS,
      scoreCustom: null,
      active: false
    },
    bs3: {
      name: 'BS3',
      id: 'bs3',
      description:
        'Well-established in vitro or in vivo functional studies show no damaging effect on protein function or splicing',
      hint: 'functional studies: benign',
      score: ACMGRankingScores.BS,
      scoreCustom: null,
      active: false
    },
    bs4: {
      name: 'BS4',
      id: 'bs4',
      description: 'Lack of segregation in affected members of a family',
      hint: 'lack of segregation',
      score: ACMGRankingScores.BS,
      scoreCustom: null,
      active: false
    },
    bp1: {
      name: 'BP1',
      id: 'bp1',
      description:
        'Missense variant in a gene for which primarily truncating variants are known to cause disease',
      hint: 'missense in gene with truncating',
      score: ACMGRankingScores.BP,
      scoreCustom: null,
      active: false
    },
    bp2: {
      name: 'BP2',
      id: 'bp2',
      description:
        'Observed in trans with a pathogenic variant for a fully penetrant dominant gene/disorder or observed in cis with a pathogenic variant in any inheritance pattern',
      hint: 'other variant is causative',
      score: ACMGRankingScores.BP,
      scoreCustom: null,
      active: false
    },
    bp3: {
      name: 'BP3',
      id: 'bp3',
      description: 'In-frame deletions/insertions in a repetitive region without a known function',
      hint: 'in-frame indel in repeat',
      score: ACMGRankingScores.BP,
      scoreCustom: null,
      active: false
    },
    bp4: {
      name: 'BP4',
      id: 'bp4',
      description:
        'Multiple lines of computational evidence suggest no impact on gene or gene product (conservation, evolutionary,splicing impact, etc.)',
      hint: 'prediction: benign',
      score: ACMGRankingScores.BP,
      scoreCustom: null,
      active: false
    },
    bp5: {
      name: 'BP5',
      id: 'bp5',
      description: 'Variant found in a case with an alternate molecular basis for disease',
      hint: 'different gene in other case',
      score: ACMGRankingScores.BP,
      scoreCustom: null,
      active: false
    },
    bp6: {
      name: 'BP6',
      id: 'bp6',
      description:
        'Reputable source recently reports variant as benign, but the evidence is not available to the laboratory to perform an independent evaluation',
      hint: 'reputable source: benign',
      score: ACMGRankingScores.BP,
      scoreCustom: null,
      active: false
    },
    bp7: {
      name: 'BP7',
      id: 'bp7',
      description:
        'A synonymous (silent) variant for which splicing prediction algorithms predict no impact to the splice consensus sequence nor the creation of a new splice site AND the nucleotide is not highly conserved',
      hint: 'silent, no splicing/conservation',
      score: ACMGRankingScores.BP,
      scoreCustom: null,
      active: false
    }
  }
}

const acmgRatingComputed = ref(JSON.parse(JSON.stringify(acmgRating)))
const acmgRatingCustom = ref(JSON.parse(JSON.stringify(acmgRating)))
const acmgRatingConflicting = ref(false)
const acmgRatingScore = ref(0)
const acmgRatingScoreComputed = ref(0)
const acmgRatingPathogenicScore = ref(0)
const acmgRatingBenignScore = ref(0)
const showTooltip = ref(false)
const showSwitches = ref(false)
const showFailed = ref(false)

// Defining methods

const unsetAcmgRating = () => {
  acmgRatingCustom.value = JSON.parse(JSON.stringify(acmgRating))
}

const setAcmgRating = () => {
  if (acmgRatingStore.acmgRatingComputed) {
    for (const [key, value] of Object.entries(acmgRatingStore.acmgRatingComputed)) {
      if (value === true) {
        for (const [criteriaKey, criteria] of Object.entries(
          acmgRatingComputed.value.pathogenic
        ) as any) {
          if (criteriaKey === key) {
            criteria.active = true
          }
        }
        for (const [criteriaKey, criteria] of Object.entries(
          acmgRatingComputed.value.benign
        ) as any) {
          if (criteriaKey === key) {
            criteria.active = true
          }
        }
      }
    }
    acmgRatingCustom.value = JSON.parse(JSON.stringify(acmgRatingComputed.value))
    const acmgScore = calculateAcmgScore(acmgRatingComputed.value)
    acmgRatingScoreComputed.value = acmgScore.acmgScore
  } else {
    acmgRatingComputed.value = JSON.parse(JSON.stringify(acmgRating))
    acmgRatingCustom.value = JSON.parse(JSON.stringify(acmgRating))
    unsetAcmgRating()
  }
}

const resetAcmgRating = () => {
  acmgRatingCustom.value = JSON.parse(JSON.stringify(acmgRatingComputed.value))
}

const updateAcmgClass = (isConflicting: boolean, pathogenicScore: number, benignScore: number) => {
  acmgRatingConflicting.value = isConflicting
  acmgRatingPathogenicScore.value = pathogenicScore
  acmgRatingBenignScore.value = -benignScore
  acmgRatingScore.value = pathogenicScore + benignScore
}

const calculateAcmgScore = (acmgRating: any) => {
  let pathogenicScore = 0
  let benignScore = 0
  for (const criteria of Object.values(acmgRating.pathogenic) as any) {
    if (criteria.active) {
      pathogenicScore += criteria.scoreCustom || criteria.score.score
    }
  }
  for (const criteria of Object.values(acmgRating.benign) as any) {
    if (criteria.active) {
      benignScore += criteria.scoreCustom || criteria.score.score
    }
  }
  const acmgScore = pathogenicScore + benignScore
  return {
    pathogenicScore,
    benignScore,
    acmgScore
  }
}

const calculateAcmgRating = computed(() => {
  const acmgScores = calculateAcmgScore(acmgRatingCustom.value)
  const acmgScore = acmgScores.acmgScore
  const pathogenicScore = acmgScores.pathogenicScore
  const benignScore = acmgScores.benignScore

  const isPathogenic = acmgScore >= 10
  const isLikelyPathogenic = acmgScore >= 6 && acmgScore <= 9
  const isLikelyBenign = acmgScore >= -6 && acmgScore <= -1
  const isBenign = acmgScore <= -7
  const isConflicting = pathogenicScore >= 6 && benignScore <= -1

  var computedClassAuto = 3
  if (isPathogenic) {
    computedClassAuto = 5
  } else if (isLikelyPathogenic) {
    computedClassAuto = 4
  } else if (isBenign) {
    computedClassAuto = 1
  } else if (isLikelyBenign) {
    computedClassAuto = 2
  }
  if (isConflicting) {
    computedClassAuto = 3
    updateAcmgClass(true, pathogenicScore, benignScore)
  } else {
    updateAcmgClass(false, pathogenicScore, benignScore)
  }
  return ScoreExplanation[computedClassAuto as 1 | 2 | 3 | 4 | 5]
})

// Defining watchers

watch(
  () => [props.smallVariant, acmgRatingStore.storeState],
  async () => {
    if (props.smallVariant && acmgRatingStore.storeState === StoreState.Active) {
      await acmgRatingStore.retrieveAcmgRating(props.smallVariant)
      resetAcmgRating()
    }
  }
)

onMounted(async () => {
  if (props.smallVariant) {
    await acmgRatingStore.retrieveAcmgRating(props.smallVariant)
    setAcmgRating()
  }
})
</script>

<template>
  <v-row>
    <v-col cols="12" md="3">
      <div>
        <div>
          <h2 for="acmg-class">
            <strong>ACMG classification:</strong>
            <small
              ><v-tooltip
                width="300"
                v-model="showTooltip"
                bottom
                text="Rules are combined using the point system described in PMID:32720330

              Each rule triggered is assigned a number of points based on the strength of the evidence provided:

              Supporting: 1 point
              Moderate: 2 points
              Strong: 4 points
              Very Strong: 8 points
              A total score is computed as the sum of the points from the pathogenic rules, minus the sum of the points from benign rules.

              The total score is then compared to thresholds to assign the final verdict:

              Pathogenic if greater than or equal to 10.
              Likely Pathogenic if between 6 and 9 inclusive.
              Uncertain Significance if between 0 and 5.
              Likely Benign if between -6 and -1.
              Benign if less than or equal to -7."
              >
                <template v-slot:activator="{ props }">
                  <v-icon style="margin: 10px" v-bind="props">mdi-help-circle</v-icon>
                </template>
              </v-tooltip>
            </small>
            <v-btn prepend-icon="mdi-help-circle-outline" @click="showTooltip = !showTooltip">
              info
            </v-btn>
          </h2>
        </div>
        <h2>
          {{ acmgRatingScore }} points = {{ acmgRatingPathogenicScore }}P -
          {{ acmgRatingBenignScore }}B
        </h2>
        <h1 title="Automatically determined ACMG class (Richards et al., 2015)">
          {{ calculateAcmgRating }}
        </h1>
      </div>
    </v-col>
    <v-col cols="12" md="5">
      <v-table>
        <thead>
          <tr>
            <th>Mode</th>
            <th>Criteria</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Automatically selected</td>
            <td class="d-flex flex-row flex-wrap">
              <div
                v-for="(criteria, criteriaKey) in acmgRatingComputed.pathogenic"
                :key="criteriaKey"
              >
                <div v-if="criteria.active" style="margin-right: 10px">
                  {{ criteria.name }}: +{{ criteria.score.score }}
                </div>
              </div>
              <div v-for="(criteria, criteriaKey) in acmgRatingComputed.benign" :key="criteriaKey">
                <div v-if="criteria.active" style="margin-right: 10px">
                  {{ criteria.name }}: {{ criteria.score.score }}
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td>Manually selected</td>
            <td class="d-flex flex-row flex-wrap">
              <div
                v-for="(criteria, criteriaKey) in acmgRatingCustom.pathogenic"
                :key="criteriaKey"
              >
                <div v-if="criteria.active" style="margin-right: 10px">
                  {{ criteria.name }}: +{{ criteria.scoreCustom || criteria.score.score }}
                </div>
              </div>
              <div v-for="(criteria, criteriaKey) in acmgRatingCustom.benign" :key="criteriaKey">
                <div v-if="criteria.active" style="margin-right: 10px">
                  {{ criteria.name }}: {{ criteria.scoreCustom || criteria.score.score }}
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td>Difference</td>
            <td class="d-flex flex-row flex-wrap">
              <div
                v-for="(criteria, criteriaKey) in acmgRatingCustom.pathogenic"
                :key="criteriaKey"
              >
                <div
                  v-if="
                    acmgRatingComputed.pathogenic[criteriaKey].active !== criteria.active ||
                    criteria.scoreCustom
                  "
                  style="margin-right: 10px"
                >
                  {{ criteria.name }}: +{{ criteria.scoreCustom || criteria.score.score }}
                </div>
              </div>
              <div v-for="(criteria, criteriaKey) in acmgRatingCustom.benign" :key="criteriaKey">
                <div
                  v-if="
                    acmgRatingComputed.benign[criteriaKey].active !== criteria.active ||
                    criteria.scoreCustom
                  "
                  style="margin-right: 10px"
                >
                  {{ criteria.name }}: {{ criteria.scoreCustom || criteria.score.score }}
                </div>
              </div>
              <div>
                Score computed: {{ acmgRatingScoreComputed }} /// Custom score:
                {{ acmgRatingScore }}
              </div>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-col>
    <v-col cols="12" md="4">
      <div class="button-group">
        <v-btn @click="unsetAcmgRating()"> Clear </v-btn>
        <v-btn @click="resetAcmgRating()"> Reset </v-btn>
      </div>
      <div v-if="acmgRatingConflicting">
        <div>
          <div>
            <v-icon>mdi-information-outline</v-icon>
            <strong>Caution!</strong> Conflicting interpretation of variant.
          </div>
        </div>
      </div>
      <div>
        <div>
          <div>
            <v-icon>mdi-information-outline</v-icon>
            Select all fulfilled criteria to get the classification following Richards
            <i>et al.</i> (2015). If necessary, you can also specify a manual override. Press
            <span style="background-color: wheat">Reset</span> to reset criteria to the default
            state. Press <span style="background-color: wheat">Clear</span> to set all criteria to
            initial state.
          </div>
        </div>
      </div>
    </v-col>
  </v-row>
  <v-row style="margin-bottom: 15px">
    <v-col>
      <v-btn @click="showSwitches = !showSwitches">
        {{ showSwitches ? 'Hide' : 'Show' }} summary view
      </v-btn>
    </v-col>
  </v-row>
  <v-row v-show="showSwitches">
    <v-col class="d-flex flex-row flex-wrap" cols="12" md="6">
      <div style="margin-right: 20px">
        <h3><strong>Pathogenic:</strong></h3>
      </div>
      <div v-for="(criteria, criteriaKey) in acmgRatingCustom.pathogenic" :key="criteriaKey">
        <v-switch
          color="primary"
          :label="criteria.name"
          :model-value="criteria.active"
          @update:model-value="criteria.active = $event as any"
          style="margin-right: 20px"
        ></v-switch>
      </div>
    </v-col>
    <v-divider vertical></v-divider>
    <v-col class="d-flex flex-row flex-wrap" cols="12" md="6">
      <div style="margin-right: 20px">
        <h3><strong>Benign:</strong></h3>
      </div>
      <div v-for="(criteria, criteriaKey) in acmgRatingCustom.benign" :key="criteriaKey">
        <v-switch
          color="primary"
          :label="criteria.name"
          :model-value="criteria.active"
          @update:model-value="criteria.active = $event as any"
          style="margin-right: 20px"
        ></v-switch>
      </div>
    </v-col>
  </v-row>
  <v-row>
    <v-col>
      <v-btn @click="showFailed = !showFailed">
        {{ showFailed ? 'Hide' : 'Show' }} failed criteria
      </v-btn>
    </v-col>
  </v-row>
  <v-row>
    <v-col class="d-flex flex-row flex-wrap">
      <v-table>
        <thead>
          <tr>
            <th>Criteria</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <h3>Pathogenic:</h3>
            </td>
            <td></td>
          </tr>
          <tr v-for="(criteria, criteriaKey) in acmgRatingCustom.pathogenic" :key="criteriaKey">
            <td v-if="criteria.active || showFailed">
              <v-card class="mx-auto" width="200" style="margin: 10px">
                <div class="d-flex justify-content-between">
                  <v-switch
                    style="margin-left: 10px"
                    color="primary"
                    :label="criteria.name"
                    :model-value="criteria.active"
                    @update:model-value="criteria.active = $event as any"
                  />
                  <v-tooltip :text="criteria.hint">
                    <template v-slot:activator="{ props }">
                      <v-icon style="margin: 10px" v-bind="props">mdi-information</v-icon>
                    </template>
                  </v-tooltip>
                </div>
                <v-divider />
                <v-expansion-panels>
                  <v-expansion-panel>
                    <v-expansion-panel-title>
                      <template v-slot:default="{}">
                        <v-row no-gutters>
                          <v-col class="d-flex justify-start">
                            Score: {{ criteria.scoreCustom || criteria.score.score }}
                          </v-col>
                        </v-row>
                      </template>
                    </v-expansion-panel-title>
                    <v-expansion-panel-text>
                      <v-select
                        v-model="criteria.scoreCustom"
                        :items="[8, 4, 2, 1, null]"
                        label="Select Custom Score"
                      ></v-select>
                    </v-expansion-panel-text>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-card>
            </td>
            <td v-if="criteria.active || showFailed">
              {{ criteria.description }}
            </td>
          </tr>
          <tr>
            <td>
              <h3>Benign:</h3>
            </td>
            <td></td>
          </tr>
          <tr v-for="(criteria, criteriaKey) in acmgRatingCustom.benign" :key="criteriaKey">
            <td v-if="criteria.active || showFailed">
              <v-card class="mx-auto" width="180" style="margin: 10px">
                <div class="d-flex justify-content-between">
                  <v-switch
                    style="margin-left: 10px"
                    color="primary"
                    :label="criteria.name"
                    :model-value="criteria.active"
                    @update:model-value="criteria.active = $event as any"
                  ></v-switch>
                  <v-tooltip :text="criteria.hint">
                    <template v-slot:activator="{ props }">
                      <v-icon style="margin: 10px" v-bind="props">mdi-information</v-icon>
                    </template>
                  </v-tooltip>
                </div>

                <v-divider />
                <v-expansion-panels>
                  <v-expansion-panel>
                    <v-expansion-panel-title>
                      <template v-slot:default="{}">
                        <v-row no-gutters>
                          <v-col class="d-flex justify-start">
                            Score: {{ criteria.scoreCustom || criteria.score.score }}
                          </v-col>
                        </v-row>
                      </template>
                    </v-expansion-panel-title>
                    <v-expansion-panel-text>
                      <v-select
                        v-model="criteria.scoreCustom"
                        :items="[-2, -4, -8, null]"
                        label="Select Custom Score"
                      ></v-select>
                    </v-expansion-panel-text>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-card>
            </td>
            <td v-if="criteria.active || showFailed">
              {{ criteria.description }}
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-col>
  </v-row>
</template>

<style scoped>
#acmg-class-override {
  width: 135px;
  height: 50px;
  margin-bottom: 120px;
}

.button-group {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 12px;
}
</style>
