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
    const mockOmimTerm = { id: 'OMIM:123456', name: 'Example Disease' }
    fetchMocker.mockResponseOnce(JSON.stringify(mockOmimTerm))

    const client = new VigunoClient()
    const result = await client.resolveOmimTermById('123456')
    expect(result).toEqual(mockOmimTerm)
  })

  it('handles non-existent OMIM term ID', async () => {
    const errorMessage = 'OMIM term not found'
    fetchMocker.mockResponseOnce(JSON.stringify({ msg: errorMessage }), { status: 404 })

    const client = new VigunoClient()
    await expect(client.resolveOmimTermById('999999')).rejects.toThrow(errorMessage)
  })

  it('handles server error when resolving OMIM term by ID', async () => {
    const errorMessage = 'Internal Server Error'
    fetchMocker.mockResponseOnce(JSON.stringify({ msg: errorMessage }), { status: 500 })

    const client = new VigunoClient()
    await expect(client.resolveOmimTermById('123456')).rejects.toThrow(errorMessage)
  })

  it('handles network error when resolving OMIM term by ID', async () => {
    fetchMocker.mockReject(new Error('Network Error'))

    const client = new VigunoClient()
    await expect(client.resolveOmimTermById('123456')).rejects.toThrow('Network Error')
  })

  it('returns a list of OMIM terms for a valid query', async () => {
    const mockResponse = [
      { id: 'OMIM:123456', name: 'Example Disease 1' },
      { id: 'OMIM:234567', name: 'Example Disease 2' }
    ]
    fetchMocker.mockResponseOnce(JSON.stringify(mockResponse))

    const client = new VigunoClient()
    const result = await client.queryOmimTermsByName('Example')
    expect(result).toEqual(mockResponse)
  })

  it('returns an empty list for a query with no results', async () => {
    fetchMocker.mockResponseOnce(JSON.stringify([]))

    const client = new VigunoClient()
    const result = await client.queryOmimTermsByName('NonExistentDisease')
    expect(result).toEqual([])
  })

  it('handles server error for a query', async () => {
    const errorMessage = 'Internal Server Error'
    fetchMocker.mockResponseOnce(JSON.stringify({ msg: errorMessage }), { status: 500 })

    const client = new VigunoClient()
    await expect(client.queryOmimTermsByName('Example')).rejects.toThrow(errorMessage)
  })

  it('handles network error during a query', async () => {
    fetchMocker.mockReject(new Error('Network Error'))

    const client = new VigunoClient()
    await expect(client.queryOmimTermsByName('Example')).rejects.toThrow('Network Error')
  })

  it('resolves HPO term by ID correctly', async () => {
    const mockHpoTerm = { id: 'HP:0000118', name: 'Phenotypic abnormality' }
    fetchMocker.mockResponseOnce(JSON.stringify(mockHpoTerm))

    const client = new VigunoClient()
    const result = await client.resolveHpoTermById('0000118')
    expect(result).toEqual(mockHpoTerm)
  })

  it('handles non-existent HPO term ID', async () => {
    const errorMessage = 'HPO term not found'
    fetchMocker.mockResponseOnce(JSON.stringify({ msg: errorMessage }), { status: 404 })

    const client = new VigunoClient()
    await expect(client.resolveHpoTermById('9999999')).rejects.toThrow(errorMessage)
  })

  it('handles server error when resolving HPO term by ID', async () => {
    const errorMessage = 'Internal Server Error'
    fetchMocker.mockResponseOnce(JSON.stringify({ msg: errorMessage }), { status: 500 })

    const client = new VigunoClient()
    await expect(client.resolveHpoTermById('0000118')).rejects.toThrow(errorMessage)
  })

  it('handles network error when resolving HPO term by ID', async () => {
    fetchMocker.mockReject(new Error('Network Error'))

    const client = new VigunoClient()
    await expect(client.resolveHpoTermById('0000118')).rejects.toThrow('Network Error')
  })

  it('queries HPO terms by name correctly', async () => {
    const mockHpoTerms = [
      { id: 'HP:0000118', name: 'Phenotypic abnormality' },
      { id: 'HP:0000152', name: 'Abnormality of head or neck' }
    ]
    fetchMocker.mockResponseOnce(JSON.stringify(mockHpoTerms))

    const client = new VigunoClient()
    const result = await client.queryHpoTermsByName('Phenotypic')
    expect(result).toEqual(mockHpoTerms)
  })

  it('returns an empty list for a name query with no results', async () => {
    fetchMocker.mockResponseOnce(JSON.stringify([]))

    const client = new VigunoClient()
    const result = await client.queryHpoTermsByName('NonExistentTerm')
    expect(result).toEqual([])
  })

  it('handles server error during name query', async () => {
    const errorMessage = 'Internal Server Error'
    fetchMocker.mockResponseOnce(JSON.stringify({ msg: errorMessage }), { status: 500 })

    const client = new VigunoClient()
    await expect(client.queryHpoTermsByName('Phenotypic')).rejects.toThrow(errorMessage)
  })

  it('handles network error during name query', async () => {
    fetchMocker.mockReject(new Error('Network Error'))

    const client = new VigunoClient()
    await expect(client.queryHpoTermsByName('Phenotypic')).rejects.toThrow('Network Error')
  })
})
