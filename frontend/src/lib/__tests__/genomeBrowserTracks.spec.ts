import { describe, expect, it } from 'vitest'

import { publicTracks } from '../genomeBrowserTracks'

describe('publicTracks', () => {
  it('should have at least one track', () => {
    expect(publicTracks.length).toBeGreaterThan(0)
  })

  it('should have a name for each track', () => {
    publicTracks.forEach((track) => {
      expect(track.name).toBeDefined()
    })
  })

  it('should have a sourceType for each track', () => {
    publicTracks.forEach((track) => {
      expect(track.sourceType).toBeDefined()
    })
  })

  it('should have a format for each track', () => {
    publicTracks.forEach((track) => {
      expect(track.format).toBeDefined()
    })
  })

  it('should have a visibilityWindow for each track', () => {
    publicTracks.forEach((track) => {
      expect(track.visibilityWindow).toBeDefined()
    })
  })

  it('should have a url for each track', () => {
    publicTracks.forEach((track) => {
      expect(track.url).toBeDefined()
    })
  })

  it('should have a color for each track', () => {
    publicTracks.forEach((track) => {
      expect(track.color).toBeDefined()
    })
  })
})
