<script setup lang="ts">
import { computed, ref } from 'vue'

import { roundIt, separateIt as sep } from '@/lib/utils'
import { type SmallVariant } from '@/stores/variantInfo'

const props = defineProps<{
  smallVar: SmallVariant
  varAnnos: any
  dataset: string
}>()

const FREQ_DIGITS = 5

const selAnnos = computed(() => {
  if (!props.varAnnos) {
    return null
  } else {
    return props.varAnnos[props.dataset]
  }
})

const noCohort = computed(() => {
  for (const elem of selAnnos.value?.allele_counts ?? []) {
    if (!elem.cohort) {
      return elem
    }
  }
  return null
})

const bySex = computed(() => {
  return noCohort.value?.by_sex
})

const byPop = computed(() => {
  const res: any = {}
  for (const record of noCohort.value?.by_population ?? []) {
    res[record.population] = record
  }
  return res
})

const allPopLabels = {
  afr: 'African-American/African',
  asj: 'Ashkenazy Jewish',
  eas: 'East Asian',
  fin: 'European (Finnish)',
  nfe: 'European (North-Western)',
  amr: 'Latino/Admixed American',
  sas: 'South Asian',
  oth: 'Other'
}

const idKey = (token: string): string => {
  return `id-${props.dataset}-${token}`
}

const sexExpanded: any = ref({})
</script>

<template>
  <v-card-text>
    <div>
      <span style="font-size: 120%">
        <template v-if="props.dataset === 'gnomad_exomes'"> gnomAD Exomes </template>
        <template v-if="props.dataset === 'gnomad_genomes'"> gnomAD Genomes </template>
      </span>
      <a
        v-if="smallVar.release == 'grch37'"
        :href="`https://gnomad.broadinstitute.org/variant/${smallVar.chromosome.replace(
          /^chr/,
          ''
        )}-${smallVar.start}-${smallVar.reference}-${smallVar.alternative}?dataset=gnomad_r2_1`"
        target="_blank"
      >
        <v-icon>mdi-launch</v-icon>
        @gnomAD
      </a>
      <a
        v-if="smallVar.release == 'grch38'"
        :href="`https://gnomad.broadinstitute.org/variant/${smallVar.chromosome.replace(
          /^chr/,
          ''
        )}-${smallVar.start}-${smallVar.reference}-${smallVar.alternative}?dataset=gnomad_r3`"
        target="_blank"
      >
        <v-icon>mdi-launch</v-icon>
        @gnomAD
      </a>
    </div>
    <v-table v-if="selAnnos">
      <thead>
        <tr>
          <th>Population</th>
          <th></th>
          <th>Allele Count</th>
          <th>Homozygotes</th>
          <th>Allele Frequency</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(label, key) of allPopLabels" :key="key">
          <template v-if="byPop[key]?.counts?.overall?.an">
            <tr>
              <td>
                {{ label }}
                <a @click.prevent="sexExpanded[key] = true" v-if="!sexExpanded[key]">
                  <v-icon>mdi-chevron-down</v-icon>
                </a>
                <a @click.prevent="sexExpanded[key] = false" v-else>
                  <v-icon>mdi-chevron-down</v-icon>
                </a>
              </td>
              <td></td>
              <td>
                {{ sep(byPop[key]?.counts?.overall?.an) }}
              </td>
              <td>
                {{ sep(byPop[key]?.counts?.overall?.nhomalt) }}
              </td>
              <td v-html="roundIt(byPop[key]?.counts?.overall?.af, FREQ_DIGITS)"></td>
            </tr>
            <tr :id="idKey(key) + '-xx'" :class="{ 'd-none': !sexExpanded[key] }">
              <td></td>
              <td>XX</td>
              <td>
                {{ sep(byPop[key]?.counts?.xx?.an) }}
              </td>
              <td>
                {{ sep(byPop[key]?.counts?.xx?.nhomalt) }}
              </td>
              <td v-html="roundIt(byPop[key]?.counts?.xx?.af, FREQ_DIGITS)"></td>
            </tr>
            <tr :id="idKey(key) + '-xy'" :class="{ 'd-none': !sexExpanded[key] }">
              <td></td>
              <td>XY</td>
              <td>
                {{ sep(byPop[key].counts?.xy?.an) }}
              </td>
              <td>
                {{ sep(byPop[key].counts?.xy?.nhomalt) }}
              </td>
              <td v-html="roundIt(byPop[key].counts?.xy?.af, FREQ_DIGITS)"></td>
            </tr>
          </template>
        </template>

        <tr>
          <th>Total</th>
          <td></td>
          <td>{{ sep(bySex?.overall?.an) }}</td>
          <td>
            {{ sep(bySex?.overall?.nhomalt) }}
          </td>
          <td v-html="roundIt(bySex?.overall?.af, FREQ_DIGITS)"></td>
        </tr>

        <tr>
          <td></td>
          <td>XX</td>
          <td>{{ sep(bySex?.xx?.an) }}</td>
          <td>{{ sep(bySex?.xx?.nhomalt) }}</td>
          <td v-html="roundIt(bySex?.xx?.af, FREQ_DIGITS)"></td>
        </tr>

        <tr>
          <td></td>
          <td>XY</td>
          <td>{{ sep(bySex?.xy?.an) }}</td>
          <td>{{ sep(bySex?.xy?.nhomalt) }}</td>
          <td v-html="roundIt(bySex?.xy?.af, FREQ_DIGITS)"></td>
        </tr>
      </tbody>
    </v-table>

    <div v-else>
      No allele frequency information available in local database. Try to lookup the variant
      directly:
      <a
        :href="`https://gnomad.broadinstitute.org/variant/${smallVar.chromosome.replace(
          /^chr/,
          ''
        )}-${smallVar.start}-${smallVar.reference}-${smallVar.alternative}?dataset=gnomad_r2_1`"
        v-if="smallVar.release == 'grch37'"
      >
        <v-icon>mdi-launch</v-icon>
        gnomAD
      </a>
      <a
        :href="`https://gnomad.broadinstitute.org/variant/${smallVar.chromosome.replace(
          /^chr/,
          ''
        )}-${smallVar.start}-${smallVar.reference}-${smallVar.alternative}?dataset=gnomad_r3`"
        v-if="smallVar.release == 'grch38'"
      >
        <v-icon>mdi-launch</v-icon>
        gnomAD
      </a>
    </div>
  </v-card-text>
</template>
