import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { DottyClient } from '@/api/dotty'

import {
  copy,
  infoFromQuery,
  isVariantMt,
  isVariantMtHomopolymer,
  removeCommasFromNumbers,
  roundIt,
  search,
  separateIt
} from '../utils'

describe.concurrent('roundIt method', () => {
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
    expect(result).toBe("<abbr title='0'>0</abbr>")
  })

  it('should handle NaN value', () => {
    const result = roundIt(NaN)
    expect(result).toBe("<abbr title='NaN'>0</abbr>")
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

describe.concurrent('separateIt method', () => {
  it('should separate a positive value with default separator', () => {
    const result = separateIt(123456789)
    expect(result).toBe('123 456 789')
  })

  it('should separate a positive value with specified separator', () => {
    const result = separateIt(123456789, ',')
    expect(result).toBe('123,456,789')
  })

  it('should handle zero value', () => {
    const result = separateIt(0)
    expect(result).toBe('0')
  })

  it('should handle float value', () => {
    const result = separateIt(123456789.12345)
    expect(result).toBe('123 456 789')
  })

  it('should handle values less then 0', () => {
    const result = separateIt(0.0134)
    expect(result).toBe('0')
  })
})

describe.concurrent('isVariantMt method', () => {
  it('should return true if mitochondrial chromosome', () => {
    const result_MT = isVariantMt({ chromosome: 'MT' })
    const result_M = isVariantMt({ chromosome: 'M' })
    const result_chrMT = isVariantMt({ chromosome: 'chrMT' })
    const result_chrM = isVariantMt({ chromosome: 'chrM' })
    expect(result_MT).toBe(true)
    expect(result_M).toBe(true)
    expect(result_chrMT).toBe(true)
    expect(result_chrM).toBe(true)
  })

  it('should return false if not mitochondrial chromosome', () => {
    const result = isVariantMt({ chromosome: '1' })
    expect(result).toBe(false)
  })
})

describe.concurrent('isVariantMtHomopolymer method', () => {
  it('should return true if mitochondrial homopolymer', () => {
    const result = isVariantMtHomopolymer({ chromosome: 'MT', start: 70 })
    expect(result).toBe(true)
  })

  it('should return false if not mitochondrial homopolymer (chromosome)', () => {
    const result = isVariantMtHomopolymer({ chromosome: '1', start: 70 })
    expect(result).toBe(false)
  })

  it('should return false if not mitochondrial homopolymer (position)', () => {
    const result = isVariantMtHomopolymer({ chromosome: 'MT', start: 1 })
    expect(result).toBe(false)
  })

  it('should return false for NaN', () => {
    const result = isVariantMtHomopolymer(NaN)
    expect(result).toBe(false)
  })
})

describe.concurrent('removeCommasFromNumbers method', () => {
  it('should remove commas from numbers', () => {
    const result = removeCommasFromNumbers('1,234,567,890')
    expect(result).toBe('1234567890')
  })

  it('should return the same string if no commas', () => {
    const result = removeCommasFromNumbers('1234567890')
    expect(result).toBe('1234567890')
  })

  it('should return the same string if empty', () => {
    const result = removeCommasFromNumbers('')
    expect(result).toBe('')
  })

  it('should not remove commas from strings', () => {
    const result = removeCommasFromNumbers('foo,foo,bar')
    expect(result).toBe('foo,foo,bar')
  })

  it('should not remove commas from numbers in strings', () => {
    const result = removeCommasFromNumbers('foo,1,234,567,890,bar')
    expect(result).toBe('foo,1234567890,bar')
  })
})

describe.concurrent('search method', async () => {
  beforeEach(() => {
    // we make `DottyClient.toSpdi` return null / fail every time
    vi.spyOn(DottyClient.prototype, 'toSpdi').mockResolvedValue(null)
  })
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should return "gene" route location for HGNC queries', async () => {
    const result = await search('HGNC:1100', 'ghcr37')
    expect(result).toEqual({
      name: 'gene',
      params: {
        searchTerm: 'HGNC:1100',
        genomeRelease: 'ghcr37'
      }
    })
  })

  it('should return "variant" route location for Variant queries', async () => {
    const result = await search('chr37:12345:A:G', 'ghcr37')
    expect(result).toEqual({
      name: 'variant',
      params: {
        searchTerm: 'chr37:12345:A:G',
        genomeRelease: 'ghcr37'
      }
    })
  })

  it('should return "variant" route location for Variant queries with commas in position', async () => {
    const result = await search('chr37:12,345:A:G', 'ghcr37')
    expect(result).toEqual({
      name: 'variant',
      params: {
        searchTerm: 'chr37:12345:A:G',
        genomeRelease: 'ghcr37'
      }
    })
  })

  it('should return "cnv" route location for SV quries', async () => {
    const result = await search('DEL:chr37:12345:123456', 'ghcr37')
    expect(result).toEqual({
      name: 'cnv',
      params: {
        searchTerm: 'DEL:chr37:12345:123456',
        genomeRelease: 'ghcr37'
      }
    })
  })

  it('should return "cnv" route location for SV quries with commas in start and end', async () => {
    const result = await search('DEL:chr37:12,345:123,456', 'ghcr37')
    expect(result).toEqual({
      name: 'cnv',
      params: {
        searchTerm: 'DEL:chr37:12345:123456',
        genomeRelease: 'ghcr37'
      }
    })
  })

  it('should return "genes" route location for general queries', async () => {
    const result = await search('TP53', 'ghcr37')
    expect(result).toEqual({
      name: 'genes',
      query: {
        q: 'TP53',
        fields: 'hgnc_id,ensembl_gene_id,ncbi_gene_id,symbol'
      }
    })
  })

  it('should return null if no entry', async () => {
    const result = await search('', 'foo37')
    expect(result).toBe(null)
  })

  it('should remove whitespace', async () => {
    const result = await search(' HGNC:1100  ', 'ghcr37')
    expect(result).toEqual({
      name: 'gene',
      params: {
        searchTerm: 'HGNC:1100',
        genomeRelease: 'ghcr37'
      }
    })
  })
})

describe.concurrent('infoFromQuery method', () => {
  it('should return info from query', () => {
    const result = infoFromQuery('chr37:12345:A:G')
    expect(result).toEqual({
      chromosome: 'chr37',
      pos: '12345',
      reference: 'A',
      alternative: 'G',
      hgnc_id: undefined
    })
  })

  it('should return empty object if no query', () => {
    const result = infoFromQuery('')
    expect(result).toEqual({
      chromosome: '',
      pos: undefined,
      reference: undefined,
      alternative: undefined,
      hgnc_id: undefined
    })
  })
})

describe.concurrent('copy method', () => {
  it('should return a JSON object for given dict', () => {
    const result = copy({ foo: 'bar' })
    expect(result).toEqual({ foo: 'bar' })
  })
})
