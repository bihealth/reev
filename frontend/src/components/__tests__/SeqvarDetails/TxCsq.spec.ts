import { describe, expect, it } from 'vitest'

import * as BRCA1TxInfo from '@/assets/__tests__/BRCA1TxInfo.json'
import TxCsq from '@/components/SeqvarDetails/TxCsqCard.vue'
import { setupMountedComponents } from '@/lib/test-utils'

describe.concurrent('TxCsq', async () => {
  it('renders the TxCsq info', async () => {
    const { wrapper } = await setupMountedComponents(
      { component: TxCsq },
      {
        props: {
          txCsq: BRCA1TxInfo
        }
      }
    )
    const table = wrapper.find('table')
    expect(table.exists()).toBe(true)
    const headers = table.findAll('th')
    expect(headers.length).toBe(6)
    expect(headers[0].text()).toBe('Gene')
    expect(headers[1].text()).toBe('Transcript')
    expect(headers[2].text()).toBe('Consequence')
    expect(headers[3].text()).toBe('HGVS.p')
    expect(headers[4].text()).toBe('HGVS.t')
    expect(headers[5].text()).toBe('Exon/Intron')
  })
})
