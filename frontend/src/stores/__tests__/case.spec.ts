import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import createFetchMock from 'vitest-fetch-mock'

import { type Case, Ethnicity, Inheritance, Sex, Zygosity, useCaseStore } from '@/stores/case'
import { StoreState } from '@/stores/misc'

const fetchMocker = createFetchMock(vi)

const CaseInfo: Case = {
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
    fetchMocker.enableMocks()
    fetchMocker.resetMocks()
  })

  it('should clear data', () => {
    const store = useCaseStore()
    // Set a non-initial state to check if clearData works properly
    store.caseInfo = { ...CaseInfo, pseudonym: 'TestPseudonym' }

    store.clearData()

    expect(store.caseInfo).toStrictEqual(CaseInfo)
  })

  it('should handle unauthorized access when loading case', async () => {
    const store = useCaseStore()
    fetchMocker.mockResponseOnce(JSON.stringify({ detail: 'Unauthorized' }), { status: 401 })

    await store.loadCase()

    expect(store.storeState).toBe(StoreState.Active)
  })

  it('should handle not found when loading case', async () => {
    const store = useCaseStore()
    fetchMocker.mockResponseOnce(JSON.stringify({ detail: 'Case Information not found' }), {
      status: 404
    })

    await store.loadCase()

    expect(store.storeState).toBe(StoreState.Active)
  })

  it('should handle server error when loading case', async () => {
    const store = useCaseStore()
    fetchMocker.mockReject(new Error('Internal Server Error'))

    await store.loadCase()

    expect(store.storeState).toBe(StoreState.Active)
  })

  it('should handle unauthorized access when updating case', async () => {
    const store = useCaseStore()
    fetchMocker.mockResponseOnce(JSON.stringify({ detail: 'Unauthorized' }), { status: 401 })

    await store.updateCase(CaseInfo)

    expect(store.storeState).toBe(StoreState.Error)
  })

  it('should handle server error when updating case', async () => {
    const store = useCaseStore()
    fetchMocker.mockReject(new Error('Internal Server Error'))

    await store.updateCase(CaseInfo)

    expect(store.storeState).toBe(StoreState.Error)
  })

  it('should delete case information', async () => {
    const store = useCaseStore()
    fetchMocker.mockResponseOnce(JSON.stringify({}))

    await store.deleteCase()

    expect(store.storeState).toBe(StoreState.Active)
    expect(store.caseInfo).toStrictEqual(CaseInfo) // assuming clearData is called in deleteCase
  })

  it('should handle unauthorized access when deleting case', async () => {
    const store = useCaseStore()
    fetchMocker.mockResponseOnce(JSON.stringify({ detail: 'Unauthorized' }), { status: 401 })

    await store.deleteCase()

    expect(store.storeState).toBe(StoreState.Error)
  })

  it('should handle server error when deleting case', async () => {
    const store = useCaseStore()
    fetchMocker.mockReject(new Error('Internal Server Error'))

    await store.deleteCase()

    expect(store.storeState).toBe(StoreState.Error)
  })

  it('should have initial state', () => {
    const store = useCaseStore()

    expect(store.storeState).toBe(StoreState.Initial)
    expect(store.caseInfo).toStrictEqual(CaseInfo)
  })

  it('should load case information', async () => {
    const store = useCaseStore()
    fetchMocker.mockResponse(JSON.stringify(CaseInfo))

    await store.loadCase()

    expect(store.storeState).toBe(StoreState.Active)
    expect(store.caseInfo).toEqual(CaseInfo)
  })

  it.skip('should update case information', async () => {
    const store = useCaseStore()
    const updatedCaseInfo = { ...CaseInfo, pseudonym: 'test' }
    fetchMocker.mockResponse((req) => {
      if (req.url.includes('get')) {
        return Promise.resolve(JSON.stringify(CaseInfo))
      } else if (req.url.includes('update')) {
        return Promise.resolve(JSON.stringify(updatedCaseInfo))
      } else {
        return Promise.resolve(JSON.stringify({ status: 400 }))
      }
    })

    expect(store.storeState).toBe(StoreState.Initial)
    expect(store.caseInfo).toStrictEqual(CaseInfo)
    await store.updateCase(updatedCaseInfo)
    expect(store.storeState).toBe(StoreState.Active)
    expect(store.caseInfo).toEqual(updatedCaseInfo)
  })
})
