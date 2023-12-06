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

import { StoreState } from '../misc'
import { useSvAcmgRatingStore } from '../svAcmgRating'
import type { SmallVariant } from '../variantInfo'

const fetchMocker = createFetchMock(vi)

const svRecord = {
  svType: 'DEL',
  chromosome: 'chr17',
  start: '41176312',
  end: '41277500',
  release: 'grch37',
  result: [
    {
      hgnc_id: 'HGNC:18315',
      transcript_effects: [
        'transcript_variant',
        'exon_variant',
        'splice_region_variant',
        'intron_variant',
        'upstream_variant',
        'downstream_variant'
      ]
    },
    {
      hgnc_id: 'HGNC:20691',
      transcript_effects: ['upstream_variant']
    },
    {
      hgnc_id: 'HGNC:1100',
      transcript_effects: [
        'transcript_variant',
        'exon_variant',
        'splice_region_variant',
        'intron_variant',
        'upstream_variant',
        'downstream_variant'
      ]
    },
    {
      hgnc_id: 'HGNC:16919',
      transcript_effects: ['upstream_variant']
    }
  ]
}

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
    const store = useSvAcmgRatingStore()

    expect(store.storeState).toBe(StoreState.Initial)
    expect(store.acmgRating).toStrictEqual(new MultiSourceAcmgCriteriaCNVState('DEL'))
    expect(store.svRecord).toBe(null)
  })

  it('should clear state', () => {
    const store = useSvAcmgRatingStore()
    store.storeState = StoreState.Active
    store.acmgRating = JSON.parse(JSON.stringify({ acmg: 'rating' }))
    store.svRecord = JSON.parse(JSON.stringify(svRecord))

    store.clearData()

    expect(store.storeState).toBe(StoreState.Initial)
    expect(store.acmgRating).toStrictEqual(new MultiSourceAcmgCriteriaCNVState('DEL'))
    expect(store.svRecord).toBe(null)
  })

  it('should correctly retrieve data', async () => {
    const store = useSvAcmgRatingStore()
    fetchMocker.mockResponseOnce(JSON.stringify(ExampleAutoCNVResponse))

    await store.fetchAcmgRating(svRecord)

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
    expect(store.svRecord).toStrictEqual(JSON.parse(JSON.stringify(svRecord)))
  })

  it('should fail to load data with invalid request', async () => {
    // Disable error logging
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const store = useSvAcmgRatingStore()
    fetchMocker.mockResponseOnce(JSON.stringify({ foo: 'bar' }), { status: 400 })

    await store.fetchAcmgRating(svRecord)

    expect(store.storeState).toBe(StoreState.Error)
    expect(store.acmgRating).toStrictEqual(new MultiSourceAcmgCriteriaCNVState('DEL'))
    expect(store.svRecord).toBe(null)
  })

  it('should not load data if structure variant is the same', async () => {
    const store = useSvAcmgRatingStore()
    fetchMocker.mockResponse(JSON.stringify(ExampleAutoCNVResponse))
    await store.fetchAcmgRating(svRecord)

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
    expect(store.svRecord).toStrictEqual(JSON.parse(JSON.stringify(svRecord)))

    await store.fetchAcmgRating(store.svRecord as SmallVariant)

    expect(fetchMocker.mock.calls.length).toBe(1)
  })
})
