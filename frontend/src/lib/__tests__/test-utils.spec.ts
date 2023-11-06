import { describe, expect, it } from 'vitest'

import { setupMountedComponents } from '../test-utils'

const TestComponent = { template: '<template><div>Test</div></template>', __name: 'TestComponent' }

describe.concurrent('Test Utils - setupMountedComponents', async () => {
  it('should mount component with template', async () => {
    const { wrapper } = await setupMountedComponents(
      { component: TestComponent, template: true },
      { initialStoreState: { state: { count: 42 } } }
    )

    expect(wrapper.exists()).toBe(true)
  })

  it('should mount component without template', async () => {
    const { wrapper } = await setupMountedComponents(
      { component: TestComponent, template: false },
      { initialStoreState: { count: 42 } }
    )

    expect(wrapper.exists()).toBe(true)
  })

  it('should mock router push method', async () => {
    const { router } = await setupMountedComponents(
      { component: TestComponent, template: true },
      { initialStoreState: { count: 42 } }
    )

    router.push('/new-route')
    expect(router.push).toHaveBeenCalledWith('/new-route')
  })

  it('should create vuetify, router, and pinia instances', async () => {
    const { wrapper, router, pinia } = await setupMountedComponents(
      { component: TestComponent, template: true },
      { initialStoreState: { count: 42 } }
    )

    expect(wrapper.exists()).toBe(true)
    expect(router).toBeDefined()
    expect(pinia).toBeDefined()
  })

  it('should set props when rendering without template', async () => {
    const TestComponent = {
      props: ['message'],
      template: '<div>{{ message }}</div>',
      __name: 'TestComponent'
    }

    const { wrapper } = await setupMountedComponents(
      { component: TestComponent, template: false },
      { props: { message: 'Hello, Props!' } }
    )
    expect(wrapper.text()).toBe('Hello, Props!')
  })
})
