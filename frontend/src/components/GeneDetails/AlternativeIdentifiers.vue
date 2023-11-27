<script setup lang="ts">
export interface Props {
  hgnc: any
}

const props = withDefaults(defineProps<Props>(), {
  hgnc: null
})
</script>

<template>
  <div>
    <div class="text-subtitle-1">Alternative Identifiers</div>

    <div>
      <strong> ENSEMBL: </strong>
      <a
        :href="`https://www.ensembl.org/Homo_sapiens/Gene/Summary?g=${props.hgnc?.ensemblGeneId}`"
        target="_blank"
      >
        <v-icon>mdi-launch</v-icon>
        {{ props.hgnc?.ensemblGeneId }}
      </a>
    </div>

    <div>
      <strong> HGNC: </strong>
      <a
        :href="`https://www.genenames.org/data/gene-symbol-report/#!/hgnc_id/${props.hgnc?.hgncId}`"
        target="_blank"
      >
        <v-icon>mdi-launch</v-icon>
        {{ props.hgnc?.hgncId }}
      </a>
    </div>

    <div v-if="props.hgnc?.mgdId?.length">
      <strong>MGI: </strong>
      <template v-for="(mgd_id, index) in props.hgnc.mgdId" :key="mgd_id">
        <template v-if="index > 0">, </template>
        <a :href="`https://www.informatics.jax.org/marker/${mgd_id}`" target="_blank">
          <v-icon>mdi-launch</v-icon>
          {{ mgd_id }}
        </a>
      </template>
    </div>
    <span v-else> No MGI </span>

    <div v-if="props.hgnc?.pubmedId?.length">
      <strong>Primary PMID: </strong>
      <template v-for="(pmid, index) in props.hgnc.pubmedId" :key="pmid">
        <template v-if="index > 0">, </template>
        <a :href="`https://pubmed.ncbi.nlm.nih.gov/${pmid}/`" target="_blank">
          <v-icon>mdi-launch</v-icon>
          {{ pmid }}
        </a>
      </template>
    </div>
    <div v-else>No primary PMID</div>

    <div v-if="props.hgnc?.refseqAccession?.length">
      <strong> RefSeq: </strong>
      <template v-for="(accession, index) in props.hgnc.refseqAccession" :key="index">
        <template v-if="index > 0">, </template>
        <a
          :href="`https://www.ncbi.nlm.nih.gov/nuccore/?term=${accession}+AND+srcdb_refseq[PROP]`"
          target="_blank"
        >
          <v-icon>mdi-launch</v-icon>
          {{ accession }}
        </a>
      </template>
    </div>
    <div v-else>No RefSeq</div>

    <div v-if="props.hgnc?.uniprotIds?.length">
      <strong> UniProt: </strong>
      <template v-for="(uniprotid, index) in props.hgnc.uniprotIds" :key="index">
        <template v-if="index > 0">, </template>
        <a :href="`https://www.uniprot.org/uniprotkb/${uniprotid}/entry`" target="_blank">
          <v-icon>mdi-launch</v-icon>
          {{ uniprotid }}
        </a>
      </template>
    </div>
    <div v-else>No UniProt</div>
  </div>
</template>
