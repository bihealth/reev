import { type GenomeBuild } from '@bihealth/reev-frontend-lib/lib/genomeBuilds'
import { type Seqvar } from '@bihealth/reev-frontend-lib/lib/genomicVars'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import createFetchMock from 'vitest-fetch-mock'

import { lookupGene, lookupWithDotty, resolveSeqvar, resolveStrucvar } from '@/lib/query'

const fetchMocker = createFetchMock(vi)

describe.concurrent('Variant lookup with dotty', () => {
  /** Example Sequence variant. */
  const seqVar: Seqvar = {
    genomeBuild: 'grch37' as GenomeBuild,
    chrom: '1',
    pos: 12345,
    del: 'A',
    ins: 'G',
    userRepr: 'chr1:12345:A:G'
  }

  beforeEach(() => {
    fetchMocker.enableMocks()
    fetchMocker.resetMocks()
  })

  it('should return a gene', async () => {
    // arrange:
    fetchMocker.mockResponseOnce(
      JSON.stringify({
        success: true,
        value: {
          contig: seqVar.chrom,
          pos: seqVar.pos,
          reference_deleted: seqVar.del,
          alternate_inserted: seqVar.ins
        }
      })
    )

    // act:
    const result = await lookupWithDotty(seqVar.userRepr, seqVar.genomeBuild)

    // assert:
    expect(result).toStrictEqual(seqVar)
  })

  it('should throw an error if dotty fails', async () => {
    // arrange:
    fetchMocker.mockResponseOnce(JSON.stringify({ success: false }))

    // act: nothing to do

    // assert:
    await expect(lookupWithDotty(seqVar.userRepr, seqVar.genomeBuild)).rejects.toThrow()
  })
})

describe.concurrent('Resolve seqvar from the given query', () => {
  /** Example Sequence variant. */
  const seqVar: Seqvar = {
    genomeBuild: 'grch37' as GenomeBuild,
    chrom: '1',
    pos: 12345,
    del: 'A',
    ins: 'G',
    userRepr: 'GRCh37-1-12345-A-G'
  }

  beforeEach(() => {
    fetchMocker.enableMocks()
    fetchMocker.resetMocks()
  })

  it('should return a gene', async () => {
    // arrange:
    fetchMocker.mockResponseOnce(
      JSON.stringify({
        success: true,
        value: {
          contig: seqVar.chrom,
          pos: seqVar.pos,
          reference_deleted: seqVar.del,
          alternate_inserted: seqVar.ins
        }
      })
    )

    // act:
    const result = await resolveSeqvar(seqVar.userRepr, seqVar.genomeBuild)

    // assert:
    expect(result).toStrictEqual(seqVar)
  })
})

describe.concurrent('Resolve strucvar from the given query', () => {
  /** Example Sequence variant. */
  const strucVar: any = {
    svType: 'DEL',
    genomeBuild: 'grch37' as GenomeBuild,
    chrom: '17',
    start: 41176312,
    stop: 41277500,
    copyNumber: undefined,
    userRepr: 'DEL-grch37-17-41176312-41277500'
  }

  beforeEach(() => {
    fetchMocker.enableMocks()
    fetchMocker.resetMocks()
  })

  it('should return a gene', async () => {
    // arrange:
    fetchMocker.mockResponseOnce(JSON.stringify({ success: true, value: strucVar }))

    // act:
    const result = resolveStrucvar(strucVar.userRepr, strucVar.genomeBuild)
    const expected = structuredClone(strucVar)
    expected.userRepr = 'DEL-GRCh37-17-41176312-41277500'

    // assert:
    expect(result).toStrictEqual(expected)
  })
})

describe.concurrent('Gene lookup', () => {
  beforeEach(() => {
    fetchMocker.enableMocks()
    fetchMocker.resetMocks()
  })

  it('should return a gene', async () => {
    // arrange:
    fetchMocker.mockResponseOnce(
      JSON.stringify({
        success: true,
        genes: [
          {
            score: 1,
            data: {
              name: 'BRCA1',
              symbol: 'BRCA1',
              alias_name: ['BRCA1'],
              alias_symbol: ['BRCA1'],
              ensembl_gene_id: 'ENSG00000012048',
              hgnc_id: '1100',
              ncbi_gene_id: '672'
            }
          }
        ]
      })
    )

    // act:
    const result = await lookupGene('BRCA1')

    // assert:
    expect(result).toContain('BRCA1')
  })

  it('should throw an error if dotty fails', async () => {
    // arrange:
    fetchMocker.mockResponseOnce(JSON.stringify({ success: false }))

    // act: nothing to do

    // assert:
    await expect(lookupGene('BRCA1')).rejects.toThrow()
  })
})
