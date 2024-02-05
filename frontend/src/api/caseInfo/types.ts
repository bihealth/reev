import type { HpoTerm } from '@/ext/reev-frontend-lib/src/api/viguno/types'
import type { OmimTerm } from '@/ext/reev-frontend-lib/src/pbs/annonars/genes/base'

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

/** Enumeration for possible molecular sex. */
export enum Sex {
  Male = 'PATO:0000384',
  Female = 'PATO:0000383',
  Unknown = 'reev:unknown_sex'
}

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

/** Enumeration for zygosity. */
export enum Zygosity {
  Heterozygous = 'GENO:0000135',
  Homozygous = 'NCIT:C45826',
  CompoundHeterozygous = 'NCIT:C198518',
  Unknown = 'reev:unknown_zygosity'
}

/** Case Info as returned by API */
export interface CaseInfo$Api {
  affected_family_members: boolean | null
  age_of_onset_month: number | null
  diseases: any[] // Replace with the actual type from your API
  ethinicity: string
  family_segregation: boolean | null
  hpo_terms: any[] // Replace with the actual type from your API
  id: string
  inheritance: string | null
  pseudonym: string
  sex: string | null
  user: string
  zygosity: string
}

/** Interface for the case data, for storage and API. */
export interface CaseInfo {
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

/**
 * Helper class for converting from CaseInfo$Api to CaseInfo.
 */
export class CaseInfo$Type {
  fromJson(apiResponse: CaseInfo$Api): CaseInfo {
    return {
      pseudonym: apiResponse.pseudonym,
      diseases: apiResponse.diseases,
      hpoTerms: apiResponse.hpo_terms,
      inheritance: apiResponse.inheritance as Inheritance,
      affectedFamilyMembers: apiResponse.affected_family_members,
      sex: apiResponse.sex as Sex,
      ageOfOnsetMonths: apiResponse.age_of_onset_month,
      ethnicity: apiResponse.ethinicity as Ethnicity,
      zygosity: apiResponse.zygosity as Zygosity,
      familySegregation: apiResponse.family_segregation
    }
  }
}

/**
 * Helper instance for converting from CaseInfo$Api to CaseInfo.
 */
export const CaseInfo = new CaseInfo$Type()

/** Failure information as returned by API. */
export interface FailureInfo {
  message: string
}

/**
 * Return type of the API.
 *
 * TODO: use wrapper to differentiate between success and failure
 */
export type ApiResponse = CaseInfo$Api | FailureInfo

/** Type guard for ApiResponse is CaseInfo$Api. */
export function isCaseInfo$Api(response: ApiResponse): response is CaseInfo$Api {
  return (response as CaseInfo$Api).id !== undefined
}

/** Type guard for ApiResponse is FailureInfo.  */
export function isFailureInfo(response: ApiResponse): response is FailureInfo {
  return (response as FailureInfo).message !== undefined
}
