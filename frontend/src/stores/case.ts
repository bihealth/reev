/**
 * Store for case information.
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'

import { CaseInfoClient } from '@/api/caseinfo'
import { MITT, deepCopy } from '@/lib/utils'
import { useCadaPrioStore } from '@/stores/cadaprio'
import { StoreState } from '@/stores/misc'
import { Events as UserStoreEvents, useUserStore } from '@/stores/user'

/** Prefix to use for local storage. */
export const LOCAL_STORAGE_PREFIX = 'reev.caseStore'

/** The storage mode. */
export enum StorageMode {
  /** Local browser storage. */
  Local = 'local',
  /** Server storage. */
  Server = 'server'
}

/** Enumeration for the inheritance. */
export enum Inheritance {
  AutosomalDominant = 'NCIT:C94245',
  AutosomalRecessive = 'NCIT:C94246',
  Cosegregation = 'NCIT:C94599',
  GeneticAnticipation = 'NCIT:C93189',
  GeneticLinkage = 'NCIT:C94542',
  XLinkedRecessive = 'NCIT:C94247',
  Unknown = 'reev:unknown_inheritance'
}

/** Labels for `Inheritance`. */
export const InheritanceLabels = new Map<Inheritance, string>([
  [Inheritance.AutosomalDominant, 'Autosomal dominant'],
  [Inheritance.AutosomalRecessive, 'Autosomal recessive'],
  [Inheritance.Cosegregation, 'Cosegregation'],
  [Inheritance.GeneticAnticipation, 'Genetic anticipation'],
  [Inheritance.GeneticLinkage, 'Genetic linkage'],
  [Inheritance.XLinkedRecessive, 'X-linked recessive'],
  [Inheritance.Unknown, 'Unknown']
])

/** Enumeration for possible molecular sex. */
export enum Sex {
  Male = 'PATO:0000384',
  Female = 'PATO:0000383',
  Unknown = 'reev:unknown_sex'
}

/** Labels for `Sex`. */
export const SexLabels = new Map<Sex, string>([
  [Sex.Unknown, 'Unknown'],
  [Sex.Female, 'Female'],
  [Sex.Male, 'Male']
])

/** Enumeration for the ethnicity. */
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

/** Labels for `Ethnicity`. */
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

/** Enumeration for zygosity. */
export enum Zygosity {
  Heterozygous = 'GENO:0000135',
  Homozygous = 'NCIT:C45826',
  CompoundHeterozygous = 'NCIT:C198518',
  Unknown = 'reev:unknown_zygosity'
}

/** Labels for `Zygosity`. */
export const ZygosityLabels = new Map<Zygosity, string>([
  [Zygosity.Heterozygous, 'Heterozygous'],
  [Zygosity.Homozygous, 'Homozygous'],
  [Zygosity.CompoundHeterozygous, 'Compound heterozygous'],
  [Zygosity.Unknown, 'Unknown']
])

/** Interface for storing one HPO term, for storage and API. */
export interface HpoTerm {
  term_id: string
  name: string
  definition?: string
}

/** Interface for storing one OMIM term, for storage and API. */
export interface OmimTerm {
  omim_id: string
  name: string
}

/** Interface for the case data, for storage and API. */
export interface Case {
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

/** Interface for the API response. */
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

/** Translate from `ApiResponse` to `Case` (use in frontend). */
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

/** Default case information. */
export const DEFAULT_CASE_INFO: Case = Object.freeze({
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

export const useCaseStore = defineStore('case', () => {
  /** Current storage mode, set on initialization. */
  const storageMode = ref<StorageMode>(StorageMode.Local)
  /** The current store state. */
  const storeState = ref<StoreState>(StoreState.Initial)

  /** Currently stored case information. */
  const caseInfo = ref<Case>(deepCopy(DEFAULT_CASE_INFO))

  /** Clear all data from store. */
  const clearData = () => {
    caseInfo.value = deepCopy(DEFAULT_CASE_INFO)
  }

  /** Refresh the `cadaPrioStore` when the current case's terms change. */
  const refreshCadaPrioStore = async () => {
    const cadaPrioStore = useCadaPrioStore()
    await cadaPrioStore.loadData(
      caseInfo.value.hpoTerms.map((item) => item.term_id),
      { skipClear: true }
    )
  }

  /**
   * Setup the event handlers.
   *
   * Currently, we only listen to the login/logout events.
   */
  const setupEventHandlers = () => {
    MITT.on(UserStoreEvents.Login, async () => {
      await initialize(true)
    })
    MITT.on(UserStoreEvents.Logout, async () => {
      await initialize(true)
    })
  }

  /**
   * Initialize the case store.
   *
   * @param force whether to force initialization
   */
  const initialize = async (force: boolean = false) => {
    if (storeState.value === StoreState.Active && !force) {
      return // do not initialize twice
    }

    // Ensure initialization of the dependent stores (only user store).
    const userStore = useUserStore()
    await userStore.initialize()

    // Adjust the storage mode dependent on the login state and setup event handlers.
    storageMode.value = userStore.currentUser ? StorageMode.Server : StorageMode.Local
    setupEventHandlers()

    // Load case from storage.
    await loadCase()
  }

  /**
   * Internal function to load the current case.
   *
   * This function is private to the store.
   */
  const loadCase = async () => {
    if (storageMode.value === StorageMode.Local) {
      storeState.value = StoreState.Loading
      const storeData = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}.caseInfo`)
      if (!storeData) {
        clearData()
      } else {
        caseInfo.value = JSON.parse(storeData) as Case
      }
      storeState.value = StoreState.Active
    } else {
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
  }

  /**
   * Update the case information to server or local storage.
   *
   * @param caseData the case data to apply to the store
   */
  const updateCase = async (caseData: Case) => {
    if (storageMode.value === StorageMode.Local) {
      storeState.value = StoreState.Loading
      caseInfo.value = caseData
      localStorage.setItem(`${LOCAL_STORAGE_PREFIX}.caseInfo`, JSON.stringify(caseData))
      storeState.value = StoreState.Active
    } else {
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
  }

  /** Delete the case in the server or local storage. */
  const deleteCase = async () => {
    if (storageMode.value === StorageMode.Local) {
      storeState.value = StoreState.Loading
      localStorage.removeItem(`${LOCAL_STORAGE_PREFIX}.caseInfo`)
      clearData()
      storeState.value = StoreState.Active
    } else {
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
  }

  return {
    storageMode,
    storeState,
    caseInfo,
    initialize,
    clearData,
    updateCase,
    deleteCase
  }
})
