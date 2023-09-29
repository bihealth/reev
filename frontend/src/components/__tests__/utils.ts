import { type TestingPinia, createTestingPinia } from '@pinia/testing'
import { type VueWrapper, mount } from '@vue/test-utils'
import { vi } from 'vitest'
import { type Router, createRouter, createWebHistory } from 'vue-router'
import { createVuetify } from 'vuetify'
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
export const setupMountedComponents = (
  componentOptions: {
    component: any
    template: boolean
  },
  options?: {
    initialStoreState?: any
    props?: any
  }
): MountedComponents => {
  // Create new vuetify instance.
  const vuetify = createVuetify({
    components,
    directives
  })

  // Create a `Router` instance that will be used in the tests and mock `push()`.
  const router = createRouter({
    history: createWebHistory(),
    routes: routes
  })
  router.push = vi.fn()

  // Create a testing pinia with the initial data.
  const pinia = createTestingPinia({
    createSpy: vi.fn,
    initialState: options?.initialStoreState ?? {}
  })

  // Setup the component mapping that is to be tested.
  const knownComponents: { [key: string]: any } = {}
  knownComponents[componentOptions.component.__name] = componentOptions.component

  // Setup mounting option of component
  const componentMount = componentOptions.template
    ? { template: `<v-app><${componentOptions.component.__name} /></v-app>` }
    : componentOptions.component

  const wrapper = mount(componentMount, {
    props: options?.props,
    global: {
      plugins: [vuetify, router, pinia],
      components: knownComponents
    }
  })

  return { pinia, wrapper, router }
}
