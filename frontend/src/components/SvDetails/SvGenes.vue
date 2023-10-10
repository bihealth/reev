<script setup lang="ts">
import { type ComputedRef, type Ref, computed, ref } from 'vue'

import VariantDetailsGene from '@/components/VariantDetails/VariantGene.vue'
import { roundIt } from '@/lib/utils'

/** `GeneInfo` is a type alias for easier future interface definition. */
type GeneInfo = any

const props = defineProps<{
  genesInfos?: GeneInfo[]
}>()

const currentGeneInfos: Ref<any> = ref(null)
const itemsPerPage = ref(10)

const headers = [
  {
    title: 'symbol',
    key: 'dbnsfp.gene_name',
    width: 150,
    sortable: true
  },
  {
    title: 'name',
    key: 'dbnsfp.gene_full_name',
    width: 200
  },
  {
    title: 'OMIM',
    key: 'omim',
    sortable: true
  },
  {
    title: 'Orphanet',
    key: 'orpha',
    sortable: true
  },
  {
    title: 'pLI',
    key: 'gnomad_constraints.pli',
    width: 50,
    sortable: true
  },
  {
    title: 'o/e LoF (upper)',
    key: 'gnomad_constraints.oe_lof_upper',
    width: 100,
    sortable: true
  },
  {
    title: 'P(HI)',
    width: 50,
    key: 'dbnsfp.haploinsufficiency'
  },
  {
    title: 'sHet',
    width: 100,
    key: 'shet.s_het',
    sortable: true
  },
  {
    title: 'pHaplo',
    width: 100,
    key: 'rcnv.p_haplo',
    sortable: true
  },
  {
    title: 'pTriplo',
    width: 100,
    key: 'rcnv.p_triplo',
    sortable: true
  },
  {
    title: 'CG haploin.',
    width: 100,
    key: 'clingen.haplo_summary'
  },
  {
    title: 'CG triploin.',
    width: 100,
    key: 'clingen.triplo_summary'
  }
]

/** Compute list of gene infos to protect against empty `props.genesInfos`. */
const items: ComputedRef<GeneInfo[]> = computed(() => {
  if (props.genesInfos) {
    const genesInfos = JSON.parse(JSON.stringify(props.genesInfos))
    for (const geneInfo of genesInfos) {
      if (geneInfo.clingen) {
        const haploLabels = new Map<number, string>()
        const triploLabels = new Map<number, string>()

        for (const diseaseRecord of geneInfo.clingen.disease_records) {
          if (diseaseRecord.dosage_haploinsufficiency_assertion?.length) {
            const val = parseInt(diseaseRecord.dosage_haploinsufficiency_assertion.split(' ')[0])
            haploLabels.set(val, diseaseRecord.dosage_haploinsufficiency_assertion)
          }
          if (diseaseRecord.dosage_triplosensitivity_assertion?.length) {
            const val = parseInt(diseaseRecord.dosage_triplosensitivity_assertion.split(' ')[0])
            triploLabels.set(val, diseaseRecord.dosage_triplosensitivity_assertion)
          }
        }

        if (haploLabels.size) {
          geneInfo.clingen.haplo_summary = Math.max(...haploLabels.keys())
          geneInfo.clingen.haplo_label = haploLabels.get(geneInfo.clingen.haplo_summary)
        } else {
          geneInfo.clingen.haplo_summary = null
          geneInfo.clingen.haplo_label = null
        }
        if (triploLabels.size) {
          geneInfo.clingen.triplo_summary = Math.max(...triploLabels.keys())
          geneInfo.clingen.triplo_label = triploLabels.get(geneInfo.clingen.triplo_summary)
        } else {
          geneInfo.clingen.triplo_summary = null
          geneInfo.clingen.triplo_label = null
        }
      }
    }
    return genesInfos
  } else {
    return []
  }
})

/** Show gene info on click. */
const onRowClicked = (event: Event, { item }: { item: GeneInfo }): void => {
  currentGeneInfos.value = item
}
</script>

<template>
  <div>
    <div style="max-width: 1300px">
      <v-data-table
        v-model:items-per-page="itemsPerPage"
        :headers="headers"
        :items="items"
        :loading="!items"
        buttons-pagination
        show-index
        item-key="gene_name"
        @click:row="onRowClicked"
      >
        <template v-slot:[`item.omim`]="{ value }">
          <template v-if="value?.omim_diseases?.length">
            <template v-for="(disease, idx) in value?.omim_diseases" :key="idx">
              <template v-if="idx > 0">, </template>
              <a
                :href="`https://www.omim.org/entry/${disease.omim_id.replace('OMIM:', '')}`"
                target="_blank"
              >
                {{ disease.label }}
              </a>
            </template>
          </template>
          <template v-else> &mdash; </template>
        </template>

        <template v-slot:[`item.orpha`]="{ value }">
          <template v-if="value?.orpha_diseases?.length">
            <template v-for="(disease, idx) in value?.orpha_diseases" :key="idx">
              <template v-if="idx > 0">, </template>
              <a
                :href="`https://www.orpha.net/consor/cgi-bin/OC_Exp.php?Expert=${disease.orpha_id.replace(
                  'ORPHA:',
                  ''
                )}`"
                target="_blank"
              >
                {{ disease.label }}
              </a>
            </template>
          </template>
          <template v-else> &mdash; </template>
        </template>

        <template v-slot:[`item.gnomad_constraints.pli`]="{ value }">
          <template v-if="value">
            <span v-html="roundIt(value, 3)" />
          </template>
          <template v-else> &mdash; </template>
        </template>

        <template v-slot:[`item.gnomad_constraints.oe_lof_upper`]="{ value }">
          <template v-if="value">
            <span v-html="roundIt(value, 3)" />
          </template>
          <template v-else> &mdash; </template>
        </template>

        <template v-slot:[`item.dbnsfp.haploinsufficiency`]="{ value }">
          <template v-if="value">
            <span v-html="roundIt(value, 3)" />
          </template>
          <template v-else> &mdash; </template>
        </template>

        <template v-slot:[`item.shet.s_het`]="{ value }">
          <template v-if="value">
            <span v-html="roundIt(value, 3)" />
          </template>
          <template v-else> &mdash; </template>
        </template>

        <template v-slot:[`item.rcnv.p_haplo`]="{ value }">
          <template v-if="value">
            <span v-html="roundIt(value, 3)"></span>
          </template>
          <template v-else> &mdash; </template>
        </template>

        <template v-slot:[`item.rcnv.p_triplo`]="{ value }">
          <template v-if="value">
            <span v-html="roundIt(value, 3)" />
          </template>
          <template v-else> &mdash; </template>
        </template>

        <template v-slot:[`item.clingen.haplo_summary`]="{ value }">
          <template v-if="value">
            <abbr :title="value">{{ value }}</abbr>
          </template>
          <template v-else> &mdash; </template>
        </template>

        <template v-slot:[`item.clingen.triplo_summary`]="{ value }">
          <template v-if="value">
            <abbr :title="value">{{ value }}</abbr>
          </template>
          <template v-else> &mdash; </template>
        </template>
      </v-data-table>
    </div>

    <div v-if="currentGeneInfos">
      <div
        class="ml-2 mr-2"
        style="font-weight: bolder; font-size: 120%; border-bottom: 1px solid #aaaaaa"
      >
        Gene Details: {{ currentGeneInfos.hgnc.symbol }}
      </div>
      <VariantDetailsGene :gene="currentGeneInfos" />
    </div>
    <div v-else class="text-muted text-center font-italic pt-2">
      Select gene in table above to see details.
    </div>
  </div>
</template>
