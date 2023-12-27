<script setup lang="ts">
import _ from 'lodash'
import { computed, onMounted, ref, watch } from 'vue'

import { roundIt } from '@/lib/utils'
import { useCadaPrioStore } from '@/stores/cadaprio'
import {
  Ethnicity,
  Inheritance,
  InheritanceLabels,
  Sex,
  SexLabels,
  StorageMode,
  Zygosity,
  ZygosityLabels,
  ethinicityLabels,
  useCaseStore
} from '@/stores/case'
import { useTermsStore } from '@/stores/terms'

const caseStore = useCaseStore()
const termsStore = useTermsStore()
const cadaPrioStore = useCadaPrioStore()
const cadaPrioRankingFields = ref([
  { title: '#', key: 'rank' },
  { title: 'Gene Symbol', key: 'gene_symbol' },
  { title: 'Score', key: 'score' }
])

const form = ref(null)

const inheritanceOptions = computed(() => {
  return Object.values(Inheritance).map((value) => {
    return {
      text: InheritanceLabels.get(value),
      value: value
    }
  })
})

const ethnicityOptions = computed(() => {
  return Object.values(Ethnicity).map((value) => {
    return {
      text: ethinicityLabels.get(value),
      value: value
    }
  })
})

const sexOptions = computed(() => {
  return Object.values(Sex).map((value) => {
    return {
      text: SexLabels.get(value),
      value: value
    }
  })
})

const zygosityOptions = computed(() => {
  return Object.values(Zygosity).map((value) => {
    return {
      text: ZygosityLabels.get(value),
      value: value
    }
  })
})

const loadDataToStore = async () => {
  await caseStore.initialize()
  if (caseStore.caseInfo.hpoTerms.length > 0) {
    const hpoTermsList: string[] = caseStore.caseInfo.hpoTerms.map((term) => term.term_id)
    await cadaPrioStore.loadData(hpoTermsList)
  }
}

const saveChanges = () => {
  if (!form.value) {
    return
  }
  if ((form.value as any).validate()) {
    caseStore.updateCase(caseStore.caseInfo)
  }
}

const deleteCaseInformation = () => {
  caseStore.deleteCase()
}

const validateAgeOfOnset = (value: string) => {
  const pattern = /^[0-9]*$/
  return pattern.test(value) || 'Age of onset must be a number'
}

const hpoIsLoading = ref(false)
const omimIsLoading = ref(false)
const hpoSearchQuery = ref()
const omimSearchQuery = ref()

// Debounced fetchTerms functions
const debouncedHpoFetchTerms = _.debounce(async (query: string) => {
  if (!query) return
  hpoIsLoading.value = true
  try {
    await termsStore.fetchHpoTerms(query)
  } finally {
    hpoIsLoading.value = false
  }
}, 250)

const debouncedOmimFetchTerms = _.debounce(async (query: string) => {
  if (!query) return
  omimIsLoading.value = true
  try {
    await termsStore.fetchOmimTerms(query)
  } finally {
    omimIsLoading.value = false
  }
}, 250)

onMounted(async () => {
  loadDataToStore()
})

watch(
  () => caseStore.caseInfo.hpoTerms,
  async () => {
    if (caseStore.caseInfo.hpoTerms.length > 0) {
      const hpoTermsList: string[] = caseStore.caseInfo.hpoTerms.map((term) => term.term_id)
      await cadaPrioStore.loadData(hpoTermsList)
    }
  }
)
</script>

