import { beforeEach, describe, expect, it, vi } from 'vitest'
import createFetchMock from 'vitest-fetch-mock'

import { VigunoClient } from '@/api/viguno'

const fetchMocker = createFetchMock(vi)

describe.concurrent('Viguno Client', () => {
  beforeEach(() => {
    fetchMocker.enableMocks()
    fetchMocker.resetMocks()
  })

  it('resolves OMIM term by ID correctly', async () => {
    // arrange:
    const mockOmimTerm = { id: 'OMIM:123456', name: 'Example Disease' }
    fetchMocker.mockResponseOnce(JSON.stringify(mockOmimTerm))

    // act:
    const client = new VigunoClient()
    const result = await client.resolveOmimTermById('123456')

    // assert:
    expect(result).toEqual(mockOmimTerm)
  })

  it('handles non-existent OMIM term ID', async () => {
    // arrange:
    const errorMessage = 'OMIM term not found'
    fetchMocker.mockResponseOnce(JSON.stringify({ msg: errorMessage }), { status: 404 })

    // act:
    const client = new VigunoClient()

    // assert:
    await expect(client.resolveOmimTermById('999999')).rejects.toThrow(errorMessage)
  })

  it('handles server error when resolving OMIM term by ID', async () => {
    // arrange:
    const errorMessage = 'Internal Server Error'
    fetchMocker.mockResponseOnce(JSON.stringify({ msg: errorMessage }), { status: 500 })

    // act:
    const client = new VigunoClient()

    // assert:
    await expect(client.resolveOmimTermById('123456')).rejects.toThrow(errorMessage)
  })

  it('handles network error when resolving OMIM term by ID', async () => {
    // arrange:
    fetchMocker.mockReject(new Error('Network Error'))

    // act:
    const client = new VigunoClient()

    // assert:
    await expect(client.resolveOmimTermById('123456')).rejects.toThrow('Network Error')
  })

  it('returns a list of OMIM terms for a valid query', async () => {
    // arrange:
    const mockResponse = [
      { id: 'OMIM:123456', name: 'Example Disease 1' },
      { id: 'OMIM:234567', name: 'Example Disease 2' }
    ]
    fetchMocker.mockResponseOnce(JSON.stringify(mockResponse))

    // act:
    const client = new VigunoClient()
    const result = await client.queryOmimTermsByName('Example')

    // assert:
    expect(result).toEqual(mockResponse)
  })

  it('returns an empty list for a query with no results', async () => {
    // arrange:
    fetchMocker.mockResponseOnce(JSON.stringify([]))

    // act:
    const client = new VigunoClient()
    const result = await client.queryOmimTermsByName('NonExistentDisease')

    // assert:
    expect(result).toEqual([])
  })

  it('handles server error for a query', async () => {
    // arrange:
    const errorMessage = 'Internal Server Error'
    fetchMocker.mockResponseOnce(JSON.stringify({ msg: errorMessage }), { status: 500 })

    // act:
    const client = new VigunoClient()

    // assert:
    await expect(client.queryOmimTermsByName('Example')).rejects.toThrow(errorMessage)
  })

  it('handles network error during a query', async () => {
    // arrange:
    fetchMocker.mockReject(new Error('Network Error'))

    // act:
    const client = new VigunoClient()

    // assert:
    await expect(client.queryOmimTermsByName('Example')).rejects.toThrow('Network Error')
  })

  it('resolves HPO term by ID correctly', async () => {
    // arrange:
    const mockHpoTerm = { id: 'HP:0000118', name: 'Phenotypic abnormality' }
    fetchMocker.mockResponseOnce(JSON.stringify(mockHpoTerm))

    // act:
    const client = new VigunoClient()
    const result = await client.resolveHpoTermById('0000118')

    // assert:
    expect(result).toEqual(mockHpoTerm)
  })

  it('handles non-existent HPO term ID', async () => {
    // arrange:
    const errorMessage = 'HPO term not found'
    fetchMocker.mockResponseOnce(JSON.stringify({ msg: errorMessage }), { status: 404 })

    // act:
    const client = new VigunoClient()

    // assert:
    await expect(client.resolveHpoTermById('9999999')).rejects.toThrow(errorMessage)
  })

  it('handles server error when resolving HPO term by ID', async () => {
    // arrange:
    const errorMessage = 'Internal Server Error'
    fetchMocker.mockResponseOnce(JSON.stringify({ msg: errorMessage }), { status: 500 })

    // act:
    const client = new VigunoClient()

    // assert:
    await expect(client.resolveHpoTermById('0000118')).rejects.toThrow(errorMessage)
  })

  it('handles network error when resolving HPO term by ID', async () => {
    // arrange:
    fetchMocker.mockReject(new Error('Network Error'))

    // act:
    const client = new VigunoClient()

    // assert:
    await expect(client.resolveHpoTermById('0000118')).rejects.toThrow('Network Error')
  })

  it('queries HPO terms by name correctly', async () => {
    // arrange:
    const mockHpoTerms = [
      { id: 'HP:0000118', name: 'Phenotypic abnormality' },
      { id: 'HP:0000152', name: 'Abnormality of head or neck' }
    ]
    fetchMocker.mockResponseOnce(JSON.stringify(mockHpoTerms))

    // act:
    const client = new VigunoClient()
    const result = await client.queryHpoTermsByName('Phenotypic')

    // assert:
    expect(result).toEqual(mockHpoTerms)
  })

  it('returns an empty list for a name query with no results', async () => {
    // arrange:
    fetchMocker.mockResponseOnce(JSON.stringify([]))

    // act:
    const client = new VigunoClient()
    const result = await client.queryHpoTermsByName('NonExistentTerm')

    // assert:
    expect(result).toEqual([])
  })

  it('handles server error during name query', async () => {
    // arrange:
    const errorMessage = 'Internal Server Error'
    fetchMocker.mockResponseOnce(JSON.stringify({ msg: errorMessage }), { status: 500 })

    // act:
    const client = new VigunoClient()

    // assert:
    await expect(client.queryHpoTermsByName('Phenotypic')).rejects.toThrow(errorMessage)
  })

  it('handles network error during name query', async () => {
    // arrange:
    fetchMocker.mockReject(new Error('Network Error'))

    // act:
    const client = new VigunoClient()

    // assert:
    await expect(client.queryHpoTermsByName('Phenotypic')).rejects.toThrow('Network Error')
  })
})
