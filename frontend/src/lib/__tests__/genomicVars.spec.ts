import { describe, expect, it } from 'vitest'

import { GENOME_BUILD_LABELS, type GenomeBuild } from '@/lib/genomeBuilds'
import {
  REGEX_CANONICAL_SPDI,
  REGEX_CLINVAR_ID,
  REGEX_CNV_COLON,
  REGEX_CNV_HYPHEN,
  REGEX_CNV_ISCN_2020,
  REGEX_DBSNP_ID,
  REGEX_GNOMAD_VARIANT,
  REGEX_RELAXED_SPDI,
  parseCanonicalSpdiSeqvar,
  parseIscnCnv,
  parseSeparatedSeqvar,
  parseSeparatedStrucvar,
  validateSeqvar
} from '@/lib/genomicVars'

describe.concurrent('regular expression REGEX_GNOMAD_VARIANT', () => {
  it('should match variants with chromosome name only', () => {
    expect('chr1-100-AT-TG').toMatch(REGEX_GNOMAD_VARIANT)
    expect('chr22-100-AT-TG').toMatch(REGEX_GNOMAD_VARIANT)
    expect('chrX-100-AT-TG').toMatch(REGEX_GNOMAD_VARIANT)
    expect('chrY-100-AT-TG').toMatch(REGEX_GNOMAD_VARIANT)
    expect('chrMT-100-AT-TG').toMatch(REGEX_GNOMAD_VARIANT)
    expect('1-100-AT-TG').toMatch(REGEX_GNOMAD_VARIANT)
    expect('22-100-AT-TG').toMatch(REGEX_GNOMAD_VARIANT)
    expect('X-100-AT-TG').toMatch(REGEX_GNOMAD_VARIANT)
    expect('Y-100-AT-TG').toMatch(REGEX_GNOMAD_VARIANT)
    expect('MT-100-AT-TG').toMatch(REGEX_GNOMAD_VARIANT)

    expect('chrMT-100-AT-TG'.match(REGEX_GNOMAD_VARIANT)?.groups).toEqual({
      chrom: 'chrMT',
      del: 'AT',
      genomeBuild: undefined,
      ins: 'TG',
      pos: '100'
    })
  })

  it('should match variants with valid genome releases name', () => {
    expect('hg19-chr1-100-AT-TG').toMatch(REGEX_GNOMAD_VARIANT)
    expect('hg19-chr22-100-AT-TG').toMatch(REGEX_GNOMAD_VARIANT)
    expect('hg38-chrX-100-AT-TG').toMatch(REGEX_GNOMAD_VARIANT)
    expect('hg38-Y-100-AT-TG').toMatch(REGEX_GNOMAD_VARIANT)
    expect('hg38-chrMT-100-AT-TG').toMatch(REGEX_GNOMAD_VARIANT)
    expect('GRCh37-1-100-AT-TG').toMatch(REGEX_GNOMAD_VARIANT)
    expect('GRCh37-22-100-AT-TG').toMatch(REGEX_GNOMAD_VARIANT)
    expect('GRCh37-X-100-AT-TG').toMatch(REGEX_GNOMAD_VARIANT)
    expect('GRCh37-chrY-100-AT-TG').toMatch(REGEX_GNOMAD_VARIANT)
    expect('GRCh37-MT-100-AT-TG').toMatch(REGEX_GNOMAD_VARIANT)

    expect('hg19-chrMT-100-AT-TG'.match(REGEX_GNOMAD_VARIANT)?.groups).toEqual({
      chrom: 'chrMT',
      del: 'AT',
      genomeBuild: 'hg19',
      ins: 'TG',
      pos: '100'
    })
  })

  it('should match variants with invalid genome releases name', () => {
    expect('T2T-Y-100-AT-TG').toMatch(REGEX_GNOMAD_VARIANT)
    expect('T2T-MT-100-AT-TG').toMatch(REGEX_GNOMAD_VARIANT)

    expect('T2T-chrMT-100-AT-TG'.match(REGEX_GNOMAD_VARIANT)?.groups).toEqual({
      chrom: 'chrMT',
      del: 'AT',
      genomeBuild: 'T2T',
      ins: 'TG',
      pos: '100'
    })
  })
})

