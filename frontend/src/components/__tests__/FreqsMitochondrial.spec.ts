import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from '@/router'

import { createTestingPinia } from '@pinia/testing'

import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import FreqsMitochondrial from '@/components/VariantDetails/FreqsMitochondrial.vue'

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
  chromosome: 'chrM',
  start: '70',
  end: '70',
  reference: 'G',
  alternative: 'A',
  hgnc_id: 'HGNC:1100'
}

const variantInfo = {
  helixmtdb: {
    num_total: 1,
    num_het: 1,
    num_hom: 0
  },
  'gnomad-mtdna': {
    an: 0,
    ac_het: 0,
    ac_hom: 0
  },
  mtdna: {
    an: 0,
    ac_het: 0,
    ac_hom: 0
  }
}

const makeWrapper = (variantData: Object) => {
  return mount(FreqsMitochondrial, {
    props: {
      smallVar: smallVariantInfo,
      varAnnos: variantData
    },
    global: {
      plugins: [vuetify, router, createTestingPinia({ createSpy: vi.fn() })],
      components: {
        FreqsMitochondrial
      }
    }
  })
}

describe.concurrent('FreqsMitochondrial', async () => {
  it('renders the FreqsMitochondrial info', async () => {
    const wrapper = makeWrapper(variantInfo)
    expect(wrapper.html()).toContain('HelixMTdb')
    expect(wrapper.html()).toContain('gnomAD-MT')
    const table = wrapper.find('table')
    expect(table.exists()).toBe(true)
  })

  it('renders the FreqsMitochondrial info with no helixmtdb', async () => {
    const variantInfoNoHelixmtdb: any = structuredClone(variantInfo)
    variantInfoNoHelixmtdb.helixmtdb = {}
    const wrapper = makeWrapper(variantInfoNoHelixmtdb)
    expect(wrapper.html()).toContain('HelixMTdb')
    expect(wrapper.html()).toContain('gnomAD-MT')
    const table = wrapper.find('table')
    expect(table.exists()).toBe(true)
  })

  it('renders the FreqsMitochondrial info with no gnomad-mtdna', async () => {
    const variantInfoNoGnomad: any = structuredClone(variantInfo)
    variantInfoNoGnomad['gnomad-mtdna'] = {}
    const wrapper = makeWrapper(variantInfoNoGnomad)
    expect(wrapper.html()).toContain('HelixMTdb')
    expect(wrapper.html()).toContain('gnomAD-MT')
    const table = wrapper.find('table')
    expect(table.exists()).toBe(true)
  })

  it.skip('renders the FreqsMitochondrial info with invalid data', async () => {
    const wrapper = makeWrapper(smallVariantInfo)
    console.log(wrapper.html())
    const alertIcon = wrapper.find('.mdi-alert-circle-outline')
    expect(alertIcon.exists()).toBe(true)
  })
})
