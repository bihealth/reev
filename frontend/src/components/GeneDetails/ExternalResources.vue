<script setup lang="ts">
export interface Props {
  hgnc: any
}

const props = withDefaults(defineProps<Props>(), {
  hgnc: null
})
</script>
<template>
  <v-card>
    <v-card-title>External Resources</v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <v-row>
        <v-col cols="12" md="6">
          <div>
            <a
              :href="`https://cancer.sanger.ac.uk/cosmic/gene/analysis?ln=${props.hgnc?.cosmic}`"
              target="_blank"
              v-if="props.hgnc?.cosmic"
            >
              <v-icon>mdi-launch</v-icon>
              COSMIC
            </a>
            <span v-else> <v-icon>mdi-launch</v-icon> COSMIC</span>
          </div>

          <div>
            <a
              :href="`https://www.deciphergenomics.org/gene/${props.hgnc?.symbol}`"
              target="_blank"
            >
              <v-icon>mdi-launch</v-icon>
              DECIPHER
            </a>
          </div>
          <div>
            <a :href="`https://search.thegencc.org/genes/${props.hgnc?.hgncId}`" target="_blank">
              <v-icon>mdi-launch</v-icon>
              GenCC
            </a>
          </div>
          <div>
            <a
              :href="`https://www.kegg.jp/kegg-bin/search_pathway_text?map=map&keyword=${props.hgnc?.symbol}&mode=1&viewImage=true`"
              target="_blank"
            >
              <v-icon>mdi-launch</v-icon>
              KEGG
            </a>
          </div>
          <div>
            <a
              :href="`https://medlineplus.gov/genetics/gene/${props.hgnc?.symbol}/`"
              target="_blank"
            >
              <v-icon>mdi-launch</v-icon>
              MedLinePlus
            </a>
          </div>
          <div>
            <a
              :href="`https://www.omim.org/entry/${props.hgnc?.omimId[0]}`"
              target="_blank"
              v-if="props.hgnc?.omimId.length"
            >
              <v-icon>mdi-launch</v-icon>
              OMIM
            </a>
            <span v-else> <v-icon>mdi-launch</v-icon> OMIM</span>
          </div>
        </v-col>
        <v-col cols="12" md="6">
          <div>
            <a
              :href="`https://pubmed.ncbi.nlm.nih.gov/?term=${props.hgnc?.symbol}`"
              target="_blank"
            >
              <v-icon>mdi-launch</v-icon>
              PubMed
            </a>
          </div>

          <div>
            <a
              :href="`https://www.malacards.org/search/results?query=+[GE]+${props.hgnc?.symbol}`"
              target="_blank"
            >
              <v-icon>mdi-launch</v-icon>
              MalaCards
            </a>
          </div>
          <div>
            <a
              :href="`https://mastermind.genomenon.com/detail?gene=${props.hgnc?.symbol}&disease=all%20diseases`"
              target="_blank"
            >
              <v-icon>mdi-launch</v-icon>
              MASTERMIND
            </a>
          </div>

          <div>
            <template v-if="props.hgnc?.uniprotIds?.length">
              <template v-for="(uniprotid, index) in props.hgnc.uniprotIds" :key="index">
                <template v-if="index > 0">, </template>
                <a
                  :href="`http://missense3d.bc.ic.ac.uk:8080/search_direct?uniprot=${uniprotid}`"
                  target="_blank"
                >
                  <v-icon>mdi-launch</v-icon>
                  {{ uniprotid }}
                </a>
                (Missense3D)
              </template>
            </template>
            <span v-else> <v-icon>mdi-launch</v-icon> Missense3D </span>
          </div>
          <div>
            <a :href="`https://varsome.com/gene/hg19/${props.hgnc?.hgncId}`" target="_blank">
              <v-icon>mdi-launch</v-icon>
              VarSome
            </a>
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
