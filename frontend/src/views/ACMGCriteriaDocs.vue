<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import { useTheme } from 'vuetify'

// Components
const PageHeader = defineAsyncComponent(() => import('@/components/PageHeader.vue'))
/** The global theme. */
const theme = useTheme()

/** Return backgorund color for v-main based on current theme. */
const mainBackgroundColor = computed(() => {
  return theme.global.current.value.dark ? 'bg-grey-darken-3' : 'bg-grey-lighten-3'
})
</script>

<template>
  <PageHeader />
  <main :class="mainBackgroundColor">
    <v-container class="docs-view">
      <v-row>
        <v-col>
          <h1>ACMG Rating Criteria</h1>

          <!-- Pathogenic Criteria -->
          <div class="pathogenic">
            <h2>Pathogenic Criteria</h2>
            <ul>
              <li>
                <h3>PVS1 - Null variant</h3>
                <p>
                  Description: Null variant (nonsense, frameshift, canonical ±1 or 2 splice sites,
                  initiation codon, single or multi-exon deletion) in a gene where LOF is a known
                  mechanism of disease. Caution! PVS1 confronts with PM4 and PP3! Use as strong if
                  not subject to NMD but >10% of the protein are affected.
                </p>
                <p>Hint: Null variant</p>
              </li>
              <li>
                <h3>PS1 - Same amino acid change</h3>
                <p>
                  Description: Same amino acid change as a previously established pathogenic variant
                  regardless of nucleotide change. CAVE not applicable for same nucleotide change,
                  for same nucleotide change use PS4.
                </p>
                <p>Hint: Literature: this AA exchange</p>
              </li>
              <li>
                <h3>PS2 - De novo</h3>
                <p>
                  Description: De novo (both maternity and paternity confirmed) in a patient with
                  the disease and no family history
                </p>
                <p>Hint: Confirmed de novo</p>
              </li>
              <li>
                <h3>PS3 - Well-established functional studies</h3>
                <p>
                  Description: Well-established in vitro or in vivo functional studies supportive of
                  a damaging effect on the gene or gene product
                </p>
                <p>Hint: Supported by functional studies</p>
              </li>
              <li>
                <h3>PS4 - Prevalence in affected individuals</h3>
                <p>
                  Description: The prevalence of the variant in affected individuals is
                  significantly increased compared with the prevalence in controls
                </p>
                <p>Hint: Prevalence in disease controls</p>
              </li>
              <li>
                <h3>PM1 - Located in a mutational hot spot</h3>
                <p>
                  Description: Located in a mutational hot spot and/or critical and well-established
                  functional domain (e.g., active site of an enzyme) without benign variation
                </p>
                <p>Hint: Variant in hotspot (missense)</p>
              </li>
              <li>
                <h3>PM2 - Absent from controls</h3>
                <p>
                  Description: Absent from controls (or at extremely low frequency if recessive) in
                  Exome Sequencing Project, 1000 Genomes Project, or Exome Aggregation Consortium.
                  New recommendation: use on supporting level only.
                </p>
                <p>Hint: Rare; &lt; 1:20,000 in ExAC</p>
              </li>
              <li>
                <h3>PM3 - Detected in trans with a pathogenic variant</h3>
                <p>
                  Description: For recessive disorders, detected in trans with a pathogenic variant
                </p>
                <p>Hint: AR: trans with known pathogenic</p>
              </li>
              <li>
                <h3>PM4 - Protein length changes</h3>
                <p>
                  Description: Protein length changes as a result of in-frame deletions/insertions
                  in a nonrepeat region or stop-loss variants. Do not use in combination with PVS1
                  or PP3.
                </p>
                <p>Hint: Protein length change</p>
              </li>
              <li>
                <h3>PM5 - Novel missense change</h3>
                <p>
                  Description: Novel missense change at an amino acid residue where a different
                  missense change determined to be pathogenic has been seen before
                </p>
                <p>Hint: Literature: AA exchange same pos</p>
              </li>
              <li>
                <h3>PM6 - Assumed de novo</h3>
                <p>
                  Description: Assumed de novo, but without confirmation of paternity and maternity
                </p>
                <p>Hint: Assumed de novo</p>
              </li>
              <li>
                <h3>PP1 - Cosegregation with disease</h3>
                <p>
                  Description: Cosegregation with disease in multiple affected family members in a
                  gene definitively known to cause the disease
                </p>
                <p>Hint: Cosegregates in family</p>
              </li>
              <li>
                <h3>PP2 - Missense variant in a gene with low benign missense variation</h3>
                <p>
                  Description: Missense variant in a gene that has a low rate of benign missense
                  variation and in which missense variants are a common mechanism of disease
                </p>
                <p>Hint: Few missense in gene</p>
              </li>
              <li>
                <h3>PP3 - Multiple lines of computational evidence</h3>
                <p>
                  Description: Multiple lines of computational evidence support a deleterious effect
                  on the gene or gene product (conservation, evolutionary, splicing impact, etc.).
                  Do not use in combination with PVS1 or PM4.
                </p>
                <p>Hint: Predicted pathogenic >= 2</p>
              </li>
              <li>
                <h3>PP4 - Highly specific phenotype or family history</h3>
                <p>
                  Description: Patient's phenotype or family history is highly specific for a
                  disease with a single genetic etiology
                </p>
                <p>Hint: Phenotype/pedigree match gene</p>
              </li>
            </ul>
          </div>

          <!-- Benign Criteria -->
          <div class="benign">
            <h2>Benign Criteria</h2>
            <ul>
              <li>
                <h3>BA1 - Allele frequency > 5%</h3>
                <p>
                  Description: Allele frequency is >5% in Exome Sequencing Project, 1000 Genomes
                  Project, or Exome Aggregation Consortium
                </p>
                <p>Hint: Allele frequency > 5%</p>
              </li>
              <li>
                <h3>BS1 - Greater than expected allele frequency</h3>
                <p>Description: Allele frequency is greater than expected for the disorder</p>
                <p>Hint: Disease: allele freq. too high</p>
              </li>
              <li>
                <h3>BS2 - Observed in a healthy individual</h3>
                <p>
                  Description: Observed in a healthy adult individual for a recessive (homozygous),
                  dominant (heterozygous), or X-linked (hemizygous) disorder, with full penetrance
                  expected at an early age
                </p>
                <p>Hint: Observed in healthy individual</p>
              </li>
              <li>
                <h3>BS3 - Well-established functional studies show no damage</h3>
                <p>
                  Description: Well-established in vitro or in vivo functional studies show no
                  damaging effect on protein function or splicing
                </p>
                <p>Hint: Functional studies: benign</p>
              </li>
              <li>
                <h3>BS4 - Lack of segregation in family</h3>
                <p>Description: Lack of segregation in affected members of a family</p>
                <p>Hint: Lack of segregation</p>
              </li>
              <li>
                <h3>BP1 - Missense variant in a gene with truncating</h3>
                <p>
                  Description: Missense variant in a gene for which primarily truncating variants
                  are known to cause disease
                </p>
                <p>Hint: Missense in gene with truncating</p>
              </li>
              <li>
                <h3>BP2 - Observed with a pathogenic variant</h3>
                <p>
                  Description: Observed in trans with a pathogenic variant for a fully penetrant
                  dominant gene/disorder or observed in cis with a pathogenic variant in any
                  inheritance pattern
                </p>
                <p>Hint: Other variant is causative</p>
              </li>
              <li>
                <h3>BP3 - In-frame deletions/insertions in repeat</h3>
                <p>
                  Description: In-frame deletions/insertions in a repetitive region without a known
                  function
                </p>
                <p>Hint: In-frame indel in repeat</p>
              </li>
              <li>
                <h3>BP4 - Multiple lines of computational evidence suggest no impact</h3>
                <p>
                  Description: Multiple lines of computational evidence suggest no impact on gene or
                  gene product (conservation, evolutionary, splicing impact, etc.)
                </p>
                <p>Hint: Prediction: benign</p>
              </li>
              <li>
                <h3>BP5 - Variant found with alternate molecular basis</h3>
                <p>
                  Description: Variant found in a case with an alternate molecular basis for disease
                </p>
                <p>Hint: Different gene in other case</p>
              </li>
              <li>
                <h3>BP7 - Synonymous variant with no splicing impact</h3>
                <p>
                  Description: A synonymous (silent) variant for which splicing prediction
                  algorithms predict no impact to the splice consensus sequence nor the creation of
                  a new splice site AND the nucleotide is not highly conserved
                </p>
                <p>Hint: Silent, no splicing/conservation</p>
              </li>
            </ul>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </main>
</template>

<style scoped>
.docs-view {
  padding: 40px;
}

h2 {
  color: #333;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin-bottom: 20px;
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 5px;
}

/* Pathogenic Criteria Styles */
.pathogenic h3 {
  background-color: #ff8080;
  color: #fff;
  padding: 5px 10px;
  border-radius: 5px;
  margin: 0;
}

.pathogenic p {
  font-weight: bold;
}

/* Benign Criteria Styles */
.benign h3 {
  background-color: #2196f3;
  color: #fff;
  padding: 5px 10px;
  border-radius: 5px;
  margin: 0;
}

.benign p {
  font-weight: bold;
}
</style>
