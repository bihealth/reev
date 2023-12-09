import { describe, expect, it } from 'vitest'

import { type GenomeBuild } from '@/lib/genomeBuilds'
import { type Seqvar } from '@/lib/genomicVars'

import {
  copy,
  infoFromQuery,
  isVariantMt,
  isVariantMtHomopolymer,
  removeCommasFromNumbers,
  roundIt,
  separateIt
} from '../utils'

/** Example Sequence variant. */
const seqVar: Seqvar = {
  genomeBuild: 'grch37' as GenomeBuild,
  chrom: '1',
  pos: 12345,
  del: 'A',
  ins: 'G',
  userRepr: 'chr1:12345:A:G'
}

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
    seqVar.chrom = 'MT'
    const result_MT = isVariantMt(seqVar)
    seqVar.chrom = 'M'
    const result_M = isVariantMt(seqVar)
    seqVar.chrom = 'chrMT'
    const result_chrMT = isVariantMt(seqVar)
    seqVar.chrom = 'chrM'
    const result_chrM = isVariantMt(seqVar)
    expect(result_MT).toBe(true)
    expect(result_M).toBe(true)
    expect(result_chrMT).toBe(true)
    expect(result_chrM).toBe(true)
  })

  it('should return false if not mitochondrial chromosome', () => {
    seqVar.chrom = '1'
    const result = isVariantMt(seqVar)
    expect(result).toBe(false)
  })
})

describe.concurrent('isVariantMtHomopolymer method', () => {
  it('should return true if mitochondrial homopolymer', () => {
    seqVar.chrom = 'MT'
    seqVar.pos = 70
    const result = isVariantMtHomopolymer(seqVar)
    expect(result).toBe(true)
  })

  it('should return false if not mitochondrial homopolymer (chromosome)', () => {
    seqVar.chrom = '1'
    seqVar.pos = 70
    const result = isVariantMtHomopolymer(seqVar)
    expect(result).toBe(false)
  })

  it('should return false if not mitochondrial homopolymer (position)', () => {
    seqVar.chrom = 'MT'
    seqVar.pos = 1
    const result = isVariantMtHomopolymer(seqVar)
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
