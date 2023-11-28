import { describe, expect, it } from 'vitest'

import * as BRCA1GeneInfo from '@/assets/__tests__/BRCA1GeneInfo.json'
import OverviewCard from '@/components/GeneDetails/OverviewCard.vue'
import { setupMountedComponents } from '@/lib/test-utils'

describe.concurrent('v', async () => {
  it('renders the OverviewCard information.', async () => {
    const { wrapper } = await setupMountedComponents(
      { component: OverviewCard, template: false },
      {
        props: {
          geneInfo: BRCA1GeneInfo['genes']['HGNC:1100']
        }
      }
    )
    expect(wrapper.text()).toContain('BRCA1')
    expect(wrapper.text()).toContain('This gene encodes a 190')
    expect(wrapper.text()).toContain('BRCA1 DNA repair')
  })
})
