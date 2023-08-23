import { describe, it, expect, vi } from 'vitest'
import * as VueRouter from 'vue-router'
import { mount } from '@vue/test-utils'
import HeaderDetailPage from '@/components/HeaderDetailPage.vue'

describe('HeaderDetailPage.vue', () => {
  const useRouteSpy = vi.spyOn(VueRouter, 'useRoute');
  const getWrapper = () => mount(HeaderDetailPage as any, {
    global: {
      stubs: {
        'router-link': { template: '<div/>' },
        'router-view': { template: '<div/>' },
      },
    },
  });

  it('renders the logo and title', () => {
    const useRouteMock = useRouteSpy.mockImplementationOnce(vi.fn());
    // ACT
    const wrapper = getWrapper();
    // ASSERT
    expect(useRouteMock).toHaveBeenCalled();
    expect(wrapper.exists()).toBeTruthy();
    const logo = wrapper.find('#logo')
    const title = wrapper.find('router-link')
    expect(logo.exists()).toBe(true)
    expect(title.text()).toMatch('Explanation and Evaluation of Variants')
  })

  it('renders the navigation links', () => {
    const useRouteMock = useRouteSpy.mockImplementationOnce({ query: 'query' });
    // ACT
    const wrapper = getWrapper();
    // ASSERT
    expect(useRouteMock).toHaveBeenCalled();
    const aboutLink = wrapper.find('v-btn[to="/about"]')
    const contactLink = wrapper.find('v-btn[to="/contact"]')
    expect(aboutLink.exists()).toBe(true)
    expect(contactLink.exists()).toBe(true)
  })
})
