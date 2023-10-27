/**
 * Store for case information.
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'

import { StoreState } from '@/stores/misc'

export enum Sex {
  Male = "male",
  Female = "female",
}

export enum Zygosity {
  Heterozygous = "heterozygous",
  Homozygous = "homozygous",
  CompoundHeterozygous = "compound heterozygous",
}

export const useCaseStore = defineStore('case', () => {
  /* The current store state. */
  const storeState = ref<StoreState>(StoreState.Initial)

  /* The case pseudonym. */
  const pseudonym = ref<string>('')

  /* Orphanet / OMIM disease(s). */
  const diseases = ref<string[]>([])

  /* HPO terms. */
  const hpoTerms = ref<string[]>([])

  /* Inheritance. */
  const inheritance = ref<string>('')

  /* Affected family members. */
  const affectedFamilyMembers = ref<string[]>([])

  /* Sex. */
  const sex = ref<Sex | undefined>(undefined)

  /* Age of onset. */
  const ageOfOnset = ref<string>('')

  /* Ethnicity. */
  const ethnicity = ref<string>('')

  /* Zygosity. */
  const zygosity = ref<Zygosity | undefined>(undefined)

  /* Family segregation. */
  const familySegregation = ref<string>('')

  const loadCase = async () => {
    storeState.value = StoreState.Loading
    try {
      // const client = new BookmarksClient()
      // bookmarks.value = await client.fetchBookmarks()
      storeState.value = StoreState.Active
    } catch (e) {
      storeState.value = StoreState.Error
    }
  }

  const updateCaseField = async (field: string, value: string) => {
    if (field === 'pseudonym') {
      pseudonym.value = value
    } else if (field === 'diseases') {
      diseases.value = value.split(',').map((disease) => disease.trim())
    } else if (field === 'hpoTerms') {
      hpoTerms.value = value.split(',').map((hpoTerm) => hpoTerm.trim())
    } else if (field === 'inheritance') {
      inheritance.value = value
    } else if (field === 'affectedFamilyMembers') {
      affectedFamilyMembers.value = value.split(',').map((member) => member.trim())
    } 
  }

  return {
    storeState,
    pseudonym,
    diseases,
    hpoTerms,
    inheritance,
    affectedFamilyMembers,
    sex,
    ageOfOnset,
    ethnicity,
    zygosity,
    familySegregation,
    loadCase,
    updateCaseField,
  }
})