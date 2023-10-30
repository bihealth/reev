import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'

import { Ethnicity, Inheritance, Sex, Zygosity, useCaseStore } from '@/stores/case'
import { StoreState } from '@/stores/misc'

const CaseInfo = {
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

describe.concurrent('Case Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should have initial state', () => {
    const store = useCaseStore()

    expect(store.storeState).toBe(StoreState.Initial)
    expect(store.caseInfo).toStrictEqual(CaseInfo)
  })

  it('should load case information', async () => {
    const store = useCaseStore()
    store.loadCase()

    expect(store.storeState).toBe(StoreState.Active)
    expect(store.caseInfo).toEqual(CaseInfo)
  })

  it('should update case information', async () => {
    const store = useCaseStore()
    const updatedCaseInfo = { ...CaseInfo, pseudonym: 'test' }

    expect(store.storeState).toBe(StoreState.Initial)
    expect(store.caseInfo).toStrictEqual(CaseInfo)
    store.updateCase(updatedCaseInfo)
    expect(store.storeState).toBe(StoreState.Active)
    expect(store.caseInfo).toEqual(updatedCaseInfo)
  })
})
