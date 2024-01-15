import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import createFetchMock from 'vitest-fetch-mock'

import {
  ACMG_CRITERIA_CNV_DEFS,
  ACMG_CRITERIA_CNV_LOSS,
  AcmgCriteriaCNVLoss,
  MultiSourceAcmgCriteriaCNVState,
  Presence,
  StateSourceCNV
} from '@/components/StrucvarDetails/ClinsigCard.c'
import type { Strucvar } from '@/lib/genomicVars'

import { StoreState } from '../misc'
import { useStrucvarAcmgRatingStore } from '../strucvarAcmgRating'

const fetchMocker = createFetchMock(vi)

/** Example Structure Variant */
const strucvarInfo: Strucvar = {
  genomeBuild: 'grch37',
  svType: 'DEL',
  chrom: '17',
  start: 41176312,
  stop: 41277500,
  userRepr: 'DEL-grch37-17-41176312-41277500'
}

/** Example AutoCNV Response */
const ExampleAutoCNVResponse = {
  job: {
    result: {
      auto_evidence_score: {
        '1A': '0',
        '2A': '1'
      }
    }
  }
}

/** Helper function to get Enum key based on Enum value.
 *
 * @param myEnum The enum to search in.
 * @param enumValue The enum value to search for.
 */
function getEnumKeyByEnumValue<T extends { [index: string]: string }>(
  myEnum: T,
  enumValue: string
): keyof T | null {
  const keys = Object.keys(myEnum).filter((x) => myEnum[x] == enumValue)
  return keys.length > 0 ? keys[0] : null
}

