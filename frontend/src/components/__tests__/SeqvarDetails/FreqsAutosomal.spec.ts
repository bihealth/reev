import { describe, expect, it } from 'vitest'

import * as BRCA1VariantInfo from '@/assets/__tests__/BRCA1VariantInfo.json'
import FreqsAutosomal from '@/components/SeqvarDetails/FreqsCard/AutosomalFreqs.vue'
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

describe.concurrent('FreqsAutosomal', async () => {
  it('renders the FreqsAutosomal info', async () => {
    const { wrapper } = await setupMountedComponents(
      { component: FreqsAutosomal, template: false },
      {
        props: {
          smallVar: smallVariantInfo,
          varAnnos: BRCA1VariantInfo['result'],
          dataset: 'gnomad_exomes'
        }
      }
    )
    expect(wrapper.text()).toContain('gnomAD Exomes')
    const table = wrapper.find('table')
    expect(table.exists()).toBe(true)
  })

  it('renders the FreqsAutosomal info with no data', async () => {
    const { wrapper } = await setupMountedComponents(
      { component: FreqsAutosomal, template: false },
      {
        props: {
          smallVar: smallVariantInfo,
          varAnnos: null,
          dataset: 'gnomad_genomes'
        }
      }
    )
    expect(wrapper.text()).toContain('gnomAD Genomes')
    expect(wrapper.text()).toContain('No allele frequency information available in local database.')
  })
})
