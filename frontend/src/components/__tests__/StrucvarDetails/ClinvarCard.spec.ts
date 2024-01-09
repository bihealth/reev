import { describe, expect, it } from 'vitest'

import * as CurrentSV from '@/assets/__tests__/ExampleSV.json'
import ClinvarCard from '@/components/StrucvarDetails/ClinvarCard.vue'
import { setupMountedComponents } from '@/lib/testUtils'

describe.concurrent('ClinvarCard', async () => {
  it('renders the ClinvarCard info', async () => {
    const { wrapper } = await setupMountedComponents(
      { component: ClinvarCard },
      {
        props: {
          genomeRelease: 'grch37'
        },
        initialStoreState: {
          svInfo: {
            currentSvRecord: JSON.parse(JSON.stringify(CurrentSV))
          }
        }
      }
    )

    expect(wrapper.text()).toContain('ClinVar')
    const dataTable = wrapper.findComponent({ name: 'VDataTable' })
    expect(dataTable.exists()).toBe(true)
  })
})
