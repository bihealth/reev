import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from '@/router'

import { createTestingPinia } from '@pinia/testing'

import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import ClinVar from '@/components/VariantDetails/ClinVar.vue'

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

const makeWrapper = (cvInfo: Object) => {
  return mount(ClinVar, {
    props: { clinvar: cvInfo },
    global: {
      plugins: [vuetify, router, createTestingPinia({ createSpy: vi.fn() })],
      components: { ClinVar }
    }
  })
}

describe.concurrent('ClinVar', async () => {
  it('renders the ClinVar info', async () => {
    const wrapper = makeWrapper(clinVarInfo)
    expect(wrapper.text()).toContain('Note that REEV is using a local copy of Clinvar')
    expect(wrapper.text()).toContain('VCV000041833')
    const starsOutline = wrapper.findAll('.mdi-star-outline')
    expect(starsOutline.length).toBe(5)
  })

  it('renders the ClinVar info with stars', async () => {
    const clinVarInfoStars = structuredClone(clinVarInfo)
    clinVarInfoStars.summary_clinvar_gold_stars = 3
    const wrapper = makeWrapper(clinVarInfoStars)
    expect(wrapper.text()).toContain('Note that REEV is using a local copy of Clinvar')
    expect(wrapper.text()).toContain('VCV000041833')
    const stars = wrapper.findAll('.mdi-star-outline')
    expect(stars.length).toBe(2)
    const starsOutline = wrapper.findAll('.mdi-star-outline')
    expect(starsOutline.length).toBe(2)
  })

  it('renders the ClinVar info (not found)', async () => {
    const wrapper = makeWrapper({})
    expect(wrapper.text()).toContain('Note that REEV is using a local copy of Clinvar')
    expect(wrapper.text()).toContain('No ClinVar information available.')
  })
})
