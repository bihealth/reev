import { describe, expect, it } from 'vitest'

import * as BRCA1Clinvar from '@/assets/__tests__/BRCA1ClinVar.json'
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
          geneSymbol: 'HGNC:1100'
        }
      }
    )
    expect(wrapper.text()).toContain('Variation Landscape')
    expect(wrapper.html()).toContain('figure')
  })
})