describe.concurrent('regular expression REGEX_CANONICAL_SPDI', () => {
  it('should match correctly formatted variants only', () => {
    expect('NC_000001.11:100:AT:TG').toMatch(REGEX_CANONICAL_SPDI)
    expect('NC_999999.999:100:AT:TG').toMatch(REGEX_CANONICAL_SPDI)
    expect('NC_000000.0:100:AT:TG').toMatch(REGEX_CANONICAL_SPDI)

    expect('NC_000000:100:AT:TG').not.toMatch(REGEX_CANONICAL_SPDI)
    expect('NC_000000:100:AT:TG').not.toMatch(REGEX_CANONICAL_SPDI)
    expect('NC_000000.0:100:AT:').not.toMatch(REGEX_CANONICAL_SPDI)
    expect('NC_000000.0:100::T').not.toMatch(REGEX_CANONICAL_SPDI)
    expect('NM_000000.0:100:AT:TG').not.toMatch(REGEX_CANONICAL_SPDI)

    expect('NC_000001.11:100:AT:TG'.match(REGEX_CANONICAL_SPDI)?.groups).toEqual({
      sequence: 'NC_000001.11',
      del: 'AT',
      ins: 'TG',
      pos: '100'
    })
  })
})

describe.concurrent('regular expression REGEX_RELAXED_SPDI', () => {
  it('should match variants with chromosome name only', () => {
    expect('chr1:100:AT:TG').toMatch(REGEX_RELAXED_SPDI)
    expect('chr22:100:AT:TG').toMatch(REGEX_RELAXED_SPDI)
    expect('chrX:100:AT:TG').toMatch(REGEX_RELAXED_SPDI)
    expect('chrY:100:AT:TG').toMatch(REGEX_RELAXED_SPDI)
    expect('chrMT:100:AT:TG').toMatch(REGEX_RELAXED_SPDI)
    expect('1:100:AT:TG').toMatch(REGEX_RELAXED_SPDI)
    expect('22:100:AT:TG').toMatch(REGEX_RELAXED_SPDI)
    expect('X:100:AT:TG').toMatch(REGEX_RELAXED_SPDI)
    expect('Y:100:AT:TG').toMatch(REGEX_RELAXED_SPDI)
    expect('MT:100:AT:TG').toMatch(REGEX_RELAXED_SPDI)

    expect('chrMT:100:AT:TG'.match(REGEX_RELAXED_SPDI)?.groups).toEqual({
      chrom: 'chrMT',
      del: 'AT',
      genomeBuild: undefined,
      ins: 'TG',
      pos: '100'
    })
  })

  it('should match variants with valid genome releases name', () => {
    expect('hg19:chr1:100:AT:TG').toMatch(REGEX_RELAXED_SPDI)
    expect('hg19:chr22:100:AT:TG').toMatch(REGEX_RELAXED_SPDI)
    expect('hg38:chrX:100:AT:TG').toMatch(REGEX_RELAXED_SPDI)
    expect('hg38:Y:100:AT:TG').toMatch(REGEX_RELAXED_SPDI)
    expect('hg38:chrMT:100:AT:TG').toMatch(REGEX_RELAXED_SPDI)
    expect('GRCh37:1:100:AT:TG').toMatch(REGEX_RELAXED_SPDI)
    expect('GRCh37:22:100:AT:TG').toMatch(REGEX_RELAXED_SPDI)
    expect('GRCh37:X:100:AT:TG').toMatch(REGEX_RELAXED_SPDI)
    expect('GRCh37:chrY:100:AT:TG').toMatch(REGEX_RELAXED_SPDI)
    expect('GRCh37:MT:100:AT:TG').toMatch(REGEX_RELAXED_SPDI)

    expect('hg19:chrMT:100:AT:TG'.match(REGEX_RELAXED_SPDI)?.groups).toEqual({
      chrom: 'chrMT',
      del: 'AT',
      genomeBuild: 'hg19',
      ins: 'TG',
      pos: '100'
    })
  })

  it('should match variants with invalid genome releases name', () => {
    expect('T2T:Y:100:AT:TG').toMatch(REGEX_RELAXED_SPDI)
    expect('T2T:MT:100:AT:TG').toMatch(REGEX_RELAXED_SPDI)

    expect('T2T:chrMT:100:AT:TG'.match(REGEX_RELAXED_SPDI)?.groups).toEqual({
      chrom: 'chrMT',
      del: 'AT',
      genomeBuild: 'T2T',
      ins: 'TG',
      pos: '100'
    })
  })
})

