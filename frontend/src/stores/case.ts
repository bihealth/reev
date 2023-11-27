/**
 * Store for case information.
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'

import { CaseInfoClient } from '@/api/caseinfo'
import { useCadaPrioStore } from '@/stores/cadaprio'
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

export const InheritanceLabels = new Map<Inheritance, string>([
  [Inheritance.AutosomalDominant, 'Autosomal dominant'],
  [Inheritance.AutosomalRecessive, 'Autosomal recessive'],
  [Inheritance.Cosegregation, 'Cosegregation'],
  [Inheritance.GeneticAnticipation, 'Genetic anticipation'],
  [Inheritance.GeneticLinkage, 'Genetic linkage'],
  [Inheritance.XLinkedRecessive, 'X-linked recessive'],
  [Inheritance.Unknown, 'Unknown']
])

export enum Sex {
  Male = 'PATO:0000384',
  Female = 'PATO:0000383',
  Unknown = 'reev:unknown_sex'
}

export const SexLabels = new Map<Sex, string>([
  [Sex.Unknown, 'Unknown'],
  [Sex.Female, 'Female'],
  [Sex.Male, 'Male']
])

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

export const ethinicityLabels = new Map<Ethnicity, string>([
  [Ethnicity.AfricanAmerican, 'African American'],
  [Ethnicity.AshkenaziJewish, 'Ashkenazi Jewish'],
  [Ethnicity.EastAsian, 'East Asian'],
  [Ethnicity.Finnish, 'Finnish'],
  [Ethnicity.European, 'European'],
  [Ethnicity.Latino, 'Latino'],
  [Ethnicity.MiddleEastern, 'Middle Eastern'],
  [Ethnicity.SouthAsian, 'South Asian'],
  [Ethnicity.Other, 'Other'],
  [Ethnicity.Unknown, 'Unknown']
])

export enum Zygosity {
  Heterozygous = 'GENO:0000135',
  Homozygous = 'NCIT:C45826',
  CompoundHeterozygous = 'NCIT:C198518',
  Unknown = 'reev:unknown_zygosity'
}

export const ZygosityLabels = new Map<Zygosity, string>([
  [Zygosity.Heterozygous, 'Heterozygous'],
  [Zygosity.Homozygous, 'Homozygous'],
  [Zygosity.CompoundHeterozygous, 'Compound heterozygous'],
  [Zygosity.Unknown, 'Unknown']
])

export interface HpoTerm {
  term_id: string
  name: string
}

export interface OmimTerm {
  omim_id: string
  name: string
}

export interface Case {
  [key: string]: any
  /* The case pseudonym. */
  pseudonym: string
  /* Orphanet / OMIM disease(s). */
  diseases: OmimTerm[]
  /* HPO terms. */
  hpoTerms: HpoTerm[]
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
  affected_family_members: boolean | null
  age_of_onset_month: number | null
  diseases: any[] // Replace with the actual type from your API
  ethinicity: string
  family_segregation: boolean | null
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
      return item as OmimTerm
    }),
    hpoTerms: apiResponse.hpo_terms.map((item) => {
      return item as HpoTerm
    }),
    inheritance: apiResponse.inheritance as Inheritance,
    affectedFamilyMembers: apiResponse.affected_family_members,
    sex: apiResponse.sex as Sex,
    ageOfOnsetMonths: apiResponse.age_of_onset_month,
    ethnicity: apiResponse.ethinicity as Ethnicity,
    zygosity: apiResponse.zygosity as Zygosity,
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

  /** Refresh the `cadaPrioStore` when the current case's terms change. */
  const refreshCadaPrioStore = async () => {
    const cadaPrioStore = useCadaPrioStore()
    await cadaPrioStore.loadData(caseInfo.value.hpoTerms.map((item) => item.term_id))
  }

  const loadCase = async () => {
    storeState.value = StoreState.Loading
    try {
      const client = new CaseInfoClient()
      const result: any = await client.fetchCaseInfo()
      caseInfo.value = apiResponseToFrontendCase(result as APIResponse)

      // refresh CADA prio store after loading case
      await refreshCadaPrioStore()

      storeState.value = StoreState.Active
    } catch (e) {
      clearData()
      storeState.value = StoreState.Active
    }
  }

  const updateCase = async (caseData: Case) => {
    storeState.value = StoreState.Loading
    try {
      const client = new CaseInfoClient()
      const result: any = await client.fetchCaseInfo()
      if (result.detail === 'Unauthorized') {
        storeState.value = StoreState.Error
        return
      } else if (result.detail === 'Case Information not found') {
        await client.createCaseInfo(caseData)
      } else {
        const updatedCase = await client.updateCaseInfo(caseData)
        caseInfo.value = apiResponseToFrontendCase(updatedCase as APIResponse)
      }

      // refresh CADA prio store after loading case
      await refreshCadaPrioStore()

      storeState.value = StoreState.Active
    } catch (e) {
      storeState.value = StoreState.Error
    }
  }

  const deleteCase = async () => {
    storeState.value = StoreState.Loading
    try {
      const client = new CaseInfoClient()
      const result = await client.deleteCaseInfo()
      if (result.detail === 'Unauthorized') {
        storeState.value = StoreState.Error
        return
      }
      clearData()

      // refresh CADA prio store after clearing the case
      await refreshCadaPrioStore()

      storeState.value = StoreState.Active
    } catch (e) {
      storeState.value = StoreState.Error
    }
  }

  return {
    storeState,
    caseInfo,
    clearData,
    loadCase,
    updateCase,
    deleteCase
  }
})
