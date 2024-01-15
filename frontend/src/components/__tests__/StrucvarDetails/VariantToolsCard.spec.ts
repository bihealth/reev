import { describe, expect, it } from 'vitest'

import VariantToolsCard from '@/components/StrucvarDetails/VariantToolsCard.vue'
import { type Strucvar } from '@/lib/genomicVars'
import { setupMountedComponents } from '@/lib/testUtils'

/** Example stucture Variant */
const strucvarInfo: Strucvar = {
  genomeBuild: 'grch37',
  svType: 'DEL',
  chrom: '17',
  start: 41176312,
  stop: 41277500,
  userRepr: 'DEL-grch37-17-41176312-41277500'
}

describe.concurrent('VariantToolsCard', async () => {
  it('renders the VariantToolsCard content', async () => {
    // arrange:
    const { wrapper } = await setupMountedComponents(
      { component: VariantToolsCard },
      {
        props: {
          strucvar: structuredClone(strucvarInfo),
          genomeBuild: 'grch37'
        }
      }
    )

    // act: nothing, only test rendering

    // assert:
    expect(wrapper.text()).toContain('Variant Tools')
    const vButtons = wrapper.findAllComponents({ name: 'VBtn' })
    expect(vButtons.length).toBe(7)
  })
})
