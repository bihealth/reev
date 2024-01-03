import { describe, expect, it } from 'vitest'
import { VSwitch } from 'vuetify/components'

import * as BRCA1GeneInfo from '@/assets/__tests__/BRCA1GeneInfo.json'
import ConditionsCard from '@/components/GeneDetails/ConditionsCard.vue'
import { setupMountedComponents } from '@/lib/test-utils'

describe.concurrent('ConditionsCard', async () => {
  it('renders the ConditionsCard information.', async () => {
    const { wrapper } = await setupMountedComponents(
      { component: ConditionsCard },
      {
        props: {
          geneInfo: BRCA1GeneInfo['genes']['HGNC:1100'],
          hpoTerms: []
        }
      }
    )
    expect(wrapper.text()).toContain('The gene BRCA1')
    expect(wrapper.text()).toContain('HPO Terms')
    expect(wrapper.text()).toContain('OMIM Diseases')
    expect(wrapper.text()).toContain('Orphanet Diseases (6)')
  })

  it('expands the Orphanet Disorders information.', async () => {
    const { wrapper } = await setupMountedComponents(
      { component: ConditionsCard },
      {
        props: {
          geneInfo: BRCA1GeneInfo['genes']['HGNC:1100'],
          hpoTerms: []
        }
      }
    )
    expect(wrapper.text()).not.toContain('Orphanet Disorders')
    const expandButton = wrapper.find('#conditions-card-expand-button')
    expect(expandButton.exists()).toBe(true)
    await expandButton.trigger('click')
    expect(wrapper.text()).toContain('Orphanet Disorders')
  })

  it.skip('shows numerical values for HPO terms.', async () => {
    const { wrapper } = await setupMountedComponents(
      { component: ConditionsCard },
      {
        props: {
          geneInfo: BRCA1GeneInfo['genes']['HGNC:1100'],
          hpoTerms: [
            {
              term_id: 'HP:0000001',
              name: 'Example HPO Term'
            },
            {
              term_id: 'HP:0000002',
              name: 'Example HPO Term 2'
            }
          ]
        }
      }
    )
    expect(wrapper.text()).toContain('Example HPO Term')
    expect(wrapper.text()).toContain('Example HPO Term 2')
    expect(wrapper.text()).not.toContain('HP:0000001')
    expect(wrapper.text()).not.toContain('HP:0000002')

    const vSwitches = wrapper.findAllComponents(VSwitch)
    expect(vSwitches.length).toBe(2)
    const showTermsIdSwitch = vSwitches.find((vSwitch) => vSwitch.text() === 'numeric terms')
    expect(showTermsIdSwitch?.exists()).toBe(true)

    await showTermsIdSwitch?.vm.$emit('change', true)
    await showTermsIdSwitch?.vm.$emit('click')
    expect(showTermsIdSwitch?.vm.$props.value).toBe(true)
    expect(wrapper.text()).toContain('HP:0000001')
    expect(wrapper.text()).toContain('HP:0000002')
  })

  it.skip('shows links for HPO terms.', async () => {
    const { wrapper } = await setupMountedComponents(
      { component: ConditionsCard },
      {
        props: {
          geneInfo: BRCA1GeneInfo['genes']['HGNC:1100'],
          hpoTerms: [
            {
              term_id: 'HP:0000001',
              name: 'Example HPO Term'
            },
            {
              term_id: 'HP:0000002',
              name: 'Example HPO Term 2'
            }
          ]
        }
      }
    )
    expect(wrapper.text()).toContain('Example HPO Term')
    expect(wrapper.text()).toContain('Example HPO Term 2')
    expect(wrapper.html()).toContain('https://hpo.jax.org/app/browse/term/HP:0000001')

    const vSwitches = wrapper.findAllComponents(VSwitch)
    expect(vSwitches.length).toBe(2)
    const showTermsIdSwitch = vSwitches.find((vSwitch) => vSwitch.text() === 'show links')
    expect(showTermsIdSwitch?.exists()).toBe(true)

    await showTermsIdSwitch?.vm.$emit('change', false)
    await showTermsIdSwitch?.vm.$emit('click')
    expect(showTermsIdSwitch?.vm.$props.value).toBe(false)
    expect(wrapper.html()).not.toContain('https://hpo.jax.org/app/browse/term/HP:0000001')
  })
})
