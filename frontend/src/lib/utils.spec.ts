import { describe, expect, it } from 'vitest'

import { copy, infoFromQuery, removeCommasFromNumbers } from './utils'

describe('removeCommasFromNumbers method', () => {
  it('should remove commas from numbers', () => {
    // arrange: nothing to do

    // act:
    const result = removeCommasFromNumbers('1,234,567,890')

    // assert:
    expect(result).toBe('1234567890')
  })

  it('should return the same string if no commas', () => {
    // arrange: nothing to do

    // act:
    const result = removeCommasFromNumbers('1234567890')

    // assert:
    expect(result).toBe('1234567890')
  })

  it('should return the same string if empty', () => {
    // arrange: nothing to do

    // act:
    const result = removeCommasFromNumbers('')

    // assert:
    expect(result).toBe('')
  })

  it('should not remove commas from strings', () => {
    // arrange: nothing to do

    // act:
    const result = removeCommasFromNumbers('foo,foo,bar')

    // assert:
    expect(result).toBe('foo,foo,bar')
  })

  it('should not remove commas from numbers in strings', () => {
    // arrange: nothing to do

    // act:
    const result = removeCommasFromNumbers('foo,1,234,567,890,bar')

    // assert:
    expect(result).toBe('foo,1234567890,bar')
  })
})

describe('infoFromQuery method', () => {
  it('should return info from query', () => {
    // arrange: nothing to do

    // act:
    const result = infoFromQuery('chr37:12345:A:G')

    // assert:
    expect(result).toEqual({
      chromosome: 'chr37',
      pos: '12345',
      reference: 'A',
      alternative: 'G',
      hgnc_id: undefined
    })
  })

  it('should return empty object if no query', () => {
    // arrange: nothing to do

    // act:
    const result = infoFromQuery('')

    // assert:
    expect(result).toEqual({
      chromosome: '',
      pos: undefined,
      reference: undefined,
      alternative: undefined,
      hgnc_id: undefined
    })
  })
})

describe('copy method', () => {
  it('should return a JSON object for given dict', () => {
    // arrange: nothing to do

    // act:
    const result = copy({ foo: 'bar' })

    // assert:
    expect(result).toEqual({ foo: 'bar' })
  })
})
