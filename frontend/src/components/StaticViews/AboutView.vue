<script setup lang="ts">
type AcknowledgementsType = {
  [key: string]: {
    name: string
    url: string
    description: string
    doi?: string
  }
}

const Acknowledgements: AcknowledgementsType = {
  ClinVar: {
    name: 'ClinVar',
    url: 'https://www.ncbi.nlm.nih.gov/clinvar/',
    description:
      'ClinVar is a freely accessible, public archive ' +
      'of reports of the relationships among human variations ' +
      'and phenotypes, with supporting evidence.',
    doi: 'DOI: 10.1093/nar/gkx1153'
  },
  Coral: {
    name: 'Coral emoji',
    url: 'https://openmoji.org/library/emoji-1FAB8/',
    description: 'Coral emoji from OpenMoji',
    doi: ''
  }
}
</script>

<template>
  <v-card>
    <v-card-title>About REEV</v-card-title>
    <v-divider />
    <v-card-text>
      <p>
        REEV (REEV Explains and Evaluates Variants) is a web-based tool designed to assist
        clinicians and researchers in the field of rare disease genetics. This tool empowers users
        by providing comprehensive and aggregated information on genomic variants.
      </p>
      <p>
        Whether you're a medical professional seeking insights into genetic variations or a
        researcher investigating rare diseases, REEV is here to streamline your workflow. Our
        platform combines cutting-edge technology with user-friendly interfaces to ensure that you
        have the resources you need to make informed decisions.
      </p>
      <v-card-subtitle>Sequence Variants in REEV</v-card-subtitle>
      <p>
        REEV's documentation on ACMG Sequence Variant Criteria provides a comprehensive guide for
        the automated classification of sequence variants. This process emphasizes transparency for
        users, ensuring they receive detailed reports of evidence supporting or contradicting each
        criterion. It is meticulously designed to inform users why certain criteria are applied or
        omitted in specific cases, such as when one criterion may invalidate others due to the
        nature of the variant (e.g., BA1 disabling all other benign criteria). In addition, the ACMG
        Sequence Variant Details section elaborates on the implementation of these classification
        criteria. This includes a detailed description of the data sources utilized in the
        classification of sequence variants. These sources form the foundation of the classification
        process, aiding in the accurate and comprehensive evaluation of sequence variants.
      </p>
      <v-card-subtitle>Copy Number Variants in REEV</v-card-subtitle>
      <p>
        The ACMG CNV Criteria section in REEV's documentation outlines the implementation of
        criteria for CNVs (Copy Number Variants), based on guidelines from Riggs et al. (2020).
        These criteria are critical for understanding and classifying CNVs in the context of genetic
        analysis and rare disease research. Furthermore, the ACMG CNV Details page provides in-depth
        information about the assessment criteria for CNVs. This includes an overview of the data
        used for classification, emphasizing the thorough and detailed approach REEV takes in
        evaluating CNVs. The data used in this classification process is pivotal for understanding
        the genetic implications of CNVs and their potential impact on rare genetic disorders.
      </p>
      <p>
        Overall, REEV's approach to both sequence and CNV variants is characterized by a meticulous
        and transparent methodology. The platform's use of comprehensive data sources and adherence
        to established criteria ensures that it remains a valuable tool for researchers and
        clinicians in the field of rare disease genetics.
      </p>
      <p>
        For more detailed information, please visit our
        <a href="https://reev.readthedocs.io/en/latest/">documentation</a>.
      </p>
    </v-card-text>
    <v-card-title>Acknowledgements:</v-card-title>
    <v-divider />
    <v-card-text>
      <p class="description">
        <v-list lines="two">
          <v-list-item v-for="ack in Object.values(Acknowledgements)" :key="ack.name">
            <v-list-item-title>
              <a :href="ack.url" target="_blank">{{ ack.name }}</a>
            </v-list-item-title>
            <v-list-item-subtitle>{{ ack.description }}</v-list-item-subtitle>
            <!-- If there is a doi, then display it -->
            <v-list-item-subtitle v-if="ack.doi">
              <a :href="'https://doi.org/' + ack.doi" target="_blank">{{ ack.doi }}</a>
            </v-list-item-subtitle>
          </v-list-item>
        </v-list>
      </p>
    </v-card-text>
  </v-card>
</template>
