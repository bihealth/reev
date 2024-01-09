import { describe, expect, it } from 'vitest'

import * as BRCA1ClinVar from '@/assets/__tests__/BRCA1ClinVar.json'
import ClinvarImpact from '@/components/GeneDetails/ClinvarCard/ClinvarImpact.vue'
import { setupMountedComponents } from '@/lib/testUtils'

describe.concurrent('ClinvarImpact', async () => {
  it('renders the ClinvarImpact information.', async () => {
    const { wrapper } = await setupMountedComponents(
      { component: ClinvarImpact },
      {
        props: {
          geneClinvar: BRCA1ClinVar['genes']['HGNC:1100']
        }
      }
    )
    expect(wrapper.text()).toContain('Impact Counts')
  })
})
