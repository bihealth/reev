import { describe, expect, it } from 'vitest'

import * as BRCA1GeneInfo from '@/assets/__tests__/BRCA1GeneInfo.json'
import NcbiSummary from '@/components/GeneDetails/NcbiSummary.vue'
import { setupMountedComponents } from '@/lib/test-utils'

describe.concurrent('NcbiSummary', async () => {
  it('renders the NcbiSummary information.', async () => {
    const { wrapper } = setupMountedComponents(
      { component: NcbiSummary, template: false },
      {
        props: {
          ncbiSummary: BRCA1GeneInfo['genes']['HGNC:1100']['ncbi']['summary'],
          geneId: BRCA1GeneInfo['genes']['HGNC:1100']['ncbi']['gene_id']
        }
      }
    )
    expect(wrapper.text()).toContain('NCBI Summary')
  })
})
