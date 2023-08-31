<script setup lang="ts">
const props = defineProps({
  clinvar: Object
})

const interpretations = [
  'N/A',
  'Benign',
  'Likely benign',
  'Uncertain signifiance',
  'Likely pathogenic',
  'Pathogenic'
]
</script>

<template>
  <div>
    <v-icon>mdi-information</v-icon>
    Note that VarFish is using a local copy of Clinvar to display this information. The link-outs to
    NCBI ClinVar will display the most current data that may differ from our "frozen" copy.
  </div>
  <div v-if="props.clinvar?.vcv">
    <div>
      <strong>Interpretation: </strong>
      {{
        props.clinvar.summary_props.clinvar_pathogenicity
          .map((num: any) => interpretations[num])
          .join(', ')
      }}
    </div>
    <div>
      <strong>Review Status: </strong>
      <template v-for="i of [1, 2, 3, 4, 5]" :key="i">
        <div v-if="i <= props.clinvar.summary_props.clinvar_gold_stars">
          <v-icon>mdi-star</v-icon>
        </div>
        <div v-else>
          <v-icon>mdi-star-outline</v-icon>
        </div>
      </template>
    </div>
    <div>
      <strong>Accession: </strong>
      <a
        :href="`https://www.ncbi.nlm.nih.gov/props.clinvar/?term=${props.clinvar.vcv}`"
        target="_blank"
      >
        <v-icon>mdi-launch</v-icon>
        {{ props.clinvar.vcv }}
      </a>
    </div>
  </div>
  <div class="text-center font-italic" v-else>No ClinVar information available.</div>
</template>
