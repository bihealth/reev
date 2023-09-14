<script setup lang="ts">
export interface Props {
  /** Gene information from annonars. */
  gene: any,
  /** Clinvar-Gene information from annonars. */
  geneClinvar: any
}

withDefaults(defineProps<Props>(), {
  gene: null
})

const variantImpactLabels = [
  "3' UTR",
  "5' UTR",
  'downstream',
  'frameshift',
  'inframe indel',
  'start lost',
  'intron',
  'missense',
  'non-coding',
  'stop gained',
  'no alteration',
  'splice acceptor',
  'splice donor',
  'stop lost',
  'synonymous',
  'upstream gene',
]

const clinsigLabels = [
  'pathogenic',
  'likely pathogenic',
  'uncertain significance',
  'likely benign',
  'benign',
]

const clinsigColor = ['#b05454', '#f59f9f', '#f5c964', '#a3f56c', '#5d9936']
</script>

<template>
  <div id="hgnc" class="gene-item">
    <h3>HGNC</h3>
    <v-divider></v-divider>
    <div>
      <div>
        <strong>symbol:</strong>
        {{ $props.gene?.hgnc?.symbol }}
      </div>
      <div>
        <strong>name:</strong>
        {{ $props.gene?.hgnc?.name }}
      </div>
      <div>
        <strong>cytoband:</strong>
        {{ $props.gene?.hgnc?.location }}
      </div>
      <div>
        <strong>aliases:</strong>
        {{ $props.gene?.hgnc?.alias_name?.join(', ') }}
      </div>
      <div>
        <strong>synonyms:</strong>
        {{ $props.gene?.hgnc?.alias_symbol?.join(', ') }}
      </div>
    </div>
  </div>

  <v-divider></v-divider>
  <v-divider></v-divider>

  <div id="ncbi-summary" class="gene-item">
    <h3>NCBI Summary</h3>
    <v-divider></v-divider>
    <div>
      <div class="overflow-auto" style="max-height: 250px; font-size: 90%">
        {{ $props.gene?.ncbi?.summary }}
        <a :href="`https://www.ncbi.nlm.nih.gov/gene/672`" target="_blank">
          <v-icon>mdi-launch</v-icon>
          source
        </a>
      </div>
    </div>
  </div>

  <div class="col-6 mb-2 pl-2 pr-0">
    <div class="card h-100">
      <div class="card-header pl-2 pt-1 pb-1 pr-2">
        <span class="font-weight-bolder" style="font-size: 120%">
          ClinVar By Impact
        </span>
      </div>
      <div
        class="card-body pb-2 pt-2"
        v-if="geneClinvar?.per_impact_counts?.length"
      >
        <table class="table table-sm">
          <tr>
            <thead>
              <th>impact</th>
              <th v-for="i in [0, 1, 2, 3, 4]" :key="i">
                {{ clinsigLabels[i] }}
              </th>
              <th>total</th>
            </thead>
            <tbody>
              <tr v-for="row in geneClinvar?.per_impact_counts ?? []" :key="row">
                <td>
                  {{ variantImpactLabels[row.impact] }}
                </td>
                <td
                  v-for="(count, idx) in row.counts" :key="idx"
                  class="text-right"
                  :style="`background-color: ${clinsigColor[idx]}`"
                >
                  {{ count }}
                </td>
                <td class="text-right">
                  {{ row.counts.reduce((a: any, b: any) => a + b, 0) }}
                </td>
              </tr>
            </tbody>
          </tr>
        </table>
      </div>
      <div v-else class="text-muted text-center font-italic">
        No ClinVar data for gene.
      </div>
    </div>
  </div>
</template>

<style scoped="true">
.gene-item {
  margin: 15px;
}
</style>
