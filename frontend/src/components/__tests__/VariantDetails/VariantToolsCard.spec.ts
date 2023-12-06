import { describe, expect, it } from 'vitest'

import * as BRCA1VariantInfo from '@/assets/__tests__/BRCA1VariantInfo.json'
import VariantTools from '@/components/SeqvarDetails/VariantToolsCard.vue'
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
  it('renders the Variant Tools info', async () => {
    const { wrapper } = await setupMountedComponents(
      { component: VariantTools, template: false },
      {
        props: {
          smallVar: smallVariantInfo,
          varAnnos: BRCA1VariantInfo['result']
        }
      }
    )
    expect(wrapper.text()).toContain('Genome Browsers')
    expect(wrapper.text()).toContain('Other Resources')
    expect(wrapper.text()).toContain('Local IGV')
    const launchIcons = wrapper.findAll('.mdi-launch')
    expect(launchIcons.length).toBe(9)
  })
})
