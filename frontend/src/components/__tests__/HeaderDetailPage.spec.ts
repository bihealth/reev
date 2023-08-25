import { describe, expect, it, vi } from 'vitest'
import { useRouter } from 'vue-router'
import { createTestingPinia } from '@pinia/testing'
import { mount, RouterLinkStub } from '@vue/test-utils'
import { useGeneInfoStore } from '@/stores/geneInfo'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import HeaderDetailPage from '../HeaderDetailPage.vue'

// const vuetify = createVuetify({
//   components,
//   directives,
// })

// vi.mock('vue-router', () => ({
//   useRouter: () => ({
//     push: vi.fn()
//   })
// }))

// const makeWrapper = (geneData = {}) => {
//   return mount(HeaderDetailPage, {
//     // shallow: true,
//     global: {
//       plugins: [
//         vuetify,
//         // createTestingPinia({
//         //   initialState: { data: geneData },
//         //   createSpy: vi.fn()
//         // })
//       ]
//     }
//   })
// }

describe('HeaderDetailPage', async () => {
  const vuetify = createVuetify({
    components,
    directives
  })

  // vi.mock('vue-router', () => ({
  //   useRouter: () => ({
  //     push: vi.fn()
  //   })
  // }))

  // it('renders the gene symbol and nav links', () => {
  //   const geneData = {
  //     geneSymbol: 'BRCA1',
  //     geneInfo: {
  //       symbol: 'BRCA1',
  //       name: 'Test Gene',
  //       hgncId: '12345',
  //       ensemblId: 'ENSG00000000000001',
  //       entrezId: '12345'
  //     }
  //   }

  //   const wrapper = makeWrapper(geneData)
  //   const store = useGeneInfoStore()
  //   const logo = wrapper.find('#logo')
  //   const aboutLink = wrapper.find('v-btn[to="/about"]')
  //   const contactLink = wrapper.find('v-btn[to="/contact"]')
  //   expect(logo.exists()).toBe(true)
  //   expect(aboutLink.exists()).toBe(true)
  //   expect(contactLink.exists()).toBe(true)
  // })

  it('redirects if gene data is null', async () => {
    // const geneData = {geneSymbol: '', geneInfo: null}
    // const wrapper = makeWrapper(geneData)
    const wrapper = mount(
      {
        template: '<v-layout><header-detail-page></header-detail-page></v-layout>'
      },
      {
        global: {
          plugins: [vuetify],
          components: {
            HeaderDetailPage
          },
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      }
    )
    console.log(wrapper.html())
    // const router = useRouter()
    // expect(router.push).toHaveBeenCalled()
  })
})