<template>
  <div>
    <v-row no-gutters>
      <v-col>
        <v-card>
          <v-responsive min-width="300">
            <v-card-title>Case Information</v-card-title>
            <v-card-text>
              <p class="text-body-2 pb-3">
                You can store information about your current case here. The HPO terms will be used
                to prioritize genes using the CADA algorithm. On the right, you will see all known
                disease genes ranked by their CADA score. Also, you will see the rank in the details
                section of each gene.
              </p>
              <p v-if="caseStore.storageMode === StorageMode.Local" class="text-body-2 pb-3">
                As you are not logged in, we will store the case information in the local browser
                storage.
              </p>
              <v-form ref="form">
                <v-text-field
                  v-model="caseStore.caseInfo.pseudonym"
                  class="pb-3"
                  label="Pseudonym"
                  density="default"
                  hide-details
                />

                <!-- Diseases -->
                <v-autocomplete
                  v-show="false"
                  v-model="caseStore.caseInfo.diseases"
                  v-model:search="omimSearchQuery"
                  class="pb-3"
                  :items="termsStore.omimTerms"
                  :loading="omimIsLoading"
                  label="Disease"
                  :item-title="(item) => item.name"
                  :item-value="(item) => item"
                  multiple
                  chips
                  closable-chips
                  deletable-chips
                  hint="Start typing to search for OMIM diseases"
                  persistent-hint
                  @update:search="debouncedOmimFetchTerms"
                />

                <!-- HPO Terms -->
                <v-autocomplete
                  v-model="caseStore.caseInfo.hpoTerms"
                  v-model:search="hpoSearchQuery"
                  class="pb-3"
                  :items="termsStore.hpoTerms"
                  :loading="hpoIsLoading"
                  label="HPO Terms"
                  :item-title="(item) => `${item.name} (${item.term_id})`"
                  :item-value="(item) => item"
                  :item-props="
                    (item) => ({
                      subtitle: item.definition
                    })
                  "
                  :no-filter="true"
                  multiple
                  chips
                  closable-chips
                  deletable-chips
                  hint="Start typing to search for OMIM diseases"
                  persistent-hint
                  @update:search="debouncedHpoFetchTerms"
                />

                <!-- Inheritance -->
                <v-select
                  v-show="false"
                  v-model="caseStore.caseInfo.inheritance"
                  label="Inheritance"
                  :items="inheritanceOptions"
                  item-title="text"
                  item-value="value"
                />

                <v-row v-show="false" no-gutters>
                  <v-col cols="6">
                    <!-- Affected Family Members -->
                    <v-switch
                      v-model="caseStore.caseInfo.affectedFamilyMembers"
                      class="pl-3"
                      label="Affected Family Members"
                      color="primary"
                      density="compact"
                    />
                  </v-col>
                  <v-col cols="6">
                    <!-- Family Segregation -->
                    <v-switch
                      v-model="caseStore.caseInfo.familySegregation"
                      label="Family Segregation"
                      color="primary"
                      density="compact"
                    />
                  </v-col>
                </v-row>

                <!-- Sex -->
                <v-select
                  v-show="false"
                  v-model="caseStore.caseInfo.sex"
                  class="pb-3"
                  label="Sex"
                  :items="sexOptions"
                  item-title="text"
                  item-value="value"
                  hide-details
                />

                <!-- Age of Onset -->
                <v-text-field
                  v-show="false"
                  v-model.number="caseStore.caseInfo.ageOfOnsetMonths"
                  class="pb-3"
                  label="Age of Onset (Months)"
                  :rules="[validateAgeOfOnset]"
                />

                <!-- Ethnicity -->
                <v-select
                  v-show="false"
                  v-model="caseStore.caseInfo.ethnicity"
                  label="Ethnicity"
                  :items="ethnicityOptions"
                  item-title="text"
                  item-value="value"
                />

                <!-- Zygosity -->
                <v-select
                  v-show="false"
                  v-model="caseStore.caseInfo.zygosity"
                  label="Zygosity"
                  :items="zygosityOptions"
                  item-title="text"
                  item-value="value"
                />

                <!-- Buttons -->
                <v-btn class="ml-2" @click="saveChanges"> Save Changes </v-btn>
                <v-btn class="ml-2" color="secondary" @click="deleteCaseInformation">
                  Delete Case info
                </v-btn>
              </v-form>
            </v-card-text>
          </v-responsive>
        </v-card>
      </v-col>

      <v-col>
        <v-card>
          <v-responsive min-width="300">
            <v-card-title>Cada-prio gene ranking for current HPO:</v-card-title>
            <v-card-text>
              <p v-if="!cadaPrioStore.geneRanking?.length" class="text-body-1 pb-3">
                Gene ranking results will appear once you have selected at least one HPO term.
              </p>
              <v-data-table
                :headers="cadaPrioRankingFields as any"
                :items="cadaPrioStore.geneRanking ?? []"
                :items-per-page="10"
                density="compact"
              >
                <template #[`item.gene_symbol`]="{ item }">
                  <router-link
                    :to="{
                      name: 'gene-details',
                      params: { gene: item.hgnc_id }
                    }"
                    target="_blank"
                  >
                    {{ item.gene_symbol }}
                  </router-link>
                </template>

                <template #[`item.score`]="{ item }">
                  <!-- eslint-disable vue/no-v-html -->
                  <span v-html="roundIt(item.score, 2)" />
                  <!-- eslint-enable -->
                </template>
              </v-data-table>
            </v-card-text>
          </v-responsive>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
