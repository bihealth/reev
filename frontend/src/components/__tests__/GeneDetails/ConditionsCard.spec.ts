import { describe, expect, it } from 'vitest'
import { VSwitch } from 'vuetify/components'

import * as BRCA1GeneInfo from '@/assets/__tests__/BRCA1GeneInfo.json'
import ConditionsCard from '@/components/GeneDetails/ConditionsCard.vue'
import { setupMountedComponents } from '@/lib/testUtils'

describe.concurrent('ConditionsCard', async () => {
  it('renders the ConditionsCard information.', async () => {
    // arrange:
    const { wrapper } = await setupMountedComponents(
      { component: ConditionsCard },
      {
        props: {
          geneInfo: BRCA1GeneInfo['genes']['HGNC:1100'],
          hpoTerms: []
        }
      }
    )

    // act: nothing, only test rendering

    // assert:
    expect(wrapper.text()).toContain('The gene BRCA1')
    expect(wrapper.text()).toContain('Associated Diseases')
    expect(wrapper.text()).toContain('PanelApp Panels')
    expect(wrapper.text()).toContain('HPO Terms')
  })

  it('expands the Orphanet Disorders information.', async () => {
    // arrange:
    const { wrapper } = await setupMountedComponents(
      { component: ConditionsCard },
      {
        props: {
          geneInfo: BRCA1GeneInfo['genes']['HGNC:1100'],
          hpoTerms: []
        }
      }
    )

    // act:
    expect(wrapper.text()).not.toContain('Orphanet Disorders') // guard
    const expandButton = wrapper.find('#conditions-card-expand-button')
    expect(expandButton.exists()).toBe(true) // guard
    await expandButton.trigger('click')

    // assert:
    expect(wrapper.text()).toContain('Orphanet Disorders')
  })

  // Test is skipped, because of VSwitch component
  // the component can not be clicked.
  it.skip('shows numerical values for HPO terms.', async () => {
    // arrange:
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

    // act:
    expect(wrapper.text()).toContain('Example HPO Term') // guard
    expect(wrapper.text()).toContain('Example HPO Term 2') // guard
    expect(wrapper.text()).not.toContain('HP:0000001') // guard
    expect(wrapper.text()).not.toContain('HP:0000002') // guard

    const vSwitches = wrapper.findAllComponents(VSwitch)
    expect(vSwitches.length).toBe(2) // guard
    const showTermsIdSwitch = vSwitches.find((vSwitch) => vSwitch.text() === 'numeric terms')
    expect(showTermsIdSwitch?.exists()).toBe(true) // guard

    await showTermsIdSwitch?.trigger('click')
    await showTermsIdSwitch?.vm.$emit('change', true)
    await showTermsIdSwitch?.vm.$emit('click')

    // assert:
    expect(showTermsIdSwitch?.vm.$props.value).toBe(true)
    expect(wrapper.text()).toContain('HP:0000001')
    expect(wrapper.text()).toContain('HP:0000002')
  })

  // Test is skipped, because of VSwitch component
  // the component can not be clicked.
  it.skip('shows links for HPO terms.', async () => {
    // arrange:
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

    // act:
    expect(wrapper.text()).toContain('Example HPO Term') // guard
    expect(wrapper.text()).toContain('Example HPO Term 2') // guard
    expect(wrapper.html()).toContain('https://hpo.jax.org/app/browse/term/HP:0000001') // guard

    const vSwitches = wrapper.findAllComponents(VSwitch)
    expect(vSwitches.length).toBe(2) // guard
    const showTermsIdSwitch = vSwitches.find((vSwitch) => vSwitch.text() === 'show links')
    expect(showTermsIdSwitch?.exists()).toBe(true) // guard

    await showTermsIdSwitch?.vm.$emit('change', false)
    await showTermsIdSwitch?.vm.$emit('click')

    // assert:
    expect(showTermsIdSwitch?.vm.$props.value).toBe(false)
    expect(wrapper.html()).not.toContain('https://hpo.jax.org/app/browse/term/HP:0000001')
  })
})
