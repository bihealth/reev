import { describe, it, expect } from 'vitest'

import { roundIt, search } from '../utils'

describe('roundIt method', () => {
  it('should round a positive value with default digits', () => {
    const result = roundIt(3.14159)
    expect(result).toBe('<abbr title="3.14159">3.14</abbr>')
  })

  it('should round a positive value with specified digits', () => {
    const result = roundIt(3.14159, 3)
    expect(result).toBe('<abbr title="3.14159">3.142</abbr>')
  })

  it('should handle zero value', () => {
    const result = roundIt(0)
    expect(result).toBe("<abbr title='0'>NaN</abbr>")
  })

  it('should handle NaN value', () => {
    const result = roundIt(NaN)
    expect(result).toBe("<abbr title='NaN'>NaN</abbr>")
  })

  it('should add label to title if provided', () => {
    const result = roundIt(5.6789, 2, 'Value')
    expect(result).toBe('<abbr title="Value: 5.6789">5.68</abbr>')
  })

  it('should handle negative value', () => {
    const result = roundIt(-10.12345)
    expect(result).toBe('<abbr title="-10.12345">-10.12</abbr>')
  })
})

describe('search method', () => {
  it('should return route location if match', () => {
    const result = search('BRCA1', 'ghcr37')
    expect(result).toEqual({
      name: 'gene',
      params: {
        searchTerm: 'BRCA1',
        genomeRelease: 'ghcr37'
      }
    })
  })

  it.skip('should return null if no match', () => {
    const result = search('foo', 'foo37')
    expect(result).toBe(null)
  })
})