describe.concurrent('regular expression REGEX_DBSNP_ID', () => {
  it('should match correctly formatted rs IDs only', () => {
    expect('rs1').toMatch(REGEX_DBSNP_ID)
    expect('rs99999999999').toMatch(REGEX_DBSNP_ID)
    expect('sr1').not.toMatch(REGEX_DBSNP_ID)
    expect('rs').not.toMatch(REGEX_DBSNP_ID)
  })
})

describe.concurrent('regular expression REGEX_CLINVAR_ID', () => {
  it('should match correctly formatted IDs only', () => {
    expect('VCV000148363.2').toMatch(REGEX_CLINVAR_ID)
    expect('VCV000000000.0').toMatch(REGEX_CLINVAR_ID)
    expect('RCV000148363.2').toMatch(REGEX_CLINVAR_ID)
    expect('RCV000000000.0').toMatch(REGEX_CLINVAR_ID)
    expect('VCV000148363').toMatch(REGEX_CLINVAR_ID)
    expect('VCV000000000').toMatch(REGEX_CLINVAR_ID)
    expect('RCV000148363').toMatch(REGEX_CLINVAR_ID)
    expect('RCV000000000').toMatch(REGEX_CLINVAR_ID)

    expect('RCV000000000.').not.toMatch(REGEX_CLINVAR_ID)
    expect('VCV00014836.1').not.toMatch(REGEX_CLINVAR_ID)

    expect('VCV000148363.2'.match(REGEX_CLINVAR_ID)?.groups).toEqual({
      accession: 'VCV000148363',
      version: '2'
    })
    expect('VCV000148363'.match(REGEX_CLINVAR_ID)?.groups).toEqual({
      accession: 'VCV000148363',
      version: undefined
    })
  })
})

describe.concurrent('regular expression REGEX_CNV_COLON', () => {
  it('should match variants with chromosome name only', () => {
    expect('DEL:chr1:100:200').toMatch(REGEX_CNV_COLON)
    expect('DEL:1:100:200').toMatch(REGEX_CNV_COLON)
    expect('DUP:chr1:100:200').toMatch(REGEX_CNV_COLON)
    expect('DUP:1:100:200').toMatch(REGEX_CNV_COLON)

    expect('DEL:chr1:100:200'.match(REGEX_CNV_COLON)?.groups).toEqual({
      chrom: 'chr1',
      genomeBuild: undefined,
      sequence: undefined,
      start: '100',
      stop: '200',
      svType: 'DEL'
    })
  })

  it('should match variants with valid genome releases name', () => {
    expect('DEL:GRCh37:chr1:100:200').toMatch(REGEX_CNV_COLON)
    expect('DEL:GRCh38:1:100:200').toMatch(REGEX_CNV_COLON)
    expect('DUP:hg19:chr1:100:200').toMatch(REGEX_CNV_COLON)
    expect('DUP:hg38:1:100:200').toMatch(REGEX_CNV_COLON)

    expect('DEL:GRCh37:chr1:100:200'.match(REGEX_CNV_COLON)?.groups).toEqual({
      chrom: 'chr1',
      genomeBuild: 'GRCh37',
      sequence: undefined,
      start: '100',
      stop: '200',
      svType: 'DEL'
    })
  })

  it('should match variants with RefSeq identifiers', () => {
    expect('DEL:NC_000001.10:100:200').toMatch(REGEX_CNV_COLON)
    expect('DEL:NC_000001.11:100:200').toMatch(REGEX_CNV_COLON)
    expect('DUP:NC_000001.10:100:200').toMatch(REGEX_CNV_COLON)
    expect('DUP:NC_000001.11:100:200').toMatch(REGEX_CNV_COLON)

    expect('DEL:NC_000001.10:100:200'.match(REGEX_CNV_COLON)?.groups).toEqual({
      chrom: undefined,
      genomeBuild: undefined,
      sequence: 'NC_000001.10',
      start: '100',
      stop: '200',
      svType: 'DEL'
    })
  })

  it('should match variants with invalid genome releases name', () => {
    expect('DEL:T2T:chr1:100:200').toMatch(REGEX_CNV_COLON)

    expect('DEL:T2T:chr1:100:200'.match(REGEX_CNV_COLON)?.groups).toEqual({
      chrom: 'chr1',
      genomeBuild: 'T2T',
      sequence: undefined,
      start: '100',
      stop: '200',
      svType: 'DEL'
    })
  })
})

