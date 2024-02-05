import { describe, expect, it } from 'vitest'

import {
  AcmgCriteria,
  AcmgEvidenceLevel,
  MultiSourceAcmgCriteriaState,
  Presence,
  StateSource
} from './acmgSeqvar'

describe.concurrent('MultiSourceAcmgCriteriaState', () => {
  it('should have correct default values', () => {
    // arrange: nothing, only test check

    // act:
    const AcmgCriteriaState = new MultiSourceAcmgCriteriaState()

    // assert:
    // Check keys of AcmgCriteriaState.criteriaStates
    expect(Object.keys(AcmgCriteriaState.criteriaStates).length).toEqual(4)
    expect(AcmgCriteriaState.criteriaStates).toHaveProperty(StateSource.Default)
    expect(AcmgCriteriaState.criteriaStates).toHaveProperty(StateSource.InterVar)
    expect(AcmgCriteriaState.criteriaStates).toHaveProperty(StateSource.Server)
    expect(AcmgCriteriaState.criteriaStates).toHaveProperty(StateSource.User)

    // Check keys of AcmgCriteriaState.criteriaStates[StateSource.Default]
    expect(Object.keys(AcmgCriteriaState.criteriaStates[StateSource.Default]).length).toEqual(26)
    expect(AcmgCriteriaState.criteriaStates[StateSource.Default]).toHaveProperty(AcmgCriteria.PVS1)

    // Check keys of AcmgCriteriaState.criteriaStates[StateSource.InterVar]
    expect(Object.keys(AcmgCriteriaState.criteriaStates[StateSource.InterVar]).length).toEqual(26)
    expect(AcmgCriteriaState.criteriaStates[StateSource.InterVar]).toHaveProperty(AcmgCriteria.PVS1)

    // Check keys of AcmgCriteriaState.criteriaStates[StateSource.Server]
    expect(Object.keys(AcmgCriteriaState.criteriaStates[StateSource.Server]).length).toEqual(26)
    expect(AcmgCriteriaState.criteriaStates[StateSource.Server]).toHaveProperty(AcmgCriteria.PVS1)

    // Check keys of AcmgCriteriaState.criteriaStates[StateSource.User]
    expect(Object.keys(AcmgCriteriaState.criteriaStates[StateSource.User]).length).toEqual(26)
    expect(AcmgCriteriaState.criteriaStates[StateSource.User]).toHaveProperty(AcmgCriteria.PVS1)
  })

  it('should correctly get criteria state', () => {
    // arrange: nothing, only test check

    // act:
    const AcmgCriteriaState = new MultiSourceAcmgCriteriaState()

    // assert:
    expect(AcmgCriteriaState.getCriteriaState(AcmgCriteria.PVS1)).toEqual(
      AcmgCriteriaState.criteriaStates[StateSource.Default][AcmgCriteria.PVS1]
    )
  })

  it('should correctly get criteria state from interVar', () => {
    // arrange:
    const criteriaState = {
      criteria: AcmgCriteria.PVS1,
      presence: Presence.Present,
      evidenceLevel: AcmgEvidenceLevel.PathogenicVeryStrong
    }

    // act:
    const AcmgCriteriaState = new MultiSourceAcmgCriteriaState()
    AcmgCriteriaState.setPresence(StateSource.InterVar, AcmgCriteria.PVS1, Presence.Present)

    // assert:
    expect(AcmgCriteriaState.getCriteriaState(AcmgCriteria.PVS1)).toStrictEqual(criteriaState)
  })

  it('should correctly get criteria state from server', () => {
    // arrange:
    const criteriaState = {
      criteria: AcmgCriteria.PVS1,
      presence: Presence.Present,
      evidenceLevel: AcmgEvidenceLevel.PathogenicVeryStrong
    }

    // act:
    const AcmgCriteriaState = new MultiSourceAcmgCriteriaState()
    AcmgCriteriaState.setPresence(StateSource.Server, AcmgCriteria.PVS1, Presence.Present)

    // assert:
    expect(AcmgCriteriaState.getCriteriaState(AcmgCriteria.PVS1)).toStrictEqual(criteriaState)
  })

  it('should correctly get criteria state from server and InterVar', () => {
    // arrange:
    const criteriaState = {
      criteria: AcmgCriteria.PVS1,
      presence: Presence.Absent,
      evidenceLevel: AcmgEvidenceLevel.PathogenicVeryStrong
    }

    // act:
    const AcmgCriteriaState = new MultiSourceAcmgCriteriaState()
    AcmgCriteriaState.setPresence(StateSource.InterVar, AcmgCriteria.PVS1, Presence.Present)
    AcmgCriteriaState.setPresence(StateSource.Server, AcmgCriteria.PVS1, Presence.Absent)

    // assert:
    expect(AcmgCriteriaState.getCriteriaState(AcmgCriteria.PVS1)).toStrictEqual(criteriaState)
  })

  it('should correctly get criteria state with invalid request', () => {
    // arrange:
    const criteriaState = {
      criteria: 'invalid' as AcmgCriteria,
      presence: Presence.Unknown,
      evidenceLevel: AcmgEvidenceLevel.NotSet
    }

    // act:
    const AcmgCriteriaState = new MultiSourceAcmgCriteriaState()

    // assert:
    expect(AcmgCriteriaState.getCriteriaState('invalid' as AcmgCriteria)).toStrictEqual(
      criteriaState
    )
  })

  it('should correctly get criteria state from default source', () => {
    // arrange:
    const criteriaState = {
      criteria: AcmgCriteria.PVS1,
      presence: Presence.Unknown,
      evidenceLevel: AcmgEvidenceLevel.PathogenicVeryStrong
    }

    // act:
    const AcmgCriteriaState = new MultiSourceAcmgCriteriaState()

    // assert:
    expect(
      AcmgCriteriaState.getCriteriaStateFromSource(AcmgCriteria.PVS1, StateSource.Default)
    ).toStrictEqual(criteriaState)
  })

  it('should correctly get criteria state from interVar source', () => {
    // arrange:
    const criteriaState = {
      criteria: AcmgCriteria.PVS1,
      presence: Presence.Present,
      evidenceLevel: AcmgEvidenceLevel.NotSet
    }

    // act:
    const AcmgCriteriaState = new MultiSourceAcmgCriteriaState()
    AcmgCriteriaState.setPresence(StateSource.InterVar, AcmgCriteria.PVS1, Presence.Present)

    // assert:
    expect(
      AcmgCriteriaState.getCriteriaStateFromSource(AcmgCriteria.PVS1, StateSource.InterVar)
    ).toStrictEqual(criteriaState)
  })

  it('should correctly get criteria state from server source', () => {
    // arrange:
    const criteriaState = {
      criteria: AcmgCriteria.PVS1,
      presence: Presence.Present,
      evidenceLevel: AcmgEvidenceLevel.NotSet
    }

    // act:
    const AcmgCriteriaState = new MultiSourceAcmgCriteriaState()
    AcmgCriteriaState.setPresence(StateSource.Server, AcmgCriteria.PVS1, Presence.Present)

    // assert:
    expect(
      AcmgCriteriaState.getCriteriaStateFromSource(AcmgCriteria.PVS1, StateSource.Server)
    ).toStrictEqual(criteriaState)
  })

  it('should correctly get criteria state from user source', () => {
    // arrange:
    const criteriaState = {
      criteria: AcmgCriteria.PVS1,
      presence: Presence.Present,
      evidenceLevel: AcmgEvidenceLevel.NotSet
    }

    // act:
    const AcmgCriteriaState = new MultiSourceAcmgCriteriaState()
    AcmgCriteriaState.setPresence(StateSource.User, AcmgCriteria.PVS1, Presence.Present)

    // assert:
    expect(
      AcmgCriteriaState.getCriteriaStateFromSource(AcmgCriteria.PVS1, StateSource.User)
    ).toStrictEqual(criteriaState)
  })

  it('should throw error if getting invalid criteria from source', () => {
    // arrange: nothing, only test check

    // act:
    const AcmgCriteriaState = new MultiSourceAcmgCriteriaState()

    // assert:
    expect(() =>
      AcmgCriteriaState.getCriteriaStateFromSource('invalid' as AcmgCriteria, StateSource.User)
    ).toThrowError()
  })

  it('should correctly set presence for InterVar', () => {
    // arrange: nothing, only test check

    // act:
    const AcmgCriteriaState = new MultiSourceAcmgCriteriaState()
    AcmgCriteriaState.setPresence(StateSource.InterVar, AcmgCriteria.PVS1, Presence.Present)

    // assert:
    expect(
      AcmgCriteriaState.criteriaStates[StateSource.InterVar][AcmgCriteria.PVS1].presence
    ).toEqual(Presence.Present)
    // Check that other sources are not affected
    expect(
      AcmgCriteriaState.criteriaStates[StateSource.Default][AcmgCriteria.PVS1].presence
    ).toEqual(Presence.Unknown)
    expect(AcmgCriteriaState.criteriaStates[StateSource.User][AcmgCriteria.PVS1].presence).toEqual(
      Presence.Unknown
    )
  })

  it('should correctly set presence for Server', () => {
    // arrange: nothing, only test check

    // act:
    const AcmgCriteriaState = new MultiSourceAcmgCriteriaState()
    AcmgCriteriaState.setPresence(StateSource.Server, AcmgCriteria.PVS1, Presence.Present)

    // assert:
    expect(
      AcmgCriteriaState.criteriaStates[StateSource.Server][AcmgCriteria.PVS1].presence
    ).toEqual(Presence.Present)
    // Check that other sources are not affected
    expect(
      AcmgCriteriaState.criteriaStates[StateSource.Default][AcmgCriteria.PVS1].presence
    ).toEqual(Presence.Unknown)
    expect(AcmgCriteriaState.criteriaStates[StateSource.User][AcmgCriteria.PVS1].presence).toEqual(
      Presence.Unknown
    )
  })

  it('should correctly set presence for User', () => {
    // arrange: nothing, only test check

    // act:
    const AcmgCriteriaState = new MultiSourceAcmgCriteriaState()
    AcmgCriteriaState.setPresence(StateSource.User, AcmgCriteria.PVS1, Presence.Present)

    // assert:
    expect(AcmgCriteriaState.criteriaStates[StateSource.User][AcmgCriteria.PVS1].presence).toEqual(
      Presence.Present
    )
    // Check that other sources are not affected
    expect(
      AcmgCriteriaState.criteriaStates[StateSource.Default][AcmgCriteria.PVS1].presence
    ).toEqual(Presence.Unknown)
    expect(
      AcmgCriteriaState.criteriaStates[StateSource.InterVar][AcmgCriteria.PVS1].presence
    ).toEqual(Presence.Unknown)
  })

  it('should raise error for setting present for Default', () => {
    // arrange: nothing, only test check

    // act:
    const AcmgCriteriaState = new MultiSourceAcmgCriteriaState()

    // assert:
    expect(() =>
      AcmgCriteriaState.setPresence(StateSource.Default, AcmgCriteria.PVS1, Presence.Present)
    ).toThrowError()
  })

  it('should correctly set absent presence for User', () => {
    // arrange: nothing, only test check

    // act:
    const AcmgCriteriaState = new MultiSourceAcmgCriteriaState()
    AcmgCriteriaState.setPresence(StateSource.User, AcmgCriteria.PVS1, Presence.Absent)
    expect(AcmgCriteriaState.criteriaStates[StateSource.User][AcmgCriteria.PVS1].presence).toEqual(
      Presence.Absent
    )
    // Set presence to absent
    AcmgCriteriaState.setUserPresenceAbsent()

    // assert:
    expect(AcmgCriteriaState.criteriaStates[StateSource.User][AcmgCriteria.PVS1].presence).toEqual(
      Presence.Absent
    )
  })

  it('should correctly set interVar presence for User', () => {
    // arrange: nothing, only test check

    // act:
    const AcmgCriteriaState = new MultiSourceAcmgCriteriaState()
    AcmgCriteriaState.setPresence(StateSource.User, AcmgCriteria.PVS1, Presence.Absent)
    AcmgCriteriaState.setPresence(StateSource.InterVar, AcmgCriteria.PVS1, Presence.Present)
    expect(AcmgCriteriaState.criteriaStates[StateSource.User][AcmgCriteria.PVS1].presence).toEqual(
      Presence.Absent
    )
    // Set presence to unknown
    AcmgCriteriaState.setUserPresenceInterVar()

    // assert:
    expect(AcmgCriteriaState.criteriaStates[StateSource.User][AcmgCriteria.PVS1].presence).toEqual(
      Presence.Present
    )
  })

  it('should correctly set server presence for User', () => {
    // arrange: nothing, only test check

    // act:
    const AcmgCriteriaState = new MultiSourceAcmgCriteriaState()
    AcmgCriteriaState.setPresence(StateSource.User, AcmgCriteria.PVS1, Presence.Absent)
    AcmgCriteriaState.setPresence(StateSource.Server, AcmgCriteria.PVS1, Presence.Present)
    expect(AcmgCriteriaState.criteriaStates[StateSource.User][AcmgCriteria.PVS1].presence).toEqual(
      Presence.Absent
    )
    // Set presence to unknown
    AcmgCriteriaState.setUserPresenceServer()

    // assert:
    expect(AcmgCriteriaState.criteriaStates[StateSource.User][AcmgCriteria.PVS1].presence).toEqual(
      Presence.Present
    )
  })

  it('should correctly set evidence level for user', () => {
    // arrange: nothing, only test check

    // act:
    const AcmgCriteriaState = new MultiSourceAcmgCriteriaState()
    AcmgCriteriaState.setEvidenceLevel(
      StateSource.User,
      AcmgCriteria.PVS1,
      AcmgEvidenceLevel.PathogenicModerate
    )

    // assert:
    expect(
      AcmgCriteriaState.criteriaStates[StateSource.User][AcmgCriteria.PVS1].evidenceLevel
    ).toEqual(AcmgEvidenceLevel.PathogenicModerate)
    // Check that other sources are not affected
    expect(
      AcmgCriteriaState.criteriaStates[StateSource.Default][AcmgCriteria.PVS1].evidenceLevel
    ).toEqual(AcmgEvidenceLevel.PathogenicVeryStrong)
    expect(
      AcmgCriteriaState.criteriaStates[StateSource.InterVar][AcmgCriteria.PVS1].evidenceLevel
    ).toEqual(AcmgEvidenceLevel.NotSet)
  })

  it('should correctly set evidence level for server', () => {
    // arrange: nothing, only test check

    // act:
    const AcmgCriteriaState = new MultiSourceAcmgCriteriaState()
    AcmgCriteriaState.setEvidenceLevel(
      StateSource.Server,
      AcmgCriteria.PVS1,
      AcmgEvidenceLevel.PathogenicModerate
    )

    // assert:
    expect(
      AcmgCriteriaState.criteriaStates[StateSource.Server][AcmgCriteria.PVS1].evidenceLevel
    ).toEqual(AcmgEvidenceLevel.PathogenicModerate)
    // Check that other sources are not affected
    expect(
      AcmgCriteriaState.criteriaStates[StateSource.Default][AcmgCriteria.PVS1].evidenceLevel
    ).toEqual(AcmgEvidenceLevel.PathogenicVeryStrong)
    expect(
      AcmgCriteriaState.criteriaStates[StateSource.InterVar][AcmgCriteria.PVS1].evidenceLevel
    ).toEqual(AcmgEvidenceLevel.NotSet)
  })

  it('should correctly set evidence level for interVar', () => {
    // arrange: nothing, only test check

    // act:
    const AcmgCriteriaState = new MultiSourceAcmgCriteriaState()
    AcmgCriteriaState.setEvidenceLevel(
      StateSource.InterVar,
      AcmgCriteria.PVS1,
      AcmgEvidenceLevel.PathogenicModerate
    )

    // assert:
    expect(
      AcmgCriteriaState.criteriaStates[StateSource.InterVar][AcmgCriteria.PVS1].evidenceLevel
    ).toEqual(AcmgEvidenceLevel.PathogenicModerate)
    // Check that other sources are not affected
    expect(
      AcmgCriteriaState.criteriaStates[StateSource.Default][AcmgCriteria.PVS1].evidenceLevel
    ).toEqual(AcmgEvidenceLevel.PathogenicVeryStrong)
    expect(
      AcmgCriteriaState.criteriaStates[StateSource.User][AcmgCriteria.PVS1].evidenceLevel
    ).toEqual(AcmgEvidenceLevel.NotSet)
  })

  it('should raise error for setting evidence level for Default', () => {
    // arrange: nothing, only test check

    // act:
    const AcmgCriteriaState = new MultiSourceAcmgCriteriaState()

    // assert:
    expect(() =>
      AcmgCriteriaState.setEvidenceLevel(
        StateSource.Default,
        AcmgCriteria.PVS1,
        AcmgEvidenceLevel.PathogenicModerate
      )
    ).toThrowError()
  })

  it('should correctly get States', () => {
    // arrange: nothing, only test check

    // act:
    const AcmgCriteriaState = new MultiSourceAcmgCriteriaState()
    const criteriaStates = AcmgCriteriaState.getStates()

    // assert:
    // Check keys of AcmgCriteriaState.criteriaStates
    expect(Object.keys(criteriaStates).length).toEqual(4)
    expect(criteriaStates).toHaveProperty(StateSource.Default)
    expect(criteriaStates).toHaveProperty(StateSource.InterVar)
    expect(criteriaStates).toHaveProperty(StateSource.Server)
    expect(criteriaStates).toHaveProperty(StateSource.User)

    // Check keys of AcmgCriteriaState.criteriaStates[StateSource.Default]
    expect(Object.keys(criteriaStates[StateSource.Default]).length).toEqual(26)
    expect(criteriaStates[StateSource.Default]).toHaveProperty(AcmgCriteria.PVS1)

    // Check keys of AcmgCriteriaState.criteriaStates[StateSource.InterVar]
    expect(Object.keys(criteriaStates[StateSource.InterVar]).length).toEqual(26)
    expect(criteriaStates[StateSource.InterVar]).toHaveProperty(AcmgCriteria.PVS1)

    // Check keys of AcmgCriteriaState.criteriaStates[StateSource.Server]
    expect(Object.keys(criteriaStates[StateSource.Server]).length).toEqual(26)
    expect(criteriaStates[StateSource.Server]).toHaveProperty(AcmgCriteria.PVS1)

    // Check keys of AcmgCriteriaState.criteriaStates[StateSource.User]
    expect(Object.keys(criteriaStates[StateSource.User]).length).toEqual(26)
    expect(criteriaStates[StateSource.User]).toHaveProperty(AcmgCriteria.PVS1)
  })

  it('should correctly get evidence counts', () => {
    // arrange: nothing, only test check

    // act:
    const AcmgCriteriaState = new MultiSourceAcmgCriteriaState()
    AcmgCriteriaState.setPresence(StateSource.InterVar, AcmgCriteria.PVS1, Presence.Present)
    AcmgCriteriaState.setPresence(StateSource.InterVar, AcmgCriteria.PS1, Presence.Present)
    AcmgCriteriaState.setPresence(StateSource.InterVar, AcmgCriteria.PM1, Presence.Present)
    AcmgCriteriaState.setPresence(StateSource.InterVar, AcmgCriteria.PM2, Presence.Present)
    AcmgCriteriaState.setPresence(StateSource.InterVar, AcmgCriteria.PP1, Presence.Present)
    AcmgCriteriaState.setPresence(StateSource.InterVar, AcmgCriteria.PP4, Presence.Present)
    AcmgCriteriaState.setPresence(StateSource.InterVar, AcmgCriteria.BA1, Presence.Present)
    AcmgCriteriaState.setPresence(StateSource.InterVar, AcmgCriteria.BP1, Presence.Present)
    AcmgCriteriaState.setPresence(StateSource.InterVar, AcmgCriteria.BS1, Presence.Present)
    AcmgCriteriaState.setPresence(StateSource.InterVar, AcmgCriteria.BS2, Presence.Present)
    AcmgCriteriaState.setPresence(StateSource.InterVar, AcmgCriteria.BS3, Presence.Present)

    // assert:
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

describe.concurrent(
  'MultiSourceAcmgCriteriaState ACMG class computation without user override',
  () => {
    // Parameters for testing:
    // PVS1, PS1, PS2, PM1, PM2, PM3, PP1, PP2, PP3, PP4
    it.each([
      [
        Presence.Present, // PVS1
        Presence.Present, // PS1
        Presence.Absent, // PS2
        Presence.Absent, // PM1
        Presence.Absent, // PM2
        Presence.Absent, // PM3
        Presence.Absent, // PP1
        Presence.Absent, // PP2
        Presence.Absent, // PP3
        Presence.Absent // PP4
      ],
      [
        Presence.Present, // PVS1
        Presence.Absent, // PS1
        Presence.Absent, // PS2
        Presence.Present, // PM1
        Presence.Present, // PM2
        Presence.Absent, // PM3
        Presence.Absent, // PP1
        Presence.Absent, // PP2
        Presence.Absent, // PP3
        Presence.Absent // PP4
      ],
      [
        Presence.Present, // PVS1
        Presence.Absent, // PS1
        Presence.Absent, // PS2
        Presence.Present, // PM1
        Presence.Absent, // PM2
        Presence.Absent, // PM3
        Presence.Present, // PP1
        Presence.Absent, // PP2
        Presence.Absent, // PP3
        Presence.Absent // PP4
      ],
      [
        Presence.Present, // PVS1
        Presence.Absent, // PS1
        Presence.Absent, // PS2
        Presence.Absent, // PM1
        Presence.Absent, // PM2
        Presence.Absent, // PM3
        Presence.Present, // PP1
        Presence.Present, // PP2
        Presence.Absent, // PP3
        Presence.Absent // PP4
      ],
      [
        Presence.Absent, // PVS1
        Presence.Present, // PS1
        Presence.Present, // PS2
        Presence.Absent, // PM1
        Presence.Absent, // PM2
        Presence.Absent, // PM3
        Presence.Absent, // PP1
        Presence.Absent, // PP2
        Presence.Absent, // PP3
        Presence.Absent // PP4
      ],
      [
        Presence.Absent, // PVS1
        Presence.Present, // PS1
        Presence.Absent, // PS2
        Presence.Present, // PM1
        Presence.Present, // PM2
        Presence.Present, // PM3
        Presence.Absent, // PP1
        Presence.Absent, // PP2
        Presence.Absent, // PP3
        Presence.Absent // PP4
      ],
      [
        Presence.Absent, // PVS1
        Presence.Present, // PS1
        Presence.Absent, // PS2
        Presence.Present, // PM1
        Presence.Present, // PM2
        Presence.Absent, // PM3
        Presence.Present, // PP1
        Presence.Present, // PP2
        Presence.Absent, // PP3
        Presence.Absent // PP4
      ],
      [
        Presence.Absent, // PVS1
        Presence.Present, // PS1
        Presence.Absent, // PS2
        Presence.Present, // PM1
        Presence.Absent, // PM2
        Presence.Absent, // PM3
        Presence.Present, // PP1
        Presence.Present, // PP2
        Presence.Present, // PP3
        Presence.Present // PP4
      ]
    ])(
      `should return 'Pathogenic' for 'PVS1: %s, PS1: %s, PS2: %s, PM1: %s, PM2: %s, PM3: %s,
  PM4: %s, PP1: %s, PP2: %s, PP3: %s, PP4: %s' with no confclicts`,
      (pvs1, ps1, ps2, pm1, pm2, pm3, pp1, pp2, pp3, pp4) => {
        // arrange: nothing, only test check

        // act:
        const AcmgCriteriaState = new MultiSourceAcmgCriteriaState()
        AcmgCriteriaState.setPresence(StateSource.InterVar, AcmgCriteria.PVS1, pvs1)
        AcmgCriteriaState.setPresence(StateSource.InterVar, AcmgCriteria.PS1, ps1)
        AcmgCriteriaState.setPresence(StateSource.InterVar, AcmgCriteria.PS2, ps2)
        AcmgCriteriaState.setPresence(StateSource.InterVar, AcmgCriteria.PM1, pm1)
        AcmgCriteriaState.setPresence(StateSource.InterVar, AcmgCriteria.PM2, pm2)
        AcmgCriteriaState.setPresence(StateSource.InterVar, AcmgCriteria.PM3, pm3)
        AcmgCriteriaState.setPresence(StateSource.InterVar, AcmgCriteria.PP1, pp1)
        AcmgCriteriaState.setPresence(StateSource.InterVar, AcmgCriteria.PP2, pp2)
        AcmgCriteriaState.setPresence(StateSource.InterVar, AcmgCriteria.PP3, pp3)
        AcmgCriteriaState.setPresence(StateSource.InterVar, AcmgCriteria.PP4, pp4)

        // assert:
        expect(AcmgCriteriaState.getAcmgClass()).toEqual(['Pathogenic', false])
      }
    )

    it.each([
      [
        Presence.Present, // PVS1
        Presence.Absent, // PS1
        Presence.Absent, // PS2
        Presence.Present, // PM1
        Presence.Absent, // PM2
        Presence.Absent, // PM3
        Presence.Absent, // PP1
        Presence.Absent, // PP2
        Presence.Absent, // PP3
        Presence.Absent // PP4
      ],
      [
        Presence.Absent, // PVS1
        Presence.Present, // PS1
        Presence.Absent, // PS2
        Presence.Present, // PM1
        Presence.Absent, // PM2
        Presence.Absent, // PM3
        Presence.Absent, // PP1
        Presence.Absent, // PP2
        Presence.Absent, // PP3
        Presence.Absent // PP4
      ],
      [
        Presence.Absent, // PVS1
        Presence.Present, // PS1
        Presence.Absent, // PS2
        Presence.Present, // PM1
        Presence.Present, // PM2
        Presence.Absent, // PM3
        Presence.Absent, // PP1
        Presence.Absent, // PP2
        Presence.Absent, // PP3
        Presence.Absent // PP4
      ],
      [
        Presence.Absent, // PVS1
        Presence.Present, // PS1
        Presence.Absent, // PS2
        Presence.Absent, // PM1
        Presence.Absent, // PM2
        Presence.Absent, // PM3
        Presence.Present, // PP1
        Presence.Present, // PP2
        Presence.Absent, // PP3
        Presence.Absent // PP4
      ],
      [
        Presence.Absent, // PVS1
        Presence.Absent, // PS1
        Presence.Absent, // PS2
        Presence.Present, // PM1
        Presence.Present, // PM2
        Presence.Present, // PM3
        Presence.Absent, // PP1
        Presence.Absent, // PP2
        Presence.Absent, // PP3
        Presence.Absent // PP4
      ],
      [
        Presence.Absent, // PVS1
        Presence.Absent, // PS1
        Presence.Absent, // PS2
        Presence.Present, // PM1
        Presence.Present, // PM2
        Presence.Absent, // PM3
        Presence.Present, // PP1
        Presence.Present, // PP2
        Presence.Absent, // PP3
        Presence.Absent // PP4
      ],
      [
        Presence.Absent, // PVS1
        Presence.Absent, // PS1
        Presence.Absent, // PS2
        Presence.Present, // PM1
        Presence.Absent, // PM2
        Presence.Absent, // PM3
        Presence.Present, // PP1
        Presence.Present, // PP2
        Presence.Present, // PP3
        Presence.Present // PP4
      ]
    ])(
      `should return 'Likely pathogenic' for 'PVS1: %s, PS1: %s, PS2: %s, PM1: %s, PM2: %s, PM3: %s,
  PM4: %s, PP1: %s, PP2: %s, PP3: %s, PP4: %s' with no confclicts`,
      (pvs1, ps1, ps2, pm1, pm2, pm3, pp1, pp2, pp3, pp4) => {
        // arrange: nothing, only test check

        // act:
        const AcmgCriteriaState = new MultiSourceAcmgCriteriaState()
        AcmgCriteriaState.setPresence(StateSource.InterVar, AcmgCriteria.PVS1, pvs1)
        AcmgCriteriaState.setPresence(StateSource.InterVar, AcmgCriteria.PS1, ps1)
        AcmgCriteriaState.setPresence(StateSource.InterVar, AcmgCriteria.PS2, ps2)
        AcmgCriteriaState.setPresence(StateSource.InterVar, AcmgCriteria.PM1, pm1)
        AcmgCriteriaState.setPresence(StateSource.InterVar, AcmgCriteria.PM2, pm2)
        AcmgCriteriaState.setPresence(StateSource.InterVar, AcmgCriteria.PM3, pm3)
        AcmgCriteriaState.setPresence(StateSource.InterVar, AcmgCriteria.PP1, pp1)
        AcmgCriteriaState.setPresence(StateSource.InterVar, AcmgCriteria.PP2, pp2)
        AcmgCriteriaState.setPresence(StateSource.InterVar, AcmgCriteria.PP3, pp3)
        AcmgCriteriaState.setPresence(StateSource.InterVar, AcmgCriteria.PP4, pp4)

        // assert:
        expect(AcmgCriteriaState.getAcmgClass()).toEqual(['Likely pathogenic', false])
      }
    )

    // Parameters for testing:
    // Ba1, BS1, BS2, BP1, BP2
    it.each([
      [Presence.Present, Presence.Absent, Presence.Absent, Presence.Absent, Presence.Absent],
      [Presence.Absent, Presence.Present, Presence.Present, Presence.Absent, Presence.Absent],
      [Presence.Absent, Presence.Present, Presence.Present, Presence.Present, Presence.Absent]
    ])(
      `should return 'Benign' for 'BA1: %s, BS1: %s, BS2: %s, BP1: %s, BP2: %s' with no confclicts`,
      (ba1, bs1, bs2, bp1, bp2) => {
        // arrange: nothing, only test check

        // act:
        const AcmgCriteriaState = new MultiSourceAcmgCriteriaState()
        AcmgCriteriaState.setPresence(StateSource.InterVar, AcmgCriteria.BA1, ba1)
        AcmgCriteriaState.setPresence(StateSource.InterVar, AcmgCriteria.BS1, bs1)
        AcmgCriteriaState.setPresence(StateSource.InterVar, AcmgCriteria.BS2, bs2)
        AcmgCriteriaState.setPresence(StateSource.InterVar, AcmgCriteria.BP1, bp1)
        AcmgCriteriaState.setPresence(StateSource.InterVar, AcmgCriteria.BP2, bp2)

        // assert:
        expect(AcmgCriteriaState.getAcmgClass()).toEqual(['Benign', false])
      }
    )

    it.each([
      [Presence.Absent, Presence.Present, Presence.Absent, Presence.Present, Presence.Absent],
      [Presence.Absent, Presence.Absent, Presence.Absent, Presence.Present, Presence.Present]
    ])(
      `should return 'Likely benign' for 'BA1: %s, BS1: %s, BS2: %s, BP1: %s, BP2: %s' with no
    confclicts`,
      (ba1, bs1, bs2, bp1, bp2) => {
        // arrange: nothing, only test check

        // act:
        const AcmgCriteriaState = new MultiSourceAcmgCriteriaState()
        AcmgCriteriaState.setPresence(StateSource.InterVar, AcmgCriteria.BA1, ba1)
        AcmgCriteriaState.setPresence(StateSource.InterVar, AcmgCriteria.BS1, bs1)
        AcmgCriteriaState.setPresence(StateSource.InterVar, AcmgCriteria.BS2, bs2)
        AcmgCriteriaState.setPresence(StateSource.InterVar, AcmgCriteria.BP1, bp1)
        AcmgCriteriaState.setPresence(StateSource.InterVar, AcmgCriteria.BP2, bp2)

        // assert:
        expect(AcmgCriteriaState.getAcmgClass()).toEqual(['Likely benign', false])
      }
    )

    // Parameters for testing:
    // PM1, PP1, PP2, BS1, BP1
    it.each([
      [Presence.Present, Presence.Present, Presence.Present, Presence.Present, Presence.Absent],
      [Presence.Present, Presence.Absent, Presence.Absent, Presence.Absent, Presence.Absent],
      [Presence.Absent, Presence.Present, Presence.Present, Presence.Absent, Presence.Absent],
      [Presence.Absent, Presence.Present, Presence.Present, Presence.Present, Presence.Absent],
      [Presence.Absent, Presence.Present, Presence.Present, Presence.Absent, Presence.Present],
      [Presence.Absent, Presence.Absent, Presence.Absent, Presence.Absent, Presence.Absent]
    ])(
      `should return 'Uncertain significance' for 'PM1: %s, PP1: %s, PP2: %s, BS1: %s, BP1: %s'
    with no confclicts`,
      (pm1, pp1, pp2, bs1, bp1) => {
        // arrange: nothing, only test check

        // act:
        const AcmgCriteriaState = new MultiSourceAcmgCriteriaState()
        AcmgCriteriaState.setPresence(StateSource.InterVar, AcmgCriteria.PM1, pm1)
        AcmgCriteriaState.setPresence(StateSource.InterVar, AcmgCriteria.PP1, pp1)
        AcmgCriteriaState.setPresence(StateSource.InterVar, AcmgCriteria.PP2, pp2)
        AcmgCriteriaState.setPresence(StateSource.InterVar, AcmgCriteria.BS1, bs1)
        AcmgCriteriaState.setPresence(StateSource.InterVar, AcmgCriteria.BP1, bp1)

        // assert:
        expect(AcmgCriteriaState.getAcmgClass()).toEqual(['Uncertain significance', false])
      }
    )

    // Parameters for testing:
    // PVS1, PS1, PS2, BA1, BS1
    it.each([
      [Presence.Present, Presence.Present, Presence.Present, Presence.Present, Presence.Present]
    ])(
      `should return 'Conflicting' for 'PVS1: %s, PS1: %s, PS2: %s, BA1: %s, BS1: %s'
    with confclicts`,
      (pvs1, ps1, ps2, ba1, bs1) => {
        // arrange: nothing, only test check

        // act:
        const AcmgCriteriaState = new MultiSourceAcmgCriteriaState()
        AcmgCriteriaState.setPresence(StateSource.InterVar, AcmgCriteria.PVS1, pvs1)
        AcmgCriteriaState.setPresence(StateSource.InterVar, AcmgCriteria.PS1, ps1)
        AcmgCriteriaState.setPresence(StateSource.InterVar, AcmgCriteria.PS2, ps2)
        AcmgCriteriaState.setPresence(StateSource.InterVar, AcmgCriteria.BA1, ba1)
        AcmgCriteriaState.setPresence(StateSource.InterVar, AcmgCriteria.BS1, bs1)

        // assert:
        expect(AcmgCriteriaState.getAcmgClass()).toEqual(['Conflicting', true])
      }
    )
  }
)

describe.concurrent(
  'MultiSourceAcmgCriteriaState ACMG class computation with user override',
  () => {
    it(`should return 'Likely pathogenic' for PVS1 as Moderate and PS1`, () => {
      // arrange: nothing, only test check

      // act:
      const AcmgCriteriaState = new MultiSourceAcmgCriteriaState()
      // Set PVS1 and PS1 to present
      AcmgCriteriaState.setPresence(StateSource.User, AcmgCriteria.PVS1, Presence.Present)
      AcmgCriteriaState.setPresence(StateSource.InterVar, AcmgCriteria.PS1, Presence.Present)
      expect(AcmgCriteriaState.getAcmgClass()).toEqual(['Pathogenic', false])

      // Override PVS1 Evidence Level to Pathogenic Moderate
      AcmgCriteriaState.setEvidenceLevel(
        StateSource.User,
        AcmgCriteria.PVS1,
        AcmgEvidenceLevel.PathogenicModerate
      )

      // assert:
      // Expect to return 'Likely pathogenic'
      expect(AcmgCriteriaState.getAcmgClass()).toEqual(['Likely pathogenic', false])
    })

    it(`should return 'Likely benign' for Ba1 as Strong and Bs1 as Supporting`, () => {
      // arrange: nothing, only test check

      // act:
      const AcmgCriteriaState = new MultiSourceAcmgCriteriaState()
      // Set Ba1 and Bs1 to present
      AcmgCriteriaState.setPresence(StateSource.User, AcmgCriteria.BA1, Presence.Present)
      AcmgCriteriaState.setPresence(StateSource.InterVar, AcmgCriteria.BS1, Presence.Present)
      expect(AcmgCriteriaState.getAcmgClass()).toEqual(['Benign', false])

      // Override Ba1 Evidence Level to Benign Strong
      AcmgCriteriaState.setEvidenceLevel(
        StateSource.User,
        AcmgCriteria.BA1,
        AcmgEvidenceLevel.BenignStrong
      )
      // Override Bs1 Evidence Level to Benign Supporting
      AcmgCriteriaState.setEvidenceLevel(
        StateSource.User,
        AcmgCriteria.BS1,
        AcmgEvidenceLevel.BenignSupporting
      )

      // assert:
      // Expect to return 'Likely benign'
      expect(AcmgCriteriaState.getAcmgClass()).toEqual(['Likely benign', false])
    })
  }
)
