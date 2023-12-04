<script setup lang="ts">
import { titleCase } from 'title-case'
import { computed, ref } from 'vue'

import type { HpoTerm } from '@/api/viguno'
import CadaRanking from '@/components/GeneDetails/ConditionsCard/CadaRanking.vue'

export interface Props {
  geneInfo: any
  hpoTerms: HpoTerm[]
}

const props = withDefaults(defineProps<Props>(), {
  geneInfo: null,
  hpoTerms: () => []
})

// -- code for hiding / showing term IDs -------------------------------------

/** Whether to display Term IDs. */
const showTermIds = ref<boolean>(false)

/** Whether to show terms as hyperlinks. */
const showTermLinks = ref<boolean>(true)

/** Extract MIM disease ID from dbSNFP string */
const extractMimDiseaseId = (id: string) => {
  return id.split('[')[1].split(']')[0]
}

/** Transforms MIM disease ID from dbNSFP depending on `showTermIds.value` */
const transformMimDiseaseId = (id: string) => {
  if (showTermIds.value) {
    return id.replace(']', '] ')
  } else {
    return id.split(']')[1].trim()
  }
}

// -- code for expanded / collapsed card --------------------------------------

/** Whether the card is expanded. */
const isExpanded = ref<boolean>(false)

// -- code for shortened / full HPO term list -------------------------------

/** Maxmimal number of HPO terms to show by default. */
const maxHpoTerms = 20

/** Whether to show all terms. */
const showAllHpoTerms = ref<boolean>(false)

/** The HPO terms to show. */
const hpoTermsToShow = computed<HpoTerm[]>(() => {
  if (showAllHpoTerms.value ?? !props.hpoTerms) {
    return props.hpoTerms ?? []
  } else {
    return props.hpoTerms.slice(0, maxHpoTerms)
  }
})
</script>

