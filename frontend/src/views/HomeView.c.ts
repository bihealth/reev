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

const SEQVARS_DEV: Example[] = [
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

const SEQVARS_PROD: Example[] = [
  {
    query: 'GRCh37:chr6:24302274:T:C',
    hint: 'splicing variant in SPDI notation'
  },
  {
    query: 'NM_001267039.1(LARP7)>c.855dup',
    hint: 'frameshift variant in HGVS notation'
  },
  {
    query: 'GRCh37-chrX-77245290-G-C',
    hint: 'X-chromosomal SNV in gnomAD notation'
  },
  {
    query: 'NM_004780.3(TCEAL1):c.124_138dup',
    hint: 'in-frame insertion in HGVS notation'
  },
  {
    query: 'chrMT:7497:G:A',
    hint: 'mitochondrial SNV in SPDI notation'
  },
  {
    query: 'GRCh38-chrMT-7465-A-AC',
    hint: 'mitochondrial insertion in gnomAD notation'
  }
]

const STRUCVARS_DEV: Example[] = [
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

const STRUCVARS_PROD: Example[] = [
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
    examples: import.meta.env.MODE !== 'development' ? SEQVARS_DEV : SEQVARS_PROD
  },
  {
    title: 'Structural Variants',
    text: 'You can provide variants in the formats below',
    examples: import.meta.env.MODE === 'development' ? STRUCVARS_DEV : STRUCVARS_PROD
  }
]
