import { describe, expect, it } from 'vitest'

import * as clinVarInfo from '@/assets/__tests__/BRCA1VariantClinVar.json'
import ClinVar from '@/components/SeqvarDetails/ClinvarCard.vue'
import { setupMountedComponents } from '@/lib/test-utils'

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
    expect(wrapper.text()).toContain('ClinVar')
    expect(wrapper.text()).toContain('VCV000055407')
    const stars = wrapper.findAll('.mdi-star')
    expect(stars.length).toBe(15)
    const starsOutline = wrapper.findAll('.mdi-star-outline')
    expect(starsOutline.length).toBe(30)
  })

  it('renders the ClinVar info with stars', async () => {
    const clinVarInfoStars = structuredClone(clinVarInfo)
    clinVarInfoStars.referenceAssertions[0].reviewStatus =
      'REVIEW_STATUS_NO_ASSERTION_CRITERIA_PROVIDED'
    const { wrapper } = await setupMountedComponents(
      { component: ClinVar, template: false },
      {
        props: {
          clinvar: clinVarInfoStars
        }
      }
    )
    expect(wrapper.text()).toContain('VCV000055407')
    const stars = wrapper.findAll('.mdi-star')
    expect(stars.length).toBe(9)
    const starsOutline = wrapper.findAll('.mdi-star-outline')
    expect(starsOutline.length).toBe(36)
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
