import { describe, expect, it } from 'vitest'

import * as BRCA1VariantInfo from '@/assets/__tests__/BRCA1VariantInfo.json'
import FreqsAutosomal from '@/components/SeqvarDetails/FreqsCard/AutosomalFreqs.vue'
import type { Seqvar } from '@/lib/genomicVars'
import { setupMountedComponents } from '@/lib/testUtils'

/** Example Sequece Variant */
const seqvarInfo: Seqvar = {
  genomeBuild: 'grch37',
  chrom: '17',
  pos: 43044295,
  del: 'G',
  ins: 'A',
  userRepr: 'grch37-17-43044295-G-A'
}

describe.concurrent('FreqsAutosomal', async () => {
  it('renders the FreqsAutosomal info', async () => {
    // arrange:
    const { wrapper } = await setupMountedComponents(
      { component: FreqsAutosomal },
      {
        props: {
          seqvar: structuredClone(seqvarInfo),
          varAnnos: BRCA1VariantInfo['result'],
          dataset: 'gnomad_exomes'
        }
      }
    )

    // act: nothing, only test rendering

    // assert:
    expect(wrapper.text()).toContain('gnomAD Exomes')
    const table = wrapper.find('table')
    expect(table.exists()).toBe(true)
  })

  it('renders the FreqsAutosomal info with no data', async () => {
    // arrange:
    const { wrapper } = await setupMountedComponents(
      { component: FreqsAutosomal },
      {
        props: {
          seqvar: structuredClone(seqvarInfo),
          varAnnos: null,
          dataset: 'gnomad_genomes'
        }
      }
    )

    // act: nothing, only test rendering

    // assert:
    expect(wrapper.text()).toContain('gnomAD Genomes')
    expect(wrapper.text()).toContain('No allele frequency information available in local database.')
  })
})
