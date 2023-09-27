/**
 * Store for handling per-variant ACMG rating.
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'

import { StoreState } from '@/stores/misc'
import { API_BASE_PREFIX } from '@/api/common'
import { MultiSourceAcmgCriteriaState, StateSource, AcmgCriteria, Presence } from '@/lib/acmgSeqVar'
import { type SmallVariant } from './variantInfo'

const API_BASE_URL = API_BASE_PREFIX

export const useVariantAcmgRatingStore = defineStore('variantAcmgRating', () => {
  /** The current store state. */
  const storeState = ref<StoreState>(StoreState.Initial)

  /** The small variant that acmgRating are handled for. */
  const smallVariant = ref<SmallVariant | null>(null)

  /** The small variants ACMG rating. */
  const acmgRating = ref<MultiSourceAcmgCriteriaState>(new MultiSourceAcmgCriteriaState())

  /**
   * Clear the data in the store.
   */
  function clearData() {
    storeState.value = StoreState.Initial
    acmgRating.value = new MultiSourceAcmgCriteriaState()
    smallVariant.value = null
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
  const setAcmgRating = async (smallVar: SmallVariant) => {
    // Do not re-load data if the small variant is the same
    if (smallVar === smallVariant.value) {
      return
    }

    // Clear against artifact
    clearData()

    // Load data from InterVar via API
    storeState.value = StoreState.Loading
    try {
      const release = smallVar.release === 'grch37' ? 'hg19' : 'hg38'
      const chromosome = smallVar.chromosome.replace('chr', '')
      const pos = smallVar.start
      const ref = smallVar.reference
      const alt = smallVar.alternative
      const response = await fetch(
        `${API_BASE_URL}internal/remote/acmg/?release=${release}&chromosome=${chromosome}` +
          `&position=${pos}&reference=${ref}&alternative=${alt}`,
        { method: 'GET' }
      )
      if (!response.ok) {
        throw new Error('There was an error loading the ACMG data.')
      }
      const acmgRatingInterVarData = await response.json()
      // Go through the data and setPresense for each criteria
      for (const [criteriaId, value] of Object.entries(acmgRatingInterVarData)) {
        const criteriaIdKey = capitalizeFirstLetter(criteriaId) as keyof typeof AcmgCriteria
        if (value === true) {
          acmgRating.value.setPresence(
            StateSource.InterVar,
            AcmgCriteria[criteriaIdKey],
            Presence.Present
          )
        } else {
          acmgRating.value.setPresence(
            StateSource.InterVar,
            AcmgCriteria[criteriaIdKey],
            Presence.Absent
          )
        }
      }
      smallVariant.value = smallVar
      storeState.value = StoreState.Active
    } catch (e) {
      console.error('There was an error loading the ACMG data.', e)
      clearData()
      storeState.value = StoreState.Error
    }
  }

  return {
    smallVariant,
    storeState,
    acmgRating,
    clearData,
    setAcmgRating
  }
})
