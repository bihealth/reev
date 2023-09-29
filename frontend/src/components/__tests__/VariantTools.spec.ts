import { createTestingPinia } from '@pinia/testing'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import * as BRCA1VariantInfo from '@/assets/__tests__/BRCA1VariantInfo.json'
import VariantTools from '@/components/VariantDetails/VariantTools.vue'
import { routes } from '@/router'

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

const makeWrapper = () => {
  return mount(VariantTools, {
    props: {
      smallVar: smallVariantInfo,
      varAnnos: BRCA1VariantInfo['result']
    },
    global: {
      plugins: [vuetify, router, createTestingPinia({ createSpy: vi.fn })],
      components: {
        VariantTools
      }
    }
  })
}

describe.concurrent('VariantTools', async () => {
  it('renders the VariantTools info', async () => {
    const wrapper = makeWrapper()
    expect(wrapper.text()).toContain('External Resources')
    expect(wrapper.text()).toContain('IGV')
    expect(wrapper.text()).toContain('Precomputed Scores')
    const launchIcons = wrapper.findAll('.mdi-launch')
    expect(launchIcons.length).toBe(8)
  })
})
