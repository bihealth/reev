import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'

import * as BRCA1GeneInfo from '@/assets/__tests__/BRCA1GeneInfo.json'
import SvGenes from '@/components/SvDetails/SvGenes.vue'
import { setupMountedComponents } from '@/lib/test-utils'

describe.concurrent('SvGenes', async () => {
  it('renders the SvGenes table', async () => {
    const { wrapper } = await setupMountedComponents(
      { component: SvGenes, template: false },
      {
        props: {
          currentSvRecord: JSON.parse(JSON.stringify([BRCA1GeneInfo['genes']['HGNC:1100']]))
        }
      }
    )

    const table = wrapper.findComponent({ name: 'VDataTable' })
    expect(table.exists()).toBe(true)
    expect(wrapper.text()).toContain('Select gene in table above to see details.')
  })

  it('shows the gene info on row click', async () => {
    const { wrapper } = await setupMountedComponents(
      { component: SvGenes, template: false },
      {
        props: {
          currentSvRecord: JSON.parse(JSON.stringify([BRCA1GeneInfo['genes']['HGNC:1100']]))
        }
      }
    )

    const table = wrapper.findComponent({ name: 'VDataTable' })
    expect(table.exists()).toBe(true)
    // Click on the first row
    await table.get('tbody tr').trigger('click')
    await nextTick()
    expect(table.emitted('update:options')).toBeTruthy()
  })
})
