import { beforeEach, describe, expect, it, vi } from 'vitest'
import createFetchMock from 'vitest-fetch-mock'

import { CaseInfoClient } from '@/api/caseInfo'
import { type CaseInfo, Ethnicity, Inheritance, Sex, Zygosity } from '@/stores/caseInfo'

const fetchMocker = createFetchMock(vi)

/** Example Case data */
const mockCaseInfo: CaseInfo = {
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

describe.concurrent('CaseInfo Client', () => {
  beforeEach(() => {
    fetchMocker.enableMocks()
    fetchMocker.resetMocks()
  })

  it('fetches case info correctly', async () => {
    // arrange:
    fetchMocker.mockResponse(JSON.stringify(mockCaseInfo))

    // act:
    const client = new CaseInfoClient()
    const result = await client.fetchCaseInfo()

    // assert:
    expect(result).toEqual(mockCaseInfo)
  })

  it('fails to fetch case info', async () => {
    // arrange:
    fetchMocker.mockResponse((req) => {
      if (req.url.includes('caseinfo/get')) {
        return Promise.resolve(JSON.stringify({ status: 500 }))
      }
      return Promise.resolve(JSON.stringify({ status: 400 }))
    })

    // act:
    const client = new CaseInfoClient()
    const result = await client.fetchCaseInfo()

    // assert:
    expect(result).toEqual({ status: 500 })
  })

  it('creates case info correctly', async () => {
    // arrange:
    fetchMocker.mockResponse(JSON.stringify(mockCaseInfo))

    // act:
    const client = new CaseInfoClient()
    const result = await client.createCaseInfo(mockCaseInfo)

    // assert:
    expect(result).toEqual(mockCaseInfo)
  })

  it('fails to create case info', async () => {
    // arrange:
    fetchMocker.mockResponse((req) => {
      if (req.url.includes('caseinfo/create')) {
        return Promise.resolve(JSON.stringify({ status: 500 }))
      }
      return Promise.resolve(JSON.stringify({ status: 400 }))
    })

    // act:
    const client = new CaseInfoClient()
    const result = await client.createCaseInfo(mockCaseInfo)

    // assert:
    expect(result).toEqual({ status: 500 })
  })

  it('updates case info correctly', async () => {
    // arrange:
    fetchMocker.mockResponse(JSON.stringify(mockCaseInfo))

    // act:
    const client = new CaseInfoClient()
    const result = await client.updateCaseInfo(mockCaseInfo)

    // assert:
    expect(result).toEqual(mockCaseInfo)
  })

  it('fails to update case info', async () => {
    // arrange:
    fetchMocker.mockResponse((req) => {
      if (req.url.includes('caseinfo/update')) {
        return Promise.resolve(JSON.stringify({ status: 500 }))
      }
      return Promise.resolve(JSON.stringify({ status: 400 }))
    })

    // act:
    const client = new CaseInfoClient()
    const result = await client.updateCaseInfo(mockCaseInfo)

    // assert:
    expect(result).toEqual({ status: 500 })
  })

  it('deletes case info correctly', async () => {
    // arrange:
    fetchMocker.mockResponse(JSON.stringify({}))

    // act:
    const client = new CaseInfoClient()
    const result = await client.deleteCaseInfo()

    // assert:
    expect(result).toEqual({})
  })

  it('fails to delete case info', async () => {
    // arrange:
    fetchMocker.mockResponse((req) => {
      if (req.url.includes('caseinfo/delete')) {
        return Promise.resolve(JSON.stringify({ status: 500 }))
      }
      return Promise.resolve(JSON.stringify({ status: 400 }))
    })

    // act:
    const client = new CaseInfoClient()
    const result = await client.deleteCaseInfo()

    // assert:
    expect(result).toEqual({ status: 500 })
  })
})
