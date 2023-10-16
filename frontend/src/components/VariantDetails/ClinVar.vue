<script setup lang="ts">
const props = defineProps({
  clinvar: Object
})

const interpretations = [
  'pathogenic', // 0
  'likely pathogenic', // 1
  'uncertain signifiance', // 2
  'likely benign', // 3
  'benign', // 4
  'other'
]
</script>

<template>
  <div style="font-size: small">
    <v-icon>mdi-information</v-icon>
    Note that REEV is using a local copy of Clinvar to display this information. The link-outs to
    NCBI ClinVar will display the most current data that may differ from our "frozen" copy.
  </div>
  <v-divider />
  <div v-if="props.clinvar?.rcv">
    <div>
      <strong>Interpretation: </strong>
      {{ interpretations[props.clinvar.clinical_significance] }}
    </div>
    <div>
      <strong>Review Status: </strong>
      <div v-for="i of [1, 2, 3, 4, 5]" :key="i" style="display: inline">
        <div v-if="i <= props.clinvar.review_status" style="display: inline">
          <v-icon>mdi-star</v-icon>
        </div>
        <div v-else style="display: inline">
          <v-icon>mdi-star-outline</v-icon>
        </div>
      </div>
    </div>
    <div>
      <strong>Accession: </strong>
      <a :href="`https://www.ncbi.nlm.nih.gov/clinvar/${props.clinvar.rcv}/`" target="_blank">
        <v-icon>mdi-launch</v-icon>
        {{ props.clinvar.rcv }}
      </a>
    </div>
  </div>
  <div class="text-center font-italic" v-else>No ClinVar information available.</div>
</template>
