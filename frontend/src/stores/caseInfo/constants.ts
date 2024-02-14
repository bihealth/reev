import { type CaseInfo, Ethnicity, Inheritance, Sex, Zygosity } from './types'

/** Prefix to use for local storage. */
export const LOCAL_STORAGE_PREFIX = 'reev.caseStore'

/** Labels for `Sex`. */
export const SexLabels = new Map<Sex, string>([
  [Sex.Unknown, 'Unknown'],
  [Sex.Female, 'Female'],
  [Sex.Male, 'Male']
])

/** Default case information. */
export const DEFAULT_CASE_INFO: CaseInfo = {
  id: 'iduuid',
  user: 'useruuid',
  pseudonym: '',
  diseases: [],
  hpoTerms: [],
  inheritance: Inheritance.Unknown,
  affectedFamilyMembers: false,
  sex: Sex.Unknown,
  ageOfOnsetMonths: null,
  ethnicity: Ethnicity.Unknown,
  zygosity: Zygosity.Unknown,
  familySegregation: false
}

/** Labels for `Zygosity`. */
export const ZygosityLabels = new Map<Zygosity, string>([
  [Zygosity.Heterozygous, 'Heterozygous'],
  [Zygosity.Homozygous, 'Homozygous'],
  [Zygosity.CompoundHeterozygous, 'Compound heterozygous'],
  [Zygosity.Unknown, 'Unknown']
])

/** Labels for `Ethnicity`. */
export const ethnicityLabels = new Map<Ethnicity, string>([
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
