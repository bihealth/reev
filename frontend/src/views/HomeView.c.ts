/**
 * Constants for the `HomeView`.
 */
import { type GenomeBuild } from '@/lib/genomeBuilds'

/** Interface for one example. */
export interface Example {
  query: string
  genomeBuild?: GenomeBuild
  hint?: string
}

/** Interface for a section of examples. */
export interface Section {
  title: string
  text?: string
  examples: Example[]
}

/** Examples to display below the search on the homepage. */
export const EXAMPLES: Section[] = [
  {
    title: 'Genes',
    text: 'Search by HGNC symbol or NCBI/ENSEMBL/HGNC ID',
    examples: [
      {
        query: 'BRCA1'
      },
      {
        query: 'HGNC:1100',
        hint: 'BRCA1'
      },
      {
        query: '7273',
        hint: 'TTN'
      }
    ]
  },
  {
    title: 'Sequence Variants',
    text: 'Provide variants in HGSV notation, gnomAD, or SPDI-style',
    examples: [
      {
        query: 'NM_007294.4(BRCA1):c.5123C>A',
        hint: 'HGVS transcript SNV'
      },
      {
        query: 'NM_000179.3:c.4082del',
        hint: 'HGVS transcript deletion'
      },
      {
        query: 'NC_000017.10:g.41197728G>T',
        hint: 'HGVS genomic SNV'
      },
      {
        query: 'GRCh37-chr17-41197751-G-T',
        hint: 'gnomAD style variant'
      },
      {
        query: 'NC_000017.11:43039470:G:A',
        hint: 'Canonical SPDI'
      }
    ]
  },
  {
    title: 'Structural Variants',
    text: 'You can provide variants in the formats below',
    examples: [
      {
        query: 'DEL:chr17:41176312:41277500',
        hint: 'Deletion on chr17'
      },
      {
        query: 'DUP-chrX-73565114-73956354',
        hint: 'Duplication on chrX'
      },
      {
        query: 'arr[GRCh37] 7q11(72,650,120_74,154,209)x1',
        hint: 'ISCN notation'
      },
      {
        query: 'GRCh37 7q11(72,650,120_74,154,209)x1',
        hint: 'Shorter ISCN'
      }
    ]
  }
]
