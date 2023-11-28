import { describe, expect, it } from 'vitest'

import * as BRCA1GeneInfo from '@/assets/__tests__/BRCA1GeneInfo.json'
import ConditionsCard from '@/components/GeneDetails/ConditionsCard.vue'
import { setupMountedComponents } from '@/lib/test-utils'

describe.concurrent('ConditionsCard', async () => {
  it('renders the ConditionsCard information.', async () => {
    const { wrapper } = await setupMountedComponents(
      { component: ConditionsCard, template: false },
      {
        props: {
          geneInfo: BRCA1GeneInfo['genes']['HGNC:1100'],
          hpoTerms: []
        }
      }
    )
    expect(wrapper.text()).toContain('The gene BRCA1')
    expect(wrapper.text()).toContain('HPO Terms')
    expect(wrapper.text()).toContain('OMIM Diseases')
    expect(wrapper.text()).toContain('Orphanet Diseases (6)')
  })
})
