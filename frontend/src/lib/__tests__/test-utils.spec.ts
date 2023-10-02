import { describe, expect, it } from 'vitest'

import { setupMountedComponents } from '../test-utils'

const TestComponent = { template: '<template><div>Test</div></template>', __name: 'TestComponent' }

describe.concurrent('Test Utils - setupMountedComponents', () => {
  it('should mount component with template', () => {
    const { wrapper } = setupMountedComponents(
      { component: TestComponent, template: true },
      { initialStoreState: { state: { count: 42 } } }
    )

    expect(wrapper.exists()).toBe(true)
  })

  it('should mount component without template', () => {
    const { wrapper } = setupMountedComponents(
      { component: TestComponent, template: false },
      { initialStoreState: { count: 42 } }
    )

    expect(wrapper.exists()).toBe(true)
  })

  it('should mock router push method', () => {
    const { router } = setupMountedComponents(
      { component: TestComponent, template: true },
      { initialStoreState: { count: 42 } }
    )

    router.push('/new-route')
    expect(router.push).toHaveBeenCalledWith('/new-route')
  })

  it('should create vuetify, router, and pinia instances', () => {
    const { wrapper, router, pinia } = setupMountedComponents(
      { component: TestComponent, template: true },
      { initialStoreState: { count: 42 } }
    )

    expect(wrapper.exists()).toBe(true)
    expect(router).toBeDefined()
    expect(pinia).toBeDefined()
  })

  it('should set props when rendering without template', () => {
    const TestComponent = {
      props: ['message'],
      template: '<div>{{ message }}</div>',
      __name: 'TestComponent'
    }

    const { wrapper } = setupMountedComponents(
      { component: TestComponent, template: false },
      { props: { message: 'Hello, Props!' } }
    )
    expect(wrapper.text()).toBe('Hello, Props!')
  })
})
