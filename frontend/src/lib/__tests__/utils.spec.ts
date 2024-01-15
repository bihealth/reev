import { describe, expect, it } from 'vitest'

import { type GenomeBuild } from '@/lib/genomeBuilds'
import { type Seqvar } from '@/lib/genomicVars'

import {
  copy,
  extractDbnsfpMimDiseaseId,
  infoFromQuery,
  isVariantMt,
  isVariantMtHomopolymer,
  removeCommasFromNumbers,
  roundIt,
  separateIt,
  transformDbnsfpMimDiseaseId
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
    // arrange: nothing to do

    // act:
    const result = roundIt(3.14159)

    // assert:
    expect(result).toBe('<abbr title="3.14159">3.14</abbr>')
  })

  it('should round a positive value with specified digits', () => {
    // arrange: nothing to do

    // act:
    const result = roundIt(3.14159, 3)

    // assert:
    expect(result).toBe('<abbr title="3.14159">3.142</abbr>')
  })

  it('should handle zero value', () => {
    // arrange: nothing to do

    // act:
    const result = roundIt(0)

    // assert:
    expect(result).toBe("<abbr title='0'>0</abbr>")
  })

  it('should handle NaN value', () => {
    // arrange: nothing to do

    // act:
    const result = roundIt(NaN)

    // assert:
    expect(result).toBe("<abbr title='NaN'>0</abbr>")
  })

  it('should add label to title if provided', () => {
    // arrange: nothing to do

    // act:
    const result = roundIt(5.6789, 2, 'Value')

    // assert:
    expect(result).toBe('<abbr title="Value: 5.6789">5.68</abbr>')
  })

  it('should handle negative value', () => {
    // arrange: nothing to do

    // act:
    const result = roundIt(-10.12345)

    // assert:
    expect(result).toBe('<abbr title="-10.12345">-10.12</abbr>')
  })
})

describe.concurrent('separateIt method', () => {
  it('should separate a positive value with default separator', () => {
    // arrange: nothing to do

    // act:
    const result = separateIt(123456789)

    // assert:
    expect(result).toBe('123 456 789')
  })

  it('should separate a positive value with specified separator', () => {
    // arrange: nothing to do

    // act:
    const result = separateIt(123456789, ',')

    // assert:
    expect(result).toBe('123,456,789')
  })

  it('should handle zero value', () => {
    // arrange: nothing to do

    // act:
    const result = separateIt(0)

    // assert:
    expect(result).toBe('0')
  })

  it('should handle float value', () => {
    // arrange: nothing to do

    // act:
    const result = separateIt(123456789.12345)

    // assert:
    expect(result).toBe('123 456 789')
  })

  it('should handle values less then 0', () => {
    // arrange: nothing to do

    // act:
    const result = separateIt(0.0134)

    // assert:
    expect(result).toBe('0')
  })
})

describe.concurrent('isVariantMt method', () => {
  it('should return true if mitochondrial chromosome', () => {
    // arrange:
    seqVar.chrom = 'MT'
    seqVar.chrom = 'M'
    seqVar.chrom = 'chrMT'
    seqVar.chrom = 'chrM'

    // act:
    const result_MT = isVariantMt(seqVar)
    const result_M = isVariantMt(seqVar)
    const result_chrMT = isVariantMt(seqVar)
    const result_chrM = isVariantMt(seqVar)

    // assert:
    expect(result_MT).toBe(true)
    expect(result_M).toBe(true)
    expect(result_chrMT).toBe(true)
    expect(result_chrM).toBe(true)
  })

  it('should return false if not mitochondrial chromosome', () => {
    // arrange:
    seqVar.chrom = '1'

    // act:
    const result = isVariantMt(seqVar)

    // assert:
    expect(result).toBe(false)
  })
})

describe.concurrent('isVariantMtHomopolymer method', () => {
  it('should return true if mitochondrial homopolymer', () => {
    // arrange:
    seqVar.chrom = 'MT'
    seqVar.pos = 70

    // act:
    const result = isVariantMtHomopolymer(seqVar)

    // assert:
    expect(result).toBe(true)
  })

  it('should return false if not mitochondrial homopolymer (chromosome)', () => {
    // arrange:
    seqVar.chrom = '1'
    seqVar.pos = 70

    // act:
    const result = isVariantMtHomopolymer(seqVar)

    // assert:
    expect(result).toBe(false)
  })

  it('should return false if not mitochondrial homopolymer (position)', () => {
    // arrange:
    seqVar.chrom = 'MT'
    seqVar.pos = 1

    // act:
    const result = isVariantMtHomopolymer(seqVar)

    // assert:
    expect(result).toBe(false)
  })
})

describe.concurrent('removeCommasFromNumbers method', () => {
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

describe.concurrent('infoFromQuery method', () => {
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

describe.concurrent('copy method', () => {
  it('should return a JSON object for given dict', () => {
    // arrange: nothing to do

    // act:
    const result = copy({ foo: 'bar' })

    // assert:
    expect(result).toEqual({ foo: 'bar' })
  })
})

describe.concurrent('extractDbnsfpMimDiseaseId', () => {
  it.each([
    ['[MIM:616921] Dyskinesia, limb and orofacial, infantile-onset', '616921'],
    ['[MIM:616921] Dyskinesia, limb and orofacial, infantile-onset [recessive?]', '616921']
  ])('%s => %s', (lhs, rhs) => {
    // arrange: nothing to do
    // act: nothing to do

    // assert:
    expect(extractDbnsfpMimDiseaseId(lhs)).toEqual(rhs)
  })
})

describe.concurrent('transformDbnsfpMimDiseaseId', () => {
  it.each([
    [
      '[MIM:616921]Dyskinesia, limb and orofacial, infantile-onset',
      '[MIM:616921] Dyskinesia, limb and orofacial, infantile-onset',
      true
    ],
    [
      '[MIM:616921]Dyskinesia, limb and orofacial, infantile-onset [recessive?]',
      '[MIM:616921] Dyskinesia, limb and orofacial, infantile-onset [recessive?]',
      true
    ],
    [
      '[MIM:616921]Dyskinesia, limb and orofacial, infantile-onset',
      'Dyskinesia, limb and orofacial, infantile-onset',
      false
    ],
    [
      '[MIM:616921]Dyskinesia, limb and orofacial, infantile-onset [recessive?]',
      'Dyskinesia, limb and orofacial, infantile-onset [recessive?]',
      false
    ]
  ])('should work correctly', (lhs, rhs, showTermIds) => {
    // arrange: nothing to do
    // act: nothing to do

    // assert:
    expect(transformDbnsfpMimDiseaseId(lhs, showTermIds)).toEqual(rhs)
  })
})