describe.concurrent('regular expression REGEX_CNV_HYPEN', () => {
  it('should match variants with chromosome name only', () => {
    expect('DEL-chr1-100-200').toMatch(REGEX_CNV_HYPHEN)
    expect('DEL-1-100-200').toMatch(REGEX_CNV_HYPHEN)
    expect('DUP-chr1-100-200').toMatch(REGEX_CNV_HYPHEN)
    expect('DUP-1-100-200').toMatch(REGEX_CNV_HYPHEN)

    expect('DEL-chr1-100-200'.match(REGEX_CNV_HYPHEN)?.groups).toEqual({
      chrom: 'chr1',
      genomeBuild: undefined,
      sequence: undefined,
      start: '100',
      stop: '200',
      svType: 'DEL'
    })
  })

  it('should match variants with valid genome releases name', () => {
    expect('DEL-GRCh37-chr1-100-200').toMatch(REGEX_CNV_HYPHEN)
    expect('DEL-GRCh38-1-100-200').toMatch(REGEX_CNV_HYPHEN)
    expect('DUP-hg19-chr1-100-200').toMatch(REGEX_CNV_HYPHEN)
    expect('DUP-hg38-1-100-200').toMatch(REGEX_CNV_HYPHEN)

    expect('DEL-GRCh37-chr1-100-200'.match(REGEX_CNV_HYPHEN)?.groups).toEqual({
      chrom: 'chr1',
      genomeBuild: 'GRCh37',
      sequence: undefined,
      start: '100',
      stop: '200',
      svType: 'DEL'
    })
  })

  it('should match variants with RefSeq identifiers', () => {
    expect('DEL-NC_000001.10-100-200').toMatch(REGEX_CNV_HYPHEN)
    expect('DEL-NC_000001.11-100-200').toMatch(REGEX_CNV_HYPHEN)
    expect('DUP-NC_000001.10-100-200').toMatch(REGEX_CNV_HYPHEN)
    expect('DUP-NC_000001.11-100-200').toMatch(REGEX_CNV_HYPHEN)

    expect('DEL-NC_000001.10-100-200'.match(REGEX_CNV_HYPHEN)?.groups).toEqual({
      chrom: undefined,
      genomeBuild: undefined,
      sequence: 'NC_000001.10',
      start: '100',
      stop: '200',
      svType: 'DEL'
    })
  })

  it('should match variants with invalid genome releases name', () => {
    expect('DEL-T2T-chr1-100-200').toMatch(REGEX_CNV_HYPHEN)

    expect('DEL-T2T-chr1-100-200'.match(REGEX_CNV_HYPHEN)?.groups).toEqual({
      chrom: 'chr1',
      genomeBuild: 'T2T',
      sequence: undefined,
      start: '100',
      stop: '200',
      svType: 'DEL'
    })
  })
})

describe.concurrent('regular expression REGEX_CNV_ISCN_2020', () => {
  it('should match valid strings', () => {
    expect('arr[GRCh37] 2q12.2q13 (107132950_110427254)x1').toMatch(REGEX_CNV_ISCN_2020)
    expect(
      'arr[GRCh37] 2q12.2q13 (107132950_110427254)x1'.match(REGEX_CNV_ISCN_2020)?.groups
    ).toEqual({
      chromL: '2',
      armL: 'q12',
      chromR: '2',
      armR: 'q13',
      copyNumber: '1',
      genomeBuildA: 'GRCh37',
      genomeBuildB: undefined,
      start: '107132950',
      stop: '110427254'
    })

    expect('GRCh37 2q12.2q13(107132950_110427254)x3').toMatch(REGEX_CNV_ISCN_2020)
    expect('GRCh37 2q12.2q13(107132950_110427254)x3'.match(REGEX_CNV_ISCN_2020)?.groups).toEqual({
      chromL: '2',
      armL: 'q12',
      chromR: '2',
      armR: 'q13',
      copyNumber: '3',
      genomeBuildA: undefined,
      genomeBuildB: 'GRCh37',
      start: '107132950',
      stop: '110427254'
    })

    expect('arr[GRCh37] 7q11(72,650,120_74,154,209)x1').toMatch(REGEX_CNV_ISCN_2020)
    expect('GRCh37 2q12.2q13(107132950_110427254)x3'.match(REGEX_CNV_ISCN_2020)?.groups).toEqual({
      chromL: '2',
      armL: 'q12',
      chromR: '2',
      armR: 'q13',
      copyNumber: '3',
      genomeBuildA: undefined,
      genomeBuildB: 'GRCh37',
      start: '107132950',
      stop: '110427254'
    })
  })
})

