/**
 * Store for handling per-variant ACMG rating.
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'

import { StoreState } from '@/stores/misc'
import { API_BASE_PREFIX } from '@/api/common'

const API_BASE_URL = API_BASE_PREFIX

/** Alias definition of SmallVariant type; to be defined later. */
type SmallVariant = any
/** Alias definition of AcmgRating type; to be defined later. */
type AcmgRating = any

export const useVariantAcmgRatingStore = defineStore('variantAcmgRating', () => {
  /** The current store state. */
  const storeState = ref<StoreState>(StoreState.Initial)

  /** The small variant that acmgRating are handled for. */
  const smallVariant = ref<SmallVariant | null>(null)

  /** The small variants ACMG rating as fetched from API. */
  const acmgRatingInterVar = ref<AcmgRating | null>(null)

  /** The small variants ACMG rating updated by user */
  const acmgRatingCustom = ref<AcmgRating | null>(null)

  function clearData() {
    storeState.value = StoreState.Initial
    acmgRatingInterVar.value = null
    smallVariant.value = null
  }

  const retrieveAcmgRating = async (smallVar: SmallVariant) => {
    // Do not re-load data if the small variant is the same
    if (smallVar === smallVariant.value) {
      return
    }

    // Clear against artifact
    clearData()

    // Load data via API
    storeState.value = StoreState.Loading
    try {
      const release = smallVar.release === 'grch37' ? 'hg19' : 'hg38'
      const chromosome = smallVar.chromosome.replace('chr', '')
      const pos = smallVar.start
      const ref = smallVar.reference
      const alt = smallVar.alternative
      const response = await fetch(
        `${API_BASE_URL}acmg/?release=${release}&chromosome=${chromosome}` +
          `&position=${pos}&reference=${ref}&alternative=${alt}`,
        { method: 'GET' }
      )
      if (!response.ok) {
        throw new Error('There was an error loading the ACMG data.')
      }
      acmgRatingInterVar.value = await response.json()
      smallVariant.value = smallVar
      storeState.value = StoreState.Active
    } catch (e) {
      console.error('There was an error loading the ACMG data.', e)
      clearData()
      storeState.value = StoreState.Error
    }
  }

  const submitAcmgRating = async (smallVar: SmallVariant, payload: Object) => {
    // TODO: Implement the API call to submit the ACMG rating to ClinVar
    smallVariant.value = smallVar
    acmgRatingInterVar.value = payload
  }

  return {
    smallVariant,
    storeState,
    acmgRatingInterVar,
    acmgRatingCustom,
    clearData,
    retrieveAcmgRating,
    submitAcmgRating
  }
})
