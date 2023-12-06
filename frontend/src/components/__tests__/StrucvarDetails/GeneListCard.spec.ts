import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'

import * as BRCA1GeneInfo from '@/assets/__tests__/BRCA1GeneInfo.json'
import * as CurrentSV from '@/assets/__tests__/ExampleSV.json'
import GeneListCard from '@/components/StrucvarDetails/GeneListCard.vue'
import { setupMountedComponents } from '@/lib/test-utils'
import { StoreState } from '@/stores/misc'

describe.concurrent('GeneListCard', async () => {
  it('renders the GeneListCard table', async () => {
    const { wrapper } = await setupMountedComponents(
      { component: GeneListCard, template: false },
      {
        props: {
          genesInfos: JSON.parse(JSON.stringify([BRCA1GeneInfo['genes']['HGNC:1100']])),
          currentSvRecord: JSON.parse(JSON.stringify(CurrentSV)),
          selectedGeneHgncId: 'HGNC:1100',
          storeState: StoreState.Active
        }
      }
    )

    const table = wrapper.findComponent({ name: 'VDataIterator' })
    expect(table.exists()).toBe(true)
    expect(wrapper.text()).toContain('Overlapping and Contained Genes')
  })

  it('shows the gene info on row click', async () => {
    const { wrapper } = await setupMountedComponents(
      { component: GeneListCard, template: false },
      {
        props: {
          genesInfos: JSON.parse(JSON.stringify([BRCA1GeneInfo['genes']['HGNC:1100']])),
          currentSvRecord: JSON.parse(JSON.stringify(CurrentSV)),
          selectedGeneHgncId: 'HGNC:1100',
          storeState: StoreState.Active
        }
      }
    )

    const table = wrapper.findComponent({ name: 'VDataIterator' })
    expect(table.exists()).toBe(true)
    // Click on the first gene
    await table.get('div.v-sheet div.v-row div.v-col').trigger('click')
    await nextTick()
    expect(table.emitted('update:options')).toBeTruthy()
  })
})
