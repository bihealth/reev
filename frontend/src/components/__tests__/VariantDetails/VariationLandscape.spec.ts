import { describe, expect, it } from 'vitest'

import VariationLandscape from '@/components/VariantDetails/VariationLandscape.vue'
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

describe.concurrent('VariationLandscape', async () => {
  it('renders the VariationLandscape plot', async () => {
    const { wrapper } = setupMountedComponents(
      { component: VariationLandscape, template: false },
      {
        props: {
          clinvar: null,
          genomeRelease: null, 
          geneSymbol: null,
        }
      }
    )
    expect(wrapper.text()).toContain('Query Beacon -----|>')
    const refreshButton = wrapper.find('.mdi-refresh')
    const info = wrapper.find('.text-muted')
    expect(refreshButton.exists()).toBe(true)
    expect(info.exists()).toBe(true)
  })
})
