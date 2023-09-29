import { describe, expect, it } from 'vitest'

import GenomeBrowser from '@/components/GenomeBrowser.vue'
import { setupMountedComponents } from '@/lib/test-utils'

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
