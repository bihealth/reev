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
  for (const elem of selAnnos.value?.alleleCounts ?? []) {
    if (!elem.cohort) {
      return elem
    }
  }
  return null
})

const byPop = computed(() => {
  const res: any = {}
  for (const record of noCohort.value?.byPopulation ?? []) {
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
          <th />
          <th class="text-right text-nowrap">
            <abbr title="total number of alleles"> Allele Count </abbr>
          </th>
          <th class="text-right text-nowrap">
            <abbr title="variant alleles in high-quality calls"> Allele Number </abbr>
          </th>
          <th class="text-right text-nowrap">
            <abbr title="number of individuals with homozygote alleles"> Homozygotes </abbr>
          </th>
          <th class="text-right text-nowrap">
            <abbr title="frequency of variant alleles called with high quality">
              Allele Frequency
            </abbr>
          </th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(label, key) of allPopLabels" :key="key">
          <template v-if="byPop[key]?.counts?.overall?.an">
            <tr>
              <td>
                {{ label }}
                <a v-if="!sexExpanded[key]" @click.prevent="sexExpanded[key] = true">
                  <v-icon>mdi-chevron-down</v-icon>
                </a>
                <a v-else @click.prevent="sexExpanded[key] = false">
                  <v-icon>mdi-chevron-down</v-icon>
                </a>
              </td>
              <td />
              <td class="text-right text-nowrap">
                {{ sep(byPop[key]?.counts?.overall?.an ?? 0) }}
              </td>
              <td class="text-right text-nowrap">
                {{ sep(byPop[key]?.counts?.overall?.ac ?? 0) }}
              </td>
              <td class="text-right text-nowrap">
                {{ sep(byPop[key]?.counts?.overall?.nhomalt ?? 0) }}
              </td>
              <!-- eslint-disable vue/no-v-html -->
              <td
                class="text-right text-nowrap"
                v-html="roundIt(byPop[key]?.counts?.overall?.af, FREQ_DIGITS)"
              />
              <!-- eslint-enable -->
            </tr>
            <tr :id="idKey(key) + '-xx'" :class="{ 'd-none': !sexExpanded[key] }">
              <td />
              <td class="text-right text-nowrap">XX</td>
              <td class="text-right text-nowrap">
                {{ sep(byPop[key]?.counts?.xx?.an ?? 0) }}
              </td>
              <td class="text-right text-nowrap">
                {{ sep(byPop[key]?.counts?.xx?.nhomal ?? 0) }}
              </td>
              <!-- eslint-disable vue/no-v-html -->
              <td
                class="text-right text-nowrap"
                v-html="roundIt(byPop[key]?.counts?.xx?.af ?? 0.0, FREQ_DIGITS)"
              />
              <td
                class="text-right text-nowrap"
                v-html="roundIt(byPop[key]?.counts?.xx?.af, FREQ_DIGITS)"
              />
              <!-- eslint-enable -->
            </tr>
            <tr :id="idKey(key) + '-xy'" :class="{ 'd-none': !sexExpanded[key] }">
              <td />
              <td class="text-right text-nowrap">XY</td>
              <td class="text-right text-nowrap">
                {{ sep(byPop[key].counts?.xy?.an ?? 0) }}
              </td>
              <td class="text-right text-nowrap">
                {{ sep(byPop[key].counts?.xy?.ac ?? 0) }}
              </td>
              <td class="text-right text-nowrap">
                {{ sep(byPop[key].counts?.xy?.nhomalt ?? 0) }}
              </td>
              <!-- eslint-disable vue/no-v-html -->
              <td
                class="text-right text-nowrap"
                v-html="roundIt(byPop[key].counts?.xy?.af, FREQ_DIGITS)"
              />
              <!-- eslint-enable -->
            </tr>
          </template>
        </template>

        <tr class="table-info">
          <th>Total</th>
          <td />
          <td class="text-right text-nowrap">
            {{ sep(noCohort?.bySex?.overall?.an ?? 0) }}
          </td>
          <td class="text-right text-nowrap">
            {{ sep(noCohort?.bySex?.overall?.ac ?? 0) }}
          </td>
          <td class="text-right text-nowrap">
            {{ sep(noCohort?.bySex?.overall?.nhomalt ?? 0) }}
          </td>
          <!-- eslint-disable vue/no-v-html -->
          <td
            class="text-right text-nowrap"
            v-html="roundIt(noCohort?.bySex?.overall?.af ?? 0.0, FREQ_DIGITS)"
          />
          <!-- eslint-enable -->
        </tr>

        <tr>
          <td />
          <td class="text-right text-nowrap">XX</td>
          <td class="text-right text-nowrap">
            {{ sep(noCohort?.bySex?.xx?.an ?? 0) }}
          </td>
          <td class="text-right text-nowrap">
            {{ sep(noCohort?.bySex?.xx?.ac ?? 0) }}
          </td>
          <td class="text-right text-nowrap">
            {{ sep(noCohort?.bySex?.xx?.nhomalt ?? 0) }}
          </td>
          <!-- eslint-disable vue/no-v-html -->
          <td
            class="text-right text-nowrap"
            v-html="roundIt(noCohort?.bySex?.xx?.af ?? 0.0, FREQ_DIGITS)"
          />
          <!-- eslint-enable -->
        </tr>

        <tr>
          <td />
          <td class="text-right text-nowrap">XY</td>
          <td class="text-right text-nowrap">
            {{ sep(noCohort?.bySex?.xy?.an ?? 0) }}
          </td>
          <td class="text-right text-nowrap">
            {{ sep(noCohort?.bySex?.xy?.ac ?? 0) }}
          </td>
          <td class="text-right text-nowrap">
            {{ sep(noCohort?.bySex?.xy?.nhomalt ?? 0) }}
          </td>
          <!-- eslint-disable vue/no-v-html -->
          <td
            class="text-right text-nowrap"
            v-html="roundIt(noCohort?.bySex?.xy?.af ?? 0.0, FREQ_DIGITS)"
          />
          <!-- eslint-enable -->
        </tr>
      </tbody>
    </v-table>

    <div v-else>
      No allele frequency information available in local database. Try to lookup the variant
      directly:
      <a
        v-if="smallVar.release == 'grch37'"
        :href="`https://gnomad.broadinstitute.org/variant/${smallVar.chromosome.replace(
          /^chr/,
          ''
        )}-${smallVar.start}-${smallVar.reference}-${smallVar.alternative}?dataset=gnomad_r2_1`"
      >
        <v-icon>mdi-launch</v-icon>
        gnomAD
      </a>
      <a
        v-if="smallVar.release == 'grch38'"
        :href="`https://gnomad.broadinstitute.org/variant/${smallVar.chromosome.replace(
          /^chr/,
          ''
        )}-${smallVar.start}-${smallVar.reference}-${smallVar.alternative}?dataset=gnomad_r3`"
      >
        <v-icon>mdi-launch</v-icon>
        gnomAD
      </a>
    </div>
  </v-card-text>
</template>
