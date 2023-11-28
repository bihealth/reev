import { describe, expect, it } from 'vitest'

import * as BRCA1GeneInfo from '@/assets/__tests__/BRCA1GeneInfo.json'
import PathogenicityCard from '@/components/GeneDetails/PathogenicityCard.vue'
import { setupMountedComponents } from '@/lib/test-utils'

describe.concurrent('PathogenicityCard', async () => {
  it('renders the Pathogenicity information.', async () => {
    const { wrapper } = await setupMountedComponents(
      { component: PathogenicityCard, template: false },
      {
        props: {
          geneInfo: BRCA1GeneInfo['genes']['HGNC:1100']
        }
      }
    )
    expect(wrapper.text()).toContain('Gene Pathogenicity')
  })
})
