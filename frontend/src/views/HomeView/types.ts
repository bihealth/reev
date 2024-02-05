import { type GenomeBuild } from '@bihealth/reev-frontend-lib/lib/genomeBuilds'

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
