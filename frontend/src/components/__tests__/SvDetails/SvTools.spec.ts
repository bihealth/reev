import { describe, expect, it } from 'vitest'

import SvTools from '@/components/SvDetails/SvTools.vue'
import { setupMountedComponents } from '@/lib/test-utils'
import { type SvRecord } from '@/stores/svInfo'

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
  it('renders the SvTools content', async () => {
    const { wrapper } = await setupMountedComponents(
      { component: SvTools, template: false },
      {
        props: {
          svRecord: svRecord
        }
      }
    )

    expect(wrapper.text()).toContain('External Resources')
    const links = wrapper.findAll('a')
    expect(links.length).toBe(6)
  })
})
