/**
 * Store for handling per-variant ACMG rating.
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'

import { API_INTERNAL_BASE_PREFIX } from '@/api/common'
import {
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

  /**
   * Capitalize the first letter of a string.
   *
   * @param string The string to capitalize.
   * @returns The capitalized string.
   */
  function capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1)
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
      // Go through the data and setPresense for each criteria
      for (const [criteriaId, value] of Object.entries(acmgRatingAutoCNVData)) {
        const criteriaIdKey = capitalizeFirstLetter(criteriaId)
        if (value === true) {
          acmgRating.value.setPresence(
            StateSourceCNV.AutoCNV,
            svRec.svType === 'DUP'
              ? AcmgCriteriaCNVGain[criteriaIdKey as keyof typeof AcmgCriteriaCNVGain]
              : AcmgCriteriaCNVLoss[criteriaIdKey as keyof typeof AcmgCriteriaCNVLoss],
            Presence.Present
          )
          acmgRating.value.setScore(
            StateSourceCNV.AutoCNV,
            svRec.svType === 'DUP'
              ? AcmgCriteriaCNVGain[criteriaIdKey as keyof typeof AcmgCriteriaCNVGain]
              : AcmgCriteriaCNVLoss[criteriaIdKey as keyof typeof AcmgCriteriaCNVLoss],
            0
          )
        } else {
          acmgRating.value.setPresence(
            StateSourceCNV.AutoCNV,
            svRec.svType === 'DUP'
              ? AcmgCriteriaCNVGain[criteriaIdKey as keyof typeof AcmgCriteriaCNVGain]
              : AcmgCriteriaCNVLoss[criteriaIdKey as keyof typeof AcmgCriteriaCNVLoss],
            Presence.Absent
          )
        }
      }
      svRecord.value = svRec
      storeState.value = StoreState.Active
    } catch (e) {
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
