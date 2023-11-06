import { describe, expect, it } from 'vitest'

import * as BRCA1GeneInfo from '@/assets/__tests__/BRCA1GeneInfo.json'
import DiseaseAnnotation from '@/components/GeneDetails/DiseaseAnnotation.vue'
import { setupMountedComponents } from '@/lib/test-utils'

describe.concurrent('DiseaseAnnotation', async () => {
  it('renders the DiseaseAnnotation information.', async () => {
    const { wrapper } = await setupMountedComponents(
      { component: DiseaseAnnotation, template: false },
      {
        props: {
          dbnsfp: BRCA1GeneInfo['genes']['HGNC:1100']['dbnsfp']
        }
      }
    )
    expect(wrapper.text()).toContain('Disease Annotation')
  })
})
