import { describe, it, expect } from 'vitest'

import { API_BASE_PREFIX_ANNONARS, API_BASE_PREFIX_MEHARI } from '../common'

describe('API_BASE_PREFIX constants', () => {
  it('returns the correct API base prefix for annonars in production mode', () => {
    const originalMode = import.meta.env.MODE
    expect(API_BASE_PREFIX_ANNONARS).toBe('/proxy/annonars')
    import.meta.env.MODE = originalMode
  })

  it('returns the correct API base prefix for mehari in production mode', () => {
    const originalMode = import.meta.env.MODE
    expect(API_BASE_PREFIX_MEHARI).toBe('/proxy/mehari')
    import.meta.env.MODE = originalMode
  })
})
