import { describe, expect, it } from 'vitest'

import * as BRCA1GeneInfo from '@/assets/__tests__/BRCA1GeneInfo.json'
import VariantGene from '@/components/VariantDetails/VariantGene.vue'
import { setupMountedComponents } from '@/components/__tests__/utils'

describe.concurrent('VariantGene', async () => {
  it('renders the VariantGene info', async () => {
    const { wrapper } = setupMountedComponents(
      { component: VariantGene, template: false },
      {
        props: {
          gene: BRCA1GeneInfo
        }
      }
    )
    expect(wrapper.text()).toContain('HGNC')
    expect(wrapper.text()).toContain('NCBI Summary')
  })
})
