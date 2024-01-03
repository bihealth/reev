import { describe, expect, it } from 'vitest'

import * as BRCA1GeneInfo from '@/assets/__tests__/BRCA1GeneInfo.json'
import LocusDatabases from '@/components/GeneDetails/OverviewCard/LocusDatabases.vue'
import { setupMountedComponents } from '@/lib/test-utils'

describe.concurrent('LocusDatabases', async () => {
  it('renders the LocusDatabases information.', async () => {
    const { wrapper } = await setupMountedComponents(
      { component: LocusDatabases },
      {
        props: {
          hgnc: BRCA1GeneInfo['genes']['HGNC:1100']['hgnc']
        }
      }
    )
    expect(wrapper.text()).toContain('Locus-Specific Databases')
  })
})
