import { describe, expect, it } from 'vitest'

import FreqsMitochondrial from '@/components/SeqvarDetails/FreqsCard/MitochondrialFreqs.vue'
import { type Seqvar } from '@/lib/genomicVars'
import { setupMountedComponents } from '@/lib/test-utils'

const seqvarInfo: Seqvar = {
  genomeBuild: 'grch37',
  chrom: '17',
  pos: 43044295,
  del: 'G',
  ins: 'A',
  userRepr: 'grch37-17-43044295-G-A'
}

const variantInfo = {
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
    const { wrapper } = await setupMountedComponents(
      { component: FreqsMitochondrial, template: false },
      {
        props: {
          seqVar: seqvarInfo,
          varAnnos: variantInfo
        }
      }
    )
    expect(wrapper.html()).toContain('HelixMTdb')
    expect(wrapper.html()).toContain('gnomAD-MT')
    const table = wrapper.find('table')
    expect(table.exists()).toBe(true)
  })

  it('renders the FreqsMitochondrial info with no helixmtdb', async () => {
    const variantInfoNoHelixmtdb: any = structuredClone(variantInfo)
    variantInfoNoHelixmtdb.helixmtdb = {}
    const { wrapper } = await setupMountedComponents(
      { component: FreqsMitochondrial, template: false },
      {
        props: {
          seqVar: seqvarInfo,
          varAnnos: variantInfoNoHelixmtdb
        }
      }
    )
    expect(wrapper.html()).toContain('HelixMTdb')
    expect(wrapper.html()).toContain('gnomAD-MT')
    const table = wrapper.find('table')
    expect(table.exists()).toBe(true)
  })

  it('renders the FreqsMitochondrial info with no gnomad-mtdna', async () => {
    const variantInfoNoGnomad: any = structuredClone(variantInfo)
    variantInfoNoGnomad['gnomad-mtdna'] = {}
    const { wrapper } = await setupMountedComponents(
      { component: FreqsMitochondrial, template: false },
      {
        props: {
          seqVar: seqvarInfo,
          varAnnos: variantInfoNoGnomad
        }
      }
    )
    expect(wrapper.html()).toContain('HelixMTdb')
    expect(wrapper.html()).toContain('gnomAD-MT')
    const table = wrapper.find('table')
    expect(table.exists()).toBe(true)
  })

  it.skip('renders the FreqsMitochondrial info with invalid data', async () => {
    const { wrapper } = await setupMountedComponents(
      { component: FreqsMitochondrial, template: false },
      {
        props: {
          seqVar: seqvarInfo,
          varAnnos: {}
        }
      }
    )
    console.log(wrapper.html())
    const alertIcon = wrapper.find('.mdi-alert-circle-outline')
    expect(alertIcon.exists()).toBe(true)
  })
})
