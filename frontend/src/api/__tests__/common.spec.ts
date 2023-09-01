import { describe, it, expect } from 'vitest'

import { API_BASE_PREFIX, API_PROXY_BASE_PREFIX } from '../common'

describe('constants', () => {
  it('returns the correct proxy API base prefix in production mode', () => {
    const originalMode = import.meta.env.MODE
    expect(API_BASE_PREFIX).toBe('/')
    import.meta.env.MODE = originalMode
  })

  it('returns the correct proxy API base prefix in production mode', () => {
    const originalMode = import.meta.env.MODE
    expect(API_PROXY_BASE_PREFIX).toBe('/proxy/')
    import.meta.env.MODE = originalMode
  })
})
