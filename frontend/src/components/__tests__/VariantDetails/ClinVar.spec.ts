import { describe, expect, it } from 'vitest'

import ClinVar from '@/components/VariantDetails/ClinVar.vue'
import { setupMountedComponents } from '@/lib/test-utils'

const clinVarInfo = {
  chrom: '17',
  pos: 41215920,
  reference: 'G',
  alternative: 'T',
  vcv: 'VCV000055407',
  reference_assertions: [
    {
      rcv: 'RCV000077599',
      title:
        'NM_007294.4(BRCA1):c.5123C>A (p.Ala1708Glu) AND Breast-ovarian cancer, familial, susceptibility to, 1',
      clinical_significance: 0,
      review_status: 1
    }
  ]
}

describe.concurrent('ClinVar', async () => {
  it('renders the ClinVar info', async () => {
    const { wrapper } = await setupMountedComponents(
      { component: ClinVar, template: false },
      {
        props: {
          clinvar: clinVarInfo
        }
      }
    )
    expect(wrapper.text()).toContain('VCV000055407')
    const starsOutline = wrapper.findAll('.mdi-star-outline')
    expect(starsOutline.length).toBe(4)
  })

  it('renders the ClinVar info with stars', async () => {
    const clinVarInfoStars = structuredClone(clinVarInfo)
    clinVarInfoStars.reference_assertions[0].clinical_significance = 3
    const { wrapper } = await setupMountedComponents(
      { component: ClinVar, template: false },
      {
        props: {
          clinvar: clinVarInfoStars
        }
      }
    )
    expect(wrapper.text()).toContain('VCV000055407')
    const stars = wrapper.findAll('.mdi-star-outline')
    expect(stars.length).toBe(4)
    const starsOutline = wrapper.findAll('.mdi-star-outline')
    expect(starsOutline.length).toBe(4)
  })

  it('renders the ClinVar info (not found)', async () => {
    const { wrapper } = await setupMountedComponents(
      { component: ClinVar, template: false },
      {
        props: {
          clinvar: null
        }
      }
    )
    expect(wrapper.text()).toContain('No ClinVar information available.')
  })
})
