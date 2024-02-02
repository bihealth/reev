import { describe, expect, it } from 'vitest'

import {
  API_INTERNAL_BASE_PREFIX,
  API_INTERNAL_BASE_PREFIX_ANNONARS,
  API_INTERNAL_BASE_PREFIX_CADA_PRIO,
  API_INTERNAL_BASE_PREFIX_MEHARI,
  API_INTERNAL_BASE_PREFIX_NGINX
} from './api'

describe.concurrent('API_BASE_PREFIX constants', () => {
  it('returns the correct API base prefix in production mode', () => {
    // arrange:
    const originalMode = import.meta.env.MODE

    // act: nothing, only test check

    // assert:
    expect(API_INTERNAL_BASE_PREFIX).toBe('/internal/')
    import.meta.env.MODE = originalMode
  })

  it('returns the correct API base prefix for annonars in production mode', () => {
    // arrange:
    const originalMode = import.meta.env.MODE

    // act: nothing, only test check

    // assert:
    expect(API_INTERNAL_BASE_PREFIX_ANNONARS).toBe('/internal/proxy/annonars')
    import.meta.env.MODE = originalMode
  })

  it('returns the correct API base prefix for mehari in production mode', () => {
    // arrange:
    const originalMode = import.meta.env.MODE

    // act: nothing, only test check

    // assert:
    expect(API_INTERNAL_BASE_PREFIX_MEHARI).toBe('/internal/proxy/mehari')
    import.meta.env.MODE = originalMode
  })

  it('returns the correct API base prefix for nginx in production mode', () => {
    // arrange:
    const originalMode = import.meta.env.MODE

    // act: nothing, only test check

    // assert:
    expect(API_INTERNAL_BASE_PREFIX_NGINX).toBe('/internal/proxy/nginx')
    import.meta.env.MODE = originalMode
  })

  it('returns the correct API base prefix for cada-prio in production mode', () => {
    // arrange:
    const originalMode = import.meta.env.MODE

    // act: nothing, only test check

    // assert:
    expect(API_INTERNAL_BASE_PREFIX_CADA_PRIO).toBe('/internal/proxy/cada-prio')
    import.meta.env.MODE = originalMode
  })
})
