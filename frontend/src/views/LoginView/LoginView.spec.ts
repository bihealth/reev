import { setupMountedComponents } from '@bihealth/reev-frontend-lib/lib/testUtils'
import { describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'

import LoginView from './LoginView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: h('div', { innerHTML: 'for testing' })
  },
  {
    path: '/info#terms-of-use',
    name: 'info-terms-of-use',
    component: h('div', { innerHTML: 'for testing' })
  },
  {
    path: '/login',
    name: 'login',
    component: h('div', { innerHTML: 'for testing' })
  },
  {
    path: '/profile',
    name: 'profile',
    component: h('div', { innerHTML: 'for testing' })
  }
]

describe.concurrent('Login view', async () => {
  it('renders the main content', async () => {
    // arrange:
    const { wrapper } = await setupMountedComponents(
      { component: LoginView, stubs: { PageHeader: true, FooterDefault: true } },
      { routes }
    )

    // act: nothing, only test rendering

    // assert:
    expect(wrapper.html()).toMatch('REEV Explains and Evaluates Variants')
    // Form fields
    expect(wrapper.html()).toMatch('Account')
    const emailField = wrapper.find('#email')
    expect(emailField.exists()).toBe(true)
    expect(wrapper.html()).toMatch('Password')
    const passwordField = wrapper.find('#password')
    expect(passwordField.exists()).toBe(true)
    // Buttons
    const backButton = wrapper.find('a[href="/"]')
    expect(backButton.text()).toMatch('Back')
    const loginButton = wrapper.find('button[type="button"]')
    expect(loginButton.text()).toMatch('Log In')
  })

  it('emits login event when login button is clicked', async () => {
    // arrange:
    // Mock fetch
    global.fetch = vi.fn((): any =>
      Promise.resolve({ ok: true, json: () => Promise.resolve(JSON.stringify({ status: 200 })) })
    )
    const { wrapper } = await setupMountedComponents(
      { component: LoginView, stubs: { PageHeader: true, FooterDefault: true } },
      { routes }
    )

    // act:
    const emailField = wrapper.find('#email')
    const passwordField = wrapper.find('#password')
    const loginButton = wrapper.find('button[type="button"]')

    await emailField.setValue('example@mail.com')
    await passwordField.setValue('examplePassword')
    await loginButton.trigger('click')
    await nextTick()

    // assert:
    expect(wrapper.emitted('input')).toHaveLength(2)
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('correctly handles error while logging in', async () => {
    // arrange:
    // Mock fetch
    global.fetch = vi.fn((): any =>
      Promise.resolve({ ok: false, json: () => Promise.resolve({ foo: 'foo' }) })
    )
    const { wrapper } = await setupMountedComponents(
      { component: LoginView, stubs: { PageHeader: true, FooterDefault: true } },
      { routes }
    )

    // act:
    const emailField = wrapper.find('#email')
    const passwordField = wrapper.find('#password')
    const loginButton = wrapper.find('button[type="button"]')

    await emailField.setValue('invalid')
    await passwordField.setValue('')
    await loginButton.trigger('click')
    await nextTick()

    // assert:
    expect(wrapper.emitted('input')).toHaveLength(2)
    expect(wrapper.emitted('click')).toHaveLength(1)
  })
})
