import { describe, expect, it } from 'vitest'

import * as BRCA1GeneInfo from '@/assets/__tests__/BRCA1GeneInfo.json'
import GeneRifs from '@/components/GeneDetails/OverviewCard/GeneRifs.vue'
import { setupMountedComponents } from '@/lib/test-utils'

describe.concurrent('GeneRifs', async () => {
  it('renders the GeneRifs information.', async () => {
    const { wrapper } = await setupMountedComponents(
      { component: GeneRifs },
      {
        props: {
          ncbi: BRCA1GeneInfo['genes']['HGNC:1100']['ncbi']
        }
      }
    )
    expect(wrapper.text()).toContain('NCBI References Into Function')
  })
})
