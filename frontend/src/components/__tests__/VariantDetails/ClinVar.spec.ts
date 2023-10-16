import { describe, expect, it } from 'vitest'

import ClinVar from '@/components/VariantDetails/ClinVar.vue'
import { setupMountedComponents } from '@/lib/test-utils'

const clinVarInfo = {
  release: 'GRCh38',
  chromosome: '17',
  start: 43063903,
  stop: 43063903,
  reference: 'G',
  alternative: 'T',
  rcv: 'RCV003149709',
  clinical_significance: 0,
  review_status: 3
}

describe.concurrent('ClinVar', async () => {
  it('renders the ClinVar info', async () => {
    const { wrapper } = setupMountedComponents(
      { component: ClinVar, template: false },
      {
        props: {
          clinvar: clinVarInfo
        }
      }
    )
    expect(wrapper.text()).toContain('Note that REEV is using a local copy of Clinvar')
    expect(wrapper.text()).toContain('RCV003149709')
    const starsOutline = wrapper.findAll('.mdi-star-outline')
    expect(starsOutline.length).toBe(2)
  })

  it('renders the ClinVar info with stars', async () => {
    const clinVarInfoStars = structuredClone(clinVarInfo)
    clinVarInfoStars.clinical_significance = 3
    const { wrapper } = setupMountedComponents(
      { component: ClinVar, template: false },
      {
        props: {
          clinvar: clinVarInfoStars
        }
      }
    )
    expect(wrapper.text()).toContain('Note that REEV is using a local copy of Clinvar')
    expect(wrapper.text()).toContain('RCV003149709')
    const stars = wrapper.findAll('.mdi-star-outline')
    expect(stars.length).toBe(2)
    const starsOutline = wrapper.findAll('.mdi-star-outline')
    expect(starsOutline.length).toBe(2)
  })

  it('renders the ClinVar info (not found)', async () => {
    const { wrapper } = setupMountedComponents(
      { component: ClinVar, template: false },
      {
        props: {
          clinvar: null
        }
      }
    )
    expect(wrapper.text()).toContain('Note that REEV is using a local copy of Clinvar')
    expect(wrapper.text()).toContain('No ClinVar information available.')
  })
})
