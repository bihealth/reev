import { describe, expect, it } from 'vitest'

import * as BRCA1VariantInfo from '@/assets/__tests__/BRCA1VariantInfo.json'
import VariantTools from '@/components/SeqvarDetails/VariantToolsCard.vue'
import type { Seqvar } from '@/lib/genomicVars'
import { setupMountedComponents } from '@/lib/testUtils'

/** Exmaple Sequence Variant */
const seqvarInfo: Seqvar = {
  genomeBuild: 'grch37',
  chrom: '17',
  pos: 43044295,
  del: 'G',
  ins: 'A',
  userRepr: 'grch37-17-43044295-G-A'
}

describe.concurrent('VariantTools', async () => {
  it('renders the Variant Tools info', async () => {
    // arrange:
    const { wrapper } = await setupMountedComponents(
      { component: VariantTools },
      {
        props: {
          seqvar: seqvarInfo,
          varAnnos: BRCA1VariantInfo['result']
        }
      }
    )

    // act: nothing, only test rendering

    // assert:
    expect(wrapper.text()).toContain('Genome Browsers')
    expect(wrapper.text()).toContain('Other Resources')
    expect(wrapper.text()).toContain('Local IGV')
    const launchIcons = wrapper.findAll('.mdi-launch')
    expect(launchIcons.length).toBe(9)
  })

  it('renders the Variant Tools info with empty Seqvar', async () => {
    // arrange:
    const { wrapper } = await setupMountedComponents(
      { component: VariantTools },
      {
        props: {
          seqvar: undefined,
          varAnnos: BRCA1VariantInfo['result']
        }
      }
    )

    // act: nothing, only test rendering

    // assert:
    expect(wrapper.text()).toContain('Genome Browsers')
    expect(wrapper.text()).toContain('Other Resources')
    expect(wrapper.text()).toContain('Local IGV')
    const launchIcons = wrapper.findAll('.mdi-launch')
    expect(launchIcons.length).toBe(9)
  })
})
