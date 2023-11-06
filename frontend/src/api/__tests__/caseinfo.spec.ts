import { beforeEach, describe, expect, it, vi } from 'vitest'
import createFetchMock from 'vitest-fetch-mock'

import { CaseInfoClient } from '@/api/caseinfo'
import { type Case, Ethnicity, Inheritance, Sex, Zygosity } from '@/stores/case'

const fetchMocker = createFetchMock(vi)

const mockCaseInfo: Case = {
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
    fetchMocker.mockResponse(JSON.stringify(mockCaseInfo))

    const client = new CaseInfoClient()
    const result = await client.fetchCaseInfo()

    expect(result).toEqual(mockCaseInfo)
  })

  it('fails to fetch case info', async () => {
    fetchMocker.mockResponse((req) => {
      if (req.url.includes('caseinfo/get')) {
        return Promise.resolve(JSON.stringify({ status: 500 }))
      }
      return Promise.resolve(JSON.stringify({ status: 400 }))
    })

    const client = new CaseInfoClient()
    const result = await client.fetchCaseInfo()

    expect(result).toEqual({ status: 500 })
  })

  it('creates case info correctly', async () => {
    fetchMocker.mockResponse(JSON.stringify(mockCaseInfo))

    const client = new CaseInfoClient()
    const result = await client.createCaseInfo(mockCaseInfo)

    expect(result).toEqual(mockCaseInfo)
  })

  it('fails to create case info', async () => {
    fetchMocker.mockResponse((req) => {
      if (req.url.includes('caseinfo/create')) {
        return Promise.resolve(JSON.stringify({ status: 500 }))
      }
      return Promise.resolve(JSON.stringify({ status: 400 }))
    })

    const client = new CaseInfoClient()
    const result = await client.createCaseInfo(mockCaseInfo)

    expect(result).toEqual({ status: 500 })
  })

  it('updates case info correctly', async () => {
    fetchMocker.mockResponse(JSON.stringify(mockCaseInfo))

    const client = new CaseInfoClient()
    const result = await client.updateCaseInfo(mockCaseInfo)

    expect(result).toEqual(mockCaseInfo)
  })

  it('fails to update case info', async () => {
    fetchMocker.mockResponse((req) => {
      if (req.url.includes('caseinfo/update')) {
        return Promise.resolve(JSON.stringify({ status: 500 }))
      }
      return Promise.resolve(JSON.stringify({ status: 400 }))
    })

    const client = new CaseInfoClient()
    const result = await client.updateCaseInfo(mockCaseInfo)

    expect(result).toEqual({ status: 500 })
  })

  it('deletes case info correctly', async () => {
    fetchMocker.mockResponse(JSON.stringify({}))

    const client = new CaseInfoClient()
    const result = await client.deleteCaseInfo()

    expect(result).toEqual({})
  })

  it('fails to delete case info', async () => {
    fetchMocker.mockResponse((req) => {
      if (req.url.includes('caseinfo/delete')) {
        return Promise.resolve(JSON.stringify({ status: 500 }))
      }
      return Promise.resolve(JSON.stringify({ status: 400 }))
    })

    const client = new CaseInfoClient()
    const result = await client.deleteCaseInfo()

    expect(result).toEqual({ status: 500 })
  })
})
