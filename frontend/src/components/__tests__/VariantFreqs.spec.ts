import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from '@/router'

import { createTestingPinia } from '@pinia/testing'

import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import VariantFreqs from '@/components/VariantDetails/VariantFreqs.vue'
import VariantDetailsFreqsAutosomal from '@/components/VariantDetails/FreqsAutosomal.vue'
import VariantDetailsFreqsMitochondrial from '@/components/VariantDetails/FreqsMitochondrial.vue'
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

const makeWrapper = () => {
  return mount(
    {
      template: '<v-app><VariantFreqs /></v-app>'
    },
    {
      props: {
        smallVar: smallVariantInfo,
        varAnnos: BRCA1VariantInfo
      },
      global: {
        plugins: [vuetify, router, createTestingPinia({ createSpy: vi.fn() })],
        components: {
          VariantFreqs
        }
      }
    }
  )
}

describe('VariantFreqs', async () => {
  it.fails('renders the VariantFreqs info', async () => {
    const wrapper = makeWrapper()
    const freqsMitochondrial = wrapper.findComponent(VariantDetailsFreqsMitochondrial)
    const freqsAutosomal = wrapper.findComponent(VariantDetailsFreqsAutosomal)
    expect(freqsMitochondrial.exists()).toBe(true)
    expect(freqsAutosomal.exists()).toBe(true)
  })
})
