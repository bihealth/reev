/**
 * Store for handling per-variant ACMG rating.
 */
import { type Seqvar, seqvarImplFromSeqvar } from '@bihealth/reev-frontend-lib/lib/genomicVars'
import { StoreState } from '@bihealth/reev-frontend-lib/stores'
import equal from 'fast-deep-equal'
import { defineStore } from 'pinia'
import { ref } from 'vue'

import { AcmgSeqVarClient } from '@/api/acmgSeqvar'
import { InterVarClient } from '@/api/intervar'
import {
  ALL_ACMG_CRITERIA,
  AcmgCriteria,
  AcmgEvidenceLevel,
  MultiSourceAcmgCriteriaState,
  Presence,
  StateSource
} from '@/lib/acmgSeqvar'

export interface AcmgRatingBackendCriteria {
  criteria: string
  presence: string
  evidence: string
}

export interface AcmgRatingBackend {
  criterias: AcmgRatingBackendCriteria[]
  comment: string
}

export const useSeqvarAcmgRatingStore = defineStore('seqvarAcmgRating', () => {
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

    // Set the variant
    seqvar.value = seqvar$

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
      const acmgSeqvarClient = new AcmgSeqVarClient()
      if (!seqvar$) {
        throw new Error('There was an error loading the ACMG data from the server.')
      }
      const seqvarImpl = seqvarImplFromSeqvar(seqvar$)
      const acmgRatingBackend = await acmgSeqvarClient.fetchAcmgRating(seqvarImpl)
      if (acmgRatingBackend === null) {
        return
      }
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
   * Refetch the server data.
   *
   * @param seqvar$ The sequence variant to retrieve the ACMG rating for.
   */
  const refetchAcmgRating = async (seqvar$: Seqvar) => {
    // Fetch the ACMG rating from the server
    try {
      const acmgSeqvarClient = new AcmgSeqVarClient()
      if (!seqvar$) {
        throw new Error('There was an error loading the ACMG data from the server.')
      }
      const seqvarImpl = seqvarImplFromSeqvar(seqvar$)
      const acmgRatingBackend = await acmgSeqvarClient.fetchAcmgRating(seqvarImpl)
      if (acmgRatingBackend === null) {
        return
      }
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
      const acmgSeqvarClient = new AcmgSeqVarClient()
      const data = await acmgSeqvarClient.listAcmgRatings()
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
    const acmgRatingServer = transformAcmgRating()

    try {
      const acmgSeqvarClient = new AcmgSeqVarClient()
      const acmgSeqvar = await acmgSeqvarClient.fetchAcmgRating(seqvarImpl)
      if (acmgSeqvar === null) {
        await acmgSeqvarClient.saveAcmgRating(seqvarImpl, acmgRatingServer)
      } else if (
        acmgSeqvar &&
        acmgSeqvar.detail !== 'ACMG Sequence Variant not found' &&
        acmgSeqvar.detail !== 'Not Found'
      ) {
        await acmgSeqvarClient.updateAcmgRating(seqvarImpl, acmgRatingServer)
      } else {
        await acmgSeqvarClient.saveAcmgRating(seqvarImpl, acmgRatingServer)
      }
      // Go through the data and setPresense for each criteria
      for (const criteria of acmgRatingServer.criterias) {
        const criteriaKey = criteria.criteria as keyof typeof AcmgCriteria
        acmgRating.value.setPresence(
          StateSource.Server,
          AcmgCriteria[criteriaKey],
          criteria.presence as Presence
        )
        acmgRating.value.setEvidenceLevel(
          StateSource.Server,
          AcmgCriteria[criteriaKey],
          criteria.evidence as AcmgEvidenceLevel
        )
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
      const acmgSeqvarClient = new AcmgSeqVarClient()
      await acmgSeqvarClient.deleteAcmgRating(seqvarImpl)
      // Go through the data and setPresense for each criteria
      for (const criteria of ALL_ACMG_CRITERIA) {
        acmgRating.value.setPresence(StateSource.Server, criteria, Presence.Unknown)
      }
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
    refetchAcmgRating,
    listAcmgRatings
  }
})
