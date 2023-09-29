import { describe, expect, it } from 'vitest'

import * as BRCA1VariantInfo from '@/assets/__tests__/BRCA1VariantInfo.json'
import VariantDetailsFreqsAutosomal from '@/components/VariantDetails/FreqsAutosomal.vue'
import VariantDetailsFreqsMitochondrial from '@/components/VariantDetails/FreqsMitochondrial.vue'
import VariantFreqs from '@/components/VariantDetails/VariantFreqs.vue'
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

describe.concurrent('VariantFreqs', async () => {
  it('renders the VariantFreqs info', async () => {
    const { wrapper } = setupMountedComponents(
      { component: VariantFreqs, template: false },
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

  it('renders the VariantFreqs info for Mitochondrial Variants', async () => {
    const { wrapper } = setupMountedComponents(
      { component: VariantFreqs, template: false },
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
