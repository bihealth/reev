import { describe, expect, it } from 'vitest'

import FreqsMitochondrial from '@/components/SeqvarDetails/FreqsCard/MitochondrialFreqs.vue'
import { type Seqvar } from '@/lib/genomicVars'
import { setupMountedComponents } from '@/lib/testUtils'

/** Example Sequence Variant */
const seqvarInfo: Seqvar = {
  genomeBuild: 'grch37',
  chrom: '17',
  pos: 43044295,
  del: 'G',
  ins: 'A',
  userRepr: 'grch37-17-43044295-G-A'
}

/** Example Sequence Variant Data */
const varAnnos = {
  helixmtdb: {
    num_total: 1,
    num_het: 1,
    num_hom: 0
  },
  'gnomad-mtdna': {
    an: 0,
    ac_het: 0,
    ac_hom: 0
  },
  mtdna: {
    an: 0,
    ac_het: 0,
    ac_hom: 0
  }
}

describe.concurrent('FreqsMitochondrial', async () => {
  it('renders the FreqsMitochondrial info', async () => {
    // arrange:
    const { wrapper } = await setupMountedComponents(
      { component: FreqsMitochondrial },
      {
        props: {
          seqVar: seqvarInfo,
          varAnnos
        }
      }
    )

    // act: nothing, only test rendering

    // assert:
    expect(wrapper.html()).toContain('HelixMTdb')
    expect(wrapper.html()).toContain('gnomAD-MT')
    const table = wrapper.find('table')
    expect(table.exists()).toBe(true)
  })

  it('renders the FreqsMitochondrial info with no helixmtdb', async () => {
    // arrange:
    const variantInfoNoHelixmtdb: any = structuredClone(seqvarInfo)
    variantInfoNoHelixmtdb.helixmtdb = {}
    const { wrapper } = await setupMountedComponents(
      { component: FreqsMitochondrial },
      {
        props: {
          seqVar: seqvarInfo,
          varAnnos: variantInfoNoHelixmtdb
        }
      }
    )

    // act: nothing, only test rendering

    // assert:
    expect(wrapper.html()).toContain('HelixMTdb')
    expect(wrapper.html()).toContain('gnomAD-MT')
    const table = wrapper.find('table')
    expect(table.exists()).toBe(true)
  })

  it('renders the FreqsMitochondrial info with no gnomad-mtdna', async () => {
    // arrange:
    const variantInfoNoGnomad: any = structuredClone(seqvarInfo)
    variantInfoNoGnomad['gnomad-mtdna'] = {}
    const { wrapper } = await setupMountedComponents(
      { component: FreqsMitochondrial },
      {
        props: {
          seqVar: seqvarInfo,
          varAnnos: variantInfoNoGnomad
        }
      }
    )

    // act: nothing, only test rendering

    // assert:
    expect(wrapper.html()).toContain('HelixMTdb')
    expect(wrapper.html()).toContain('gnomAD-MT')
    const table = wrapper.find('table')
    expect(table.exists()).toBe(true)
  })

  it('renders the FreqsMitochondrial info with invalid data', async () => {
    // arrange:
    const { wrapper } = await setupMountedComponents(
      { component: FreqsMitochondrial },
      {
        props: {
          seqVar: seqvarInfo,
          varAnnos: {}
        }
      }
    )

    // act: nothing, only test rendering

    // assert:
    const alertIcon = wrapper.find('.mdi-alert-circle-outline')
    expect(alertIcon.exists()).toBe(true)
  })
})
