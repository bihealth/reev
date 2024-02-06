import type { Strucvar } from '@bihealth/reev-frontend-lib/lib/genomicVars'
import { setupMountedComponents } from '@bihealth/reev-frontend-lib/lib/testUtils'
import { StoreState } from '@bihealth/reev-frontend-lib/stores'
import { describe, expect, it, vi } from 'vitest'

import StrucvarClinsigCard from './StrucvarClinsigCard.vue'
import {
  AcmgCriteriaCNVLoss,
  MultiSourceAcmgCriteriaCNVState,
  Presence,
  StateSourceCNV
} from './constants'

/** Example stucture Variant */
const strucvarInfo: Strucvar = {
  genomeBuild: 'grch37',
  svType: 'DEL',
  chrom: '17',
  start: 41176312,
  stop: 41277500,
  userRepr: 'DEL-grch37-17-41176312-41277500'
}

/** Example structure Variant record */
const svRecord = {
  svType: 'DEL',
  chromosome: 'chr17',
  start: '41176312',
  end: '41277500',
  release: 'grch37',
  result: [
    {
      hgnc_id: 'HGNC:18315',
      transcript_effects: [
        'transcript_variant',
        'exon_variant',
        'splice_region_variant',
        'intron_variant',
        'upstream_variant',
        'downstream_variant'
      ]
    },
    {
      hgnc_id: 'HGNC:20691',
      transcript_effects: ['upstream_variant']
    },
    {
      hgnc_id: 'HGNC:1100',
      transcript_effects: [
        'transcript_variant',
        'exon_variant',
        'splice_region_variant',
        'intron_variant',
        'upstream_variant',
        'downstream_variant'
      ]
    },
    {
      hgnc_id: 'HGNC:16919',
      transcript_effects: ['upstream_variant']
    }
  ]
}

/** Local helper that performs store setup and selective stubbing. */
const makeWrapper = () => {
  const mockRetrieveAcmgRating = vi.fn().mockImplementation(async () => {})

  const acmgRating = new MultiSourceAcmgCriteriaCNVState('DEL')
  acmgRating.setPresence(StateSourceCNV.AutoCNV, AcmgCriteriaCNVLoss.Loss1A, Presence.Present)

  return setupMountedComponents(
    {
      component: StrucvarClinsigCard
    },
    {
      initialStoreState: {
        strucvarAcmgRating: {
          storeState: StoreState.Active,
          strucvar: structuredClone(strucvarInfo),
          acmgRating: acmgRating,
          fetchAcmgRating: mockRetrieveAcmgRating
        }
      },
      props: {
        svRecord: svRecord
      }
    }
  )
}

describe.concurrent('AcmgRating', async () => {
  it('renders the AcmgRating info', async () => {
    // arrange:
    const { wrapper } = await makeWrapper()

    // act: nothing, only test rendering

    // assert:
    expect(wrapper.text()).toContain('Uncertain significance')
    expect(wrapper.text()).toContain('Semi-Automated Pathogenicity Prediction')
  })

  it('shows swithces and buttons', async () => {
    // arrange:
    const { wrapper } = await makeWrapper()

    // act: nothing, only test rendering

    // assert:
    const switches = wrapper.findAllComponents({ name: 'VSwitch' })
    expect(switches.length).toBe(1)
    expect(wrapper.text()).toContain('Reset')
    expect(wrapper.text()).toContain('Documentation')
  })
})
