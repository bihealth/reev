import { describe, expect, it } from 'vitest'

import * as BRCA1ClinVar from '@/assets/__tests__/BRCA1ClinVar.json'
import ClinvarImpact from '@/components/GeneDetails/ClinvarImpact.vue'
import { setupMountedComponents } from '@/lib/test-utils'

describe.concurrent('ClinvarImpact', async () => {
  it('renders the ClinvarImpact information.', async () => {
    const { wrapper } = setupMountedComponents(
      { component: ClinvarImpact, template: false },
      {
        props: {
          geneClinvar: BRCA1ClinVar['genes']['HGNC:1100']
        }
      }
    )
    expect(wrapper.text()).toContain('ClinVar By Impact')
  })
})
