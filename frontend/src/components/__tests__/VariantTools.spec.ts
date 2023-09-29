import { describe, expect, it } from 'vitest'

import * as BRCA1VariantInfo from '@/assets/__tests__/BRCA1VariantInfo.json'
import VariantTools from '@/components/VariantDetails/VariantTools.vue'
import { setupMountedComponents } from '@/lib/test-utils'

const smallVariantInfo = {
  release: 'grch37',
  chromosome: 'chr17',
  start: '43044295',
  end: '43044295',
  reference: 'G',
  alternative: 'A',
  hgnc_id: 'HGNC:1100'
}

describe.concurrent('VariantTools', async () => {
  it('renders the VariantTools info', async () => {
    const { wrapper } = setupMountedComponents(
      { component: VariantTools, template: false },
      {
        props: {
          smallVar: smallVariantInfo,
          varAnnos: BRCA1VariantInfo['result']
        }
      }
    )
    expect(wrapper.text()).toContain('External Resources')
    expect(wrapper.text()).toContain('IGV')
    expect(wrapper.text()).toContain('Precomputed Scores')
    const launchIcons = wrapper.findAll('.mdi-launch')
    expect(launchIcons.length).toBe(8)
  })
})