describe.concurrent('geneInfo Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    fetchMocker.enableMocks()
    fetchMocker.resetMocks()
  })

  it('should have initial state', () => {
    // arrange:
    const store = useStrucvarAcmgRatingStore()

    // act: nothing to do

    // assert:
    expect(store.storeState).toBe(StoreState.Initial)
    expect(store.acmgRating).toStrictEqual(new MultiSourceAcmgCriteriaCNVState('DEL'))
    expect(store.strucvar).toBe(undefined)
  })

  it('should clear state', () => {
    // arrange:
    const store = useStrucvarAcmgRatingStore()
    store.storeState = StoreState.Active
    store.acmgRating = JSON.parse(JSON.stringify({ acmg: 'rating' }))
    store.strucvar = structuredClone(strucvarInfo)

    // act:
    store.clearData()

    // assert:
    expect(store.storeState).toBe(StoreState.Initial)
    expect(store.acmgRating).toStrictEqual(new MultiSourceAcmgCriteriaCNVState('DEL'))
    expect(store.strucvar).toBe(undefined)
  })

  it('should correctly retrieve data', async () => {
    // arrange:
    fetchMocker.mockResponseOnce(JSON.stringify(ExampleAutoCNVResponse))
    const store = useStrucvarAcmgRatingStore()

    // act:
    await store.fetchAcmgRating(structuredClone(strucvarInfo))

    // assert:
    expect(store.storeState).toBe(StoreState.Active)
    const expectedAcmgRating = new MultiSourceAcmgCriteriaCNVState('DEL')
    for (const criteria of ACMG_CRITERIA_CNV_LOSS) {
      const criteriaKey = getEnumKeyByEnumValue(AcmgCriteriaCNVLoss, criteria)
      expectedAcmgRating.setPresence(
        StateSourceCNV.AutoCNV,
        AcmgCriteriaCNVLoss[criteriaKey as keyof typeof AcmgCriteriaCNVLoss],
        Presence.Absent
      )
      const criteriaDef = ACMG_CRITERIA_CNV_DEFS.get(criteria)
      if (criteriaDef === undefined) {
        throw new Error('There was an error loading the ACMG data.')
      }
      expectedAcmgRating.setScore(
        StateSourceCNV.AutoCNV,
        AcmgCriteriaCNVLoss[criteriaKey as keyof typeof AcmgCriteriaCNVLoss],
        criteriaDef.defaultScore
      )
    }
    expectedAcmgRating.setUserToAutoCNV()

    for (const [key, value] of Object.entries(
      ExampleAutoCNVResponse.job.result.auto_evidence_score
    )) {
      const score: number = +(value as string)
      const criteria = 'L' + key
      const criteriaKey = getEnumKeyByEnumValue(AcmgCriteriaCNVLoss, criteria)
      expectedAcmgRating.setPresence(
        StateSourceCNV.AutoCNV,
        AcmgCriteriaCNVLoss[criteriaKey as keyof typeof AcmgCriteriaCNVLoss],
        Presence.Present
      )
      expectedAcmgRating.setScore(
        StateSourceCNV.AutoCNV,
        AcmgCriteriaCNVLoss[criteriaKey as keyof typeof AcmgCriteriaCNVLoss],
        score as number
      )
      expectedAcmgRating.setUserToAutoCNV()
    }
    expect(store.acmgRating).toStrictEqual(expectedAcmgRating)
    expect(store.strucvar).toStrictEqual(structuredClone(strucvarInfo))
  })

  it('should fail to load data with invalid request', async () => {
    // arrange:
    // Disable error logging
    vi.spyOn(console, 'error').mockImplementation(() => {})
    fetchMocker.mockResponseOnce(JSON.stringify({ foo: 'bar' }), { status: 400 })
    const store = useStrucvarAcmgRatingStore()

    // act:
    await store.fetchAcmgRating(structuredClone(strucvarInfo))

    // assert:
    expect(store.storeState).toBe(StoreState.Error)
    expect(store.acmgRating).toStrictEqual(new MultiSourceAcmgCriteriaCNVState('DEL'))
    expect(store.strucvar).toBe(undefined)
  })

  it('should not load data if structure variant is the same', async () => {
    // arrange:
    fetchMocker.mockResponse(JSON.stringify(ExampleAutoCNVResponse))
    const store = useStrucvarAcmgRatingStore()

    // act:
    await store.fetchAcmgRating(structuredClone(strucvarInfo))

    // assert:
    expect(store.storeState).toBe(StoreState.Active)
    const expectedAcmgRating = new MultiSourceAcmgCriteriaCNVState('DEL')
    for (const criteria of ACMG_CRITERIA_CNV_LOSS) {
      const criteriaKey = getEnumKeyByEnumValue(AcmgCriteriaCNVLoss, criteria)
      expectedAcmgRating.setPresence(
        StateSourceCNV.AutoCNV,
        AcmgCriteriaCNVLoss[criteriaKey as keyof typeof AcmgCriteriaCNVLoss],
        Presence.Absent
      )
      const criteriaDef = ACMG_CRITERIA_CNV_DEFS.get(criteria)
      if (criteriaDef === undefined) {
        throw new Error('There was an error loading the ACMG data.')
      }
      expectedAcmgRating.setScore(
        StateSourceCNV.AutoCNV,
        AcmgCriteriaCNVLoss[criteriaKey as keyof typeof AcmgCriteriaCNVLoss],
        criteriaDef.defaultScore
      )
    }
    expectedAcmgRating.setUserToAutoCNV()

    for (const [key, value] of Object.entries(
      ExampleAutoCNVResponse.job.result.auto_evidence_score
    )) {
      const score: number = +(value as string)
      const criteria = 'L' + key
      const criteriaKey = getEnumKeyByEnumValue(AcmgCriteriaCNVLoss, criteria)
      expectedAcmgRating.setPresence(
        StateSourceCNV.AutoCNV,
        AcmgCriteriaCNVLoss[criteriaKey as keyof typeof AcmgCriteriaCNVLoss],
        Presence.Present
      )
      expectedAcmgRating.setScore(
        StateSourceCNV.AutoCNV,
        AcmgCriteriaCNVLoss[criteriaKey as keyof typeof AcmgCriteriaCNVLoss],
        score as number
      )
      expectedAcmgRating.setUserToAutoCNV()
    }
    expect(store.acmgRating).toStrictEqual(expectedAcmgRating)
    expect(store.strucvar).toStrictEqual(structuredClone(strucvarInfo))

    // act2:
    await store.fetchAcmgRating(structuredClone(strucvarInfo))

    // assert2:
    expect(fetchMocker.mock.calls.length).toBe(1)
  })
})
