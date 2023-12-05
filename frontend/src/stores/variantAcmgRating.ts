/**
 * Store for handling per-variant ACMG rating.
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'

import { AcmgSeqVarClient } from '@/api/acmgseqvar'
import { API_INTERNAL_BASE_PREFIX } from '@/api/common'
import {
  ALL_ACMG_CRITERIA,
  AcmgCriteria,
  MultiSourceAcmgCriteriaState,
  Presence,
  StateSource
} from '@/lib/acmgSeqVar'
import { StoreState } from '@/stores/misc'

import { type SmallVariant } from './variantInfo'

const API_BASE_URL = API_INTERNAL_BASE_PREFIX

export interface AcmgRatingBackendCriteria {
  criteria: string
  presence: string
  evidence: string
}

export interface AcmgRatingBackend {
  criterias: AcmgRatingBackendCriteria[]
  comment: string
}

export const useVariantAcmgRatingStore = defineStore('variantAcmgRating', () => {
  /** The current store state. */
  const storeState = ref<StoreState>(StoreState.Initial)

  /** The small variant that acmgRating are handled for. */
  const smallVariant = ref<SmallVariant | null>(null)

  /** The small variants ACMG rating. */
  const acmgRating = ref<MultiSourceAcmgCriteriaState>(new MultiSourceAcmgCriteriaState())

  /** Status of the ACMG Rating on the server. */
  const acmgRatingStatus = ref<boolean>(false)

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
   * Transform the ACMG rating to the ACMG rating used in the
   * backend API.
   */
  function transformAcmgRating(): AcmgRatingBackend {
    const acmgRatingBackend: AcmgRatingBackend = {
      criterias: [],
      comment: ''
    }
    for (const criteriaKey of ALL_ACMG_CRITERIA) {
      const criteria = acmgRating.value.getCriteriaState(criteriaKey as AcmgCriteria)
      acmgRatingBackend.criterias.push({
        criteria: criteriaKey,
        presence: criteria.presence,
        evidence: criteria.evidenceLevel
      })
    }

    return acmgRatingBackend
  }

  /**
   * Retrieve the ACMG rating for a sequence variant.
   *
   * @param smallVar The sequence variant to retrieve the ACMG rating for.
   */
  const fetchAcmgRating = async (smallVar: SmallVariant) => {
    // Do not re-load data if the small variant is the same
    if (smallVar === smallVariant.value) {
      return
    }

    // Clear against artifact
    clearData()

    // Load data from InterVar via API
    storeState.value = StoreState.Loading

    // Fetch the ACMG rating from InterVar
    try {
      const release = smallVar.release === 'grch37' ? 'hg19' : 'hg38'
      const chromosome = smallVar.chromosome.replace('chr', '')
      const pos = smallVar.start
      const ref = smallVar.reference
      const alt = smallVar.alternative
      const response = await fetch(
        `${API_BASE_URL}remote/acmg/?release=${release}&chromosome=${chromosome}` +
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

    // Fetch the ACMG rating from the server
    try {
      const acmgSeqVarClient = new AcmgSeqVarClient()
      if (!smallVar) {
        throw new Error('There was an error loading the ACMG data.')
      }
      const acmgRatingBackend = await acmgSeqVarClient.fetchAcmgRating(
        smallVar.chromosome +
          ':' +
          smallVar.start +
          ':' +
          smallVar.reference +
          ':' +
          smallVar.alternative
      )
      if (acmgRatingBackend && acmgRatingBackend.detail !== 'ACMG Sequence Variant not found') {
        acmgRatingStatus.value = true
        // Go through the data and setPresense for each criteria
        for (const criteria of acmgRatingBackend.acmg_rank.criterias) {
          const criteriaKey = capitalizeFirstLetter(criteria.criteria) as keyof typeof AcmgCriteria
          acmgRating.value.setPresence(
            StateSource.Server,
            AcmgCriteria[criteriaKey],
            criteria.presence
          )
          acmgRating.value.setEvidenceLevel(
            StateSource.Server,
            AcmgCriteria[criteriaKey],
            criteria.evidence
          )
        }
      }
      return
    } catch (e) {
      console.error('There was an error loading the ACMG data.', e)
      clearData()
      storeState.value = StoreState.Error
    }
  }

  /**
   * Save the ACMG rating for a variant.
   *
   * @param variantName The variant to save the ACMG rating for.
   * @param acmgRating The ACMG rating to save.
   * @returns The saved ACMG rating.
   */
  const saveAcmgRating = async () => {
    if (!smallVariant.value) {
      console.error('There was an error saving the ACMG rating.')
      return
    }
    const variantName =
      smallVariant.value.chromosome +
      ':' +
      smallVariant.value.start +
      ':' +
      smallVariant.value.reference +
      ':' +
      smallVariant.value.alternative
    const acmgRating = transformAcmgRating()
    if (!variantName || !acmgRating) {
      console.error('There was an error saving the ACMG rating.')
      return
    }

    try {
      const acmgSeqVarClient = new AcmgSeqVarClient()
      const acmgSeqVar = await acmgSeqVarClient.fetchAcmgRating(variantName)
      if (acmgSeqVar && acmgSeqVar.detail !== 'ACMG Sequence Variant not found') {
        await acmgSeqVarClient.updateAcmgRating(variantName, acmgRating)
      } else {
        await acmgSeqVarClient.saveAcmgRating(variantName, acmgRating)
      }
      acmgRatingStatus.value = true
    } catch (e) {
      console.error('There was an error saving the ACMG rating.', e)
    }
  }

  /**
   * Delete the ACMG rating for a variant.
   *
   * @param variantName The variant to delete the ACMG rating for.
   * @returns The deleted ACMG rating.
   */
  const deleteAcmgRating = async () => {
    if (!smallVariant.value) {
      console.error('There was an error saving the ACMG rating.')
      return
    }
    const variantName =
      smallVariant.value?.chromosome +
      ':' +
      smallVariant.value?.start +
      ':' +
      smallVariant.value?.reference +
      ':' +
      smallVariant.value?.alternative
    if (!variantName) {
      console.error('There was an error deleting the ACMG rating.')
      return
    }

    try {
      const acmgSeqVarClient = new AcmgSeqVarClient()
      await acmgSeqVarClient.deleteAcmgRating(variantName)
      acmgRatingStatus.value = false
    } catch (e) {
      console.error('There was an error deleting the ACMG rating.', e)
    }
  }

  return {
    smallVariant,
    storeState,
    acmgRating,
    acmgRatingStatus,
    saveAcmgRating,
    deleteAcmgRating,
    clearData,
    fetchAcmgRating
  }
})
