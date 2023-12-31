<script setup lang="ts">
import { computed, ref } from 'vue'

import DocsLink from '@/components/DocsLink.vue'
import ScoreDisplay from '@/components/SeqvarDetails/VariantScoresCard/ScoreDisplay.vue'
import Conservation from '@/components/SeqvarDetails/VariantScoresCard/UcscConservation.vue'
import { roundIt } from '@/lib/utils'

export interface Props {
  varAnnos?: any
}

const props = defineProps<Props>()

const bestOf = (obj: any, keys: string[]) => {
  if (!obj) {
    return { score: null, key: null }
  }
  const values = keys
    .map((key) => ({ score: obj[key] ?? null, key }))
    .filter(({ score }) => score !== null)
  if (values.length) {
    values.sort((a, b) => b.score - a.score)
    return values[0]
  } else {
    return {
      score: null,
      key: null
    }
  }
}

const expandSpliceAi = ref(false)
const expandMMSplice = ref(false)

const SpliceAiKeys = [
  'SpliceAI-acc-gain',
  'SpliceAi-acc-loss',
  'SpliceAi-don-gain',
  'SpliceAi-don-loss'
]
const MMSpliceKeys = [
  'MMSp_acceptorIntron',
  'MMSp_acceptor',
  'MMSp_exon',
  'MMSp_donor',
  'MMSp_donorIntron'
]

const bestSpliceAi = computed(() => {
  return bestOf(props.varAnnos?.cadd, SpliceAiKeys)
})

const allSpliceAi = computed(() => {
  const res: any = {}
  for (const key of SpliceAiKeys) {
    res[key] = props.varAnnos?.cadd[key]
  }
  return res
})

const bestMMSplice = computed(() => {
  return bestOf(props.varAnnos?.cadd, MMSpliceKeys)
})

const allMMSplice = computed(() => {
  const res: any = {}
  for (const key of MMSpliceKeys) {
    res[key] = props.varAnnos?.cadd[key]
  }
  return res
})

const decodeMultiDbnsfp = (s: string): number | null => {
  if (!s) {
    return null
  } else {
    const vals = s
      .split(';')
      .filter((s) => s != '.')
      .map(parseFloat)
    if (!vals.length) {
      return null
    } else {
      return Math.max(...vals)
    }
  }
}

const siftScore = computed((): number | null =>
  decodeMultiDbnsfp(props.varAnnos?.dbnsfp?.SIFT_score)
)

const translatedSiftScore = computed((): number | null => {
  const value = siftScore.value
  if (value === null) {
    return null
  } else {
    return 1 - value
  }
})

const fathmmScore = computed((): number | null =>
  decodeMultiDbnsfp(props.varAnnos?.dbnsfp?.FATHMM_score)
)

const translatedFathmmScore = computed((): number | null => {
  const value = fathmmScore.value
  if (value === null) {
    return null
  } else {
    return 10 - value
  }
})

const gerpScore = computed((): number | null => {
  if (props.varAnnos?.dbnsfp && 'GERP++_RS' in props.varAnnos.dbnsfp) {
    return props.varAnnos.dbnsfp['GERP++_RS']
  } else {
    return null
  }
})

const mpcScore = computed((): number | null => decodeMultiDbnsfp(props.varAnnos?.dbnsfp?.MPC_score))

const revelScore = computed((): number | null =>
  decodeMultiDbnsfp(props.varAnnos?.dbnsfp?.REVEL_score)
)

const polyphenScore = computed((): number | null =>
  decodeMultiDbnsfp(props.varAnnos?.dbnsfp?.Polyphen2_HVAR_score)
)
</script>

