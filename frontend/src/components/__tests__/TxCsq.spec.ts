import { describe, expect, it } from 'vitest'

import * as BRCA1TxInfo from '@/assets/__tests__/BRCA1TxInfo.json'
import TxCsq from '@/components/VariantDetails/TxCsq.vue'
import { setupMountedComponents } from '@/components/__tests__/utils'

describe.concurrent('TxCsq', async () => {
  it('renders the TxCsq info', async () => {
    const { wrapper } = setupMountedComponents(
      { component: TxCsq, template: false },
      {
        props: {
          txCsq: BRCA1TxInfo
        }
      }
    )
    const table = wrapper.find('table')
    expect(table.exists()).toBe(true)
  })
})