describe.concurrent('validateSequenceVariant()', () => {
  it.each([
    ['1', 249250621, 'AT'],
    ['1', 249250622, 'A']
  ])('throws on %s-%d-%s', (chrom, pos, del) => {
    const variant = {
      genomeBuild: 'grch37' as GenomeBuild,
      chrom,
      pos,
      del,
      ins: 'TG',
      userRepr: 'TEST'
    }
    expect(() => validateSeqvar(variant)).toThrow()
  })

  it.each([
    ['1', 249250620, 'AT'],
    ['1', 249250621, 'A']
  ])('work on %s-%d-%s', (chrom, pos, del) => {
    const variant = {
      genomeBuild: 'grch37' as GenomeBuild,
      chrom,
      pos,
      del,
      ins: 'TG',
      userRepr: 'TEST'
    }
    expect(validateSeqvar(variant)).toEqual(variant)
  })
})

describe.concurrent('parseSeparatedSeqvar()', () => {
  it.each([
    ['chr1-100-AT-TG', 'grch37', '1'],
    ['GRCh38-chr1-100-AT-TG', 'grch38', '1'],
    ['1-100-AT-TG', 'grch37', '1'],
    ['x-100-AT-TG', 'grch37', 'X'],
    ['m-100-at-tg', 'grch37', 'MT'],
    ['mt-100-at-tg', 'grch37', 'MT']
  ])('hyphen-separated result for %s', (variant, expectedGenomeRelease, expectedChrom) => {
    expect(parseSeparatedSeqvar(variant)).toEqual({
      genomeBuild: expectedGenomeRelease,
      chrom: expectedChrom,
      pos: 100,
      del: 'AT',
      ins: 'TG',
      userRepr: `${GENOME_BUILD_LABELS[expectedGenomeRelease]}-${expectedChrom}-100-AT-TG`
    })
  })

  it.each([
    ['chr1:100:AT:TG', 'grch37', '1'],
    ['GRCh38:chr1:100:AT:TG', 'grch38', '1'],
    ['1:100:AT:TG', 'grch37', '1'],
    ['x:100:AT:TG', 'grch37', 'X'],
    ['m:100:at:tg', 'grch37', 'MT'],
    ['mt:100:at:tg', 'grch37', 'MT']
  ])('colon-separated result for %s', (variant, expectedGenomeRelease, expectedChrom) => {
    expect(parseSeparatedSeqvar(variant)).toEqual({
      genomeBuild: expectedGenomeRelease,
      chrom: expectedChrom,
      pos: 100,
      del: 'AT',
      ins: 'TG',
      userRepr: `${GENOME_BUILD_LABELS[expectedGenomeRelease]}-${expectedChrom}-100-AT-TG`
    })
  })
})

describe.concurrent('parseCanonicalSpdiSeqvar()', () => {
  it.each([
    ['NC_000001.10:100:AT:TG', 'grch37', '1'],
    ['NC_000001.11:100:AT:TG', 'grch38', '1'],
    ['NC_000023.10:100:AT:TG', 'grch37', 'X'],
    ['NC_012920.1:100:at:tg', 'grch37', 'MT']
  ])('result for %s', (variant, expectedGenomeRelease, expectedChrom) => {
    expect(parseCanonicalSpdiSeqvar(variant)).toEqual({
      genomeBuild: expectedGenomeRelease,
      chrom: expectedChrom,
      pos: 100,
      del: 'AT',
      ins: 'TG',
      userRepr: `${GENOME_BUILD_LABELS[expectedGenomeRelease]}-${expectedChrom}-100-AT-TG`
    })
  })
})

