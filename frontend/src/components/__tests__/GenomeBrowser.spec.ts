import { describe, expect, it } from 'vitest'

import GenomeBrowser from '@/components/GenomeBrowser.vue'
import { setupMountedComponents } from '@/lib/testUtils'

describe.concurrent('GenomeBrowser', async () => {
  it('renders the GenomeBrowser with the hg19 genome', async () => {
    // arrange:
    const { wrapper } = await setupMountedComponents(
      { component: GenomeBrowser },
      {
        props: {
          genomeRelease: 'grch37',
          locus: 'chr17:41246243-41246243'
        }
      }
    )

    // act: nothing, only test rendering

    // assert:
    expect(wrapper.exists()).toBe(true)
  })

  it('renders the GenomeBrowser with the hg38 genome', async () => {
    // arrange:
    const { wrapper } = await setupMountedComponents(
      { component: GenomeBrowser },
      {
        props: {
          genomeRelease: 'grch38',
          locus: 'chr17:41246243-41246243'
        }
      }
    )

    // act: nothing, only test rendering

    // assert:
    expect(wrapper.exists()).toBe(true)
  })
})
