import { describe, expect, it, vi } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import { mount } from '@vue/test-utils'
import HeaderDetailPage from '../HeaderDetailPage.vue'
import { beforeEach } from 'node:test'

let router

const makeWrapper = (geneData = {}) => {
  return mount(HeaderDetailPage, {
    shallow: true,
    global: {
      plugins: [
        createTestingPinia({
          initialState: { data: geneData },
          createSpy: vi.fn()
        }),
        router
      ]
    }
  })
}

describe('HeaderDetailPage', async () => {
  const geneData = {
    geneSymbol: 'BRCA1',
    geneInfo: {
      symbol: 'BRCA1',
      name: 'Test Gene',
      hgncId: '12345',
      ensemblId: 'ENSG00000000000001',
      entrezId: '12345'
    }
  }

  beforeEach(() => {
    router = createRouter({
      history: createWebHistory(),
      routes: routes
    })

    router.push = vi.fn()
    await router.isReady()
  })

  it('renders the gene symbol', () => {
    const wrapper = makeWrapper(geneData)

    const logo = wrapper.find('#logo')
    expect(logo.exists()).toBe(true)
    const aboutLink = wrapper.find('v-btn[to="/about"]')
    const contactLink = wrapper.find('v-btn[to="/contact"]')
    expect(aboutLink.exists()).toBe(true)
    expect(contactLink.exists()).toBe(true)
  })

  it('redirects if gene data is null', () => {
    const wrapper = makeWrapper()
    expect(router.push).toHaveBeenCalledWith('/')
  })
})
