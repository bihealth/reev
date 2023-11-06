import { describe, expect, it } from 'vitest'

import * as BRCA1GeneInfo from '@/assets/__tests__/BRCA1GeneInfo.json'
import HgncCard from '@/components/GeneDetails/HgncCard.vue'
import { setupMountedComponents } from '@/lib/test-utils'

describe.concurrent('HgncCard', async () => {
  it('renders the HgncCard information.', async () => {
    const { wrapper } = await setupMountedComponents(
      { component: HgncCard, template: false },
      {
        props: {
          hgnc: BRCA1GeneInfo['genes']['HGNC:1100']['hgnc']
        }
      }
    )
    expect(wrapper.text()).toContain('HGNC')
  })
})
