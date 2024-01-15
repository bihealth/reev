import { describe, expect, it } from 'vitest'

import * as BRCA1Clinvar from '@/assets/__tests__/BRCA1ClinVar.json'
import * as BRCA1Transcripts from '@/assets/__tests__/BRCA1Transcripts.json'
import VariationLandscape from '@/components/GeneDetails/ClinvarCard/VariationLandscape.vue'
import { setupMountedComponents } from '@/lib/testUtils'

describe.concurrent('VariationLandscape', async () => {
  it('renders the VariationLandscape plot', async () => {
    // arrange:
    const { wrapper } = await setupMountedComponents(
      { component: VariationLandscape },
      {
        props: {
          clinvar: BRCA1Clinvar['genes']['HGNC:1100'],
          genomeRelease: 'grch37',
          hgnc: 'HGNC:1100',
          transcripts: BRCA1Transcripts,
          geneSymbol: 'BRCA1'
        }
      }
    )

    // act: nothing, only test rendering

    // assert:
    expect(wrapper.text()).toContain('Variation Lanscape')
  })
})
