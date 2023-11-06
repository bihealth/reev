import { describe, expect, it } from 'vitest'

import { setupMountedComponents } from '@/lib/test-utils'

import GenomeBrowser from '../GenomeBrowser.vue'

describe.concurrent('GenomeBrowser', async () => {
  it('renders the GenomeBrowser with the hg19 genome', async () => {
    const { wrapper } = await setupMountedComponents(
      { component: GenomeBrowser, template: false },
      {
        props: {
          genome: 'hg19',
          locus: 'chr17:41246243-41246243'
        }
      }
    )
    expect(wrapper.exists()).toBe(true)
  })

  it('renders the GenomeBrowser with the hg38 genome', async () => {
    const { wrapper } = await setupMountedComponents(
      { component: GenomeBrowser, template: false },
      {
        props: {
          genome: 'hg38',
          locus: 'chr17:41246243-41246243'
        }
      }
    )
    expect(wrapper.exists()).toBe(true)
  })
})
