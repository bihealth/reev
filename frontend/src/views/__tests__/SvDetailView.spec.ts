import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from '@/router'

import { createTestingPinia } from '@pinia/testing'
import { useSvInfoStore } from '@/stores/svInfo'

import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import SvDetailView from '../SvDetailView.vue'
import { StoreState } from '@/stores/misc'
import * as BRCA1GeneInfo from '@/assets/__tests__/BRCA1GeneInfo.json'
import HeaderDetailPage from '@/components/HeaderDetailPage.vue'
import SearchBar from '@/components/SearchBar.vue'
import { beforeEach } from 'node:test'

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



const makeWrapper = () => {
  const pinia = createTestingPinia({ createSpy: vi.fn() })
  const svInfoStore = useSvInfoStore(pinia)
  const mockLoadData = vi.fn().mockImplementation(async (svTerm: string) => {
    svInfoStore.storeState = StoreState.Active
    svInfoStore.currentSvRecord = JSON.parse(JSON.stringify({'sv': svTerm}))
  })
  svInfoStore.loadData = mockLoadData

  // Initial load
  svInfoStore.storeState = StoreState.Active
  svInfoStore.currentSvRecord = JSON.parse(JSON.stringify({'searchTerm': 'DEL:chr17:41176312:41277500'}))
  svInfoStore.genesInfos = JSON.parse(JSON.stringify([BRCA1GeneInfo]))

  return mount(
    {
      template: '<v-app><SvDetailView /></v-app>'
    },
    {
      props: {
        searchTerm: 'DEL:chr17:41176312:41277500',
        genomeRelease: 'grch37'
      },
      global: {
        plugins: [vuetify, router, pinia],
        components: {
          SvDetailView
        }
      }
    }
  )
}

describe.concurrent('SvDetailView', async () => {
  beforeEach(() => {
    // Mock tableBody.value.addEventListener from vue3-easy-data-table
    vi.mock('vue3-easy-data-table', () => ({
      __esModule: true,
      default: {
        name: 'EasyDataTable',
        props: {
          headers: Array,
          data: Array,
          tableBody: {
            value: {
              addEventListener: vi.fn().mockImplementation((event: string, callback: any) => {
                callback()
              }),
              removeEventListener: vi.fn(),
              scrollLeft: 0,
            }
          },
        },
        emits: ['row-click'],
        template: '<div></div>'
      }
    }))
  })
  
  it('renders the header', async () => {
    const wrapper = makeWrapper()
    console.log(wrapper.html())

    const header = wrapper.findComponent(HeaderDetailPage)
    const searchBar = wrapper.findComponent(SearchBar)
    expect(header.exists()).toBe(true)
    expect(searchBar.exists()).toBe(true)

    const logo = wrapper.find('#logo')
    const aboutLink = wrapper.find('#about')
    const contactLink = wrapper.find('#contact')
    expect(logo.exists()).toBe(true)
    expect(aboutLink.exists()).toBe(true)
    expect(contactLink.exists()).toBe(true)
  })
})