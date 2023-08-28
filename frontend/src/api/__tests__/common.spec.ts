import { describe, it, expect } from 'vitest'

import { API_BASE_PREFIX } from '../common'

describe('API_BASE_PREFIX constant', () => {
  it('returns the correct API base prefix in production mode', () => {
    const originalMode = import.meta.env.MODE
    expect(API_BASE_PREFIX).toBe('/proxy/annonars')
    import.meta.env.MODE = originalMode
  })
})
