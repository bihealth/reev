import { type TestingPinia, createTestingPinia } from '@pinia/testing'
import { type VueWrapper, flushPromises, mount } from '@vue/test-utils'
import { vi } from 'vitest'
import { h } from 'vue'
import { type Router, createRouter, createWebHistory } from 'vue-router'
import { createVuetify } from 'vuetify'
import { md3 } from 'vuetify/blueprints'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import { routes } from '@/router'

/**
 * Return value for `setupMountedComponents`.
 */
export interface MountedComponents {
  /** The testing pinia instance. */
  pinia: TestingPinia
  /** The `VueWrapper` instance */
  wrapper: VueWrapper
  /** The router instance */
  router: Router
}

/**
 * Creates the `VueWrapper` for the given component with mounting as template.
 *
 * Having a shared utility wrapper helps us to reduce the code in the individual tests.
 *
 * Effectively, this will:
 *
 * - create an appropriate Vuetify instance
 * - create a router with all real routes but `router.push` mocked
 * - create a testing pinia with the given initial state
 *
 * @returns
 */
export const setupMountedComponents = async (
  componentOptions: {
    /** The component itself */
    component: any
  },
  options?: {
    /** Initial Store instances */
    initialStoreState?: any
    /** Props to pass to the component */
    props?: any
    /** Query to pass to the router */
    query?: any
    /** A custom pinia instance to use. Use this option only if you need to mock a store getter
     * or action.
     */
    pinia?: TestingPinia
  }
): Promise<MountedComponents> => {
  // Create new vuetify instance.
  const vuetify = createVuetify({
    blueprint: md3,
    components: {
      ...components
    },
    directives
  })

  // Create a `Router` instance that will be used in the tests and mock `push()`.
  const router = createRouter({
    history: createWebHistory(),
    routes: routes
  })
  router.push = vi.fn()
  router.replace = vi.fn()

  // Create a testing pinia with the initial data.
  const pinia = createTestingPinia({
    createSpy: vi.fn,
    initialState: options?.initialStoreState ?? {}
  })

  // Setup the component mapping that is to be tested.
  const knownComponents: { [key: string]: any } = {}
  knownComponents[componentOptions.component.__name] = componentOptions.component

  // Setup mounting option of component
  const componentMount = h(
    components.VApp,
    // props
    {},
    // children
    () => [h(componentOptions.component, options?.props ?? {})]
  )

  const wrapper = mount(componentMount, {
    query: options?.query,
    global: {
      plugins: [vuetify, router, options?.pinia ?? pinia],
      components: knownComponents
    }
  })

  await flushPromises()
  await vi.dynamicImportSettled()

  return { pinia, wrapper, router }
}
