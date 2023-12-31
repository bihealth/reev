import { createTestingPinia } from '@pinia/testing'
import { setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import createFetchMock from 'vitest-fetch-mock'

import {
  type APIResponse,
  DEFAULT_CASE_INFO,
  Ethnicity,
  Inheritance,
  LOCAL_STORAGE_PREFIX,
  Sex,
  StorageMode,
  Zygosity,
  useCaseStore
} from '@/stores/case'
import { StoreState } from '@/stores/misc'

const MOCK_RESPONSE: APIResponse = {
  id: 'iduuid',
  user: 'useruuid',
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
    expect(fetchMock).toHaveBeenCalledWith('/api/v1/caseinfo/delete', {
      method: 'DELETE',
      credentials: 'include',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json'
      }
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
        'Content-Type': 'application/json',
        accept: 'application/json'
      }
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
        'Content-Type': 'application/json',
        accept: 'application/json'
      }
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
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json'
      },
      method: 'PATCH',
      credentials: 'include',
      mode: 'cors',
      body: '{\n\
      "pseudonym": "test", \n\
      "diseases": [], \n\
      "hpo_terms": [], \n\
      "inheritance": "reev:unknown_inheritance", \n\
      "affected_family_members": null, \n\
      "sex": "reev:unknown_sex", \n\
      "age_of_onset_month": null, \n\
      "ethincity": "reev:unknown_ethnicity", \n\
      "zygosity": "reev:unknown_zygosity", \n\
      "family_segregation": null\n\
    }'
    })
    expect(store.storeState).toBe(StoreState.Active)
    expect(store.caseInfo).toEqual(updatedCaseInfo)
  })
})

// NB: we cannot run in parallel as local storage is currently shared
describe('case store with local storage', () => {
  const getItemSpy = vi.spyOn(Storage.prototype, 'getItem')
  const setItemSpy = vi.spyOn(Storage.prototype, 'setItem')
  const removeItemSpy = vi.spyOn(Storage.prototype, 'removeItem')
  const clearSpy = vi.spyOn(Storage.prototype, 'clear')

  beforeEach(() => {
    setActivePinia(
      createTestingPinia({
        stubActions: false,
        initialState: {
          user: {
            storeState: StoreState.Active,
            currentUser: undefined
          },
          case: {
            storageMode: StorageMode.Local,
            state: StoreState.Initial
          }
        }
      })
    )
    fetchMocker.enableMocks()
    fetchMocker.resetMocks()

    localStorage.clear()
    getItemSpy.mockClear()
    setItemSpy.mockClear()
    removeItemSpy.mockClear()
    clearSpy.mockClear()
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
    expect(getItemSpy).not.toBeCalled()
    expect(setItemSpy).not.toBeCalled()
    expect(removeItemSpy).not.toBeCalled()
    expect(clearSpy).not.toBeCalled()
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
    expect(getItemSpy).toBeCalled()
    expect(setItemSpy).toBeCalled()
    expect(removeItemSpy).toHaveBeenCalledOnce()
    expect(removeItemSpy).toHaveBeenCalledWith(ITEM_KEY)
    expect(clearSpy).not.toBeCalled()
  })

  it('initialize() should load case information', async () => {
    // arrange:
    const caseInfo = { ...DEFAULT_CASE_INFO, pseudonym: 'TestPseudonym' }
    const store = useCaseStore()
    localStorage.setItem(ITEM_KEY, JSON.stringify(caseInfo))
    expect(store.caseInfo).toStrictEqual(DEFAULT_CASE_INFO)

    // act:
    await store.initialize()

    // assert:
    expect(fetchMocker).not.toBeCalled()
    expect(store.storeState).toBe(StoreState.Active)
    expect(store.caseInfo).toStrictEqual(caseInfo)
    expect(localStorage.getItem(ITEM_KEY)).toStrictEqual(JSON.stringify(caseInfo))
    expect(getItemSpy).toBeCalled()
    expect(setItemSpy).toBeCalled()
    expect(removeItemSpy).not.toHaveBeenCalled()
    expect(clearSpy).not.toBeCalled()
  })

  it('updateCase() should update case information', async () => {
    // arrange:
    localStorage.setItem(ITEM_KEY, JSON.stringify(DEFAULT_CASE_INFO))
    const store = useCaseStore()
    const updatedCaseInfo = { ...DEFAULT_CASE_INFO, pseudonym: 'test' }
    expect(store.storeState).toBe(StoreState.Initial)
    expect(store.caseInfo).toStrictEqual(DEFAULT_CASE_INFO)

    // act:
    await store.updateCase(updatedCaseInfo)

    // assert:
    expect(fetchMocker).not.toBeCalled()
    expect(store.storeState).toBe(StoreState.Active)
    expect(store.caseInfo).toEqual(updatedCaseInfo)
    expect(localStorage.getItem(ITEM_KEY)).toStrictEqual(JSON.stringify(updatedCaseInfo))
    expect(getItemSpy).toBeCalled()
    expect(setItemSpy).toBeCalled()
    expect(removeItemSpy).not.toHaveBeenCalled()
    expect(clearSpy).not.toBeCalled()
  })
})
