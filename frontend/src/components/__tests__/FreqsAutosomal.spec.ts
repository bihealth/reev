import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from '@/router'

import { createTestingPinia } from '@pinia/testing'

import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import FreqsAutosomal from '@/components/VariantDetails/FreqsAutosomal.vue'
import * as BRCA1VariantInfo from '@/assets/__tests__/BRCA1VariantInfo.json'

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

const makeWrapper = (variantData: Object) => {
  return mount(FreqsAutosomal, {
    props: {
      smallVar: smallVariantInfo,
      varAnnos: variantData,
      dataset: 'gnomad_genomes'
    },
    global: {
      plugins: [vuetify, router, createTestingPinia({ createSpy: vi.fn() })],
      components: {
        FreqsAutosomal
      }
    }
  })
}

describe('FreqsAutosomal', async () => {
  it('renders the FreqsAutosomal info', async () => {
    const wrapper = makeWrapper(BRCA1VariantInfo['result'])
    expect(wrapper.text()).toContain('gnomAD Genomes')
    const table = wrapper.find('table')
    expect(table.exists()).toBe(true)
  })

  it('renders the FreqsAutosomal info with no data', async () => {
    const wrapper = makeWrapper({})
    expect(wrapper.text()).toContain('gnomAD Genomes')
    expect(wrapper.text()).toContain('No allele frequency information available in local database.')
  })
})
