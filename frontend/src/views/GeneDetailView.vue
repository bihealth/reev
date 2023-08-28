<script setup lang="ts">
import { watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { StoreState, useGeneInfoStore } from '@/stores/geneInfo'

import HeaderDetailPage from '@/components/HeaderDetailPage.vue'
import { roundIt } from '@/api/utils'

export interface Props {
  searchTerm?: string
}

const props = withDefaults(defineProps<Props>(), {
  searchTerm: ''
})

const router = useRouter()
const route = useRoute()

const geneInfoStore = useGeneInfoStore()

const scrollToSection = async () => {
  const sectionId = route.hash.slice(1)
  const elem = document.getElementById(sectionId)
  elem?.scrollIntoView()
}

const loadDataToStore = async () => {
  await geneInfoStore.loadData(props.searchTerm)
  await scrollToSection()
}

// When the component is mounted or the search term is changed through
// the router then we need to fetch the gene information from the backend
// through the store.

onMounted(loadDataToStore)

watch(() => props.searchTerm, loadDataToStore)
watch(() => route.hash, scrollToSection)

const SECTIONS = [
  { id: 'hgnc', title: 'HGNC' },
  { id: 'constraints-scores', title: 'Constraints / Scores' },
  { id: 'ncbi-summary', title: 'NCBI Summary' },
  { id: 'alternative-identifiers', title: 'Alternative Identifiers' },
  { id: 'external-resources', title: 'External Resources' },
  { id: 'disease-annotation', title: 'Disease Annotation' },
  { id: 'acmg-list', title: 'ACMG Supplementary Findings List' },
  { id: 'gene-rifs', title: 'Gene RIFs' },
  { id: 'locus-specific-databases', title: 'Locus-Specific Databases' }
]
</script>

<template>
  <HeaderDetailPage />
  <v-navigation-drawer location="right" class="overflow-auto">
    <div v-if="geneInfoStore.storeState == StoreState.Active" class="gene-info">
      <v-list density="compact" nav>
        <v-list-item
          v-for="section in SECTIONS"
          :key="section.id"
          @click="router.push({ hash: `#${section.id}` })"
        >
          <v-list-item-title>{{ section.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </div>
  </v-navigation-drawer>
  <v-layout>
    <v-main style="min-height: 300px">
      <div v-if="geneInfoStore.storeState == StoreState.Active" class="gene-info">
        <div id="hgnc" class="gene-item">
          <h2>HGNC</h2>
          <v-divider></v-divider>
          <div>
            <div>
              <strong>symbol:</strong>
              {{ geneInfoStore.geneInfo?.hgnc?.symbol }}
            </div>
            <div>
              <strong>name:</strong>
              {{ geneInfoStore.geneInfo?.hgnc?.name }}
            </div>
            <div>
              <strong>cytoband:</strong>
              {{ geneInfoStore.geneInfo?.hgnc?.location }}
            </div>
            <div>
              <strong>aliases:</strong>
              {{ geneInfoStore.geneInfo?.hgnc?.alias_name?.join(', ') }}
            </div>
            <div>
              <strong>synonyms:</strong>
              {{ geneInfoStore.geneInfo?.hgnc?.alias_symbol?.join(', ') }}
            </div>
          </div>
        </div>

        <div id="constraints-scores" class="gene-item">
          <h2>Constraints/Scores</h2>
          <h3>gnomAD</h3>
          <v-divider></v-divider>
          <div>
            <v-table style="width: 100%">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>SNVs exp.</th>
                  <th>SNVs obs.</th>
                  <th>Constraint metrics</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Synonymous</td>
                  <td v-html="roundIt(geneInfoStore.geneInfo?.gnomad_constraints?.exp_syn, 1)"></td>
                  <td v-html="roundIt(geneInfoStore.geneInfo?.gnomad_constraints?.obs_syn, 1)"></td>
                  <td>
                    Z =
                    <span
                      v-html="roundIt(geneInfoStore.geneInfo?.gnomad_constraints?.syn_z)"
                    /><br />
                    o/e =
                    <span v-html="roundIt(geneInfoStore.geneInfo?.gnomad_constraints?.oe_syn)" />
                    (<span
                      v-html="roundIt(geneInfoStore.geneInfo?.gnomad_constraints?.oe_syn_lower)"
                    />
                    -
                    <span
                      v-html="roundIt(geneInfoStore.geneInfo?.gnomad_constraints?.oe_syn_upper)"
                    />)
                  </td>
                </tr>
                <tr>
                  <td>Missense</td>
                  <td v-html="roundIt(geneInfoStore.geneInfo?.gnomad_constraints?.exp_mis, 1)"></td>
                  <td v-html="roundIt(geneInfoStore.geneInfo?.gnomad_constraints?.obs_mis, 1)"></td>
                  <td>
                    Z =
                    <span
                      v-html="roundIt(geneInfoStore.geneInfo?.gnomad_constraints?.mis_z)"
                    /><br />
                    o/e =
                    <span v-html="roundIt(geneInfoStore.geneInfo?.gnomad_constraints?.oe_mis)" />
                    (<span
                      v-html="roundIt(geneInfoStore.geneInfo?.gnomad_constraints?.oe_mis_lower)"
                    />
                    -
                    <span
                      v-html="roundIt(geneInfoStore.geneInfo?.gnomad_constraints?.oe_mis_upper)"
                    />)
                  </td>
                </tr>
                <tr>
                  <td>pLoF</td>
                  <td v-html="roundIt(geneInfoStore.geneInfo?.gnomad_constraints?.exp_lof, 1)"></td>
                  <td v-html="roundIt(geneInfoStore.geneInfo?.gnomad_constraints?.obs_lof, 1)"></td>
                  <td>
                    pLI =
                    <span v-html="roundIt(geneInfoStore.geneInfo?.gnomad_constraints?.pli)" /><br />
                    o/e =
                    <span v-html="roundIt(geneInfoStore.geneInfo?.gnomad_constraints?.oe_lof)" />
                    (<span
                      v-html="roundIt(geneInfoStore.geneInfo?.gnomad_constraints?.oe_lof_lower)"
                    />
                    -
                    <mark
                      v-html="
                        roundIt(
                          geneInfoStore.geneInfo?.gnomad_constraints?.oe_lof_upper,
                          2,
                          'LOEUF'
                        )
                      "
                    />)
                  </td>
                </tr>
              </tbody>
            </v-table>
          </div>
        </div>

        <div id="ncbi-summary" class="gene-item">
          <h2>NCBI Summary</h2>
          <v-divider></v-divider>
          <div>
            <div class="overflow-auto" style="max-height: 250px; font-size: 90%">
              {{ geneInfoStore.geneInfo?.ncbi?.summary }}
              <a :href="`https://www.ncbi.nlm.nih.gov/gene/672`" target="_blank">
                <v-icon>mdi-launch</v-icon>
                source
              </a>
            </div>
          </div>
        </div>

        <div id="alternative-identifiers" class="gene-item">
          <h2>Alternative Identifiers</h2>
          <v-divider></v-divider>
          <div>
            <div>
              <strong> ENSEMBL: </strong>
              <a
                :href="`https://www.ensembl.org/Homo_sapiens/Gene/Summary?g=${geneInfoStore.geneInfo?.hgnc?.ensembl_gene_id}`"
                target="_blank"
              >
                <v-icon>mdi-launch</v-icon>
                {{ geneInfoStore.geneInfo?.hgnc?.ensembl_gene_id }}
              </a>
            </div>
            <div>
              <strong> HGNC: </strong>
              <a
                :href="`https://www.genenames.org/data/gene-symbol-report/#!/hgnc_id/${geneInfoStore.geneInfo?.hgnc?.hgnc_id}`"
                target="_blank"
              >
                <v-icon>mdi-launch</v-icon>
                {{ geneInfoStore.geneInfo?.hgnc?.hgnc_id }}
              </a>
            </div>
            <div v-if="geneInfoStore.geneInfo?.hgnc?.mgd_id?.length">
              <strong>MGI: </strong>
              <template v-for="(mgd_id, index) in geneInfoStore.geneInfo.hgnc.mgd_id" :key="mgd_id">
                <template v-if="index > 0">, </template>
                <a :href="`https://www.informatics.jax.org/marker/${mgd_id}`" target="_blank">
                  <v-icon>mdi-launch</v-icon>
                  {{ mgd_id }}
                </a>
              </template>
            </div>
            <span v-else> No MGI </span>
            <div v-if="geneInfoStore.geneInfo?.hgnc?.pubmed_id?.length">
              <strong>Primary PMID: </strong>
              <template v-for="(pmid, index) in geneInfoStore.geneInfo.hgnc.pubmed_id" :key="pmid">
                <template v-if="index > 0">, </template>
                <a :href="`https://pubmed.ncbi.nlm.nih.gov/${pmid}/`" target="_blank">
                  <v-icon>mdi-launch</v-icon>
                  {{ pmid }}
                </a>
              </template>
            </div>
            <div v-else>No primary PMID</div>
            <div v-if="geneInfoStore.geneInfo?.hgnc?.refseq_accession?.length">
              <strong> RefSeq: </strong>
              <template
                v-for="(accession, index) in geneInfoStore.geneInfo.hgnc.refseq_accession"
                :key="index"
              >
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
            <div v-if="geneInfoStore.geneInfo?.hgnc?.uniprot_ids?.length">
              <strong> UniProt: </strong>
              <template
                v-for="(uniprotid, index) in geneInfoStore.geneInfo.hgnc.uniprot_ids"
                :key="index"
              >
                <template v-if="index > 0">, </template>
                <a :href="`https://www.uniprot.org/uniprotkb/${uniprotid}/entry`" target="_blank">
                  <v-icon>mdi-launch</v-icon>
                  {{ uniprotid }}
                </a>
              </template>
            </div>
            <div v-else>No UniProt</div>
          </div>
        </div>

        <div id="external-resources" class="gene-item">
          <h2>External Resources</h2>
          <v-divider></v-divider>
          <div>
            <v-row>
              <v-col cols="12" md="6">
                <div>
                  <a
                    :href="`https://cancer.sanger.ac.uk/cosmic/gene/analysis?ln=${geneInfoStore.geneInfo?.hgnc?.cosmic}`"
                    target="_blank"
                    v-if="geneInfoStore.geneInfo?.hgnc?.cosmic"
                  >
                    <v-icon>mdi-launch</v-icon>
                    COSMIC
                  </a>
                  <span v-else> <v-icon>mdi-launch</v-icon> COSMIC</span>
                </div>

                <div>
                  <a
                    :href="`https://www.deciphergenomics.org/gene/${geneInfoStore.geneInfo?.hgnc?.symbol}`"
                    target="_blank"
                  >
                    <v-icon>mdi-launch</v-icon>
                    DECIPHER
                  </a>
                </div>
                <div>
                  <a
                    :href="`https://search.thegencc.org/genes/${geneInfoStore.geneInfo?.hgnc?.hgnc_id}`"
                    target="_blank"
                  >
                    <v-icon>mdi-launch</v-icon>
                    GenCC
                  </a>
                </div>
                <div>
                  <a
                    :href="`https://www.kegg.jp/kegg-bin/search_pathway_text?map=map&keyword=${geneInfoStore.geneInfo?.hgnc?.symbol}&mode=1&viewImage=true`"
                    target="_blank"
                  >
                    <v-icon>mdi-launch</v-icon>
                    KEGG
                  </a>
                </div>
                <div>
                  <a
                    :href="`https://medlineplus.gov/genetics/gene/${geneInfoStore.geneInfo?.hgnc?.symbol}/`"
                    target="_blank"
                  >
                    <v-icon>mdi-launch</v-icon>
                    MedLinePlus
                  </a>
                </div>
                <div>
                  <a
                    :href="`https://www.omim.org/entry/${geneInfoStore.geneInfo?.hgnc?.omim_id[0]}`"
                    target="_blank"
                    v-if="geneInfoStore.geneInfo?.hgnc?.omim_id.length"
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
                    :href="`https://pubmed.ncbi.nlm.nih.gov/?term=${geneInfoStore.geneInfo?.hgnc?.symbol}`"
                    target="_blank"
                  >
                    <v-icon>mdi-launch</v-icon>
                    PubMed
                  </a>
                </div>

                <div>
                  <a
                    :href="`https://www.malacards.org/search/results?query=+[GE]+${geneInfoStore.geneInfo?.hgnc?.symbol}`"
                    target="_blank"
                  >
                    <v-icon>mdi-launch</v-icon>
                    MalaCards
                  </a>
                </div>
                <div>
                  <a
                    :href="`https://mastermind.genomenon.com/detail?gene=${geneInfoStore.geneInfo?.hgnc?.symbol}&disease=all%20diseases`"
                    target="_blank"
                  >
                    <v-icon>mdi-launch</v-icon>
                    MASTERMIND
                  </a>
                </div>

                <div>
                  <template v-if="geneInfoStore.geneInfo?.hgnc?.uniprot_ids?.length">
                    <template
                      v-for="(uniprotid, index) in geneInfoStore.geneInfo.hgnc.uniprot_ids"
                      :key="index"
                    >
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
                  <a
                    :href="`https://varsome.com/gene/hg19/${geneInfoStore.geneInfo?.hgnc?.hgnc_id}`"
                    target="_blank"
                  >
                    <v-icon>mdi-launch</v-icon>
                    VarSome
                  </a>
                </div>
              </v-col>
            </v-row>
          </div>
        </div>

        <div id="disease-annotation" class="gene-item">
          <h2>Disease Annotation</h2>
          <v-divider></v-divider>
          <div>
            <div>
              <div v-if="geneInfoStore.geneInfo?.dbnsfp?.orphanet_disorder?.length">
                <strong>Orphanet Disorders:</strong>
                {{ geneInfoStore.geneInfo.dbnsfp.orphanet_disorder.join(', ') }}
              </div>
              <div v-else>No Orphanet disorders annotated in dbNSFP.</div>

              <div v-if="geneInfoStore.geneInfo.dbnsfp?.mim_disease?.length">
                <strong>OMIM Diseases:</strong>
                {{ geneInfoStore.geneInfo.dbnsfp.mim_disease.join(', ') }}
              </div>
              <div v-else>No OMIM diseases annotated in dbNSFP.</div>
            </div>
          </div>
        </div>

        <div id="acmg-list" class="gene-item">
          <h2>ACMG Supplementary Findings List</h2>
          <v-divider></v-divider>
          <div>
            <div v-if="geneInfoStore.geneInfo?.acmg_sf">
              <div>
                <strong>since ACMG SF:</strong>
                v{{ geneInfoStore.geneInfo.acmg_sf.sf_list_version }}
              </div>
              <div>
                <strong>inheritance:</strong> {{ geneInfoStore.geneInfo.acmg_sf.inheritance }}
              </div>
              <div>
                <strong>phenotype:</strong>
                {{ geneInfoStore.geneInfo.acmg_sf.phenotype_category }} /
                {{ geneInfoStore.geneInfo.acmg_sf.disease_phenotype }}
              </div>
            </div>
            <div v-else>Gene is not on ACMG SF list.</div>
          </div>
        </div>

        <div id="gene-rifs" class="gene-item">
          <h2>GeneRIFs</h2>
          <v-divider></v-divider>
          <div>
            <ul
              class="overflow-auto"
              style="max-height: 200px; font-size: 90%"
              v-if="geneInfoStore.geneInfo?.ncbi?.rif_entries?.length"
            >
              <template v-for="entry in geneInfoStore.geneInfo.ncbi.rif_entries" :key="entry">
                <li v-if="entry?.text?.length">
                  {{ entry.text }}
                  <a
                    :href="'https://www.ncbi.nlm.nih.gov/pubmed/?term=' + entry.pmids.join('+')"
                    target="_blank"
                  >
                    <v-icon>mdi-launch</v-icon>
                    PubMed
                  </a>
                </li>
              </template>
            </ul>
            <div v-else>No GeneRIFs available for gene.</div>
          </div>
        </div>

        <div id="locus-specific-databases" class="gene-item">
          <h2>Locus-Specific Databases</h2>
          <v-divider></v-divider>
          <div>
            <div v-if="geneInfoStore.geneInfo?.hgnc?.lsdb?.length">
              <div v-for="{ name, url } in geneInfoStore.geneInfo.hgnc.lsdb" :key="name">
                <a :href="name" target="_blank">
                  <v-icon>mdi-launch</v-icon>
                  {{ url }}
                </a>
              </div>
              <div>
                <a
                  :href="`https://www.kegg.jp/kegg-bin/search_pathway_text?map=map&keyword=${geneInfoStore.geneInfo?.hgnc?.symbol}&mode=1&viewImage=true`"
                  target="_blank"
                >
                  <v-icon>mdi-launch</v-icon>
                  KEGG
                </a>
              </div>
            </div>
            <div v-else>No locus-specific database available for gene.</div>
          </div>
        </div>
      </div>

      <div v-else>
        <div class="d-flex align-center justify-center" style="min-height: 300px">
          <h1>Loading gene information</h1>
          <v-progress-circular indeterminate></v-progress-circular>
        </div>
      </div>
    </v-main>
  </v-layout>
</template>

<style scoped>
.gene-info {
  width: 95%;
  margin: 20px;
}

.gene-item {
  margin-bottom: 20px;
  border: 2px solid rgb(111, 100, 210);
  border-radius: 10px;
  padding: 5px 10px;
}
</style>