describe.concurrent('parseSeparatedStrucvar()', () => {
  it('parse DEL:1:100:200', () => {
    expect(parseSeparatedStrucvar('DEL:1:100:200')).toEqual({
      chrom: '1',
      copyNumber: undefined,
      genomeBuild: 'grch37',
      start: 100,
      stop: 200,
      svType: 'DEL',
      userRepr: 'DEL-GRCh37-1-100-200'
    })
  })

  it('parse DEL:GRCh37:1:100:200', () => {
    expect(parseSeparatedStrucvar('DEL:1:100:200')).toEqual({
      chrom: '1',
      copyNumber: undefined,
      genomeBuild: 'grch37',
      start: 100,
      stop: 200,
      svType: 'DEL',
      userRepr: 'DEL-GRCh37-1-100-200'
    })
  })

  it('parse DEL:NC_000001.11:100:200', () => {
    expect(parseSeparatedStrucvar('DEL:NC_000001.11:100:200')).toEqual({
      chrom: '1',
      copyNumber: undefined,
      genomeBuild: 'grch38',
      start: 100,
      stop: 200,
      svType: 'DEL',
      userRepr: 'DEL-GRCh38-1-100-200'
    })
  })

  it('parse DUP-NC_000001.11-100-200', () => {
    expect(parseSeparatedStrucvar('DUP-NC_000001.11-100-200')).toEqual({
      chrom: '1',
      copyNumber: undefined,
      genomeBuild: 'grch38',
      start: 100,
      stop: 200,
      svType: 'DUP',
      userRepr: 'DUP-GRCh38-1-100-200'
    })
  })

  it('throws when start > stop', () => {
    expect(() => parseSeparatedStrucvar('DEL:NC_000001.11:200:100')).toThrow()
  })

  it('throws when start > length', () => {
    expect(() => parseSeparatedStrucvar('DEL:NC_000001.11:249250621:249250621')).toThrow()
  })

  it('throws when stop > length', () => {
    expect(() => parseSeparatedStrucvar('DEL:NC_000001.11:1:249250623')).toThrow()
  })
})

describe.concurrent('parseIscnCnv', () => {
  it('should match valid strings', () => {
    expect(parseIscnCnv('arr[GRCh37] 2q12.2q13 (107132950_110427254)x1')).toEqual({
      chrom: '2',
      copyNumber: 1,
      genomeBuild: 'grch37',
      start: 107132950,
      stop: 110427254,
      svType: 'DEL',
      userRepr: 'GRCh37 2q12.2q13 (107132950_110427254)x1'
    })
    expect(parseIscnCnv('GRCh37 2q12.2q13(107132950_110427254)x3')).toEqual({
      chrom: '2',
      copyNumber: 3,
      genomeBuild: 'grch37',
      start: 107132950,
      stop: 110427254,
      svType: 'DUP',
      userRepr: 'GRCh37 2q12.2q13 (107132950_110427254)x3'
    })

    expect(parseIscnCnv('GRCh37 Xq12.Xq13(123_456)x1')).toEqual({
      chrom: 'X',
      copyNumber: 1,
      genomeBuild: 'grch37',
      start: 123,
      stop: 456,
      svType: 'DEL',
      userRepr: 'GRCh37 Xq12.Xq13 (123_456)x1'
    })
    expect(parseIscnCnv('GRCh37 Yq12.Yq13(123_456)x2')).toEqual({
      chrom: 'Y',
      copyNumber: 2,
      genomeBuild: 'grch37',
      start: 123,
      stop: 456,
      svType: 'DUP',
      userRepr: 'GRCh37 Yq12.Yq13 (123_456)x2'
    })
    expect(parseIscnCnv('GRCh37 Yq12.Yq13(123_456)x0')).toEqual({
      chrom: 'Y',
      copyNumber: 0,
      genomeBuild: 'grch37',
      start: 123,
      stop: 456,
      svType: 'DEL',
      userRepr: 'GRCh37 Yq12.Yq13 (123_456)x0'
    })

    expect(parseIscnCnv('arr[GRCh37] 7q11(72,650,120_74,154,209)x1')).toEqual({
      chrom: '7',
      copyNumber: 1,
      genomeBuild: 'grch37',
      start: 72650,
      stop: 74154,
      svType: 'DEL',
      userRepr: 'GRCh37 7q11 (72650_74154)x1'
    })
  })

  it('should throw on invalid positions', () => {
    expect(() => parseSeparatedStrucvar('arr[GRCh37] 2q12.2q13 (200_100)x1')).toThrow()
    expect(() => parseSeparatedStrucvar('arr[GRCh37] 2q12.2q13 (243199374_243199374)x1')).toThrow()
    expect(() => parseSeparatedStrucvar('arr[GRCh37] 2q12.2q13 (1_243199374)x1')).toThrow()
  })

  it('should throw on differing positions', () => {
    expect(() => parseSeparatedStrucvar('arr[GRCh37] 2q12.3q13 (100_200)x1')).toThrow()
  })
})