<template>
  <v-card>
    <v-card-title class="pb-0 pr-2">
      Scores
      <DocsLink anchor="scores" />
    </v-card-title>
    <v-card-subtitle class="text-overline"> Precomputed Sequence Variant Scores </v-card-subtitle>
    <v-card-text>
      <div v-if="props.varAnnos?.dbnsfp">
        <v-table density="compact">
          <thead>
            <tr>
              <th class="text-left">Scoring Method</th>
              <th class="text-center">Score</th>
              <th class="text-center">Visualization</th>
              <th class="text-center">
                <abbr title="Interpretations on prediction refer to Pejaver et al. (2022)"
                  >Interpretation</abbr
                >
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th class="align-middle">BayesDel</th>
              <template
                v-if="
                  props.varAnnos?.dbnsfp?.BayesDel_addAF_score &&
                  props.varAnnos?.dbnsfp?.BayesDel_addAF_score !== Infinity
                "
              >
                <!-- eslint-disable vue/no-v-html -->
                <td
                  class="text-center align-middle"
                  v-html="roundIt(props.varAnnos?.dbnsfp?.BayesDel_addAF_score, 4)"
                />
                <!-- eslint-enable -->
                <td class="text-center align-middle">
                  <ScoreDisplay
                    :range-lower="-1"
                    :range-upper="1"
                    :height="12"
                    font-size="10px"
                    :value="props.varAnnos?.dbnsfp?.BayesDel_addAF_score"
                    :benign-moderate-upper="-0.36"
                    :benign-supporting-upper="-0.18"
                    :pathogenic-supporting-lower="0.13"
                    :pathogenic-moderate-lower="0.27"
                    :pathogenic-strong-lower="0.5"
                  />
                </td>
                <td class="text-center align-middle">
                  <span
                    v-if="props.varAnnos?.dbnsfp?.BayesDel_addAF_score <= -0.36"
                    class="benign-moderate"
                  >
                    benign moderate
                  </span>
                  <span
                    v-else-if="
                      props.varAnnos?.dbnsfp?.BayesDel_addAF_score > -0.36 &&
                      props.varAnnos?.dbnsfp?.BayesDel_addAF_score <= -0.18
                    "
                    class="benign-supporting"
                  >
                    benign supporting
                  </span>
                  <span
                    v-else-if="
                      props.varAnnos?.dbnsfp?.BayesDel_addAF_score >= 0.13 &&
                      props.varAnnos?.dbnsfp?.BayesDel_addAF_score < 0.27
                    "
                    class="pathogenic-supporting"
                  >
                    pathogenic supporting
                  </span>
                  <span
                    v-else-if="
                      props.varAnnos?.dbnsfp?.BayesDel_addAF_score >= 0.27 &&
                      props.varAnnos?.dbnsfp?.BayesDel_addAF_score < 0.5
                    "
                    class="pathogenic-moderat"
                  >
                    pathogenic moderate
                  </span>
                  <span
                    v-else-if="props.varAnnos?.dbnsfp?.BayesDel_addAF_score >= 0.5"
                    class="pathogenic-strong"
                  >
                    pathogenic strong
                  </span>
                  <span v-else class="not-predictive"> &mdash; </span>
                </td>
              </template>
              <td v-else colspan="4" class="text-muted text-center font-italic">
                BayesDel prediction not available.
              </td>
            </tr>

            <tr>
              <th class="align-middle">CADD</th>
              <template v-if="varAnnos?.cadd?.PHRED && varAnnos?.cadd?.PHRED !== Infinity">
                <td class="text-center align-middle">
                  {{ varAnnos?.cadd?.PHRED }}
                </td>
                <td class="text-center align-middle">
                  <ScoreDisplay
                    :range-lower="0"
                    :range-upper="50"
                    :height="12"
                    font-size="10px"
                    :value="varAnnos?.cadd?.PHRED"
                    :benign-strong-upper="0.15"
                    :benign-moderate-upper="17.3"
                    :benign-supporting-upper="22.7"
                    :pathogenic-supporting-lower="25.3"
                    :pathogenic-moderate-lower="28.1"
                  />
                </td>
                <td class="text-center align-middle">
                  <span v-if="varAnnos?.cadd?.PHRED < 0.15" class="benign-strong">
                    benign strong
                  </span>
                  <span
                    v-else-if="varAnnos?.cadd?.PHRED >= 0.15 && varAnnos?.cadd?.PHRED < 17.3"
                    class="benign-moderate"
                  >
                    benign moderate
                  </span>
                  <span
                    v-else-if="varAnnos?.cadd?.PHRED >= 17.3 && varAnnos?.cadd?.PHRED < 22.7"
                    class="benign-supporting"
                  >
                    benign supporting
                  </span>
                  <span
                    v-else-if="varAnnos?.cadd?.PHRED >= 25.3 && varAnnos?.cadd?.PHRED < 28.1"
                    class="pathogenic-supporting"
                  >
                    pathogenic supporting
                  </span>
                  <span v-else-if="varAnnos?.cadd?.PHRED >= 28.1" class="pathogenic-moderate">
                    pathogenic moderate
                  </span>
                  <span v-else class="not-predictive"> &mdash; </span>
                </td>
              </template>
              <td v-else colspan="4" class="text-muted text-center font-italic">
                CADD prediction not available.
              </td>
            </tr>

            <tr>
              <th class="align-middle">FATHMM</th>
              <template
                v-if="fathmmScore && translatedFathmmScore && translatedFathmmScore !== Infinity"
              >
                <td class="text-center align-middle">
                  {{ fathmmScore }}
                </td>
                <td class="text-center align-middle">
                  <ScoreDisplay
                    :range-lower="0"
                    :range-upper="20"
                    :height="12"
                    font-size="10px"
                    :value="translatedFathmmScore"
                    :disp-trans-offset="10"
                    :disp-trans-mult="-1"
                    :benign-moderate-upper="5.31"
                    :benign-supporting-upper="6.68"
                    :pathogenic-supporting-lower="14.14"
                    :pathogenic-moderate-lower="15.04"
                  />
                </td>
                <td class="text-center align-middle">
                  <span v-if="fathmmScore >= 4.69" class="benign-moderate"> benign moderate </span>
                  <span
                    v-else-if="fathmmScore < 4.69 && fathmmScore >= 3.32"
                    class="benign-supporting"
                  >
                    benign supporting
                  </span>
                  <span
                    v-else-if="fathmmScore > -5.04 && fathmmScore <= -4.14"
                    class="pathogenic-supporting"
                  >
                    pathogenic supporting
                  </span>
                  <span v-else-if="fathmmScore <= -5.04" class="pathogenic-moderate">
                    pathogenic moderate
                  </span>
                  <span v-else class="not-predictive"> &mdash; </span>
                </td>
              </template>
              <td v-else colspan="4" class="text-muted text-center font-italic">
                FATHMM prediction not available.
              </td>
            </tr>

            <tr>
              <th class="align-middle">Gerp++</th>
              <template v-if="gerpScore && gerpScore !== Infinity">
                <td class="text-center align-middle">
                  {{ gerpScore }}
                </td>
                <td class="text-center align-middle">
                  <ScoreDisplay
                    :range-lower="-10"
                    :range-upper="10"
                    :height="12"
                    font-size="10px"
                    :value="gerpScore"
                    :benign-moderate-upper="-4.54"
                    :benign-supporting-upper="2.7"
                  />
                </td>
                <td class="text-center align-middle">
                  <span v-if="gerpScore <= -4.54" class="benign-moderate"> benign moderate </span>
                  <span v-else-if="gerpScore > -4.54 && gerpScore <= 2.7" class="benign-supporting">
                    benign supporting
                  </span>
                </td>
              </template>
              <td v-else colspan="4" class="text-muted text-center font-italic">
                Gerp++ prediction not available.
              </td>
            </tr>

            <tr>
              <th class="align-middle">
                MMSplice
                <!-- Toggle Button -->
                <v-btn
                  variant="outlined"
                  size="30"
                  color=""
                  icon
                  :disabled="!bestMMSplice.key || bestMMSplice.score === Infinity"
                  @click="expandMMSplice = !expandMMSplice"
                >
                  <v-icon>
                    {{ expandMMSplice ? 'mdi-chevron-down' : 'mdi-chevron-right' }}
                  </v-icon>
                </v-btn>
              </th>
              <template v-if="bestMMSplice.key && bestMMSplice.score !== Infinity">
                <td class="text-center align-middle">
                  {{ bestMMSplice.score }}
                  <span class="text-muted ml-2">({{ bestMMSplice.key }})</span>
                </td>
                <td class="text-center align-middle">
                  <ScoreDisplay
                    :range-lower="0"
                    :range-upper="1"
                    :height="12"
                    font-size="10px"
                    :value="bestMMSplice.score"
                  />
                </td>
                <td class="text-center align-middle">&mdash;</td>
              </template>
              <td v-else colspan="4" class="text-muted text-center font-italic">
                MMSplice prediction not available.
              </td>
            </tr>

            <template v-if="expandMMSplice">
              <tr v-for="(score, index) in allMMSplice" :key="index">
                <th class="text-center align-middle">{{ index }}</th>
                <td>{{ score }}</td>
                <td class="text-center align-middle">
                  <ScoreDisplay
                    :range-lower="0"
                    :range-upper="1"
                    :height="12"
                    font-size="10px"
                    :value="score"
                  />
                </td>
                <td class="text-center align-middle">&mdash;</td>
              </tr>
            </template>

            <tr>
              <th class="align-middle">MPC</th>
              <template v-if="mpcScore && mpcScore !== Infinity">
                <td class="text-center align-middle" v-html="roundIt(mpcScore, 4)" />
                <td class="text-center align-middle">
                  <ScoreDisplay
                    :range-lower="0"
                    :range-upper="5"
                    :height="12"
                    font-size="10px"
                    :value="mpcScore"
                    :pathogenic-supporting-lower="1.36"
                    :pathogenic-moderate-lower="1.828"
                  />
                </td>
                <td class="text-center align-middle">
                  <span v-if="mpcScore >= 1.36 && mpcScore < 1.828" class="pathogenic-supporting">
                    pathogenic supporting
                  </span>
                  <span v-else-if="mpcScore >= 1.828" class="pathogenic-moderate">
                    pathogenic moderate
                  </span>
                  <span v-else class="not-predictive"> &mdash; </span>
                </td>
              </template>
              <td v-else colspan="4" class="text-muted text-center font-italic">
                MPC prediction not available.
              </td>
            </tr>

            <tr>
              <th class="align-middle">PolyPhen2</th>
              <template v-if="polyphenScore !== null && polyphenScore !== Infinity">
                <td class="text-center align-middle">
                  {{ polyphenScore }}
                </td>
                <td class="text-center align-middle">
                  <ScoreDisplay
                    :range-lower="-20"
                    :range-upper="30"
                    :height="12"
                    font-size="10px"
                    :value="polyphenScore"
                    :benign-moderate-upper="0.009"
                    :benign-supporting-upper="0.113"
                    :pathogenic-supporting-lower="0.978"
                    :pathogenic-moderate-lower="0.999"
                  />
                </td>
                <td class="text-center align-middle">
                  <span v-if="polyphenScore <= 0.009" class="benign-moderate">
                    benign moderate
                  </span>
                  <span
                    v-else-if="polyphenScore > 0.009 && polyphenScore <= 0.113"
                    class="benign-supporting"
                  >
                    benign supporting
                  </span>
                  <span
                    v-else-if="polyphenScore >= 0.978 && polyphenScore < 0.999"
                    class="pathogenic-supporting"
                  >
                    pathogenic supporting
                  </span>
                  <span v-else-if="polyphenScore >= 0.999" class="pathogenic-moderate">
                    pathogenic moderate
                  </span>
                  <span v-else class="not-predictive"> &mdash; </span>
                </td>
              </template>
              <td v-else colspan="4" class="text-muted text-center font-italic">
                PolyPhen2 HVAR prediction not available.
              </td>
            </tr>

            <tr>
              <th class="align-middle">PhyloP-100</th>
              <template
                v-if="
                  props.varAnnos?.dbnsfp?.phyloP100way_vertebrate &&
                  props.varAnnos?.dbnsfp?.phyloP100way_vertebrate !== Infinity
                "
              >
                <td class="text-center align-middle">
                  {{ props.varAnnos?.dbnsfp?.phyloP100way_vertebrate }}
                </td>
                <td class="text-center align-middle">
                  <ScoreDisplay
                    :range-lower="-20"
                    :range-upper="30"
                    :height="12"
                    font-size="10px"
                    :value="props.varAnnos?.dbnsfp?.phyloP100way_vertebrate"
                    :benign-moderate-upper="0.021"
                    :benign-supporting-upper="1.879"
                    :pathogenic-supporting-lower="7.367"
                    :pathogenic-moderate-lower="9.741"
                  />
                </td>
                <td class="text-center align-middle">
                  <span
                    v-if="props.varAnnos?.dbnsfp?.phyloP100way_vertebrate <= 0.021"
                    class="benign-moderate"
                  >
                    benign moderate
                  </span>
                  <span
                    v-else-if="
                      props.varAnnos?.dbnsfp?.phyloP100way_vertebrate > 0.021 &&
                      props.varAnnos?.dbnsfp?.phyloP100way_vertebrate <= 1.879
                    "
                    class="benign-supporting"
                  >
                    benign supporting
                  </span>
                  <span
                    v-else-if="
                      props.varAnnos?.dbnsfp?.phyloP100way_vertebrate >= 7.367 &&
                      props.varAnnos?.dbnsfp?.phyloP100way_vertebrate < 9.741
                    "
                    class="pathogenic-supporting"
                  >
                    pathogenic supporting
                  </span>
                  <span
                    v-else-if="props.varAnnos?.dbnsfp?.phyloP100way_vertebrate >= 9.741"
                    class="pathogenic-moderate"
                  >
                    pathogenic moderate
                  </span>
                  <span v-else class="not-predictive"> &mdash; </span>
                </td>
              </template>
              <td v-else colspan="4" class="text-muted text-center font-italic">
                PhyloP-100 prediction not available.
              </td>
            </tr>

            <tr>
              <th class="align-middle">PrimateAI</th>
              <template
                v-if="
                  props.varAnnos?.dbnsfp?.PrimateAI_score &&
                  props.varAnnos?.dbnsfp?.PrimateAI_score !== Infinity
                "
              >
                <td
                  class="text-center align-middle"
                  v-html="roundIt(props.varAnnos?.dbnsfp?.PrimateAI_score, 4)"
                />
                <td class="text-center align-middle">
                  <ScoreDisplay
                    :range-lower="0"
                    :range-upper="1"
                    :height="12"
                    font-size="10px"
                    :value="props.varAnnos?.dbnsfp?.PrimateAI_score"
                    :benign-moderate-upper="0.362"
                    :benign-supporting-upper="0.483"
                    :pathogenic-supporting-lower="0.79"
                    :pathogenic-moderate-lower="0.867"
                  />
                </td>
                <td class="text-center align-middle">
                  <span
                    v-if="props.varAnnos?.dbnsfp?.PrimateAI_score <= 0.362"
                    class="benign-moderate"
                  >
                    benign moderate
                  </span>
                  <span
                    v-else-if="
                      props.varAnnos?.dbnsfp?.PrimateAI_score > 0.362 &&
                      props.varAnnos?.dbnsfp?.PrimateAI_score <= 0.483
                    "
                    class="benign-supporting"
                  >
                    benign supporting
                  </span>
                  <span
                    v-else-if="
                      props.varAnnos?.dbnsfp?.PrimateAI_score >= 0.79 &&
                      props.varAnnos?.dbnsfp?.PrimateAI_score < 0.867
                    "
                    class="pathogenic-supporting"
                  >
                    pathogenic supporting
                  </span>
                  <span
                    v-else-if="props.varAnnos?.dbnsfp?.PrimateAI_score >= 0.867"
                    class="pathogenic-moderate"
                  >
                    pathogenic moderate
                  </span>
                  <span v-else class="not-predictive"> &mdash; </span>
                </td>
              </template>
              <td v-else colspan="4" class="text-muted text-center font-italic">
                PrimateAI prediction not available.
              </td>
            </tr>

            <tr>
              <th class="align-middle">SIFT</th>
              <template v-if="siftScore && translatedSiftScore && translatedSiftScore !== Infinity">
                <td class="text-center align-middle">
                  {{ siftScore }}
                </td>
                <td class="text-center align-middle">
                  <ScoreDisplay
                    :range-lower="0"
                    :range-upper="1"
                    :height="12"
                    font-size="10px"
                    :value="translatedSiftScore"
                    :disp-trans-offset="1"
                    :disp-trans-mult="-1"
                    :benign-moderate-upper="0.673"
                    :benign-supporting-upper="0.92"
                    :pathogenic-supporting-lower="0.999"
                    :pathogenic-moderate-lower="1.0"
                  />
                </td>
                <td class="text-center align-middle">
                  <span v-if="siftScore >= 0.327" class="benign-moderate"> benign moderate </span>
                  <span
                    v-else-if="siftScore < 0.327 && siftScore >= 0.08"
                    class="benign-supporting"
                  >
                    benign supporting
                  </span>
                  <span
                    v-else-if="siftScore >= 0.001 && siftScore < 0"
                    class="pathogenic-supporting"
                  >
                    pathogenic supporting
                  </span>
                  <span v-else-if="siftScore == 0" class="pathogenic-moderate">
                    pathogenic moderate
                  </span>
                  <span v-else class="not-predictive"> &mdash; </span>
                </td>
              </template>
              <td v-else colspan="4" class="text-muted text-center font-italic">
                SIFT prediction not available.
              </td>
            </tr>

            <tr>
              <th class="align-middle">
                SpliceAI
                <!-- Toggle Button -->
                <v-btn
                  variant="outlined"
                  size="30"
                  color=""
                  icon
                  :disabled="!bestSpliceAi.key || bestSpliceAi.score === Infinity"
                  @click="expandSpliceAi = !expandSpliceAi"
                >
                  <v-icon>
                    {{ expandSpliceAi ? 'mdi-chevron-down' : 'mdi-chevron-right' }}
                  </v-icon>
                </v-btn>
              </th>
              <template v-if="bestSpliceAi.key && bestSpliceAi.score !== Infinity">
                <td class="text-center align-middle">
                  {{ bestSpliceAi.score }}
                  <span class="text-muted ml-2">({{ bestSpliceAi.key }})</span>
                </td>
                <td class="text-center align-middle">
                  <ScoreDisplay
                    :range-lower="0"
                    :range-upper="1"
                    :height="12"
                    font-size="10px"
                    :value="bestSpliceAi.score"
                  />
                </td>
                <td class="text-center align-middle">&mdash;</td>
              </template>
              <td v-else colspan="4" class="text-muted text-center font-italic">
                SpliceAI prediction not available.
              </td>
            </tr>

            <template v-if="expandSpliceAi">
              <tr v-for="(score, index) in allSpliceAi" :key="index">
                <th class="text-center align-middle">{{ index }}</th>
                <td>{{ score }}</td>
                <td class="text-center align-middle">
                  <ScoreDisplay
                    :range-lower="0"
                    :range-upper="1"
                    :height="12"
                    font-size="10px"
                    :value="score"
                  />
                </td>
                <td class="text-center align-middle">&mdash;</td>
              </tr>
            </template>

            <tr>
              <th class="align-middle">REVEL</th>
              <template v-if="revelScore && revelScore !== Infinity">
                <td class="text-center align-middle">
                  {{ revelScore }}
                </td>
                <td class="text-center align-middle">
                  <ScoreDisplay
                    :range-lower="0"
                    :range-upper="1"
                    :height="12"
                    font-size="10px"
                    :value="revelScore"
                    :benign-very-strong-upper="0.003"
                    :benign-strong-upper="0.016"
                    :benign-moderate-upper="0.183"
                    :benign-supporting-upper="0.29"
                    :pathogenic-supporting-lower="0.644"
                    :pathogenic-moderate-lower="0.773"
                    :pathogenic-strong-lower="0.932"
                  />
                </td>
                <td class="text-center align-middle">
                  <span v-if="revelScore <= 0.003" class="benign-very-strong">
                    benign very strong
                  </span>
                  <span v-else-if="revelScore > 0.003 && revelScore <= 0.016" class="benign-strong">
                    benign strong
                  </span>
                  <span
                    v-else-if="revelScore > 0.016 && revelScore <= 0.183"
                    class="benign-moderate"
                  >
                    benign moderate
                  </span>
                  <span
                    v-else-if="revelScore > 0.183 && revelScore <= 0.29"
                    class="benign-supporting"
                  >
                    benign supporting
                  </span>
                  <span
                    v-else-if="revelScore >= 0.644 && revelScore < 0.773"
                    class="pathogenic-supporting"
                  >
                    pathogenic supporting
                  </span>
                  <span
                    v-else-if="revelScore >= 0.773 && revelScore < 0.932"
                    class="pathogenic-moderate"
                  >
                    pathogenic moderate
                  </span>
                  <span v-else-if="revelScore >= 0.932" class="pathogenic-strong">
                    pathogenic strong
                  </span>
                  <span v-else class="not-predictive"> &mdash; </span>
                </td>
              </template>
              <td v-else colspan="4" class="text-muted text-center font-italic">
                REVEL prediction not available.
              </td>
            </tr>
          </tbody>
        </v-table>
      </div>
      <div v-else>
        <p class="text-muted text-center font-italic">
          Variant predictions are currently only available for SNVs and certain precomputed indels.
        </p>
      </div>
    </v-card-text>
    <v-card-subtitle class="text-overline"> UCSC 100 Vertebrate Conservation </v-card-subtitle>
    <v-card-text>
      <Conservation :var-annos="varAnnos" />
    </v-card-text>
  </v-card>
</template>

<style scoped>
.external-resource-item {
  float: left;
  margin-right: 10px;
}

.external-resource-item:last-child {
  float: none;
  margin-right: 0;
}

.benign-very-strong {
  padding: 2px;
  background-color: hsla(120, 100%, 50%, 0.65);
}

.benign-strong {
  padding: 2px;
  background-color: hsla(105.6, 100%, 50%, 0.65);
}

.benign-moderate {
  padding: 2px;
  background-color: hsla(91.2, 100%, 50%, 0.65);
}

.benign-supporting {
  padding: 2px;
  background-color: hsla(76.8, 100%, 50%, 0.65);
}

.pathogenic-supporting {
  padding: 2px;
  background-color: hsla(43.2, 100%, 50%, 0.65);
}

.pathogenic-moderate {
  padding: 2px;
  background-color: hsla(28.8, 100%, 50%, 0.65);
}

.pathogenic-strong {
  padding: 2px;
  background-color: hsla(14.4, 100%, 50%, 0.65);
}

.pathogenic-very-strong {
  padding: 2px;
  background-color: hsla(0, 100%, 50%, 0.65);
}
</style>
