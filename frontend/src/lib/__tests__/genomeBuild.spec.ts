import { describe, expect, it } from 'vitest'

import {
  CHROM_LENGTHS_37,
  CHROM_LENGTHS_38,
  CHROM_REFSEQ_37,
  CHROM_REFSEQ_38,
  GENOME_BUILD_ALIASES,
  refseqToGenomeBuild
} from '@/lib/genomeBuilds'

describe.concurrent('constants', () => {
  it('genomeBuildAliases should have the well-known keys', () => {
    expect(Object.keys(GENOME_BUILD_ALIASES)).toEqual(['hg19', 'grch37', 'hg38', 'grch38'])
  })

  it('CHROM_REFSEQ_37 should have the well-known keys', () => {
    expect(Object.keys(CHROM_REFSEQ_37)).toEqual([
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '10',
      '11',
      '12',
      '13',
      '14',
      '15',
      '16',
      '17',
      '18',
      '19',
      '20',
      '21',
      '22',
      'X',
      'Y',
      'MT'
    ])
  })

  it('CHROM_REFSEQ_38 should have the well-known keys', () => {
    expect(Object.keys(CHROM_REFSEQ_38)).toEqual([
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '10',
      '11',
      '12',
      '13',
      '14',
      '15',
      '16',
      '17',
      '18',
      '19',
      '20',
      '21',
      '22',
      'X',
      'Y',
      'MT'
    ])
  })

  it('CHROM_LENGTHS_37 should have the well-known keys', () => {
    expect(Object.keys(CHROM_LENGTHS_37)).toEqual([
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '10',
      '11',
      '12',
      '13',
      '14',
      '15',
      '16',
      '17',
      '18',
      '19',
      '20',
      '21',
      '22',
      'X',
      'Y',
      'MT'
    ])
  })

  it('CHROM_LENGTHS_38 should have the well-known keys', () => {
    expect(Object.keys(CHROM_LENGTHS_38)).toEqual([
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '10',
      '11',
      '12',
      '13',
      '14',
      '15',
      '16',
      '17',
      '18',
      '19',
      '20',
      '21',
      '22',
      'X',
      'Y',
      'MT'
    ])
  })

  it('lengths of 37 and 38 differ but not in chrMT', () => {
    expect(CHROM_LENGTHS_37.X).not.toEqual(CHROM_LENGTHS_38.X)
    expect(CHROM_LENGTHS_37.Y).not.toEqual(CHROM_LENGTHS_38.Y)
    expect(CHROM_LENGTHS_37.MT).toEqual(CHROM_LENGTHS_38.MT)
  })
})

describe.concurrent('refseqToGenomeBuild', () => {
  it('should return grch37 for NC_000001.10', () => {
    expect(refseqToGenomeBuild('NC_000001.10')).toEqual('grch37')
  })

  it('should return grch38 for NC_000001.11', () => {
    expect(refseqToGenomeBuild('NC_000001.11')).toEqual('grch38')
  })

  it('should return grch38 for NC_012920.1', () => {
    expect(refseqToGenomeBuild('NC_012920.1')).toEqual('grch38')
  })

  it('should work case insensitive', () => {
    expect(refseqToGenomeBuild('nc_000001.10')).toEqual('grch37')
    expect(refseqToGenomeBuild('nc_000001.11')).toEqual('grch38')
    expect(refseqToGenomeBuild('nc_012920.1')).toEqual('grch38')
  })

  it('should throw an error for NC_000001.12', () => {
    expect(() => refseqToGenomeBuild('NC_000001.12')).toThrow(
      'Unknown RefSeq identifier: NC_000001.12'
    )
  })
})
