import { beforeEach, describe, it, expect, vi } from 'vitest'
import { useRouter } from 'vue-router'
import { createTestingPinia } from '@pinia/testing'
import { mount } from '@vue/test-utils'
import HeaderDetailPage from '@/components/HeaderDetailPage.vue'

const makeWrapper = () => {
  return mount(HeaderDetailPage, {
    shallow: true,
    global: {
      plugins: [
        createTestingPinia({
          initialState: { searchTerm: '', genomeRelease: 'grch37' },
          createSpy: vi.fn,
        })
      ]
    },
  });
}

describe('HeaderDetailPage.vue', () => {

  beforeEach(() => {
    vi.resetAllMocks();
  })

  it('renders the logo and title', () => {
    const wrapper = makeWrapper();
    expect(wrapper.exists()).toBeTruthy();
    const logo = wrapper.find('#logo')
    const title = wrapper.find('router-link')
    expect(logo.exists()).toBe(true)
    expect(title.text()).toMatch('Explanation and Evaluation of Variants')
  })

  it('renders the navigation links', () => {
    const wrapper = makeWrapper();
    const aboutLink = wrapper.find('v-btn[to="/about"]')
    const contactLink = wrapper.find('v-btn[to="/contact"]')
    expect(aboutLink.exists()).toBe(true)
    expect(contactLink.exists()).toBe(true)
  })
})