<template>
  <!-- no ENSG => display loader -->
  <template v-if="!geneInfo?.dbnsfp?.geneName?.length">
    <v-skeleton-loader class="mt-3 mx-auto border" type="image,button" />
  </template>

  <!-- otherwise, display actual card -->
  <template v-else>
    <v-card class="mt-3">
      <v-card-title class="pb-0"> Associated Conditions </v-card-title>
      <v-card-subtitle class="text-overline">
        Phenotypes and Disorders Associated with Gene
      </v-card-subtitle>
      <v-card-text class="pt-3">
        <v-row>
          <v-col cols="9" class="pt-0">
            <!--
            == HPO Terms ======================================================
          -->
            <template v-if="hpoTerms === null">
              <v-skeleton-loader class="mt-3 mx-auto border" type="header,text" />
            </template>
            <template v-else>
              <template v-if="geneInfo?.acmgSf">
                <div class="text-subtitle-1">ACMG Supplementary Findings</div>
                <div>
                  The gene <span class="font-italic">{{ geneInfo.hgnc.symbol }}</span> is on the
                  <abbr title="American College of Medical Genetics and Genomics"> ACMG </abbr>
                  Supplementary Findings (SF) list since v{{ geneInfo.acmgSf.sfListVersion }}. The
                  disease phenotype is
                  <strong>{{ titleCase(geneInfo.acmgSf.diseasePhenotype) }}</strong> for
                  <strong>{{ geneInfo.acmgSf.inheritance }}</strong> inheritance. The SF list
                  recommends to report
                  <strong>{{ geneInfo.acmgSf.variantsToReport.replace('All', 'all') }}</strong>
                  variants.
                </div>
              </template>
              <div class="text-subtitle-1" :class="{ 'mt-3': geneInfo?.acmgSf }">
                HPO Terms
                <small>
                  <template v-if="(hpoTerms?.length ?? 0) > maxHpoTerms">
                    <template v-if="showAllHpoTerms">
                      ({{ hpoTerms?.length }} of {{ hpoTerms?.length }})
                    </template>
                    <template v-else>
                      ({{ hpoTermsToShow.length }} of {{ hpoTerms?.length }})
                    </template>
                  </template>
                  <template v-else> ({{ hpoTerms?.length }}) </template>

                  <template v-if="hpoTerms.length > maxHpoTerms">
                    &bullet;
                    <a href="#" @click.prevent="showAllHpoTerms = !showAllHpoTerms">
                      {{ showAllHpoTerms ? ' show fewer' : ' show all' }}
                    </a>
                  </template>
                </small>
              </div>
              <div v-if="hpoTerms?.length">
                <template v-for="(term, idx) in hpoTermsToShow" :key="idx">
                  <template v-if="idx > 0"> , </template>
                  <template v-if="showTermLinks">
                    <a
                      :href="`https://hpo.jax.org/app/browse/term/${term.term_id}`"
                      target="_blank"
                    >
                      <v-icon>mdi-launch</v-icon>
                      <template v-if="showTermIds"> [{{ term.term_id }}] </template>
                      {{ term.name }}
                    </a>
                  </template>
                  <template v-else>
                    <template v-if="showTermIds"> [{{ term.term_id }}] </template>
                    {{ term.name }}
                  </template>
                </template>
                <template v-if="hpoTerms.length > maxHpoTerms"> , ... </template>
              </div>
              <div v-else class="text-grey font-italic">No HPO terms associated with gene.</div>
            </template>

            <!--
            == OMIM Diseases ==================================================
          -->
            <div class="text-subtitle-1 mt-3">
              OMIM Diseases
              <small> ({{ geneInfo?.dbnsfp?.mimDisease?.length ?? 0 }}) </small>
            </div>
            <div v-if="geneInfo?.dbnsfp?.mimDisease?.length">
              <template v-for="(disease, idx) in geneInfo?.dbnsfp?.mimDisease" :key="idx">
                <template v-if="idx > 0"> , </template>
                <template v-if="showTermLinks">
                  <a
                    :href="`https://www.omim.org/entry/${extractMimDiseaseId(disease)}`"
                    target="_blank"
                  >
                    <v-icon>mdi-launch</v-icon>
                    {{ transformMimDiseaseId(disease) }}
                  </a>
                </template>
                <template v-else>
                  {{ transformMimDiseaseId(disease) }}
                </template>
              </template>
            </div>
            <div v-else class="text-grey font-italic">No OMIM diseases annotated in dbNSFP.</div>
          </v-col>
          <v-col cols="3">
            <CadaRanking :hgnc-id="geneInfo?.hgnc?.agr" />
          </v-col>
        </v-row>
      </v-card-text>

      <v-expand-transition>
        <div v-if="isExpanded">
          <v-divider class="mt-3" />
          <v-card-text class="pt-3 pb-0">
            <!--
              == Orphanet Disorders =========================================
            -->
            <div class="text-subtitle-1 mt-3">
              Orphanet Disorders
              <small> ({{ geneInfo?.orpha?.orphaDiseases?.length ?? 0 }}) </small>
            </div>
            <div v-if="geneInfo?.orpha?.orphaDiseases?.length">
              <template v-for="(disease, idx) in geneInfo?.orpha?.orphaDiseases ?? []" :key="idx">
                <template v-if="idx > 0"> , </template>
                <template v-if="showTermLinks">
                  <a
                    :href="`https://www.orpha.net/consor/cgi-bin/Disease_Search_Simple.php?lng=EN&Disease_Disease_Search_diseaseGroup=${disease.orphaId.replace(
                      ':',
                      ' '
                    )}&Disease_Disease_Search_diseaseType=ORPHA`"
                    target="_blank"
                  >
                    <v-icon>mdi-launch</v-icon>
                    <template v-if="showTermIds"> [{{ disease.orphaId }}] </template>
                    {{ disease.label }}
                  </a>
                </template>
                <template v-else>
                  <template v-if="showTermIds"> [{{ disease.orphaId }}] </template>
                  {{ disease.label }}
                </template>
              </template>
            </div>
            <div v-else class="text-grey font-italic">
              No Orphanet disorders annotated for gene.
            </div>
          </v-card-text>
        </div>
      </v-expand-transition>

      <v-card-actions>
        <v-switch
          id="conditions-card-show-term-ids"
          v-model="showTermIds"
          color="primary"
          :value="true"
          :false-value="false"
          label="numeric terms"
          class="ml-3 d-inline-flex flex-grow-0"
          density="compact"
          inset
        />
        <v-switch
          v-model="showTermLinks"
          color="primary"
          :value="true"
          :false-value="false"
          label="show links"
          class="ml-3 d-inline-flex flex-grow-0"
          density="compact"
          inset
        />
        <v-btn
          :href="`https://hpo.jax.org/app/browse/gene/${geneInfo?.hgnc?.entrezId}`"
          target="_blank"
          prepend-icon="mdi-launch"
          class="ml-6"
        >
          JAX HPO
        </v-btn>
        <v-btn
          v-if="geneInfo?.hgnc?.omimId?.length"
          :href="`https://www.omim.org/entry/${geneInfo?.hgnc?.omimId[0]}`"
          target="_blank"
          prepend-icon="mdi-launch"
          class="ml-6"
        >
          OMIM
        </v-btn>
        <v-btn
          v-if="geneInfo?.hgnc?.orphanet"
          :href="`https://www.orpha.net/consor/cgi-bin/OC_Exp.php?Expert=${geneInfo?.hgnc?.orphanet}`"
          target="_blank"
          prepend-icon="mdi-launch"
          class="ml-6"
        >
          Orphanet
        </v-btn>

        <v-spacer />
        <div class="text-grey text-caption">
          Orphanet Diseases ({{ geneInfo?.orpha?.orphaDiseases?.length ?? 0 }})
        </div>
        <v-btn
          id="conditions-card-expand-button"
          :append-icon="isExpanded ? 'mdi-chevron-up' : 'mdi-chevron-down'"
          @click="isExpanded = !isExpanded"
        >
          <template v-if="!isExpanded"> More </template>
          <template v-if="isExpanded"> Less </template>
        </v-btn>
      </v-card-actions>
    </v-card>
  </template>
</template>
