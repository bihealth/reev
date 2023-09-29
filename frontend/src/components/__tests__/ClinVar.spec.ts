import { describe, expect, it } from 'vitest'

import ClinVar from '@/components/VariantDetails/ClinVar.vue'
import { setupMountedComponents } from '@/lib/test-utils'

const clinVarInfo = {
  release: 'GRCh37',
  chromosome: '17',
  start: 41197708,
  end: 41197708,
  reference: 'T',
  alternative: 'G',
  vcv: 'VCV000041833',
  summary_clinvar_pathogenicity: [4],
  summary_clinvar_gold_stars: 0,
  summary_paranoid_pathogenicity: [4],
  summary_paranoid_gold_stars: 0
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
    expect(wrapper.text()).toContain('VCV000041833')
    const starsOutline = wrapper.findAll('.mdi-star-outline')
    expect(starsOutline.length).toBe(5)
  })

  it('renders the ClinVar info with stars', async () => {
    const clinVarInfoStars = structuredClone(clinVarInfo)
    clinVarInfoStars.summary_clinvar_gold_stars = 3
    const { wrapper } = setupMountedComponents(
      { component: ClinVar, template: false },
      {
        props: {
          clinvar: clinVarInfoStars
        }
      }
    )
    expect(wrapper.text()).toContain('Note that REEV is using a local copy of Clinvar')
    expect(wrapper.text()).toContain('VCV000041833')
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
