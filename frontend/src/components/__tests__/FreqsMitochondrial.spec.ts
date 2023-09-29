import { describe, expect, it } from 'vitest'

import FreqsMitochondrial from '@/components/VariantDetails/FreqsMitochondrial.vue'
import { setupMountedComponents } from '@/components/__tests__/utils'

const smallVariantInfo = {
  release: 'grch37',
  chromosome: 'chrM',
  start: '70',
  end: '70',
  reference: 'G',
  alternative: 'A',
  hgnc_id: 'HGNC:1100'
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
    const { wrapper } = setupMountedComponents(
      { component: FreqsMitochondrial, template: false },
      {
        props: {
          smallVar: smallVariantInfo,
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
    const { wrapper } = setupMountedComponents(
      { component: FreqsMitochondrial, template: false },
      {
        props: {
          smallVar: smallVariantInfo,
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
    const { wrapper } = setupMountedComponents(
      { component: FreqsMitochondrial, template: false },
      {
        props: {
          smallVar: smallVariantInfo,
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
    const { wrapper } = setupMountedComponents(
      { component: FreqsMitochondrial, template: false },
      {
        props: {
          smallVar: smallVariantInfo,
          varAnnos: {}
        }
      }
    )
    console.log(wrapper.html())
    const alertIcon = wrapper.find('.mdi-alert-circle-outline')
    expect(alertIcon.exists()).toBe(true)
  })
})
