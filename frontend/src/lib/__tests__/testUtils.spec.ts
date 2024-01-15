import { describe, expect, it } from 'vitest'

import { setupMountedComponents } from '@/lib/testUtils'

/** Example Component */
const TestComponent = { template: '<template><div>Test</div></template>', __name: 'TestComponent' }

describe.concurrent('Test Utils - setupMountedComponents', async () => {
  it('should mount component with template', async () => {
    // arrange:
    const { wrapper } = await setupMountedComponents(
      { component: TestComponent },
      { initialStoreState: { state: { count: 42 } } }
    )

    // act: nothing, only test rendering

    // assert:
    expect(wrapper.exists()).toBe(true)
  })

  it('should mount component without template', async () => {
    // arrange:
    const { wrapper } = await setupMountedComponents(
      { component: TestComponent },
      { initialStoreState: { count: 42 } }
    )

    // act: nothing, only test rendering

    // assert:
    expect(wrapper.exists()).toBe(true)
  })

  it('should mock router push method', async () => {
    // arrange:
    const { router } = await setupMountedComponents(
      { component: TestComponent },
      { initialStoreState: { count: 42 } }
    )

    // act:
    router.push('/new-route')

    // assert:
    expect(router.push).toHaveBeenCalledWith('/new-route')
  })

  it('should create vuetify, router, and pinia instances', async () => {
    // arrange:
    const { wrapper, router, pinia } = await setupMountedComponents(
      { component: TestComponent },
      { initialStoreState: { count: 42 } }
    )

    // act: nothing, only test rendering

    // assert:
    expect(wrapper.exists()).toBe(true)
    expect(router).toBeDefined()
    expect(pinia).toBeDefined()
  })

  it('should set props when rendering without template', async () => {
    // arrange:
    const TestComponent = {
      props: ['message'],
      template: '<div>{{ message }}</div>',
      __name: 'TestComponent'
    }
    const { wrapper } = await setupMountedComponents(
      { component: TestComponent },
      { props: { message: 'Hello, Props!' } }
    )

    // act: nothing, only test rendering

    // assert:
    expect(wrapper.text()).toBe('Hello, Props!')
  })
})
