import { describe, expect, it } from 'vitest'

import { publicTracks } from '../GenomeBrowser.c'

describe('publicTracks', () => {
  it('should have at least one track', () => {
    // arrange: nothing to do
    // act: nothing to do

    // assert:
    expect(publicTracks.length).toBeGreaterThan(0)
  })

  it('should have a name for each track', () => {
    // arrange: nothing to do
    // act: nothing to do

    // assert:
    publicTracks.forEach((track) => {
      expect(track.name).toBeDefined()
    })
  })

  it('should have a sourceType for each track', () => {
    // arrange: nothing to do
    // act: nothing to do

    // assert:
    publicTracks.forEach((track) => {
      expect(track.sourceType).toBeDefined()
    })
  })

  it('should have a format for each track', () => {
    // arrange: nothing to do
    // act: nothing to do

    // assert:
    publicTracks.forEach((track) => {
      expect(track.format).toBeDefined()
    })
  })

  it('should have a visibilityWindow for each track', () => {
    // arrange: nothing to do
    // act: nothing to do

    // assert:
    publicTracks.forEach((track) => {
      expect(track.visibilityWindow).toBeDefined()
    })
  })

  it('should have a url for each track', () => {
    // arrange: nothing to do
    // act: nothing to do

    // assert:
    publicTracks.forEach((track) => {
      expect(track.url).toBeDefined()
    })
  })

  it('should have a color for each track', () => {
    // arrange: nothing to do
    // act: nothing to do

    // assert:
    publicTracks.forEach((track) => {
      expect(track.color).toBeDefined()
    })
  })
})
