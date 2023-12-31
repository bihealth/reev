/**
 * Store for handling per-variant ACMG rating.
 */
import equal from 'fast-deep-equal'
import { defineStore } from 'pinia'
import { ref } from 'vue'

import { AcmgSeqVarClient } from '@/api/acmgseqvar'
import { InterVarClient } from '@/api/intervar'
import {
  ALL_ACMG_CRITERIA,
  AcmgCriteria,
  MultiSourceAcmgCriteriaState,
  Presence,
  StateSource
} from '@/lib/acmgSeqVar'
import { type Seqvar, seqvarImplFromSeqvar } from '@/lib/genomicVars'
import { StoreState } from '@/stores/misc'

export interface AcmgRatingBackendCriteria {
  criteria: string
  presence: string
  evidence: string
}

export interface AcmgRatingBackend {
  criterias: AcmgRatingBackendCriteria[]
  comment: string
}

export const useSeqVarAcmgRatingStore = defineStore('seqVarAcmgRating', () => {
  /** The current store state. */
  const storeState = ref<StoreState>(StoreState.Initial)

  /** The sequence variant that acmgRating are handled for. */
  const seqvar = ref<Seqvar | null>(null)

  /** The small variants ACMG rating. */
  const acmgRating = ref<MultiSourceAcmgCriteriaState>(new MultiSourceAcmgCriteriaState())

  /** All ACMG ratings for a user. */
  const acmgRatings = ref<any>([])

  /** Whether the ACMG rating could be loaded form InterVar. */
  const acmgRatingIntervarLoaded = ref<boolean>(false)

  /** Status of the ACMG Rating on the server. */
  const acmgRatingStatus = ref<boolean>(false)

  /**
   * Clear the data in the store.
   */
  function clearData() {
    storeState.value = StoreState.Initial
    acmgRating.value = new MultiSourceAcmgCriteriaState()
    seqvar.value = null
    acmgRatings.value = []
    acmgRatingIntervarLoaded.value = false
    acmgRatingStatus.value = false
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
   * @param seqvar$ The sequence variant to retrieve the ACMG rating for.
   * @param forceReload Whether to force-reload in case the variant is the same.
   */
  const fetchAcmgRating = async (seqvar$: Seqvar, forceReload: boolean = false) => {
    // Protect against loading multiple times.
    if (!forceReload && storeState.value !== StoreState.Initial && equal(seqvar$, seqvar.value)) {
      return
    }

    // Clear against artifact
    clearData()

    // Load data from InterVar via API
    storeState.value = StoreState.Loading

    // Fetch the ACMG rating from InterVar
    try {
      const client = new InterVarClient()
      const acmgRatingInterVarData = await client.fetchAcmgRating(seqvar$)
      // Go through the data and setPresense for each criteria
      for (const [criteriaId, value] of Object.entries(acmgRatingInterVarData)) {
        // Skip pp5 and bp6 criteria as they are not used anymore
        if (criteriaId === 'pp5' || criteriaId === 'bp6') {
          continue
        }
        const criteriaIdKey = criteriaId.toUpperCase() as keyof typeof AcmgCriteria
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
      seqvar.value = seqvar$
      storeState.value = StoreState.Active
      // Flag AMCG rating as coming from the server.
      acmgRatingIntervarLoaded.value = true
    } catch (e) {
      // In case of errors, we do not want to block the user from doing anything.
      // We just do not set `acmgRatingIntervarLoaded` to true.
    }

    // Fetch the ACMG rating from the server
    try {
      const acmgSeqVarClient = new AcmgSeqVarClient()
      if (!seqvar$) {
        throw new Error('There was an error loading the ACMG data from the server.')
      }
      const acmgRatingBackend = await acmgSeqVarClient.fetchAcmgRating(
        seqvar$.chrom + ':' + seqvar$.pos + ':' + seqvar$.del + ':' + seqvar$.ins
      )
      if (acmgRatingBackend.acmg_rank?.criterias) {
        acmgRatingStatus.value = true
        // Go through the data and setPresense for each criteria
        for (const criteria of acmgRatingBackend.acmg_rank.criterias) {
          const criteriaKey = criteria.criteria as keyof typeof AcmgCriteria
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
      clearData()
      storeState.value = StoreState.Error
      throw new Error(`There was an error loading the ACMG data from the server: ${e}`)
    }
  }

  /**
   * List all ACMG ratings for a user.
   *
   * @returns The list of ACMG ratings for the user.
   */
  const listAcmgRatings = async () => {
    try {
      const acmgSeqVarClient = new AcmgSeqVarClient()
      const data = await acmgSeqVarClient.listAcmgRatings()
      acmgRatings.value = data
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
    if (!seqvar.value) {
      throw new Error('Cannot save ACMG rating without a variant.')
    }
    const seqvarImpl = seqvarImplFromSeqvar(seqvar.value)
    const acmgRating = transformAcmgRating()

    try {
      const acmgSeqVarClient = new AcmgSeqVarClient()
      const acmgSeqVar = await acmgSeqVarClient.fetchAcmgRating(seqvarImpl.toName())
      if (acmgSeqVar && acmgSeqVar.detail !== 'ACMG Sequence Variant not found') {
        await acmgSeqVarClient.updateAcmgRating(seqvarImpl.toName(), acmgRating)
      } else {
        await acmgSeqVarClient.saveAcmgRating(seqvarImpl.toName(), acmgRating)
      }
      acmgRatingStatus.value = true
    } catch (e) {
      throw new Error(`There was an error saving the ACMG data: ${e}`)
    }
  }

  /**
   * Delete the ACMG rating for a variant.
   *
   * @param variantName The variant to delete the ACMG rating for.
   * @returns The deleted ACMG rating.
   */
  const deleteAcmgRating = async () => {
    if (!seqvar.value) {
      throw new Error('Cannot delete ACMG rating without a variant.')
    }
    const seqvarImpl = seqvarImplFromSeqvar(seqvar.value)
    try {
      const acmgSeqVarClient = new AcmgSeqVarClient()
      await acmgSeqVarClient.deleteAcmgRating(seqvarImpl.toName())
      acmgRatingStatus.value = false
    } catch (e) {
      throw new Error(`There was an error deleting the ACMG data: ${e}`)
    }
  }

  return {
    seqvar,
    storeState,
    acmgRating,
    acmgRatings,
    acmgRatingStatus,
    acmgRatingIntervarLoaded,
    saveAcmgRating,
    deleteAcmgRating,
    clearData,
    fetchAcmgRating,
    listAcmgRatings
  }
})
