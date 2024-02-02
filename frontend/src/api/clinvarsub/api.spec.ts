import { beforeEach, describe, expect, test, vi } from 'vitest'
import createFetchMock from 'vitest-fetch-mock'

import { ClinvarsubClient } from '@/api/clinvarsub'
import CLINVARSUB_PAGE from '@/api/clinvarsub/fixture.clinvarsubPage.json'

const fetchMocker = createFetchMock(vi)

// Tests for manipulating SubmittingOrg records.
describe.concurrent('ClinvarsubClient.SubmittingOrg', () => {
  beforeEach(() => {
    fetchMocker.enableMocks()
    fetchMocker.resetMocks()
  })

  test('fetchSubmittingOrgs()', async () => {
    // arrange:
    fetchMocker.mockResponse((req) => {
      if (req.method == 'GET' && req.url.endsWith('/clinvarsub/submittingorgs?size=50')) {
        return Promise.resolve(JSON.stringify(CLINVARSUB_PAGE))
      } else {
        return Promise.resolve(JSON.stringify({ status: 400 }))
      }
    })

    const client = new ClinvarsubClient()
    const result = await client.fetchSubmittingOrgs()

    expect(result).toBeTruthy()
    expect(result.items.length).toBe(1)
  })

  test('createSubmittingOrg()', async () => {
    // arrange:
    const submittingOrg = CLINVARSUB_PAGE.items[0]
    fetchMocker.mockResponse((req) => {
      if (req.method == 'POST' && req.url.endsWith('/clinvarsub/submittingorgs')) {
        return Promise.resolve(JSON.stringify(submittingOrg))
      } else {
        return Promise.resolve(JSON.stringify({ status: 400 }))
      }
    })

    // act:
    const client = new ClinvarsubClient()
    const result = await client.createSubmittingOrg({
      label: 'Test Org',
      clinvar_api_token: 'test-token'
    })

    // assert:
    expect(result).toBeTruthy()
    expect(result.label).toBe('Test Org')
  })

  test('updateSubmittingOrg()', async () => {
    // arrange:
    const submittingOrg = CLINVARSUB_PAGE.items[0]
    fetchMocker.mockResponse((req) => {
      if (
        req.method == 'PUT' &&
        req.url.endsWith(`/clinvarsub/submittingorgs/${submittingOrg.id}`)
      ) {
        return Promise.resolve(JSON.stringify(submittingOrg))
      } else {
        return Promise.resolve(JSON.stringify({ status: 400 }))
      }
    })

    // act:
    const client = new ClinvarsubClient()
    const result = await client.updateSubmittingOrg(submittingOrg)

    // assert:
    expect(result).toBeTruthy()
    expect(result.label).toBe('Test Org')
  })

  test('deleteSubmittingOrg()', async () => {
    // arrange:
    const submittingOrg = CLINVARSUB_PAGE.items[0]
    fetchMocker.mockResponse((req) => {
      if (
        req.method == 'DELETE' &&
        req.url.endsWith(`/clinvarsub/submittingorgs/${submittingOrg.id}`)
      ) {
        return Promise.resolve('')
      } else {
        return Promise.resolve(JSON.stringify({ status: 400 }))
      }
    })

    // act:
    const client = new ClinvarsubClient()
    const result = await client.deleteSubmittingOrg(submittingOrg.id)

    // assert:
    expect(result).toBeUndefined()
  })
})
