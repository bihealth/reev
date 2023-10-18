import { describe, expect, it } from 'vitest'

import * as BRCA1Clinvar from '@/assets/__tests__/BRCA1ClinVar.json'
import * as BRCA1Transcripts from '@/assets/__tests__/BRCA1Transcripts.json'
import VariationLandscape from '@/components/VariationLandscape.vue'
import { setupMountedComponents } from '@/lib/test-utils'

describe.concurrent('VariationLandscape', async () => {
  it('renders the VariationLandscape plot', async () => {
    const { wrapper } = setupMountedComponents(
      { component: VariationLandscape, template: false },
      {
        props: {
          clinvar: BRCA1Clinvar['genes']['HGNC:1100'],
          genomeRelease: 'grch37',
          hgnc: 'HGNC:1100',
          transcripts: BRCA1Transcripts
        }
      }
    )
    expect(wrapper.text()).toContain('ClinVar Variation')
  })
})
