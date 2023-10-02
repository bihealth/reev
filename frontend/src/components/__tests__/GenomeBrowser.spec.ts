import { describe, expect, it } from 'vitest'

import { setupMountedComponents } from '@/lib/test-utils'

import GenomeBrowser from '../GenomeBrowser.vue'

describe.concurrent('GenomeBrowser', async () => {
  it('renders the GenomeBrowser', async () => {
    const { wrapper } = setupMountedComponents(
      { component: GenomeBrowser, template: false },
      {
        props: {
          caseUuid: 'your_case_uuid',
          genome: 'hg19',
          locus: 'chr17:41246243-41246243'
        }
      }
    )
    expect(wrapper.exists()).toBe(true)
  })
})
