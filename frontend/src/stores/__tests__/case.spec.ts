import { createTestingPinia } from '@pinia/testing'
import { setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import createFetchMock from 'vitest-fetch-mock'

import { DEFAULT_CASE_INFO, StorageMode, useCaseStore, type APIResponse, Inheritance, Sex, Ethnicity, Zygosity, LOCAL_STORAGE_PREFIX } from '@/stores/case'
import { StoreState } from '@/stores/misc'

const MOCK_RESPONSE: APIResponse = {
  pseudonym: '',
  diseases: [],
  hpo_terms: [],
  inheritance: Inheritance.Unknown,
  affected_family_members: null,
  sex: Sex.Unknown,
  age_of_onset_month: null,
  ethinicity: Ethnicity.Unknown,
  zygosity: Zygosity.Unknown,
  family_segregation: null
}

const fetchMocker = createFetchMock(vi)

const ITEM_KEY = `${LOCAL_STORAGE_PREFIX}.caseInfo`

describe.concurrent('case store with logged in user', () => {
  beforeEach(() => {
    setActivePinia(
      createTestingPinia({
        stubActions: false,
        initialState: {
          user: {
            storeState: StoreState.Active,
            currentUser: {
              id: 'test',
              email: 'test@example.com',
              is_active: true,
              is_superuser: false,
              is_verified: true,
              oauth_accounts: []
            }
          },
          case: {
            storageMode: StorageMode.Server,
            storeState: StoreState.Initial
          }
        }
      })
    )
    fetchMocker.enableMocks()
    fetchMocker.resetMocks()
  })

  it('clearData() should clear data', () => {
    // arrange:
    const store = useCaseStore()
    store.storeState = StoreState.Active
    store.caseInfo = { ...DEFAULT_CASE_INFO, pseudonym: 'TestPseudonym' }

    // act:
    store.clearData()

    // assert:
    expect(store.caseInfo).toStrictEqual(DEFAULT_CASE_INFO)
  })

  it('initialize() should handle unauthorized access when loading case', async () => {
    // arrange:
    const store = useCaseStore()
    store.storageMode = StorageMode.Server
    store.storeState = StoreState.Initial
    fetchMocker.mockResponseOnce(JSON.stringify({ detail: 'Unauthorized' }), { status: 401 })

    // act:
    await store.initialize()

    // assert:
    expect(fetchMocker).toBeCalledTimes(1)
    expect(fetchMock).toBeCalledWith('/api/v1/caseinfo/get', {
      method: 'GET',
      credentials: 'include',
      mode: 'cors'
    })
    expect(store.storeState).toBe(StoreState.Active)
    expect(store.caseInfo).toStrictEqual(DEFAULT_CASE_INFO)
  })

  it('initialize() should handle not found when loading case', async () => {
    // arrange:
    const store = useCaseStore()
    fetchMocker.mockResponseOnce(JSON.stringify({ detail: 'Case Information not found' }), {
      status: 404
    })

    // act:
    await store.initialize()

    // assert:
    expect(fetchMocker).toBeCalledTimes(1)
    expect(fetchMock).toBeCalledWith('/api/v1/caseinfo/get', {
      method: 'GET',
      credentials: 'include',
      mode: 'cors'
    })
    expect(store.storeState).toBe(StoreState.Active)
    expect(store.caseInfo).toStrictEqual(DEFAULT_CASE_INFO)
  })

  it('initialize() should handle server error when loading case', async () => {
    // arrange:
    const store = useCaseStore()
    fetchMocker.mockReject(new Error('Internal Server Error'))

    // act:
    await store.initialize()

    // assert:
    expect(fetchMocker).toBeCalledTimes(1)
    expect(fetchMock).toBeCalledWith('/api/v1/caseinfo/get', {
      method: 'GET',
      credentials: 'include',
      mode: 'cors'
    })
    expect(store.storeState).toBe(StoreState.Active)
    expect(store.caseInfo).toStrictEqual(DEFAULT_CASE_INFO)
  })

  it('initialize() should handle unauthorized access when updating case', async () => {
    // arrange:
    const store = useCaseStore()
    fetchMocker.mockResponseOnce(JSON.stringify({ detail: 'Unauthorized' }), { status: 401 })

    // act:
    await store.updateCase(DEFAULT_CASE_INFO)

    // assert:
    expect(fetchMocker).toBeCalledTimes(1)
    expect(fetchMock).toBeCalledWith('/api/v1/caseinfo/get', {
      method: 'GET',
      credentials: 'include',
      mode: 'cors'
    })
    expect(store.storeState).toBe(StoreState.Error)
    expect(store.caseInfo).toStrictEqual(DEFAULT_CASE_INFO)
  })

  it('initialize() should handle server error when updating case', async () => {
    // arrange:
    const store = useCaseStore()
    fetchMocker.mockReject(new Error('Internal Server Error'))

    // act:
    await store.updateCase(DEFAULT_CASE_INFO)

    // assert:
    expect(fetchMocker).toBeCalledTimes(1)
    expect(fetchMock).toBeCalledWith('/api/v1/caseinfo/get', {
      method: 'GET',
      credentials: 'include',
      mode: 'cors'
    })
    expect(store.storeState).toBe(StoreState.Error)
    expect(store.caseInfo).toStrictEqual(DEFAULT_CASE_INFO)
  })

  it('deleteCase() should delete case information', async () => {
    // arrange:
    const store = useCaseStore()
    fetchMocker.mockResponseOnce(JSON.stringify(MOCK_RESPONSE))

    // act:
    await store.deleteCase()

    // assert:
    expect(fetchMocker).toBeCalledTimes(1)
    expect(fetchMock).toBeCalledWith('/api/v1/caseinfo/delete', {
      method: 'DELETE',
      credentials: 'include',
      mode: 'cors',
      headers: {
        "Content-Type": "application/json",
        "accept": "application/json",
      },
    })
    expect(store.storeState).toBe(StoreState.Active)
    expect(store.caseInfo).toStrictEqual(DEFAULT_CASE_INFO) // assuming clearData is called in deleteCase
  })

  it('deleteCase() should handle unauthorized access when deleting case', async () => {
    // arrange:
    const store = useCaseStore()
    store.caseInfo = { ...DEFAULT_CASE_INFO, pseudonym: 'TestPseudonym' }
    fetchMocker.mockResponseOnce(JSON.stringify({ detail: 'Unauthorized' }), { status: 401 })

    // act:
    await store.deleteCase()

    // assert:
    expect(fetchMocker).toBeCalledTimes(1)
    expect(fetchMock).toBeCalledWith('/api/v1/caseinfo/delete', {
      method: 'DELETE',
      credentials: 'include',
      mode: 'cors',
      headers: {
        "Content-Type": "application/json",
        "accept": "application/json",
      },
    })
    expect(store.storeState).toBe(StoreState.Error)
    expect(store.caseInfo).toStrictEqual({ ...DEFAULT_CASE_INFO, pseudonym: 'TestPseudonym' })
  })

  it('should handle server error when deleting case', async () => {
    // arrange:
    const store = useCaseStore()
    store.caseInfo = { ...DEFAULT_CASE_INFO, pseudonym: 'TestPseudonym' }
    fetchMocker.mockReject(new Error('Internal Server Error'))

    // act:
    await store.deleteCase()

    // assert:
    expect(fetchMocker).toBeCalledTimes(1)
    expect(fetchMock).toBeCalledWith('/api/v1/caseinfo/delete', {
      method: 'DELETE',
      credentials: 'include',
      mode: 'cors',
      headers: {
        "Content-Type": "application/json",
        "accept": "application/json",
      },
    })
    expect(store.storeState).toBe(StoreState.Error)
    expect(store.caseInfo).toStrictEqual({ ...DEFAULT_CASE_INFO, pseudonym: 'TestPseudonym' })
  })

  it('should load case information', async () => {
    // arrange:
    const store = useCaseStore()
    fetchMocker.mockResponse(JSON.stringify({ ...MOCK_RESPONSE, pseudonym: 'TestPseudonym' }))

    // act:
    await store.initialize()

    // assert:
    expect(fetchMocker).toBeCalledTimes(1)
    expect(fetchMock).toBeCalledWith('/api/v1/caseinfo/get', {
      method: 'GET',
      credentials: 'include',
      mode: 'cors'
    })
    expect(store.storeState).toBe(StoreState.Active)
    expect(store.caseInfo).toEqual({ ...DEFAULT_CASE_INFO, pseudonym: 'TestPseudonym' })
  })

  it('should update case information', async () => {
    // arrange:
    const store = useCaseStore()
    const updatedCaseInfo = { ...DEFAULT_CASE_INFO, pseudonym: 'test' }
    expect(store.storeState).toBe(StoreState.Initial)
    expect(store.caseInfo).toStrictEqual(DEFAULT_CASE_INFO)
    fetchMocker.mockResponseOnce(JSON.stringify({ ...MOCK_RESPONSE, pseudonym: 'test' }))
    fetchMocker.mockResponseOnce(JSON.stringify({ ...MOCK_RESPONSE, pseudonym: 'test' }))

    // act:
    await store.updateCase(updatedCaseInfo)

    // assert:
    expect(fetchMocker).toBeCalledTimes(2)
    expect(fetchMock).toHaveBeenNthCalledWith(1, '/api/v1/caseinfo/get', {
      method: 'GET',
      credentials: 'include',
      mode: 'cors'
    })
    expect(fetchMock).toHaveBeenNthCalledWith(2, '/api/v1/caseinfo/update', {
      "headers": {
        "Content-Type": "application/json",
        "accept": "application/json",
      },
      "method": "PATCH",
      credentials: 'include',
      mode: 'cors',
      "body": "{\n\
      \"pseudonym\": \"test\", \n\
      \"diseases\": [], \n\
      \"hpo_terms\": [], \n\
      \"inheritance\": \"reev:unknown_inheritance\", \n\
      \"affected_family_members\": null, \n\
      \"sex\": \"reev:unknown_sex\", \n\
      \"age_of_onset_month\": null, \n\
      \"ethincity\": \"reev:unknown_ethnicity\", \n\
      \"zygosity\": \"reev:unknown_zygosity\", \n\
      \"family_segregation\": null\n\
    }",
    })
    expect(store.storeState).toBe(StoreState.Active)
    expect(store.caseInfo).toEqual(updatedCaseInfo)
  })
})

describe.concurrent('case store with local storage', () => {
  beforeEach(() => {
    setActivePinia(createTestingPinia({
      stubActions: false,
      initialState: {
        user: {
          storeState: StoreState.Active,
          currentUser: undefined
        },
        case: {
          storageMode: StorageMode.Local,
          state: StoreState.Initial,
        }
      }
    }))
    fetchMocker.enableMocks()
    fetchMocker.resetMocks()
  })

  it('clearData() should clear data', () => {
    // arrange:
    const store = useCaseStore()
    store.caseInfo = { ...DEFAULT_CASE_INFO, pseudonym: 'TestPseudonym' }

    // act:
    store.clearData()

    // assert:
    expect(fetchMocker).not.toBeCalled()
    expect(store.caseInfo).toStrictEqual(DEFAULT_CASE_INFO)
  })

  it('deleteCase() should delete case information', async () => {
    // arrange:
    const caseInfo = { ...DEFAULT_CASE_INFO, pseudonym: 'TestPseudonym' }
    localStorage.setItem(ITEM_KEY, JSON.stringify(caseInfo))
    const store = useCaseStore()
    store.caseInfo = caseInfo

    // act:
    await store.deleteCase()

    // assert:
    expect(fetchMocker).not.toBeCalled()
    expect(store.storeState).toBe(StoreState.Active)
    expect(store.caseInfo).toStrictEqual(DEFAULT_CASE_INFO) // assuming clearData is called in deleteCase
    expect(localStorage.getItem(ITEM_KEY)).toBeNull()
  })


  it('initialize() should load case information', async () => {
    // arrange:
    const caseInfo = { ...DEFAULT_CASE_INFO, pseudonym: 'TestPseudonym' }
    const store = useCaseStore()
    localStorage.setItem(ITEM_KEY, JSON.stringify(caseInfo))
    expect(store.caseInfo).toStrictEqual(DEFAULT_CASE_INFO)

    // act:
    await store.initialize()

    expect(fetchMocker).not.toBeCalled()
    expect(store.storeState).toBe(StoreState.Active)
    expect(store.caseInfo).toStrictEqual(caseInfo)
  })

//   it.skip('should update case information', async () => {
//     // arrange:
//     const store = useCaseStore()
//     const updatedCaseInfo = { ...DEFAULT_CASE_INFO, pseudonym: 'test' }
//     fetchMocker.mockResponse((req) => {
//       if (req.url.includes('get')) {
//         return Promise.resolve(JSON.stringify(DEFAULT_CASE_INFO))
//       } else if (req.url.includes('update')) {
//         return Promise.resolve(JSON.stringify(updatedCaseInfo))
//       } else {
//         return Promise.resolve(JSON.stringify({ status: 400 }))
//       }
//     })
//     expect(store.storeState).toBe(StoreState.Initial)
//     expect(store.caseInfo).toStrictEqual(DEFAULT_CASE_INFO)

//     // act:
//     await store.updateCase(updatedCaseInfo)

//     // assert:
//     expect(store.storeState).toBe(StoreState.Active)
//     expect(store.caseInfo).toEqual(updatedCaseInfo)
//   })
})
