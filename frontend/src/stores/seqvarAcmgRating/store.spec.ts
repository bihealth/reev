import { type Seqvar } from '@bihealth/reev-frontend-lib/lib/genomicVars'
import { StoreState } from '@bihealth/reev-frontend-lib/stores'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import createFetchMock from 'vitest-fetch-mock'

import * as ServerResponse from '@/assets/__tests__/ExampleAcmgSeqVarRank.json'
import { AcmgCriteria, MultiSourceAcmgCriteriaState, Presence, StateSource } from '@/lib/acmgSeqvar'

import { useSeqvarAcmgRatingStore } from '../seqvarAcmgRating'

const fetchMocker = createFetchMock(vi)

/** Example Sequence Variant */
const seqvarInfo: Seqvar = {
  genomeBuild: 'grch37',
  chrom: '17',
  pos: 43044295,
  del: 'G',
  ins: 'A',
  userRepr: 'grch37-17-43044295-G-A'
}

/** Example InterVar Response */
const ExampleInterVarResponse = {
  pvs1: true,
  ps1: false,
  ps2: false,
  ps3: false,
  ps4: false,
  pm1: false,
  pm2: false,
  pm3: false,
  pm4: false,
  pm5: false,
  pm6: false,
  pp1: false,
  pp2: false,
  pp3: false,
  pp4: false,
  ba1: false,
  bs1: false,
  bs2: false,
  bs3: false,
  bs4: false,
  bp1: false,
  bp2: false,
  bp3: false,
  bp4: false,
  bp5: false,
  bp7: false
}

describe('geneInfo Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    fetchMocker.enableMocks()
    fetchMocker.resetMocks()
  })

  it('should have initial state', () => {
    // arrange:
    const store = useSeqvarAcmgRatingStore()

    // act: nothing to do

    // assert:
    expect(store.storeState).toBe(StoreState.Initial)
    expect(store.acmgRating).toStrictEqual(new MultiSourceAcmgCriteriaState())
    expect(store.seqvar).toBe(null)
    expect(store.acmgRatingStatus).toBe(false)
  })

  it('should clear state', () => {
    // arrange:
    const store = useSeqvarAcmgRatingStore()
    store.storeState = StoreState.Active
    store.acmgRating = JSON.parse(JSON.stringify({ acmg: 'rating' }))
    store.seqvar = structuredClone(seqvarInfo)

    // act:
    store.clearData()

    // assert:
    expect(store.storeState).toBe(StoreState.Initial)
    expect(store.acmgRating).toStrictEqual(new MultiSourceAcmgCriteriaState())
    expect(store.seqvar).toBe(null)
  })

  it('should correctly retrieve data for InterVar and Server', async () => {
    // arrange:
    fetchMocker.mockResponse((req) => {
      if (req.url.includes('remote/acmg')) {
        return Promise.resolve(JSON.stringify(ExampleInterVarResponse))
      } else if (req.url.includes('acmgSeqvar')) {
        return Promise.resolve(JSON.stringify(ServerResponse))
      }
      return Promise.resolve(JSON.stringify({ status: 400 }))
    })
    const store = useSeqvarAcmgRatingStore()

    // act:
    await store.fetchAcmgRating(structuredClone(seqvarInfo))

    // assert:
    expect(store.storeState).toBe(StoreState.Active)
    const expectedAcmgRating = new MultiSourceAcmgCriteriaState()
    for (const [key, value] of Object.entries(ExampleInterVarResponse)) {
      const acmgCriteriaKey = key.toUpperCase() as AcmgCriteria
      expectedAcmgRating.setPresence(
        StateSource.InterVar,
        AcmgCriteria[acmgCriteriaKey],
        value ? Presence.Present : Presence.Absent
      )
      // Set Absent for all criteria for Server source
      // expectedAcmgRating.setPresence(
      //   StateSource.Server,
      //   AcmgCriteria[acmgCriteriaKey],
      //   Presence.Absent
      // )
      // Set evidence level to the Default for all criteria for Server source
      // const defaultEvidenceLevel = expectedAcmgRating.getCriteriaStateFromSource(
      //   acmgCriteriaKey,
      //   StateSource.Default
      // ).evidenceLevel
      // expectedAcmgRating.setEvidenceLevel(
      //   StateSource.Server,
      //   AcmgCriteria[acmgCriteriaKey],
      //   defaultEvidenceLevel
      // )
    }
    expect(store.acmgRating).toStrictEqual(expectedAcmgRating)
    expect(store.seqvar).toStrictEqual(structuredClone(seqvarInfo))
  })

  it('should fail to load data with invalid request', async () => {
    // arrange:
    // Disable error logging
    vi.spyOn(console, 'error').mockImplementation(() => {})
    fetchMocker.mockResponseOnce(JSON.stringify({ foo: 'bar' }), { status: 400 })
    const store = useSeqvarAcmgRatingStore()

    // act:
    await expect(
      async () => await store.fetchAcmgRating(structuredClone(seqvarInfo))
    ).rejects.toThrow()

    // assert:
    expect(store.storeState).toBe(StoreState.Error)
    expect(store.acmgRating).toStrictEqual(new MultiSourceAcmgCriteriaState())
    expect(store.seqvar).toBe(null)
  })

  it('should not load data if small variant is the same', async () => {
    // arrange:
    fetchMocker.mockResponse((req) => {
      if (req.url.includes('remote/acmg')) {
        return Promise.resolve(JSON.stringify(ExampleInterVarResponse))
      } else if (req.url.includes('acmgSeqvar')) {
        return Promise.resolve(JSON.stringify(ServerResponse))
      }
      return Promise.resolve(JSON.stringify({ status: 400 }))
    })
    const store = useSeqvarAcmgRatingStore()

    // act:
    await store.fetchAcmgRating(structuredClone(seqvarInfo))

    // assert:
    expect(store.storeState).toBe(StoreState.Active)
    const expectedAcmgRating = new MultiSourceAcmgCriteriaState()
    for (const [key, value] of Object.entries(ExampleInterVarResponse)) {
      const acmgCriteriaKey = key.toUpperCase() as AcmgCriteria
      expectedAcmgRating.setPresence(
        StateSource.InterVar,
        AcmgCriteria[acmgCriteriaKey],
        value ? Presence.Present : Presence.Absent
      )
      // Set Absent for all criteria for Server source
      // expectedAcmgRating.setPresence(
      //   StateSource.Server,
      //   AcmgCriteria[acmgCriteriaKey],
      //   Presence.Absent
      // )
      // // Set evidence level to the Default for all criteria for Server source
      // const defaultEvidenceLevel = expectedAcmgRating.getCriteriaStateFromSource(
      //   acmgCriteriaKey,
      //   StateSource.Default
      // ).evidenceLevel
      // expectedAcmgRating.setEvidenceLevel(
      //   StateSource.Server,
      //   AcmgCriteria[acmgCriteriaKey],
      //   defaultEvidenceLevel
      // )
    }
    expect(store.acmgRating).toStrictEqual(expectedAcmgRating)
    expect(store.seqvar).toStrictEqual(seqvarInfo)

    // act2:
    await store.fetchAcmgRating(structuredClone(seqvarInfo))

    // assert2:
    expect(fetchMocker.mock.calls.length).toBe(3)
  })
})
