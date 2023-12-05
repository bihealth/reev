import { describe, expect, it } from 'vitest'

import * as BRCA1VariantInfo from '@/assets/__tests__/BRCA1VariantInfo.json'
import Freqs from '@/components/SeqvarDetails/FreqsCard.vue'
import VariantDetailsFreqsAutosomal from '@/components/SeqvarDetails/FreqsCard/AutosomalFreqs.vue'
import VariantDetailsFreqsMitochondrial from '@/components/SeqvarDetails/FreqsCard/MitochondrialFreqs.vue'
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

const smallVariantInfoMitochondrial = {
  release: 'grch37',
  chromosome: 'chrM',
  start: '70',
  end: '70',
  reference: 'G',
  alternative: 'A',
  hgnc_id: 'HGNC:1100'
}

describe.concurrent('Freqs', async () => {
  it('renders the Freqs info', async () => {
    const { wrapper } = await setupMountedComponents(
      { component: Freqs, template: false },
      {
        props: {
          smallVar: smallVariantInfo,
          varAnnos: BRCA1VariantInfo
        }
      }
    )
    const freqsAutosomal = wrapper.findComponent(VariantDetailsFreqsAutosomal)
    expect(freqsAutosomal.exists()).toBe(true)
  })

  it('renders the Freqs info for Mitochondrial Variants', async () => {
    const { wrapper } = await setupMountedComponents(
      { component: Freqs, template: false },
      {
        props: {
          smallVar: smallVariantInfoMitochondrial,
          varAnnos: BRCA1VariantInfo
        }
      }
    )
    const freqsAutosomal = wrapper.findComponent(VariantDetailsFreqsMitochondrial)
    expect(freqsAutosomal.exists()).toBe(true)
  })
})
