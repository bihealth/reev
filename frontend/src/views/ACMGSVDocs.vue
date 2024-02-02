<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import { useTheme } from 'vuetify'

// Components
const PageHeader = defineAsyncComponent(() => import('@/components/PageHeader/PageHeader.vue'))

/** The global theme. */
const theme = useTheme()

/** Return backgorund color for v-main based on current theme. */
const mainBackgroundColor = computed(() => {
  return theme.global.current.value.dark ? 'bg-grey-darken-3' : 'bg-grey-lighten-3'
})
</script>

<template>
  <PageHeader />
  <v-main :class="mainBackgroundColor">
    <v-container class="docs-view">
      <v-row>
        <v-col>
          <h1>ACMG Rating Criteria for Structure Variants</h1>

          <!-- Loss Criteria -->
          <div class="pathogenic">
            <h2>Copy-number loss</h2>
            <ul>
              <li>
                <h3>Loss 1A</h3>
                <p>
                  Description: Contains protein-coding or other known functionally important
                  elements.
                </p>
                <p>Hint: Copy number loss content</p>
                <p>Default Score: 0</p>
                <p>Max Score: 0</p>
                <p>Conflicting Evidence: Loss1B</p>
              </li>
              <li>
                <h3>Loss 1B</h3>
                <p>
                  Description: Does NOT contain protein-coding or any known functionally important
                  elements.
                </p>
                <p>Hint: [Provide a hint]</p>
                <p>Default Score: -0.6</p>
                <p>Max Score: -0.6</p>
                <p>
                  Conflicting Evidence: Loss1A, Loss2A, Loss2B, Loss2C1, Loss2C2, Loss2D1, Loss2D2,
                  Loss2D3, Loss2D4, Loss3B, Loss3C
                </p>
              </li>

              <!-- Criteria 2A -->
              <li>
                <h3>Loss 2A</h3>
                <p>Description: Complete overlap of an established HI gene or genomic region.</p>
                <p>
                  Hint: Overlap with ESTABLISHED HI genes or genomic regions and consideration of
                  reason for referral
                </p>
                <p>Default Score: 1</p>
                <p>Min Score: 0</p>
                <p>Max Score: 1</p>
                <p>Conflicting Evidence: Loss1B, Loss2E, Loss2F, Loss2G, Loss2H</p>
              </li>

              <!-- Criteria 2B -->
              <li>
                <h3>Loss 2B</h3>
                <p>Description: Partial overlap of an established HI genomic region.</p>
                <p>Hint: Continue evaluation</p>
                <p>Default Score: 0</p>
                <p>Max Score: 0</p>
                <p>Conflicting Evidence: Loss1B, Loss2E, Loss2F, Loss2G, Loss2H</p>
              </li>
              <!-- Criteria 2C-1 -->
              <li>
                <h3>Loss 2C-1</h3>
                <p>
                  Description: Partial overlap with the 5' end of an established HI gene (3' end of
                  the gene not involved) and coding sequence is involved.
                </p>
                <p>Hint: Range: 0.45 - 1.0</p>
                <p>Default Score: 0.9</p>
                <p>Min Score: 0.45</p>
                <p>Max Score: 1</p>
                <p>Conflicting Evidence: Loss1B, Loss2E, Loss2F, Loss2G, Loss2H</p>
              </li>

              <!-- Criteria 2C-2 -->
              <li>
                <h3>Loss 2C-2</h3>
                <p>
                  Description: Partial overlap with the 5' end of an established HI gene (3' end of
                  the gene not involved) and only the 5' UTR is involved.
                </p>
                <p>Hint: Range: 0.45 - 1.0</p>
                <p>Default Score: 0</p>
                <p>Min Score: 0</p>
                <p>Max Score: 0.45</p>
                <p>Conflicting Evidence: Loss1B, Loss2E, Loss2F, Loss2G, Loss2H</p>
              </li>

              <!-- Criteria 2D-1 -->
              <li>
                <h3>Loss 2D-1</h3>
                <p>
                  Description: Partial overlap with the 3' end of an established HI gene (5' end of
                  the gene not involved) and only 3' untranslated region is involved.
                </p>
                <p>Hint: Continue evaluation</p>
                <p>Default Score: 0</p>
                <p>Max Score: 0</p>
                <p>Conflicting Evidence: Loss1B, Loss2E, Loss2F, Loss2G, Loss2H</p>
              </li>

              <!-- Criteria 2D-2 -->
              <li>
                <h3>Loss 2D-2</h3>
                <p>
                  Description: Partial overlap with the 3' end of an established HI gene (5' end of
                  the gene not involved) and only the last exon is involved. Other established
                  pathogenic variants have been reported in this exon.
                </p>
                <p>Hint: Range: 0.45 - 0.9</p>
                <p>Default Score: 0.9</p>
                <p>Min Score: 0.45</p>
                <p>Max Score: 0.9</p>
                <p>Conflicting Evidence: Loss1B, Loss2E, Loss2F, Loss2G, Loss2H</p>
              </li>

              <!-- Criteria 2D-3 -->
              <li>
                <h3>Loss 2D-3</h3>
                <p>
                  Description: Partial overlap with the 3' end of an established HI gene (5' end of
                  the gene not involved) and only the last exon is involved. No other established
                  pathogenic variants have been reported in this exon.
                </p>
                <p>Hint: Range: 0.3 - 0.45</p>
                <p>Default Score: 0.3</p>
                <p>Min Score: 0</p>
                <p>Max Score: 0.45</p>
                <p>Conflicting Evidence: Loss1B, Loss2E, Loss2F, Loss2G, Loss2H</p>
              </li>

              <!-- Criteria 2D-4 -->
              <li>
                <h3>Loss 2D-4</h3>
                <p>
                  Description: Partial overlap with the 3' end of an established HI gene (5' end of
                  the gene not involved) and it includes other exons in addition to the last exon.
                  Nonsense-mediated decay is expected to occur.
                </p>
                <p>Hint: Range: 0.45 - 1.0</p>
                <p>Default Score: 0.9</p>
                <p>Min Score: 0.45</p>
                <p>Max Score: 1.0</p>
                <p>Conflicting Evidence: Loss1B, Loss2E, Loss2F, Loss2G, Loss2H</p>
              </li>

              <!-- Criteria 2E -->
              <li>
                <h3>Loss 2E</h3>
                <p>
                  Description: Both breakpoints are within the same gene (intragenic CNV; gene-level
                  sequence variant).
                </p>
                <p>Hint: See ClinGen SVI working group PVS1 specifications</p>
                <p>Default Score: 0</p>
                <p>Min Score: 0</p>
                <p>Max Score: 0.9</p>
                <p>
                  Conflicting Evidence: Loss1B, Loss2A, Loss2B, Loss2C1, Loss2C2, Loss2D1, Loss2D2,
                  Loss2D3, Loss2D4, Loss2F, Loss2G, Loss2H
                </p>
              </li>

              <!-- Criteria 2F -->
              <li>
                <h3>Loss 2F</h3>
                <p>Description: Completely contained within an established benign CNV region.</p>
                <p>Hint: Overlap with ESTABLISHED benign genes or genomic regions</p>
                <p>Default Score: -1</p>
                <p>Min Score: -1</p>
                <p>Max Score: 0</p>
                <p>
                  Conflicting Evidence: Loss2A, Loss2B, Loss2C1, Loss2C2, Loss2D1, Loss2D2, Loss2D3,
                  Loss2D4, Loss2E, Loss2G, Loss2H
                </p>
              </li>

              <!-- Criteria 2G -->
              <li>
                <h3>Loss 2G</h3>
                <p>
                  Description: Overlaps an established benign CNV, but includes additional genomic
                  material.
                </p>
                <p>Hint: Continue evaluation</p>
                <p>Default Score: 0</p>
                <p>Max Score: 0</p>
                <p>
                  Conflicting Evidence: Loss1B, Loss2A, Loss2B, Loss2C1, Loss2C2, Loss2D1, Loss2D2,
                  Loss2D3, Loss2D4, Loss2E, Loss2F, Loss2H
                </p>
              </li>

              <!-- Criteria 2H -->
              <li>
                <h3>Loss 2H</h3>
                <p>
                  Description: Two or more HI predictors suggest that AT LEAST ONE gene in the
                  interval is HI.
                </p>
                <p>Hint: Haploinsufficiency predictors</p>
                <p>Default Score: 0.15</p>
                <p>Max Score: 0.15</p>
                <p>
                  Conflicting Evidence: Loss1B, Loss2A, Loss2B, Loss2C1, Loss2C2, Loss2D1, Loss2D2,
                  Loss2D3, Loss2D4, Loss2E, Loss2F, Loss2G
                </p>
              </li>
              <!-- Criteria 3A -->
              <li>
                <h3>Loss 3A</h3>
                <p>Description: 0-24 genes.</p>
                <p>
                  Hint: Number of protein-coding RefSeq genes wholly or partially included in the
                  copy-number loss
                </p>
                <p>Default Score: 0</p>
                <p>Max Score: 0</p>
                <p>Conflicting Evidence: Loss3B, Loss3C</p>
              </li>

              <!-- Criteria 3B -->
              <li>
                <h3>Loss 3B</h3>
                <p>Description: 25-34 genes.</p>
                <p>Hint:</p>
                <p>Default Score: 0.45</p>
                <p>Min Score: 0</p>
                <p>Max Score: 0.45</p>
                <p>Conflicting Evidence: Loss1B, Loss2E, Loss3A, Loss3C</p>
              </li>

              <!-- Criteria 3C -->
              <li>
                <h3>Loss 3C</h3>
                <p>Description: 35+ genes.</p>
                <p>Hint:</p>
                <p>Default Score: 0.9</p>
                <p>Min Score: 0.45</p>
                <p>Max Score: 0.9</p>
                <p>Conflicting Evidence: Loss1B, Loss2E, Loss3A, Loss3B</p>
              </li>

              <!-- Criteria 4A -->
              <li>
                <h3>Loss 4A</h3>
                <p>
                  Description: Reported proband has either a complete deletion of or a LOF variant
                  within a gene encompassed by the observed copy-number loss OR an overlapping
                  copy-number loss similar in genomic content to the observed copy-number loss AND
                  the reported phenotype is highly specific and relatively unique to the gene or
                  genomic region.
                </p>
                <p>
                  Hint: Confirmed de novo: 0.45 points each Assumed de novo: 0.30 points each
                  (range: 0.15 to 0.45)
                </p>
                <p>Default Score: 0.3</p>
                <p>Min Score: 0</p>
                <p>Max Score: 0.9</p>
                <p>Conflicting Evidence: Loss4B, Loss4C</p>
              </li>

              <!-- Criteria 4B -->
              <li>
                <h3>Loss 4B</h3>
                <p>
                  Description: Reported proband has either a complete deletion of or a LOF variant
                  within a gene encompassed by the observed copy-number loss OR an overlapping
                  copy-number loss similar in genomic content to the observed copy-number loss AND
                  the reported phenotype is consistent with the gene/genomic region, is highly
                  specific, but not necessarily unique to the gene/genomic region.
                </p>
                <p>
                  Hint: Confirmed de novo: 0.30 points each Assumed de novo: 0.15 point each (range:
                  0 to 0.45)
                </p>
                <p>Default Score: 0.3</p>
                <p>Min Score: 0</p>
                <p>Max Score: 0.9</p>
                <p>Conflicting Evidence: Loss4A, Loss4C</p>
              </li>

              <!-- Criteria 4C -->
              <li>
                <h3>Loss 4C</h3>
                <p>
                  Description: Reported proband has either a complete deletion of or a LOF variant
                  within a gene encompassed by the observed copy-number loss OR an overlapping
                  copy-number loss similar in genomic content to the observed copy-number loss AND
                  the reported phenotype is consistent with the gene/genomic region, but not highly
                  specific and/or with high genetic heterogeneity.
                </p>
                <p>
                  Hint: Confirmed de novo: 0.15 point each Assumed de novo: 0.10 point each (range:
                  0 to 0.30)
                </p>
                <p>Default Score: 0.15</p>
                <p>Min Score: 0</p>
                <p>Max Score: 0.9</p>
                <p>Conflicting Evidence: Loss4A, Loss4B</p>
              </li>

              <!-- Criteria 4D -->
              <li>
                <h3>Loss 4D</h3>
                <p>
                  Description: Reported proband has either a complete deletion of or a LOF variant
                  within a gene encompassed by the observed copy-number loss OR an overlapping
                  copy-number loss similar in genomic content to the observed copy-number loss AND
                  the reported phenotype is NOT consistent with what is expected for the
                  gene/genomic region or not consistent in general.
                </p>
                <p>Hint: Individual case evidence — inconsistent phenotype (range: 0 to -0.3)</p>
                <p>Default Score: 0</p>
                <p>Min Score: -0.3</p>
                <p>Max Score: 0</p>
                <p>Conflicting Evidence: None</p>
              </li>

              <!-- Criteria 4E -->
              <li>
                <h3>Loss 4E</h3>
                <p>
                  Description: Reported proband has a highly specific phenotype consistent with the
                  gene/genomic region, but the inheritance of the variant is unknown.
                </p>
                <p>Hint: Individual case evidence — unknown inheritance (range: 0 to 0.15)</p>
                <p>Default Score: 0.1</p>
                <p>Min Score: 0</p>
                <p>Max Score: 0.3</p>
                <p>Conflicting Evidence: None</p>
              </li>

              <!-- Criteria 4F -->
              <li>
                <h3>Loss 4F</h3>
                <p>Description: 3-4 observed segregations.</p>
                <p>
                  Hint: Individual case evidence — segregation among similarly affected family
                  members
                </p>
                <p>Default Score: 0.15</p>
                <p>Min Score: 0</p>
                <p>Max Score: 0.15</p>
                <p>Conflicting Evidence: None</p>
              </li>

              <!-- Criteria 4G -->
              <li>
                <h3>Loss 4G</h3>
                <p>Description: 5-6 observed segregations.</p>
                <p>Hint:</p>
                <p>Default Score: 0.3</p>
                <p>Min Score: 0</p>
                <p>Max Score: 0.3</p>
                <p>Conflicting Evidence: None</p>
              </li>

              <!-- Criteria 4H -->
              <li>
                <h3>Loss 4H</h3>
                <p>Description: 7+ observed segregations.</p>
                <p>Hint:</p>
                <p>Default Score: 0.45</p>
                <p>Min Score: 0</p>
                <p>Max Score: 0.45</p>
                <p>Conflicting Evidence: None</p>
              </li>

              <!-- Criteria 4I -->
              <li>
                <h3>Loss 4I</h3>
                <p>
                  Description: Variant is NOT found in another individual in the proband's family
                  AFFECTED with a consistent, specific, well-defined phenotype (no known
                  phenocopies).
                </p>
                <p>
                  Hint: Individual case evidence — nonsegregations -0.45 points per family (range: 0
                  to -0.45)
                </p>
                <p>Default Score: -0.45</p>
                <p>Min Score: -0.9</p>
                <p>Max Score: 0</p>
                <p>Conflicting Evidence: None</p>
              </li>

              <!-- Criteria 4J -->
              <li>
                <h3>Loss 4J</h3>
                <p>
                  Description: Variant IS found in another individual in the proband's family
                  UNAFFECTED with the specific, well-defined phenotype observed in the proband.
                </p>
                <p>Hint: -0.30 points per family (range: 0 to -0.30)</p>
                <p>Default Score: -0.3</p>
                <p>Min Score: -0.9</p>
                <p>Max Score: 0</p>
                <p>Conflicting Evidence: None</p>
              </li>
              <!-- Criteria 4K -->
              <li>
                <h3>Loss 4K</h3>
                <p>
                  Description: Variant IS found in another individual in the proband's family
                  UNAFFECTED with the nonspecific phenotype observed in the proband
                </p>
                <p>Hint: -0.15 points per family (range: 0 to -0.15)</p>
                <p>Default Score: -0.15</p>
                <p>Min Score: -0.3</p>
                <p>Max Score: 0</p>
                <p>Conflicting Evidence: None</p>
              </li>

              <!-- Criteria 4L -->
              <li>
                <h3>Loss 4L</h3>
                <p>
                  Description: Statistically significant increase amongst observations in cases
                  (with a consistent, specific, well-defined phenotype) compared with controls.
                </p>
                <p>
                  Hint: Case-control and population evidence. 0.45 per study (range: 0 to 0.45 per
                  study)
                </p>
                <p>Default Score: 0.45</p>
                <p>Min Score: 0</p>
                <p>Max Score: 0.45</p>
                <p>Conflicting Evidence: None</p>
              </li>

              <!-- Criteria 4M -->
              <li>
                <h3>Loss 4M</h3>
                <p>
                  Description: Statistically significant increase amongst observations in cases
                  (without a consistent, nonspecific phenotype OR unknown phenotype) compared with
                  controls.
                </p>
                <p>Hint: 0.30 per study (range: 0 to 0.30 per study)</p>
                <p>Default Score: 0.3</p>
                <p>Min Score: 0</p>
                <p>Max Score: 0.45</p>
                <p>Conflicting Evidence: None</p>
              </li>

              <!-- Criteria 4N -->
              <li>
                <h3>Loss 4N</h3>
                <p>
                  Description: No statistically significant difference between observations in cases
                  and controls.
                </p>
                <p>Hint: -0.90 (per study) (range: 0 to -0.90 per study)</p>
                <p>Default Score: -0.9</p>
                <p>Min Score: -0.9</p>
                <p>Max Score: 0</p>
                <p>Conflicting Evidence: None</p>
              </li>

              <!-- Criteria 4O -->
              <li>
                <h3>Loss 4O</h3>
                <p>Description: Overlap with common population variation.</p>
                <p>Hint: (range: 0 to -1)</p>
                <p>Default Score: -0.9</p>
                <p>Min Score: -0.9</p>
                <p>Max Score: 0</p>
                <p>Conflicting Evidence: None</p>
              </li>
              <!-- Criteria 5A -->
              <li>
                <h3>Loss 5A</h3>
                <p>
                  Description: Use appropriate category from de novo scoring section in section 4.
                </p>
                <p>
                  Hint: Observed copy-number loss is de novo. Use de novo scoring categories from
                  section 4 (4A-4D) to determine score
                </p>
                <p>Default Score: 0</p>
                <p>Min Score: 0</p>
                <p>Max Score: 0.45</p>
                <p>
                  Conflicting Evidence: Loss 5B, Loss 5C, Loss 5D, Loss 5E, Loss 5F, Loss 5G, Loss
                  5H
                </p>
              </li>

              <!-- Criteria 5B -->
              <li>
                <h3>Loss 5B</h3>
                <p>
                  Description: Patient with specific, well-defined phenotype and no family history.
                  CNV is inherited from an apparently unaffected parent.
                </p>
                <p>Hint: Observed copy-number loss is inherited. (range: 0 to -0.45)</p>
                <p>Default Score: -0.3</p>
                <p>Min Score: -0.45</p>
                <p>Max Score: 0</p>
                <p>
                  Conflicting Evidence: Loss 5A, Loss 5C, Loss 5D, Loss 5E, Loss 5F, Loss 5G, Loss
                  5H
                </p>
              </li>

              <!-- Criteria 5C -->
              <li>
                <h3>Loss 5C</h3>
                <p>
                  Description: Patient with nonspecific phenotype and no family history. CNV is
                  inherited from an apparently unaffected parent.
                </p>
                <p>Hint: (range: 0 to -0.30)</p>
                <p>Default Score: -0.15</p>
                <p>Min Score: -0.3</p>
                <p>Max Score: 0</p>
                <p>
                  Conflicting Evidence: Loss 5A, Loss 5B, Loss 5D, Loss 5E, Loss 5F, Loss 5G, Loss
                  5H
                </p>
              </li>

              <!-- Criteria 5D -->
              <li>
                <h3>Loss 5D</h3>
                <p>
                  Description: CNV segregates with a consistent phenotype observed in the patient's
                  family.
                </p>
                <p>
                  Hint: Use segregation scoring categories from section 4 (4F-4H) to determine score
                </p>
                <p>Default Score: 0</p>
                <p>Min Score: 0</p>
                <p>Max Score: 0.45</p>
                <p>
                  Conflicting Evidence: Loss 5A, Loss 5B, Loss 5C, Loss 5E, Loss 5F, Loss 5G, Loss
                  5H
                </p>
              </li>

              <!-- Criteria 5E -->
              <li>
                <h3>Loss 5E</h3>
                <p>
                  Description: Use appropriate category from nonsegregation section in section 4.
                </p>
                <p>
                  Hint: Observed copy-number loss — nonsegregations. Use nonsegregation scoring
                  categories from section 4 (4I-4K) to determine score
                </p>
                <p>Default Score: 0</p>
                <p>Min Score: -0.45</p>
                <p>Max Score: 0</p>
                <p>
                  Conflicting Evidence: Loss 5A, Loss 5B, Loss 5C, Loss 5D, Loss 5F, Loss 5G, Loss
                  5H
                </p>
              </li>

              <!-- Criteria 5F -->
              <li>
                <h3>Loss 5F</h3>
                <p>Description: Inheritance information is unavailable or uninformative.</p>
                <p>Hint: Other</p>
                <p>Default Score: 0</p>
                <p>Max Score: 0</p>
                <p>
                  Conflicting Evidence: Loss 5A, Loss 5B, Loss 5C, Loss 5D, Loss 5E, Loss 5G, Loss
                  5H
                </p>
              </li>
              <!-- Criteria 5G -->
              <li>
                <h3>Loss 5G</h3>
                <p>
                  Description: Inheritance information is unavailable or uninformative. The patient
                  phenotype is nonspecific, but is consistent with what has been described in
                  similar cases.
                </p>
                <p>Hint: (range: 0 to 0.15)</p>
                <p>Default Score: 0.1</p>
                <p>Min Score: 0</p>
                <p>Max Score: 0.15</p>
                <p>
                  Conflicting Evidence: Loss 5A, Loss 5B, Loss 5C, Loss 5D, Loss 5E, Loss 5F, Loss
                  5H
                </p>
              </li>

              <!-- Criteria 5H -->
              <li>
                <h3>Loss 5H</h3>
                <p>
                  Description: Inheritance information is unavailable or uninformative. The patient
                  phenotype is highly specific and consistent with what has been described in
                  similar cases.
                </p>
                <p>Hint: (range: 0 to 0.30)</p>
                <p>Default Score: 0.3</p>
                <p>Min Score: 0</p>
                <p>Max Score: 0.3</p>
                <p>
                  Conflicting Evidence: Loss 5A, Loss 5B, Loss 5C, Loss 5D, Loss 5E, Loss 5F, Loss
                  5G
                </p>
              </li>
            </ul>
          </div>

          <!-- Gain Criteria -->
          <div class="benign">
            <h2>Copy-number gain</h2>
            <ul>
              <!-- Criteria 1A -->
              <li>
                <h3>Gain 1A</h3>
                <p>
                  Description: Contains protein-coding or other known functionally important
                  elements.
                </p>
                <p>Hint: Copy number gain content (Continue evaluation)</p>
                <p>Default Score: 0</p>
                <p>Max Score: 0</p>
                <p>Conflicting Evidence: Gain 1B</p>
              </li>

              <!-- Criteria 1B -->
              <li>
                <h3>Gain 1B</h3>
                <p>
                  Description: Does NOT contain protein-coding or any known functionally important
                  elements.
                </p>
                <p>Hint:</p>
                <p>Default Score: -0.6</p>
                <p>Max Score: -0.6</p>
                <p>
                  Conflicting Evidence: Gain 1A, Gain 2A, Gain 2B, Gain 2E, Gain 2G, Gain 2H, Gain
                  2I, Gain 2J, Gain 2K, Gain 2L, Gain 3B, Gain 3C
                </p>
              </li>

              <!-- Criteria 2A -->
              <li>
                <h3>Gain 2A</h3>
                <p>
                  Description: Complete overlap; the TS gene or minimal critical region is fully
                  contained within the observed copy-number gain.
                </p>
                <p>Hint: Overlap with ESTABLISHED TS genes or genomic regions</p>
                <p>Default Score: 1</p>
                <p>Min Score: 0</p>
                <p>Max Score: 1</p>
                <p>Conflicting Evidence: Gain 1B, Gain 2C, Gain 2D, Gain 2E, Gain 2F, Gain 2I</p>
              </li>
              <!-- Criteria 2B -->
              <li>
                <h3>Gain 2B</h3>
                <p>
                  Description: Partial overlap of an established TS region • The observed CNV does
                  NOT contain the known causative gene or critical region for this established TS
                  genomic region OR • Unclear if the known causative gene or critical region is
                  affected OR • No specific causative gene or critical region has been established
                  for this TS genomic region.
                </p>
                <p>Hint: Continue evaluation</p>
                <p>Default Score: 0</p>
                <p>Max Score: 0</p>
                <p>Conflicting Evidence: Gain 1B, Gain 2C, Gain 2D</p>
              </li>

              <!-- Criteria 2C -->
              <li>
                <h3>Gain 2C</h3>
                <p>
                  Description: Identical in gene content to the established benign copy-number gain.
                </p>
                <p>
                  Hint: Overlap with ESTABLISHED benign copy-number gain genes or genomic regions
                </p>
                <p>Default Score: -1</p>
                <p>Min Score: -1</p>
                <p>Max Score: 0</p>
                <p>Conflicting Evidence: Gain 2A, Gain 2B</p>
              </li>

              <!-- Criteria 2D -->
              <li>
                <h3>Gain 2D</h3>
                <p>
                  Description: Smaller than established benign copy-number gain, breakpoint(s) does
                  not interrupt protein-coding genes.
                </p>
                <p>Hint:</p>
                <p>Default Score: -1</p>
                <p>Min Score: -1</p>
                <p>Max Score: 0</p>
                <p>Conflicting Evidence: Gain 2A, Gain 2B</p>
              </li>

              <!-- Criteria 2E -->
              <li>
                <h3>Gain 2E</h3>
                <p>
                  Description: Smaller than established benign copy-number gain, breakpoint(s)
                  potentially interrupts protein-coding gene.
                </p>
                <p>Hint: Continue evaluation</p>
                <p>Default Score: 0</p>
                <p>Max Score: 0</p>
                <p>Conflicting Evidence: Gain 1B, Gain 2A</p>
              </li>

              <!-- Criteria 2F -->
              <li>
                <h3>Gain 2F</h3>
                <p>
                  Description: Larger than known benign copy-number gain, does not include
                  additional protein-coding genes.
                </p>
                <p>Hint: (range: 0 to -1)</p>
                <p>Default Score: -0.9</p>
                <p>Min Score: -1</p>
                <p>Max Score: 0</p>
                <p>Conflicting Evidence: Gain 2A</p>
              </li>
              <!-- Criteria 2G -->
              <li>
                <h3>Gain 2G</h3>
                <p>
                  Description: Overlaps a benign copy-number gain but includes additional genomic
                  material.
                </p>
                <p>Hint: Continue evaluation</p>
                <p>Default Score: 0</p>
                <p>Max Score: 0</p>
                <p>Conflicting Evidence: Gain 1B</p>
              </li>

              <!-- Criteria 2H -->
              <li>
                <h3>Gain 2H</h3>
                <p>Description: HI gene fully contained within the observed copy-number gain.</p>
                <p>Hint: Overlap with ESTABLISHED HI gene(s). Continue evaluation</p>
                <p>Default Score: 0</p>
                <p>Max Score: 0</p>
                <p>Conflicting Evidence: Gain 1B, Gain 2I</p>
              </li>

              <!-- Criteria 2I -->
              <li>
                <h3>Gain 2I</h3>
                <p>
                  Description: Both breakpoints are within the same gene (gene-level sequence
                  variant, possibly resulting in loss of function [LOF]).
                </p>
                <p>
                  Hint: Breakpoint(s) within ESTABLISHED HI genes. See ClinGen SVI working group
                  PVS1 specifications • PVS1 = 0.90 (Range: 0.45 to 0.90) • PVS1_Strong = 0.45
                  (Range: 0.30 to 0.90) • N/A = 0 (Continue evaluation)
                </p>
                <p>Default Score: 0</p>
                <p>Min Score: 0</p>
                <p>Max Score: 0.9</p>
                <p>Conflicting Evidence: Gain 1B, Gain 2H, Gain 2J, Gain 2K</p>
              </li>

              <!-- Criteria 2J -->
              <li>
                <h3>Gain 2J</h3>
                <p>
                  Description: One breakpoint is within an established HI gene, patient's phenotype
                  is either inconsistent with what is expected for LOF of that gene OR unknown.
                </p>
                <p>Hint: Continue evaluation</p>
                <p>Default Score: 0</p>
                <p>Max Score: 0</p>
                <p>Conflicting Evidence: Gain 1B, Gain 2I</p>
              </li>
              <!-- Criteria 2K -->
              <li>
                <h3>Gain 2K</h3>
                <p>
                  Description: One breakpoint is within an established HI gene, patient's phenotype
                  is highly specific and consistent with what is expected for LOF of that gene.
                </p>
                <p>Hint:</p>
                <p>Default Score: 0.45</p>
                <p>Min Score: 0</p>
                <p>Max Score: 0.45</p>
                <p>Conflicting Evidence: Gain 1B, Gain 2I</p>
              </li>

              <!-- Criteria 2L -->
              <li>
                <h3>Gain 2L</h3>
                <p>
                  Description: One or both breakpoints are within gene(s) of no established clinical
                  significance.
                </p>
                <p>Hint: Breakpoints within other gene(s). Continue evaluation</p>
                <p>Default Score: 0</p>
                <p>Max Score: 0</p>
                <p>Conflicting Evidence: Gain 1B</p>
              </li>

              <!-- Criteria 3A -->
              <li>
                <h3>Gain 3A</h3>
                <p>Description: 0-34 genes.</p>
                <p>
                  Hint: Number of protein-coding RefSeq genes wholly or partially included in the
                  copy-number gain
                </p>
                <p>Default Score: 0</p>
                <p>Max Score: 0</p>
                <p>Conflicting Evidence: Gain 3B, Gain 3C</p>
              </li>

              <!-- Criteria 3B -->
              <li>
                <h3>Gain 3B</h3>
                <p>Description: 35-49 genes.</p>
                <p>Hint:</p>
                <p>Default Score: 0.45</p>
                <p>Min Score: 0</p>
                <p>Max Score: 0.45</p>
                <p>Conflicting Evidence: Gain 1B, Gain 2I, Gain 3A, Gain 3C</p>
              </li>

              <!-- Criteria 3C -->
              <li>
                <h3>Gain 3C</h3>
                <p>Description: 50+ genes.</p>
                <p>Hint:</p>
                <p>Default Score: 0.9</p>
                <p>Min Score: 0</p>
                <p>Max Score: 0.9</p>
                <p>Conflicting Evidence: Gain 1B, Gain 2I, Gain 3A, Gain 3B</p>
              </li>
              <!-- Criteria 4A -->
              <li>
                <h3>Gain 4A</h3>
                <p>
                  Description: Reported proband has either complete duplication of one or more genes
                  within the observed copy-number gain OR an overlapping copy-number gain similar in
                  genomic content to the observed copy-number gain AND the reported phenotype is
                  highly specific and relatively unique to the gene or genomic region.
                </p>
                <p>
                  Hint: Confirmed de novo: 0.45 points each, Assumed de novo: 0.30 points each
                  (range: 0.15 to 0.45)
                </p>
                <p>Default Score: 0.3</p>
                <p>Min Score: 0</p>
                <p>Max Score: 0.9</p>
                <p>Conflicting Evidence: Gain 4B, Gain 4C, Gain 4D</p>
              </li>

              <!-- Criteria 4B -->
              <li>
                <h3>Gain 4B</h3>
                <p>
                  Description: Reported proband has either complete duplication of one or more genes
                  within the observed copy-number gain OR an overlapping copy-number gain similar in
                  genomic content to the observed copy-number gain AND the reported phenotype is
                  consistent with the gene/genomic region, is highly specific, but is not
                  necessarily unique to the gene/genomic region.
                </p>
                <p>
                  Hint: Confirmed de novo: 0.30 points each, Assumed de novo: 0.15 point each
                  (range: 0 to 0.45)
                </p>
                <p>Default Score: 0.15</p>
                <p>Min Score: 0</p>
                <p>Max Score: 0.9</p>
                <p>Conflicting Evidence: Gain 4A, Gain 4C, Gain 4D</p>
              </li>

              <!-- Criteria 4C -->
              <li>
                <h3>Gain 4C</h3>
                <p>
                  Description: Reported proband has either complete duplication of one or more genes
                  within the observed copy-number gain OR an overlapping copy-number gain similar in
                  genomic content to the observed copy-number gain AND the reported phenotype is
                  consistent with the gene/genomic region, but not highly specific and/or with high
                  genetic heterogeneity.
                </p>
                <p>
                  Hint: Confirmed de novo: 0.15 point each, Assumed de novo: 0.10 point each (range:
                  0 to 0.30)
                </p>
                <p>Default Score: 0.15</p>
                <p>Min Score: 0</p>
                <p>Max Score: 0.9</p>
                <p>Conflicting Evidence: Gain 4A, Gain 4B, Gain 4D</p>
              </li>

              <!-- Criteria 4D -->
              <li>
                <h3>Gain 4D</h3>
                <p>
                  Description: Reported proband has either complete duplication of one or more genes
                  within the observed copy-number gain OR an overlapping copy-number gain similar in
                  genomic content to the observed copy-number gain AND the reported phenotype is NOT
                  consistent with the gene/genomic region or not consistent in general.
                </p>
                <p>
                  Hint: Individual case evidence — inconsistent phenotype. 0 points each (range: 0
                  to -0.30)
                </p>
                <p>Default Score: 0</p>
                <p>Min Score: -0.3</p>
                <p>Max Score: 0</p>
                <p>Conflicting Evidence: Gain 4A, Gain 4B, Gain 4C</p>
              </li>
              <!-- Criteria 4E -->
              <li>
                <h3>Gain 4E</h3>
                <p>
                  Description: Reported proband has a highly specific phenotype consistent with the
                  gene/genomic region, but the inheritance of the variant is unknown.
                </p>
                <p>
                  Hint: Individual case evidence — unknown inheritance. 0.10 points each (range: 0
                  to 0.15)
                </p>
                <p>Default Score: 0.1</p>
                <p>Min Score: 0</p>
                <p>Max Score: 0.3</p>
                <p>Conflicting Evidence: None</p>
              </li>

              <!-- Criteria 4F -->
              <li>
                <h3>Gain 4F</h3>
                <p>Description: 3-4 observed segregations.</p>
                <p>
                  Hint: Individual case evidence — segregation among similarly affected family
                  members
                </p>
                <p>Default Score: 0.15</p>
                <p>Min Score: 0</p>
                <p>Max Score: 0.45</p>
                <p>Conflicting Evidence: Gain 4G, Gain 4H</p>
              </li>

              <!-- Criteria 4G -->
              <li>
                <h3>Gain 4G</h3>
                <p>Description: 5-6 observed segregations.</p>
                <p>Hint: None</p>
                <p>Default Score: 0.3</p>
                <p>Min Score: 0</p>
                <p>Max Score: 0.3</p>
                <p>Conflicting Evidence: Gain 4F, Gain 4H</p>
              </li>

              <!-- Criteria 4H -->
              <li>
                <h3>Gain 4H</h3>
                <p>Description: 7+ observed segregations.</p>
                <p>Hint: None</p>
                <p>Default Score: 0.45</p>
                <p>Min Score: 0</p>
                <p>Max Score: 0.45</p>
                <p>Conflicting Evidence: Gain 4F, Gain 4G</p>
              </li>

              <!-- Criteria 4I -->
              <li>
                <h3>Gain 4I</h3>
                <p>
                  Description: Variant is NOT found in another individual in the proband's family
                  AFFECTED with a consistent, specific, well-defined phenotype (no known
                  phenocopies).
                </p>
                <p>
                  Hint: Individual case evidence — nonsegregations. -0.45 points per family (range:
                  0 to -0.45)
                </p>
                <p>Default Score: -0.45</p>
                <p>Min Score: -0.9</p>
                <p>Max Score: 0</p>
                <p>Conflicting Evidence: Gain 4K</p>
              </li>

              <!-- Criteria 4J -->
              <li>
                <h3>Gain 4J</h3>
                <p>
                  Description: Variant IS found in another individual in the proband's family
                  UNAFFECTED with the specific, well-defined phenotype observed in the proband.
                </p>
                <p>Hint: -0.30 points per family (range: 0 to -0.30)</p>
                <p>Default Score: -0.3</p>
                <p>Max Score: -0.9</p>
                <p>Conflicting Evidence: Gain 4K</p>
              </li>
              <!-- Criteria 4K -->
              <li>
                <h3>Gain 4K</h3>
                <p>
                  Description: Variant IS found in another individual in the proband's family
                  UNAFFECTED with the nonspecific phenotype observed in the proband.
                </p>
                <p>Hint: -0.15 points per family (range: 0 to -0.15)</p>
                <p>Default Score: -0.15</p>
                <p>Min Score: -0.3</p>
                <p>Max Score: 0</p>
                <p>Conflicting Evidence: Gain 4I, Gain 4J</p>
              </li>

              <!-- Criteria 4L -->
              <li>
                <h3>Gain 4L</h3>
                <p>
                  Description: Statistically significant increase among observations in cases (with
                  a consistent, specific, well-defined phenotype) compared with controls.
                </p>
                <p>
                  Hint: Case-control and population evidence. 0.45 per study (range: 0 to 0.45 per
                  study)
                </p>
                <p>Default Score: 0.45</p>
                <p>Min Score: 0</p>
                <p>Max Score: 0.45</p>
                <p>Conflicting Evidence: Gain 4M</p>
              </li>

              <!-- Criteria 4M -->
              <li>
                <h3>Gain 4M</h3>
                <p>
                  Description: Statistically significant increase among observations in cases (with
                  a consistent, nonspecific phenotype or unknown phenotype) compared with controls.
                </p>
                <p>Hint: 0.30 per study (range: 0 to 0.30 per study)</p>
                <p>Default Score: 0.3</p>
                <p>Min Score: 0</p>
                <p>Max Score: 0.45</p>
                <p>Conflicting Evidence: Gain 4L</p>
              </li>

              <!-- Criteria 4N -->
              <li>
                <h3>Gain 4N</h3>
                <p>
                  Description: No statistically significant difference between observations in cases
                  and controls.
                </p>
                <p>Hint: -0.90 (per study) (range: 0 to -0.90 per study)</p>
                <p>Default Score: -0.9</p>
                <p>Min Score: -0.9</p>
                <p>Max Score: 0</p>
                <p>Conflicting Evidence: None</p>
              </li>

              <!-- Criteria 4O -->
              <li>
                <h3>Gain 4O</h3>
                <p>Description: Overlap with common population variation.</p>
                <p>Hint: (range: 0 to -1)</p>
                <p>Default Score: -0.9</p>
                <p>Min Score: -0.9</p>
                <p>Max Score: 0</p>
                <p>Conflicting Evidence: None</p>
              </li>
              <!-- Criteria 5A -->
              <li>
                <h3>Gain 5A</h3>
                <p>
                  Description: Use appropriate category from de novo scoring section in section 4.
                </p>
                <p>
                  Hint: Observed copy-number gain is de novo. Use de novo scoring categories from
                  section 4 (4A-4D) to determine score
                </p>
                <p>Default Score: 0</p>
                <p>Min Score: 0</p>
                <p>Max Score: 0.45</p>
                <p>
                  Conflicting Evidence: Gain 5B, Gain 5C, Gain 5D, Gain 5E, Gain 5F, Gain 5G, Gain
                  5H
                </p>
              </li>

              <!-- Criteria 5B -->
              <li>
                <h3>Gain 5B</h3>
                <p>
                  Description: Patient with a specific, well-defined phenotype and no family
                  history. Copy-number gain is inherited from an apparently unaffected parent.
                </p>
                <p>Hint: Observed copy-number gain is inherited. (range: 0 to -0.45)</p>
                <p>Default Score: -0.3</p>
                <p>Min Score: -0.45</p>
                <p>Max Score: 0</p>
                <p>
                  Conflicting Evidence: Gain 5A, Gain 5C, Gain 5D, Gain 5E, Gain 5F, Gain 5G, Gain
                  5H
                </p>
              </li>

              <!-- Criteria 5C -->
              <li>
                <h3>Gain 5C</h3>
                <p>
                  Description: Patient with nonspecific phenotype and no family history. Copy-number
                  gain is inherited from an apparently unaffected parent.
                </p>
                <p>Hint: (range: 0 to -0.30)</p>
                <p>Default Score: -0.15</p>
                <p>Min Score: -0.3</p>
                <p>Max Score: 0</p>
                <p>
                  Conflicting Evidence: Gain 5A, Gain 5B, Gain 5D, Gain 5E, Gain 5F, Gain 5G, Gain
                  5H
                </p>
              </li>

              <!-- Criteria 5D -->
              <li>
                <h3>Gain 5D</h3>
                <p>
                  Description: CNV segregates with consistent phenotype observed in the patient's
                  family.
                </p>
                <p>
                  Hint: Use segregation scoring categories from in section 4 (4F-4H) to determine
                  score
                </p>
                <p>Default Score: 0.45</p>
                <p>Min Score: 0</p>
                <p>Max Score: 0.45</p>
                <p>
                  Conflicting Evidence: Gain 5A, Gain 5B, Gain 5C, Gain 5E, Gain 5F, Gain 5G, Gain
                  5H
                </p>
              </li>
              <!-- Criteria 5E -->
              <li>
                <h3>Gain 5E</h3>
                <p>
                  Description: Use appropriate category from nonsegregation section in section 4.
                </p>
                <p>
                  Hint: Observed copy-number gain — nonsegregations. Use nonsegregation scoring
                  categories from section 4 (4I-4K) to determine score
                </p>
                <p>Default Score: -0.45</p>
                <p>Min Score: -0.45</p>
                <p>Max Score: 0</p>
                <p>
                  Conflicting Evidence: Gain 5A, Gain 5B, Gain 5C, Gain 5D, Gain 5F, Gain 5G, Gain
                  5H
                </p>
              </li>

              <!-- Criteria 5F -->
              <li>
                <h3>Gain 5F</h3>
                <p>Description: Inheritance information is unavailable or uninformative.</p>
                <p>Hint: None</p>
                <p>Default Score: 0</p>
                <p>Max Score: 0</p>
                <p>
                  Conflicting Evidence: Gain 5A, Gain 5B, Gain 5C, Gain 5D, Gain 5E, Gain 5G, Gain
                  5H
                </p>
              </li>

              <!-- Criteria 5G -->
              <li>
                <h3>Gain 5G</h3>
                <p>
                  Description: Inheritance information is unavailable or uninformative. The patient
                  phenotype is nonspecific, but is consistent with what has been described in
                  similar cases.
                </p>
                <p>Hint: (range: 0 to 0.15)</p>
                <p>Default Score: 0.1</p>
                <p>Min Score: 0</p>
                <p>Max Score: 0.15</p>
                <p>
                  Conflicting Evidence: Gain 5A, Gain 5B, Gain 5C, Gain 5D, Gain 5E, Gain 5F, Gain
                  5H
                </p>
              </li>

              <!-- Criteria 5H -->
              <li>
                <h3>Gain 5H</h3>
                <p>
                  Description: Inheritance information is unavailable or uninformative. The patient
                  phenotype is highly specific and consistent with what has been described in
                  similar cases.
                </p>
                <p>Hint: (range: 0 to 0.30)</p>
                <p>Default Score: 0.3</p>
                <p>Min Score: 0</p>
                <p>Max Score: 0.3</p>
                <p>
                  Conflicting Evidence: Gain 5A, Gain 5B, Gain 5C, Gain 5D, Gain 5E, Gain 5F, Gain
                  5G
                </p>
              </li>
            </ul>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
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
