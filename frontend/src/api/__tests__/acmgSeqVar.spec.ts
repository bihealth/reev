import { describe, it, expect } from 'vitest'
import {
  MultiSourceAcmgCriteriaState,
  StateSource,
  Presence,
  AcmgCriteria,
  AcmgEvidenceLevel
} from '../acmgSeqVar'

describe.concurrent('MultiSourceAcmgCriteriaState', () => {
  it('should have correct default values', () => {
    const AcmgCriteriaState = new MultiSourceAcmgCriteriaState()
    // Check keys of AcmgCriteriaState.criteriaStates
    expect(Object.keys(AcmgCriteriaState.criteriaStates).length).toEqual(3)
    expect(AcmgCriteriaState.criteriaStates).toHaveProperty(StateSource.Default)
    expect(AcmgCriteriaState.criteriaStates).toHaveProperty(StateSource.InterVar)
    expect(AcmgCriteriaState.criteriaStates).toHaveProperty(StateSource.User)

    // Check keys of AcmgCriteriaState.criteriaStates[StateSource.Default]
    expect(Object.keys(AcmgCriteriaState.criteriaStates[StateSource.Default]).length).toEqual(28)
    expect(AcmgCriteriaState.criteriaStates[StateSource.Default]).toHaveProperty(AcmgCriteria.Pvs1)

    // Check keys of AcmgCriteriaState.criteriaStates[StateSource.InterVar]
    expect(Object.keys(AcmgCriteriaState.criteriaStates[StateSource.InterVar]).length).toEqual(28)
    expect(AcmgCriteriaState.criteriaStates[StateSource.InterVar]).toHaveProperty(AcmgCriteria.Pvs1)

    // Check keys of AcmgCriteriaState.criteriaStates[StateSource.User]
    expect(Object.keys(AcmgCriteriaState.criteriaStates[StateSource.User]).length).toEqual(28)
    expect(AcmgCriteriaState.criteriaStates[StateSource.User]).toHaveProperty(AcmgCriteria.Pvs1)
  })

  it('should correctly get criteria state', () => {
    const AcmgCriteriaState = new MultiSourceAcmgCriteriaState()
    expect(AcmgCriteriaState.getCriteriaState(AcmgCriteria.Pvs1)).toEqual(
      AcmgCriteriaState.criteriaStates[StateSource.Default][AcmgCriteria.Pvs1]
    )
  })

  it('should correctly get criteria state from interVar', () => {
    const AcmgCriteriaState = new MultiSourceAcmgCriteriaState()
    const criteriaState = {
      criteria: AcmgCriteria.Pvs1,
      presence: Presence.Present,
      evidenceLevel: AcmgEvidenceLevel.PathogenicVeryStrong
    }
    AcmgCriteriaState.setPresence(StateSource.InterVar, AcmgCriteria.Pvs1, Presence.Present)
    expect(AcmgCriteriaState.getCriteriaState(AcmgCriteria.Pvs1)).toStrictEqual(criteriaState)
  })

  it('should correctly get criteria state with invalid request', () => {
    const AcmgCriteriaState = new MultiSourceAcmgCriteriaState()
    const criteriaState = {
      criteria: 'invalid' as AcmgCriteria,
      presence: Presence.Unknown,
      evidenceLevel: AcmgEvidenceLevel.NotSet
    }
    expect(AcmgCriteriaState.getCriteriaState('invalid' as AcmgCriteria)).toStrictEqual(
      criteriaState
    )
  })

  it('should correctly get criteria state from default source', () => {
    const AcmgCriteriaState = new MultiSourceAcmgCriteriaState()
    const criteriaState = {
      criteria: AcmgCriteria.Pvs1,
      presence: Presence.Unknown,
      evidenceLevel: AcmgEvidenceLevel.PathogenicVeryStrong
    }
    expect(
      AcmgCriteriaState.getCriteriaStateFromSource(AcmgCriteria.Pvs1, StateSource.Default)
    ).toStrictEqual(criteriaState)
  })

  it('should correctly get criteria state from interVar source', () => {
    const AcmgCriteriaState = new MultiSourceAcmgCriteriaState()
    const criteriaState = {
      criteria: AcmgCriteria.Pvs1,
      presence: Presence.Present,
      evidenceLevel: AcmgEvidenceLevel.NotSet
    }
    AcmgCriteriaState.setPresence(StateSource.InterVar, AcmgCriteria.Pvs1, Presence.Present)
    expect(
      AcmgCriteriaState.getCriteriaStateFromSource(AcmgCriteria.Pvs1, StateSource.InterVar)
    ).toStrictEqual(criteriaState)
  })

  it('should correctly get criteria state from user source', () => {
    const AcmgCriteriaState = new MultiSourceAcmgCriteriaState()
    const criteriaState = {
      criteria: AcmgCriteria.Pvs1,
      presence: Presence.Present,
      evidenceLevel: AcmgEvidenceLevel.NotSet
    }
    AcmgCriteriaState.setPresence(StateSource.User, AcmgCriteria.Pvs1, Presence.Present)
    expect(
      AcmgCriteriaState.getCriteriaStateFromSource(AcmgCriteria.Pvs1, StateSource.User)
    ).toStrictEqual(criteriaState)
  })

  it('should throw error if getting invalid criteria from source', () => {
    const AcmgCriteriaState = new MultiSourceAcmgCriteriaState()
    expect(() =>
      AcmgCriteriaState.getCriteriaStateFromSource('invalid' as AcmgCriteria, StateSource.User)
    ).toThrowError()
  })

  it('should correctly set presence for InterVar', () => {
    const AcmgCriteriaState = new MultiSourceAcmgCriteriaState()
    AcmgCriteriaState.setPresence(StateSource.InterVar, AcmgCriteria.Pvs1, Presence.Present)
    expect(
      AcmgCriteriaState.criteriaStates[StateSource.InterVar][AcmgCriteria.Pvs1].presence
    ).toEqual(Presence.Present)
    // Check that other sources are not affected
    expect(
      AcmgCriteriaState.criteriaStates[StateSource.Default][AcmgCriteria.Pvs1].presence
    ).toEqual(Presence.Unknown)
    expect(AcmgCriteriaState.criteriaStates[StateSource.User][AcmgCriteria.Pvs1].presence).toEqual(
      Presence.Unknown
    )
  })

  it('should correctly set presence for User', () => {
    const AcmgCriteriaState = new MultiSourceAcmgCriteriaState()
    AcmgCriteriaState.setPresence(StateSource.User, AcmgCriteria.Pvs1, Presence.Present)
    expect(AcmgCriteriaState.criteriaStates[StateSource.User][AcmgCriteria.Pvs1].presence).toEqual(
      Presence.Present
    )
    // Check that other sources are not affected
    expect(
      AcmgCriteriaState.criteriaStates[StateSource.Default][AcmgCriteria.Pvs1].presence
    ).toEqual(Presence.Unknown)
    expect(
      AcmgCriteriaState.criteriaStates[StateSource.InterVar][AcmgCriteria.Pvs1].presence
    ).toEqual(Presence.Unknown)
  })

  it('should raise error for setting present for Default', () => {
    const AcmgCriteriaState = new MultiSourceAcmgCriteriaState()
    expect(() =>
      AcmgCriteriaState.setPresence(StateSource.Default, AcmgCriteria.Pvs1, Presence.Present)
    ).toThrowError()
  })

  it('should correctly set absent presence for User', () => {
    const AcmgCriteriaState = new MultiSourceAcmgCriteriaState()
    AcmgCriteriaState.setPresence(StateSource.User, AcmgCriteria.Pvs1, Presence.Absent)
    expect(AcmgCriteriaState.criteriaStates[StateSource.User][AcmgCriteria.Pvs1].presence).toEqual(
      Presence.Absent
    )
    // Set presence to absent
    AcmgCriteriaState.setUserPresenceAbsent()
    expect(AcmgCriteriaState.criteriaStates[StateSource.User][AcmgCriteria.Pvs1].presence).toEqual(
      Presence.Absent
    )
  })

  it('should correctly set interVar presence for User', () => {
    const AcmgCriteriaState = new MultiSourceAcmgCriteriaState()
    AcmgCriteriaState.setPresence(StateSource.User, AcmgCriteria.Pvs1, Presence.Absent)
    AcmgCriteriaState.setPresence(StateSource.InterVar, AcmgCriteria.Pvs1, Presence.Present)
    expect(AcmgCriteriaState.criteriaStates[StateSource.User][AcmgCriteria.Pvs1].presence).toEqual(
      Presence.Absent
    )
    // Set presence to unknown
    AcmgCriteriaState.setUserPresenceInterVar()
    expect(AcmgCriteriaState.criteriaStates[StateSource.User][AcmgCriteria.Pvs1].presence).toEqual(
      Presence.Present
    )
  })

  it('should correctly set evidence level for user', () => {
    const AcmgCriteriaState = new MultiSourceAcmgCriteriaState()
    AcmgCriteriaState.setEvidenceLevel(
      StateSource.User,
      AcmgCriteria.Pvs1,
      AcmgEvidenceLevel.PathogenicModerate
    )
    expect(
      AcmgCriteriaState.criteriaStates[StateSource.User][AcmgCriteria.Pvs1].evidenceLevel
    ).toEqual(AcmgEvidenceLevel.PathogenicModerate)
    // Check that other sources are not affected
    expect(
      AcmgCriteriaState.criteriaStates[StateSource.Default][AcmgCriteria.Pvs1].evidenceLevel
    ).toEqual(AcmgEvidenceLevel.PathogenicVeryStrong)
    expect(
      AcmgCriteriaState.criteriaStates[StateSource.InterVar][AcmgCriteria.Pvs1].evidenceLevel
    ).toEqual(AcmgEvidenceLevel.NotSet)
  })

  it('should correctly set evidence level for interVar', () => {
    const AcmgCriteriaState = new MultiSourceAcmgCriteriaState()
    AcmgCriteriaState.setEvidenceLevel(
      StateSource.InterVar,
      AcmgCriteria.Pvs1,
      AcmgEvidenceLevel.PathogenicModerate
    )
    expect(
      AcmgCriteriaState.criteriaStates[StateSource.InterVar][AcmgCriteria.Pvs1].evidenceLevel
    ).toEqual(AcmgEvidenceLevel.PathogenicModerate)
    // Check that other sources are not affected
    expect(
      AcmgCriteriaState.criteriaStates[StateSource.Default][AcmgCriteria.Pvs1].evidenceLevel
    ).toEqual(AcmgEvidenceLevel.PathogenicVeryStrong)
    expect(
      AcmgCriteriaState.criteriaStates[StateSource.User][AcmgCriteria.Pvs1].evidenceLevel
    ).toEqual(AcmgEvidenceLevel.NotSet)
  })

  it('should raise error for setting evidence level for Default', () => {
    const AcmgCriteriaState = new MultiSourceAcmgCriteriaState()
    expect(() =>
      AcmgCriteriaState.setEvidenceLevel(
        StateSource.Default,
        AcmgCriteria.Pvs1,
        AcmgEvidenceLevel.PathogenicModerate
      )
    ).toThrowError()
  })

  it('should correctly get States', () => {
    const AcmgCriteriaState = new MultiSourceAcmgCriteriaState()

    const criteriaStates = AcmgCriteriaState.getStates()
    // Check keys of AcmgCriteriaState.criteriaStates
    expect(Object.keys(criteriaStates).length).toEqual(3)
    expect(criteriaStates).toHaveProperty(StateSource.Default)
    expect(criteriaStates).toHaveProperty(StateSource.InterVar)
    expect(criteriaStates).toHaveProperty(StateSource.User)

    // Check keys of AcmgCriteriaState.criteriaStates[StateSource.Default]
    expect(Object.keys(criteriaStates[StateSource.Default]).length).toEqual(28)
    expect(criteriaStates[StateSource.Default]).toHaveProperty(AcmgCriteria.Pvs1)

    // Check keys of AcmgCriteriaState.criteriaStates[StateSource.InterVar]
    expect(Object.keys(criteriaStates[StateSource.InterVar]).length).toEqual(28)
    expect(criteriaStates[StateSource.InterVar]).toHaveProperty(AcmgCriteria.Pvs1)

    // Check keys of AcmgCriteriaState.criteriaStates[StateSource.User]
    expect(Object.keys(criteriaStates[StateSource.User]).length).toEqual(28)
    expect(criteriaStates[StateSource.User]).toHaveProperty(AcmgCriteria.Pvs1)
  })

  it('should correctly get evidence counts', () => {
    const AcmgCriteriaState = new MultiSourceAcmgCriteriaState()
    AcmgCriteriaState.setPresence(StateSource.InterVar, AcmgCriteria.Pvs1, Presence.Present)
    AcmgCriteriaState.setPresence(StateSource.InterVar, AcmgCriteria.Ps1, Presence.Present)
    AcmgCriteriaState.setPresence(StateSource.InterVar, AcmgCriteria.Pm1, Presence.Present)
    AcmgCriteriaState.setPresence(StateSource.InterVar, AcmgCriteria.Pm2, Presence.Present)
    AcmgCriteriaState.setPresence(StateSource.InterVar, AcmgCriteria.Pp1, Presence.Present)
    AcmgCriteriaState.setPresence(StateSource.InterVar, AcmgCriteria.Pp4, Presence.Present)
    AcmgCriteriaState.setPresence(StateSource.InterVar, AcmgCriteria.Ba1, Presence.Present)
    AcmgCriteriaState.setPresence(StateSource.InterVar, AcmgCriteria.Bp1, Presence.Present)
    AcmgCriteriaState.setPresence(StateSource.InterVar, AcmgCriteria.Bs1, Presence.Present)
    AcmgCriteriaState.setPresence(StateSource.InterVar, AcmgCriteria.Bs2, Presence.Present)
    AcmgCriteriaState.setPresence(StateSource.InterVar, AcmgCriteria.Bs3, Presence.Present)

    expect(
      AcmgCriteriaState.getActiveEvidenceCounts(AcmgEvidenceLevel.PathogenicVeryStrong)
    ).toEqual(1)
    expect(AcmgCriteriaState.getActiveEvidenceCounts(AcmgEvidenceLevel.PathogenicStrong)).toEqual(1)
    expect(AcmgCriteriaState.getActiveEvidenceCounts(AcmgEvidenceLevel.PathogenicModerate)).toEqual(
      2
    )
    expect(
      AcmgCriteriaState.getActiveEvidenceCounts(AcmgEvidenceLevel.PathogenicSupporting)
    ).toEqual(2)
    expect(AcmgCriteriaState.getActiveEvidenceCounts(AcmgEvidenceLevel.BenignSupporting)).toEqual(1)
    expect(AcmgCriteriaState.getActiveEvidenceCounts(AcmgEvidenceLevel.BenignStrong)).toEqual(3)
  })
})
