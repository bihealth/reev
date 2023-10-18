import { describe, expect, it } from 'vitest'

import * as BRCA1GeneInfo from '@/assets/__tests__/BRCA1GeneInfo.json'
import SvTools from '@/components/SvDetails/SvTools.vue'
import { type SvRecord } from '@/stores/svInfo'
import { setupMountedComponents } from '@/lib/test-utils'

const svRecord: SvRecord = {
    svType: 'DEL',
    chromosome: 'chr17',
    start: '41176312',
    end: '41277500',
    release: 'grch37',
    result: [
      {
        hgnc_id: 'HGNC:18315',
        transcript_effects: [
          'transcript_variant',
          'exon_variant',
          'splice_region_variant',
          'intron_variant',
          'upstream_variant',
          'downstream_variant'
        ]
      },
      {
        hgnc_id: 'HGNC:20691',
        transcript_effects: ['upstream_variant']
      },
      {
        hgnc_id: 'HGNC:1100',
        transcript_effects: [
          'transcript_variant',
          'exon_variant',
          'splice_region_variant',
          'intron_variant',
          'upstream_variant',
          'downstream_variant'
        ]
      },
      {
        hgnc_id: 'HGNC:16919',
        transcript_effects: ['upstream_variant']
      }
    ]
  }

describe.concurrent('SvTools', async () => {
  it('renders the SvTools table', async () => {
    const { wrapper } = setupMountedComponents(
      { component: SvTools, template: false },
      {
        props: {
          svRecord: svRecord,
        }
      }
    )

    expect(wrapper.text()).toContain('Select gene in table above to see details.')
  })
})
