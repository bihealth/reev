import { describe, expect, it } from 'vitest'

import * as BRCA1GeneInfo from '@/assets/__tests__/BRCA1GeneInfo.json'
import AlternativeIdentifiers from '@/components/GeneDetails/AlternativeIdentifiers.vue'
import { setupMountedComponents } from '@/lib/test-utils'

describe.concurrent('AlternativeIdentifiers', async () => {
  it('renders the AlternativeIdentifiers information.', async () => {
    const { wrapper } = await setupMountedComponents(
      { component: AlternativeIdentifiers, template: false },
      {
        props: {
          hgnc: BRCA1GeneInfo['genes']['HGNC:1100']['hgnc']
        }
      }
    )
    expect(wrapper.text()).toContain('Alternative Identifiers')
  })
})
