/**
 * Store for handling per-variant ACMG rating.
 */
import { type Strucvar } from '@bihealth/reev-frontend-lib/lib/genomicVars'
import { StoreState } from '@bihealth/reev-frontend-lib/stores'
import equal from 'fast-deep-equal'
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
} from '@/components/StrucvarClinsigCard/constants'

const API_BASE_URL = API_INTERNAL_BASE_PREFIX

export const useStrucvarAcmgRatingStore = defineStore('strucvarAcmgRating', () => {
  /** The current store state. */
  const storeState = ref<StoreState>(StoreState.Initial)

  /** The structural variant that acmgRating are handled for. */
  const strucvar = ref<Strucvar | undefined>(undefined)

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
    strucvar.value = undefined
  }

  /** Helper function to get Enum key based on Enum value.
   *
   * @param myEnum The enum to search in.
   * @param enumValue The enum value to search for.
   */
  function getEnumKeyByEnumValue<T extends { [index: string]: string }>(
    myEnum: T,
    enumValue: string
  ): keyof T | undefined {
    const keys = Object.keys(myEnum).filter((x) => myEnum[x] == enumValue)
    return keys.length > 0 ? keys[0] : undefined
  }

  /**
   * Load data from the server.
   *
   * @param strucvar$ The structural variant to use compute ACMG rating for.
   * @param forceReload Whether to force-reload in case the variant is the same.
   */
  const fetchAcmgRating = async (strucvar$: Strucvar, forceReload: boolean = false) => {
    // Protect against loading multiple times.
    if (
      !forceReload &&
      storeState.value !== StoreState.Initial &&
      equal(strucvar$, strucvar.value)
    ) {
      return
    }

    // Clear against artifact
    clearData()

    // Init acmgCriteria
    acmgRating.value = new MultiSourceAcmgCriteriaCNVState(strucvar$.svType)

    // Load data from AutoCNV via API
    storeState.value = StoreState.Loading
    try {
      // Set presence for all criteria to absent and score to default
      if (strucvar$.svType === 'DUP') {
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
      } else if (strucvar$.svType === 'DEL') {
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
      const { chrom, start, stop, svType } = strucvar$
      const func = svType === 'DEL' ? 'del' : 'dup'
      const response = await fetch(
        `${API_BASE_URL}remote/cnv/acmg/?chromosome=${chrom}&start=${start}&end=${stop}&func=${func}`,
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
        if (strucvar$.svType === 'DUP') {
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
        } else if (strucvar$.svType === 'DEL') {
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

      strucvar.value = strucvar$
      storeState.value = StoreState.Active
    } catch (e) {
      clearData()
      storeState.value = StoreState.Error
      console.error('There was an error loading the ACMG data.', e)
    }
  }

  return {
    strucvar,
    storeState,
    acmgRating,
    clearData,
    fetchAcmgRating
  }
})
