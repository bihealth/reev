import { createTestingPinia } from '@pinia/testing'
import { describe, expect, it, vi } from 'vitest'

import AcmgRating from '@/components/SvDetails/AcmgRating.vue'
import {
  AcmgCriteriaCNVLoss,
  MultiSourceAcmgCriteriaCNVState,
  Presence,
  StateSourceCNV
} from '@/lib/acmgCNV'
import { setupMountedComponents } from '@/lib/test-utils'
import { StoreState } from '@/stores/misc'
import { useSvAcmgRatingStore } from '@/stores/svAcmgRating'

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

const makeWrapper = () => {
  const pinia = createTestingPinia({ createSpy: vi.fn() })
  const store = useSvAcmgRatingStore(pinia)

  const mockRetrieveAcmgRating = vi.fn().mockImplementation(async () => {
    store.storeState = StoreState.Active
    store.svRecord = JSON.parse(JSON.stringify(svRecord))
    store.acmgRating = new MultiSourceAcmgCriteriaCNVState('DEL')
    store.acmgRating.setPresence(
      StateSourceCNV.AutoCNV,
      AcmgCriteriaCNVLoss.Loss1A,
      Presence.Present
    )
  })
  store.setAcmgRating = mockRetrieveAcmgRating

  store.storeState = StoreState.Active
  store.svRecord = JSON.parse(JSON.stringify(svRecord))
  store.acmgRating = new MultiSourceAcmgCriteriaCNVState('DEL')
  store.acmgRating.setPresence(StateSourceCNV.AutoCNV, AcmgCriteriaCNVLoss.Loss1A, Presence.Present)

  return setupMountedComponents(
    {
      component: AcmgRating,
      template: true
    },
    {
      props: {
        svRecord: svRecord
      },
      pinia: pinia
    }
  ).wrapper
}

describe.concurrent('AcmgRating', async () => {
  it('renders the AcmgRating info', async () => {
    const wrapper = makeWrapper()
    expect(wrapper.text()).toContain('Uncertain significance')
    expect(wrapper.text()).toContain('Select all fulfilled criteria')
  })
})
