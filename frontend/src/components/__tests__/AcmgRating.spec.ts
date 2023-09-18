import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from '@/router'

import { createTestingPinia } from '@pinia/testing'
import { useVariantAcmgRatingStore } from '@/stores/variantAcmgRating'
import { StoreState } from '@/stores/misc'

import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import AcmgRating from '@/components/VariantDetails/AcmgRating.vue'

const vuetify = createVuetify({
  components,
  directives
})

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes
})
// Mock router push
router.push = vi.fn()

const smallVariantInfo = {
  release: 'grch37',
  chromosome: 'chr17',
  start: '43044295',
  end: '43044295',
  reference: 'G',
  alternative: 'A',
  hgnc_id: 'HGNC:1100'
}

export const AcmgRatingInfo = {
  pvs1: true,
  ps1: false,
  ps2: false,
  ps3: false,
  ps4: false,
  pm1: false,
  pm2: false,
  pm3: false,
  pm4: false,
  pm5: false,
  pm6: true,
  pp1: false,
  pp2: false,
  pp3: false,
  pp4: false,
  pp5: false,
  ba1: false,
  bs1: false,
  bs2: false,
  bs3: true,
  bs4: false,
  bp1: false,
  bp2: false,
  bp3: false,
  bp4: false,
  bp5: true,
  bp6: false,
  bp7: false
}

const makeWrapper = () => {
  const pinia = createTestingPinia({ createSpy: vi.fn() })
  const store = useVariantAcmgRatingStore(pinia)

  const mockRetrieveAcmgRating = vi.fn().mockImplementation(async () => {
    store.storeState = StoreState.Active
    store.smallVariant = JSON.parse(JSON.stringify(smallVariantInfo))
    store.acmgRatingComputed = JSON.parse(JSON.stringify(AcmgRatingInfo))
  })
  store.retrieveAcmgRating = mockRetrieveAcmgRating

  store.storeState = StoreState.Active
  store.smallVariant = JSON.parse(JSON.stringify(smallVariantInfo))
  store.acmgRatingComputed = JSON.parse(JSON.stringify(AcmgRatingInfo))

  return mount(AcmgRating, {
    props: {
      smallVariant: smallVariantInfo
    },
    global: {
      plugins: [vuetify, router, pinia],
      components: {
        AcmgRating
      }
    }
  })
}

describe.concurrent('AcmgRating', async () => {
  it('renders the AcmgRating info', async () => {
    const wrapper = makeWrapper()
    expect(wrapper.text()).toContain('Pathogenic')
    expect(wrapper.text()).toContain('Benign')

    const switchers = wrapper.findAll('.v-switch')
    expect(switchers.length).toBe(28)
  })

  it('should correctly update the AcmgRating info', async () => {
    const wrapper = makeWrapper()
    const switchers = wrapper.findAll('.v-switch')
    const switcher = switchers[0]
    await switcher.trigger('click')

    expect(wrapper.text()).toContain('Pathogenic')
    expect(wrapper.text()).toContain('Benign')

    const updatedSwitchers = wrapper.findAll('.v-switch')
    expect(updatedSwitchers.length).toBe(28)
  })
})
