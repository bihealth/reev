/**
 * Pinia store for handling per-variant ACMG rating.
 *
 * ## Store Dependencies
 *
 * - `caseDetailsStore`
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'

import { StoreState } from '@/stores/misc'

/** Alias definition of SmallVariant type; to be defined later. */
type SmallVariant = any
/** Alias definition of AcmgRating type; to be defined later. */
type AcmgRating = any

export const useVariantAcmgRatingStore = defineStore('variantAcmgRating', () => {
  /** The small variant that acmgRating are handled for. */
  const smallVariant = ref<SmallVariant | null>(null)

  /* The current store state. */
  const storeState = ref<StoreState>(StoreState.Initial)

  /** The small variants ACMG rating as fetched from API. */
  const acmgRating = ref<AcmgRating | null>(null)

  function clearData() {
    storeState.value = StoreState.Initial
    acmgRating.value = null
  }

  const createAcmgRating = async (smallVariant: SmallVariant, acmgRating: Object) => {
    console.log('createAcmgRating', smallVariant, acmgRating)
  }

  const retrieveAcmgRating = async (smallVariant: SmallVariant) => {
    console.log('retrieveAcmgRating', smallVariant)
  }

  const updateAcmgRating = async (acmgRating: Object) => {
    console.log('updateAcmgRating', acmgRating)
  }

  const deleteAcmgRating = async () => {
    console.log('deleteAcmgRating')
  }

  return {
    smallVariant,
    storeState,
    acmgRating,
    clearData,
    createAcmgRating,
    retrieveAcmgRating,
    updateAcmgRating,
    deleteAcmgRating
  }
})
