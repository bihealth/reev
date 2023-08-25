import { describe, it, expect } from 'vitest'
import { API_BASE_PREFIX } from '../common'

describe('API_BASE_PREFIX constant', () => {
  it.skip('returns the correct API base prefix in development mode', () => {
    const originalMode = import.meta.env.MODE
    import.meta.env.MODE = 'development'

    expect(API_BASE_PREFIX).toBe('//localhost:8080/proxy/annonars')

    import.meta.env.MODE = originalMode
  })

  it('returns the correct API base prefix in production mode', () => {
    const originalMode = import.meta.env.MODE
    import.meta.env.MODE = 'production'

    expect(API_BASE_PREFIX).toBe('/proxy/annonars')

    import.meta.env.MODE = originalMode
  })
})
