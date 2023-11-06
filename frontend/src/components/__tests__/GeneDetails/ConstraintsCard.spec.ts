import { describe, expect, it } from 'vitest'

import * as BRCA1GeneInfo from '@/assets/__tests__/BRCA1GeneInfo.json'
import ConstraintsCard from '@/components/GeneDetails/ConstraintsCard.vue'
import { setupMountedComponents } from '@/lib/test-utils'

describe.concurrent('ConstraintsCard', async () => {
  it('renders the ConstraintsCard information.', async () => {
    const { wrapper } = await setupMountedComponents(
      { component: ConstraintsCard, template: false },
      {
        props: {
          gnomadConstraints: BRCA1GeneInfo['genes']['HGNC:1100']['gnomad_constraints']
        }
      }
    )
    expect(wrapper.text()).toContain('Constraints/Scores')
  })
})
