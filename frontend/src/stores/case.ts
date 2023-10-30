/**
 * Store for case information.
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'

import { CaseInfoClient } from '@/api/caseinfo'
import { StoreState } from '@/stores/misc'

export enum Inheritance {
  AutosomalDominant = 'NCIT:C94245',
  AutosomalRecessive = 'NCIT:C94246',
  Cosegregation = 'NCIT:C94599',
  GeneticAnticipation = 'NCIT:C93189',
  GeneticLinkage = 'NCIT:C94542',
  XLinkedRecessive = 'NCIT:C94247',
  Unknown = 'reev:unknown_inheritance'
}

export enum Sex {
  Male = 'PATO:0000384',
  Female = 'PATO:0000383',
  Unknown = 'reev:unknown_sex'
}

export enum Ethnicity {
  AfricanAmerican = 'NCIT:C128937',
  AshkenaziJewish = 'NCIT:C17950',
  EastAsian = 'NCIT:C161419',
  Finnish = 'NCIT:C43865',
  European = 'NCIT:C43851',
  Latino = 'NCIT:C17459',
  MiddleEastern = 'NCIT:C43866',
  SouthAsian = 'NCIT:C41263',
  Other = 'NCIT:C104495',
  Unknown = 'reev:unknown_ethnicity'
}

export enum Zygosity {
  Heterozygous = 'GENO:0000135',
  Homozygous = 'NCIT:C45826',
  CompoundHeterozygous = 'NCIT:C198518',
  Unknown = 'reev:unknown_zygosity'
}

export interface OntologyTerm {
  term_id: string
  name: string
}

export interface Case {
  [key: string]: any
  /* The case pseudonym. */
  pseudonym: string
  /* Orphanet / OMIM disease(s). */
  diseases: OntologyTerm[]
  /* HPO terms. */
  hpoTerms: OntologyTerm[]
  /* Inheritance. */
  inheritance: Inheritance
  /* Affected family members. */
  affectedFamilyMembers: boolean | null
  /* Sex. */
  sex: Sex
  /* Age of onset in month. */
  ageOfOnsetMonths: number | null
  /* Ethnicity. */
  ethnicity: Ethnicity
  /* Zygosity. */
  zygosity: Zygosity
  /* Family segregation. */
  familySegregation: boolean | null
}

export interface APIResponse {
  affected_family_members: boolean
  age_of_onset_month: number
  diseases: any[] // Replace with the actual type from your API
  ethinicity: string
  family_segregation: boolean
  hpo_terms: any[] // Replace with the actual type from your API
  id: string
  inheritance: string
  pseudonym: string
  sex: string
  user: string
  zygosity: string
}

const apiResponseToFrontendCase = (apiResponse: APIResponse): Case => {
  return {
    pseudonym: apiResponse.pseudonym,
    diseases: apiResponse.diseases.map((item) => {
      // Do any conversion required from the API object to OntologyTerm
      return item as OntologyTerm
    }),
    hpoTerms: apiResponse.hpo_terms.map((item) => {
      // Do any conversion required from the API object to OntologyTerm
      return item as OntologyTerm
    }),
    inheritance: apiResponse.inheritance as Inheritance, // Assuming enums can directly map
    affectedFamilyMembers: apiResponse.affected_family_members,
    sex: apiResponse.sex as Sex, // Assuming enums can directly map
    ageOfOnsetMonths: apiResponse.age_of_onset_month,
    ethnicity: apiResponse.ethinicity as Ethnicity, // Assuming enums can directly map
    zygosity: apiResponse.zygosity as Zygosity, // Assuming enums can directly map
    familySegregation: apiResponse.family_segregation
  }
}

export const useCaseStore = defineStore('case', () => {
  /* The current store state. */
  const storeState = ref<StoreState>(StoreState.Initial)

  /* The case information. */
  const caseInfo = ref<Case>({
    pseudonym: '',
    diseases: [],
    hpoTerms: [],
    inheritance: Inheritance.Unknown,
    affectedFamilyMembers: null,
    sex: Sex.Unknown,
    ageOfOnsetMonths: null,
    ethnicity: Ethnicity.Unknown,
    zygosity: Zygosity.Unknown,
    familySegregation: null
  })

  function clearData() {
    caseInfo.value = {
      pseudonym: '',
      diseases: [],
      hpoTerms: [],
      inheritance: Inheritance.Unknown,
      affectedFamilyMembers: null,
      sex: Sex.Unknown,
      ageOfOnsetMonths: null,
      ethnicity: Ethnicity.Unknown,
      zygosity: Zygosity.Unknown,
      familySegregation: null
    }
  }

  const loadCase = async () => {
    storeState.value = StoreState.Loading
    try {
      const client = new CaseInfoClient()
      const result: APIResponse = await client.fetchCaseInfo()
      caseInfo.value = apiResponseToFrontendCase(result)
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
