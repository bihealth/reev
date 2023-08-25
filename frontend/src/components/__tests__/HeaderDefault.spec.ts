import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import HeaderDefault from '../HeaderDefault.vue'

describe('HeaderDefault.vue', () => {
  it('renders the logo and title', () => {
    const wrapper = mount(HeaderDefault)
    const logo = wrapper.find('#logo')
    const title = wrapper.find('router-link')
    expect(logo.exists()).toBe(true)
    expect(title.text()).toMatch('Explanation and Evaluation of Variants')
  })

  it('renders the navigation links', () => {
    const wrapper = mount(HeaderDefault)
    const aboutLink = wrapper.find('v-btn[to="/about"]')
    const contactLink = wrapper.find('v-btn[to="/contact"]')
    expect(aboutLink.exists()).toBe(true)
    expect(contactLink.exists()).toBe(true)
  })
})
