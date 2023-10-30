/**
 * Store for case information.
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'

import { StoreState } from '@/stores/misc'

export enum Sex {
  Male = 'male',
  Female = 'female'
}

export enum Zygosity {
  Heterozygous = 'heterozygous',
  Homozygous = 'homozygous',
  CompoundHeterozygous = 'compound heterozygous'
}

export interface Case {
  /* The case pseudonym. */
  pseudonym: string
  /* Orphanet / OMIM disease(s). */
  diseases: string[]
  /* HPO terms. */
  hpoTerms: string[]
  /* Inheritance. */
  inheritance: string
  /* Affected family members. */
  affectedFamilyMembers: string[]
  /* Sex. */
  sex: Sex | undefined
  /* Age of onset. */
  ageOfOnset: string
  /* Ethnicity. */
  ethnicity: string
  /* Zygosity. */
  zygosity: Zygosity | undefined
  /* Family segregation. */
  familySegregation: string
}

export const useCaseStore = defineStore('case', () => {
  /* The current store state. */
  const storeState = ref<StoreState>(StoreState.Initial)

  /* The case information. */
  const caseInfo = ref<Case>({
    pseudonym: '',
    diseases: [],
    hpoTerms: [],
    inheritance: '',
    affectedFamilyMembers: [],
    sex: undefined,
    ageOfOnset: '',
    ethnicity: '',
    zygosity: undefined,
    familySegregation: ''
  })

  function clearData() {
    caseInfo.value = {
      pseudonym: '',
      diseases: [],
      hpoTerms: [],
      inheritance: '',
      affectedFamilyMembers: [],
      sex: undefined,
      ageOfOnset: '',
      ethnicity: '',
      zygosity: undefined,
      familySegregation: ''
    }
  }

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

  const updateCase = async (caseUpdate: Case) => {
    caseInfo.value = { ...caseUpdate }
    storeState.value = StoreState.Active
  }

  return {
    storeState,
    caseInfo,
    clearData,
    loadCase,
    updateCase
  }
})
