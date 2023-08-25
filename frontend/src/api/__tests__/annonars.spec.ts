import { describe, it, expect } from 'vitest'
import { AnnonarsClient } from '../annonars'

describe('Annonars Client', () => {
  it('fetches gene info correctly', async () => {
    const mockFetch: any = (url: string, options: any) => {
      expect(url).toBe('/proxy/annonars/genes/info?hgnc-id=BRCA1')
      expect(options.method).toBe('GET')
      return Promise.resolve({
        json: () => Promise.resolve({ gene: 'info' })
      })
    }
    globalThis.fetch = mockFetch

    const client = new AnnonarsClient()
    const result = await client.fetchGeneInfo('BRCA1')

    expect(result).toEqual({ gene: 'info' })
  })

  it.fails('fails to fetch gene info with POST', async () => {
    const mockFetch: any = (url: string, options: any) => {
      expect(url).toBe('/proxy/annonars/genes/info')
      expect(options.method).toBe('POST')
      return Promise.resolve({
        json: () => Promise.resolve({ gene: 'info' })
      })
    }
    globalThis.fetch = mockFetch

    const client = new AnnonarsClient()
    const result = await client.fetchGeneInfo('BRCA1')

    expect(result).toEqual({ gene: 'info' })
  })

  it.fails('fails to fetch gene info with wrong hgnc-id', async () => {
    const mockFetch: any = (url: string, options: any) => {
      expect(url).toBe('/proxy/annonars/genes/info?hgnc-id=BRCA1')
      expect(options.method).toBe('GET')
      return Promise.resolve({
        json: () => Promise.resolve({ gene: 'info' })
      })
    }
    globalThis.fetch = mockFetch

    const client = new AnnonarsClient()
    const result = await client.fetchGeneInfo('123')

    expect(result).toEqual({ gene: 'info' })
  })
})
