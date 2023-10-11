/**
 * Store for handling per-variant ACMG rating.
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'

import { API_INTERNAL_BASE_PREFIX } from '@/api/common'
import {
  ACMG_CRITERIA_CNV_DEFS,
  ACMG_CRITERIA_CNV_GAIN,
  ACMG_CRITERIA_CNV_LOSS,
  AcmgCriteriaCNVGain,
  AcmgCriteriaCNVLoss,
  MultiSourceAcmgCriteriaCNVState,
  Presence,
  StateSourceCNV
} from '@/lib/acmgCNV'
import { StoreState } from '@/stores/misc'
import { type SvRecord } from '@/stores/svInfo'

const API_BASE_URL = API_INTERNAL_BASE_PREFIX

export const useSvAcmgRatingStore = defineStore('svAcmgRating', () => {
  /** The current store state. */
  const storeState = ref<StoreState>(StoreState.Initial)

  /** The small variant that acmgRating are handled for. */
  const svRecord = ref<SvRecord | null>(null)

  /** The small variants ACMG rating. */
  const acmgRating = ref<MultiSourceAcmgCriteriaCNVState>(
    new MultiSourceAcmgCriteriaCNVState('DEL')
  )

  /**
   * Clear the data in the store.
   */
  function clearData() {
    storeState.value = StoreState.Initial
    acmgRating.value = new MultiSourceAcmgCriteriaCNVState('DEL')
    svRecord.value = null
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

  /**
   * Retrieve the ACMG rating for a small variant.
   *
   * @param smallVar The small variant to retrieve the ACMG rating for.
   */
  const setAcmgRating = async (svRec: SvRecord) => {
    // Do not re-load data if the small variant is the same
    if (svRec === svRecord.value) {
      return
    }

    // Clear against artifact
    clearData()

    // Init acmgCriteria
    acmgRating.value = new MultiSourceAcmgCriteriaCNVState(svRec.svType)

    // Load data from AutoCNV via API
    storeState.value = StoreState.Loading
    try {
      // Set presence for all criteria to absent and score to default
      if (svRec.svType === 'DUP') {
        for (const criteria of ACMG_CRITERIA_CNV_GAIN) {
          const criteriaKey = getEnumKeyByEnumValue(AcmgCriteriaCNVGain, criteria)
          acmgRating.value.setPresence(
            StateSourceCNV.AutoCNV,
            AcmgCriteriaCNVGain[criteriaKey as keyof typeof AcmgCriteriaCNVGain],
            Presence.Absent
          )
          const criteriaDef = ACMG_CRITERIA_CNV_DEFS.get(criteria)
          if (criteriaDef === undefined) {
            throw new Error('There was an error loading the ACMG data.')
          }
          acmgRating.value.setScore(
            StateSourceCNV.AutoCNV,
            AcmgCriteriaCNVGain[criteriaKey as keyof typeof AcmgCriteriaCNVGain],
            criteriaDef.defaultScore
          )
        }
        acmgRating.value.setUserToAutoCNV()
      } else if (svRec.svType === 'DEL') {
        for (const criteria of ACMG_CRITERIA_CNV_LOSS) {
          const criteriaKey = getEnumKeyByEnumValue(AcmgCriteriaCNVLoss, criteria)
          acmgRating.value.setPresence(
            StateSourceCNV.AutoCNV,
            AcmgCriteriaCNVLoss[criteriaKey as keyof typeof AcmgCriteriaCNVLoss],
            Presence.Absent
          )
          const criteriaDef = ACMG_CRITERIA_CNV_DEFS.get(criteria)
          if (criteriaDef === undefined) {
            throw new Error('There was an error loading the ACMG data.')
          }
          acmgRating.value.setScore(
            StateSourceCNV.AutoCNV,
            AcmgCriteriaCNVLoss[criteriaKey as keyof typeof AcmgCriteriaCNVLoss],
            criteriaDef.defaultScore
          )
        }
        acmgRating.value.setUserToAutoCNV()
      }

      // Retrieve ACMG rating from AutoCNV
      const chromosome = svRec.chromosome.replace('chr', '')
      const start = svRec.start
      const end = svRec.end
      const svType = svRec.svType === 'DUP' ? 'dup' : 'del'
      const response = await fetch(
        `${API_BASE_URL}remote/cnv/acmg/?chromosome=${chromosome}&start=${start}&end=${end}&func=${svType}`,
        { method: 'GET' }
      )
      if (!response.ok) {
        throw new Error('There was an error loading the ACMG data.')
      }
      const acmgRatingAutoCNVData = await response.json()

      // Go through the data and set Presense and Score for each criteria
      for (const [criteriaId, value] of Object.entries(
        acmgRatingAutoCNVData.job.result.auto_evidence_score
      )) {
        const score: number = +(value as string)
        if (svRec.svType === 'DUP') {
          const criteria = 'G' + criteriaId
          const criteriaKey = getEnumKeyByEnumValue(AcmgCriteriaCNVGain, criteria)
          acmgRating.value.setPresence(
            StateSourceCNV.AutoCNV,
            AcmgCriteriaCNVGain[criteriaKey as keyof typeof AcmgCriteriaCNVGain],
            Presence.Present
          )
          acmgRating.value.setScore(
            StateSourceCNV.AutoCNV,
            AcmgCriteriaCNVGain[criteriaKey as keyof typeof AcmgCriteriaCNVGain],
            score as number
          )
          acmgRating.value.setUserToAutoCNV()
        } else if (svRec.svType === 'DEL') {
          const criteria = 'L' + criteriaId
          const criteriaKey = getEnumKeyByEnumValue(AcmgCriteriaCNVLoss, criteria)
          acmgRating.value.setPresence(
            StateSourceCNV.AutoCNV,
            AcmgCriteriaCNVLoss[criteriaKey as keyof typeof AcmgCriteriaCNVLoss],
            Presence.Present
          )
          acmgRating.value.setScore(
            StateSourceCNV.AutoCNV,
            AcmgCriteriaCNVLoss[criteriaKey as keyof typeof AcmgCriteriaCNVLoss],
            score as number
          )
          acmgRating.value.setUserToAutoCNV()
        }
      }

      svRecord.value = svRec
      storeState.value = StoreState.Active
    } catch (e) {
      clearData()
      storeState.value = StoreState.Error
      console.error('There was an error loading the ACMG data.', e)
    }
  }

  return {
    svRecord,
    storeState,
    acmgRating,
    clearData,
    setAcmgRating
  }
})
