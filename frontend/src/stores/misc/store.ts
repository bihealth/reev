/**
 * Store for misc info such as the current version.
 */
import { StoreState } from '@bihealth/reev-frontend-lib/stores'
import { defineStore } from 'pinia'
import { ref } from 'vue'

import { MiscClient } from '@/api/misc'

/** Data Versions type */
interface DataVersions {
  alphamissense: string
  clingen_gene: string
  clingen_variant: string
  ensembl_37: string
  ensembl_38: string
  ensembl: string
  today: string
  dbnsfp: string
  dbscsnv: string
  cadd: string
  gnomad_constraints: string
  gnomad_mtdna: string
  gnomad_v2: string
  gnomad_v3: string
  gnomad_v4: string
  gnomad_sv: string
  gnomad_cnv4: string
  gnomad_sv4: string
  dbvar: string
  dgv: string
  dgv_gs: string
  exac_cnv: string
  g1k_svs: string
  helixmtdb: string
  ucsc_cons_37: string
  ucsc_cons_38: string
  ucsc_rmsk_37: string
  ucsc_rmsk_38: string
  ucsc_genomic_super_dups_37: string
  ucsc_genomic_super_dups_38: string
  ucsc_alt_seq_liftover_37: string
  ucsc_alt_seq_liftover_38: string
  ucsc_fix_seq_liftover_37: string
  ucsc_fix_seq_liftover_38: string
  refseq_37: string
  refseq_38: string
  dbsnp: string
  acmg_sf: string
  hpo: string
  orphadata: string
  patho_mms: string
  mehari_tx: string
  clinvar_release: string
  clinvar_version: string
  tracks: string
  refseq_fe_37: string
  refseq_fe_38: string
}

export const useMiscStore = defineStore('misc', () => {
  /* The current store state. */
  const storeState = ref<StoreState>(StoreState.Initial)

  /* The app version. */
  const appVersion = ref<string | null>(null)

  /* Data versions. */
  const dataVersions = ref<DataVersions | null>(null)

  // Initialize store, load version info.
  const initialize = async () => {
    storeState.value = StoreState.Loading
    try {
      const client = new MiscClient()
      appVersion.value = await client.fetchVersion()
      dataVersions.value = await client.fetchDataVersions()

      storeState.value = StoreState.Active
    } catch (e) {
      console.error('There was an error loading the app version.', e)
      storeState.value = StoreState.Error
    }
  }

  return {
    storeState,
    appVersion,
    dataVersions,
    initialize
  }
})
