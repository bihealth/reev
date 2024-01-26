<script setup lang="ts">
import { titleCase } from 'title-case'
import { computed, ref } from 'vue'
import { onMounted, watch } from 'vue'

import type { HpoTerm } from '@/api/viguno'
import DocsLink from '@/components/DocsLink.vue'
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

// -- code for integrated conditions -----------------------------------------

enum GeneDiseaseAssociationSource {
  Omim = 'GENE_DISEASE_ASSOCIATION_SOURCE_OMIM',
  Orphanet = 'GENE_DISEASE_ASSOCIATION_SOURCE_ORPHANET',
  Panelapp = 'GENE_DISEASE_ASSOCIATION_SOURCE_PANELAPP'
}

const GDA_LABELS: { [key in GeneDiseaseAssociationSource]: string } = {
  [GeneDiseaseAssociationSource.Omim]: 'OMIM',
  [GeneDiseaseAssociationSource.Orphanet]: 'Orphanet',
  [GeneDiseaseAssociationSource.Panelapp]: 'PanelApp'
}

enum ConfidenceLevel {
  High = 'CONFIDENCE_LEVEL_HIGH',
  Medium = 'CONFIDENCE_LEVEL_MEDIUM',
  Low = 'CONFIDENCE_LEVEL_LOW'
}

const CONFIDENCE_LEVEL_LABELS: { [key in ConfidenceLevel]: string } = {
  [ConfidenceLevel.High]: 'High',
  [ConfidenceLevel.Medium]: 'Medium',
  [ConfidenceLevel.Low]: 'Low'
}

interface LabeledDisorder {
  termId: string
  title: string | null
}

interface GeneDiseaseAssociation {
  hgnc_id: string
  labeledDisorders: LabeledDisorder[]
  diseaseName: string | null
  diseaseDefinition: string | null
  sources: GeneDiseaseAssociationSource[]
  confidence: ConfidenceLevel
}

interface PanelappPanel {
  id: number
  name: string
  version: string
}

enum PanelappConfidence {
  Green = 'PANELAPP_CONFIDENCE_GREEN',
  Amber = 'PANELAPP_CONFIDENCE_AMBER',
  Red = 'PANELAPP_CONFIDENCE_RED'
}

const PANELAPP_CONFIDENCE_LABELS: { [key in PanelappConfidence]: string } = {
  [PanelappConfidence.Green]: 'Green',
  [PanelappConfidence.Amber]: 'Amber',
  [PanelappConfidence.Red]: 'Red'
}

const PANELAPP_CONFIDENCE_ORDER: { [key in PanelappConfidence]: number } = {
  [PanelappConfidence.Green]: 0,
  [PanelappConfidence.Amber]: 1,
  [PanelappConfidence.Red]: 2
}

enum PanelappEntityType {
  Gene = 'PANELAPP_ASSOCIATION_GENE',
  Region = 'PANELAPP_ASSOCIATION_REGION',
  Str = 'PANELAPP_ASSOCIATION_STR'
}

// const PANELAPP_ENTITY_TYPE_LABELS: { [key in PanelappEntityType]: string } = {
//   [PanelappEntityType.Gene]: 'Gene',
//   [PanelappEntityType.Region]: 'Region',
//   [PanelappEntityType.Str]: 'STR'
// }

interface PanelappAssociation {
  hgncId: string
  confidenceLevel: PanelappConfidence
  entityType: PanelappEntityType
  modeOfInheritance: string | null
  phenotypes: string[]
  panel: PanelappPanel
}

interface ConditionsRecord {
  hgncId: string
  diseaseAssociations: GeneDiseaseAssociation[]
  panelappAssociations: PanelappAssociation[]
}

const conditions = computed<ConditionsRecord>(() => {
  if (props.geneInfo?.conditions) {
    return props.geneInfo.conditions as ConditionsRecord
  } else {
    return {
      hgncId: props.geneInfo?.hgnc?.id ?? '',
      diseaseAssociations: [],
      panelappAssociations: []
    }
  }
})

// -- code for shortened / full associate disease list -----------------------

/** Maxmimal number of diseases terms to show by default. */
const maxDiseases = 3

/** Whether to show all terms. */
const showAllDiseases = ref<boolean>(false)

/** The diseases to show. */
const diseasesToShow = computed<GeneDiseaseAssociation[]>(() => {
  if (showAllDiseases.value) {
    return conditions.value.diseaseAssociations
  } else {
    return conditions.value.diseaseAssociations.slice(0, maxDiseases)
  }
})

/** Whether to display disease details. */
const showDiseaseDetails = ref<boolean[]>([])

/** Initialize the showDiseaseDetails. */
const initShowDiseaseDetails = () => {
  showDiseaseDetails.value = conditions.value.diseaseAssociations.map(() => false)
}

/** Sorting `v-model` attributes for disease list. */
const sortKeyDisease = ref<string>('diseaseName')
const sortOrderDisease = ref<'asc' | 'desc'>('asc')
const sortItemsDisease = [
  {
    label: 'confidence',
    key: 'confidence'
  },
  {
    label: 'name',
    key: 'diseaseName'
  }
]

/** Custom function for sorting confidence Level. */
const confidenceLevelSorting = (a: string, b: string) => {
  const confidenceA = PANELAPP_CONFIDENCE_ORDER[a as PanelappConfidence]
  const confidenceB = PANELAPP_CONFIDENCE_ORDER[b as PanelappConfidence]
  return confidenceA - confidenceB
}

/** Custom sorting functions for `v-data-iterator` */
type DataTableCompareFunction<T = any> = (a: T, b: T) => number
const customKeySortPanelApp: { [key: string]: DataTableCompareFunction } = {
  confidenceLevel: confidenceLevelSorting
}
const customKeySortDisease: { [key: string]: DataTableCompareFunction } = {
  confidence: confidenceLevelSorting
}

onMounted(() => initShowDiseaseDetails())
watch(
  () => conditions.value,
  () => initShowDiseaseDetails()
)

// -- code for shortened / full PanelApp panel list --------------------------

/** Maxmimal number of diseases terms to show by default. */
const maxPanels = 3

/** Whether to show all terms. */
const showAllPanels = ref<boolean>(false)

/** The diseases to show. */
const panelsToShow = computed<PanelappAssociation[]>(() => {
  if (showAllPanels.value) {
    return conditions.value.panelappAssociations
  } else {
    return conditions.value.panelappAssociations.slice(0, maxPanels)
  }
})

/** Whether to display PanelApp panel details. */
const showPanelDetails = ref<boolean[]>([])

/** Initialize the showPanelDetails. */
const initShowPanelDetails = () => {
  showPanelDetails.value = conditions.value.diseaseAssociations.map(() => false)
}

/** Sorting `v-model` attributes for PanelApp panel list. */
const sortKeyPanelApp = ref<string>('confidenceLevel')
const sortOrderPanelApp = ref<'asc' | 'desc'>('desc')
const sortItemsPanelApp = [
  {
    label: 'confidence',
    key: 'confidenceLevel'
  },
  {
    label: 'name',
    key: 'panel.name'
  },
  {
    label: 'mode of inheritance',
    key: 'modeOfInheritance'
  }
]

onMounted(() => initShowPanelDetails())
watch(
  () => conditions.value,
  () => initShowPanelDetails()
)
</script>

<template>
  <!-- no ENSG => display loader -->
  <template v-if="!geneInfo?.dbnsfp?.geneName?.length">
    <v-skeleton-loader class="mt-3 mx-auto border" type="image,button" />
  </template>

  <!-- otherwise, display actual card -->
  <template v-else>
    <v-card class="mt-3">
      <v-card-title class="pb-0 pr-2">
        Associated Conditions
        <DocsLink anchor="associated-conditions" />
      </v-card-title>
      <v-card-subtitle class="text-overline">
        Phenotypes and Disorders Associated with Gene
      </v-card-subtitle>
      <v-card-text class="pt-3">
        <v-row>
          <v-col cols="9" class="pt-0">
            <template v-if="hpoTerms === null">
              <v-skeleton-loader class="mt-3 mx-auto border" type="header,text" />
            </template>
            <template v-else>
              <!-- == ACMG SF ====== -->
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
              <!-- == Conditions ===== -->

              <div v-if="conditions.diseaseAssociations.length">
                <v-data-iterator
                  :items="diseasesToShow"
                  :item-key="(item: GeneDiseaseAssociation) => item.hgnc_id"
                  :sort-by="[{ key: sortKeyDisease, order: sortOrderDisease }]"
                  :custom-key-sort="customKeySortDisease"
                  :items-per-page="-1"
                  :hide-default-footer="true"
                  class="mt-3"
                >
                  <template #header>
                    <v-toolbar class="px-2 rounded-t-lg border" color="background">
                      <div class="text-subtitle-1" :class="{ 'mt-3': geneInfo?.acmgSf }">
                        Associated Diseases
                        <small>
                          <template
                            v-if="(conditions.diseaseAssociations?.length ?? 0) > maxDiseases"
                          >
                            <template v-if="showAllDiseases">
                              ({{ conditions.diseaseAssociations?.length }} of
                              {{ conditions.diseaseAssociations?.length }})
                            </template>
                            <template v-else>
                              ({{ diseasesToShow.length }} of
                              {{ conditions.diseaseAssociations?.length }})
                            </template>
                          </template>
                          <template v-else>
                            ({{ conditions.diseaseAssociations?.length }})
                          </template>

                          <template v-if="conditions.diseaseAssociations.length > maxDiseases">
                            &bullet;
                            <a href="#" @click.prevent="showAllDiseases = !showAllDiseases">
                              {{ showAllDiseases ? ' show fewer' : ' show all' }}
                            </a>
                          </template>
                        </small>
                      </div>
                      <v-spacer></v-spacer>
                      <div style="width: 220px">
                        <v-select
                          v-model="sortKeyDisease"
                          label="sort by"
                          item-title="label"
                          item-value="key"
                          :items="sortItemsDisease"
                          density="compact"
                          :hide-details="true"
                          variant="outlined"
                        />
                      </div>
                      <v-btn @click="sortOrderDisease = sortOrderDisease == 'asc' ? 'desc' : 'asc'">
                        {{ sortOrderDisease }}
                        <v-icon
                          :icon="
                            sortOrderDisease == 'asc' ? 'mdi-sort-ascending' : 'mdi-sort-descending'
                          "
                          class="pl-3"
                        />
                      </v-btn>
                    </v-toolbar>
                  </template>

                  <template #default="{ items }">
                    <template v-for="item in items" :key="item.raw">
                      <v-sheet class="rounded-l px-3 py-2 mt-3" color="background">
                        <div class="text-h6">
                          {{ item.raw.diseaseName }}
                        </div>
                        <div class="text-body-2 mt-1">
                          Description: {{ item.raw.diseaseDefinition ?? 'N/A' }}
                        </div>
                        <div class="text-body-2 mt-2">
                          <span class="font-weight-bold"> Confidence: </span>
                          <span
                            class="text-no-wrap"
                            :title="CONFIDENCE_LEVEL_LABELS[item.raw.confidence as ConfidenceLevel]"
                          >
                            <template v-if="item.raw.confidence === ConfidenceLevel.High">
                              <v-icon>mdi-star</v-icon>
                              <v-icon>mdi-star</v-icon>
                              <v-icon>mdi-star</v-icon>
                            </template>
                            <template v-else-if="item.raw.confidence === ConfidenceLevel.Medium">
                              <v-icon>mdi-star</v-icon>
                              <v-icon>mdi-star</v-icon>
                              <v-icon>mdi-star-outline</v-icon>
                            </template>
                            <template v-else>
                              <v-icon>mdi-star</v-icon>
                              <v-icon>mdi-star-outline</v-icon>
                              <v-icon>mdi-star-outline</v-icon>
                            </template>
                          </span>
                          <span class="font-weight-bold"> &bullet; Sources: </span>
                          {{
                            item.raw.sources
                              .map((s: keyof typeof GDA_LABELS) => GDA_LABELS[s])
                              .join(', ')
                          }}
                        </div>
                        <v-expansion-panels color="background" variant="popout">
                          <v-expansion-panel bg-color="background" rounded="lg">
                            <v-expansion-panel-title
                              expand-icon="mdi-plus"
                              collapse-icon="mdi-minus"
                            >
                              Additional Information
                            </v-expansion-panel-title>
                            <v-expansion-panel-text>
                              <div style="border-top: 1px solid black" class="mt-2 pt-2 pl-4">
                                <ul
                                  v-for="(disorder, idxDisorder) in item.raw.labeledDisorders"
                                  :key="idxDisorder"
                                >
                                  <li>[{{ disorder.termId }}] {{ disorder.title }}</li>
                                </ul>
                              </div>
                            </v-expansion-panel-text>
                          </v-expansion-panel>
                        </v-expansion-panels>
                      </v-sheet>
                    </template>
                  </template>

                  <template #no-data>
                    <v-sheet class="pa-3 text-center font-italic border">
                      No diseases associated with gene.
                    </v-sheet>
                  </template>
                </v-data-iterator>
              </div>

              <div v-else class="text-grey font-italic">No diseases associated with gene.</div>
              <!-- == PanelApp Panels -->

              <div v-if="conditions.panelappAssociations.length">
                <v-data-iterator
                  :items="panelsToShow"
                  :item-key="(item: PanelappAssociation) => item.panel.id"
                  :sort-by="[{ key: sortKeyPanelApp, order: sortOrderPanelApp }]"
                  :custom-key-sort="customKeySortPanelApp"
                  :items-per-page="-1"
                  :hide-default-footer="true"
                  class="mt-3"
                >
                  <template #header>
                    <v-toolbar class="px-2 rounded-t-lg border" color="background">
                      <div class="text-subtitle-1 mt-3">
                        PanelApp Panels for {{ geneInfo.acmgSf.geneSymbol }}
                        <a
                          :href="`https://panelapp.genomicsengland.co.uk/panels/entities/${geneInfo.acmgSf.geneSymbol}`"
                          target="_blank"
                        >
                          <v-icon>mdi-launch</v-icon>
                        </a>
                        <small>
                          <template
                            v-if="(conditions.panelappAssociations?.length ?? 0) > maxPanels"
                          >
                            <template v-if="showAllPanels">
                              ({{ conditions.panelappAssociations?.length }} of
                              {{ conditions.panelappAssociations?.length }})
                            </template>
                            <template v-else>
                              ({{ panelsToShow.length }} of
                              {{ conditions.panelappAssociations?.length }})
                            </template>
                          </template>
                          <template v-else>
                            ({{ conditions.panelappAssociations?.length }})
                          </template>

                          <template v-if="conditions.panelappAssociations.length > maxPanels">
                            &bullet;
                            <a href="#" @click.prevent="showAllPanels = !showAllPanels">
                              {{ showAllPanels ? ' show fewer' : ' show all' }}
                            </a>
                          </template>
                        </small>
                      </div>
                      <v-spacer></v-spacer>
                      <div style="width: 220px">
                        <v-select
                          v-model="sortKeyPanelApp"
                          label="sort by"
                          item-title="label"
                          item-value="key"
                          :items="sortItemsPanelApp"
                          density="compact"
                          :hide-details="true"
                          variant="outlined"
                        />
                      </div>
                      <v-btn
                        @click="sortOrderPanelApp = sortOrderPanelApp == 'asc' ? 'desc' : 'asc'"
                      >
                        {{ sortOrderPanelApp }}
                        <v-icon
                          :icon="
                            sortOrderPanelApp == 'asc'
                              ? 'mdi-sort-ascending'
                              : 'mdi-sort-descending'
                          "
                          class="pl-3"
                        />
                      </v-btn>
                    </v-toolbar>
                  </template>

                  <template #default="{ items }">
                    <template v-for="item in items" :key="item.raw.panel.name">
                      <v-sheet class="rounded-l px-3 py-2 mt-3" color="background">
                        <div class="text-h6">
                          {{ item.raw.panel.name }}
                          <small> (v{{ item.raw.panel.version }}) </small>
                          <a
                            :href="`https://panelapp.genomicsengland.co.uk/panels/${item.raw.panel.id}`"
                            target="_blank"
                            class="ml-2"
                          >
                            <v-icon>mdi-launch</v-icon>
                          </a>
                        </div>
                        <!-- <div class="text-body-2 mt-1">
                        Description: {{ item.raw.diseaseDefinition ?? 'N/A' }}
                      </div> -->
                        <div class="text-body-2 mt-2">
                          <span class="font-weight-bold"> Confidence: </span>
                          <span
                            class="text-no-wrap"
                            :title="
                              PANELAPP_CONFIDENCE_LABELS[
                                item.raw.confidenceLevel as PanelappConfidence
                              ]
                            "
                          >
                            <template v-if="item.raw.confidenceLevel === PanelappConfidence.Green">
                              <v-icon>mdi-star</v-icon>
                              <v-icon>mdi-star</v-icon>
                              <v-icon>mdi-star</v-icon>
                            </template>
                            <template
                              v-else-if="item.raw.confidenceLevel === PanelappConfidence.Amber"
                            >
                              <v-icon>mdi-star</v-icon>
                              <v-icon>mdi-star</v-icon>
                              <v-icon>mdi-star-outline</v-icon>
                            </template>
                            <template v-else>
                              <v-icon>mdi-star</v-icon>
                              <v-icon>mdi-star-outline</v-icon>
                              <v-icon>mdi-star-outline</v-icon>
                            </template>
                          </span>
                          <span class="font-weight-bold"> &bullet; Mode of Inheritance: </span>
                          <span> {{ item.raw.modeOfInheritance }} </span>
                        </div>

                        <v-expansion-panels color="background" variant="popout">
                          <v-expansion-panel bg-color="background" rounded="lg">
                            <v-expansion-panel-title
                              expand-icon="mdi-plus"
                              collapse-icon="mdi-minus"
                            >
                              Additional Information
                            </v-expansion-panel-title>
                            <v-expansion-panel-text>
                              Gene specific panel decision in PanelApp:
                              <a
                                :href="`https://panelapp.genomicsengland.co.uk/panels/${item.raw.panel.id}/gene/${geneInfo.acmgSf.geneSymbol}`"
                                target="_blank"
                              >
                                <v-icon>mdi-launch</v-icon>
                              </a>
                              <div style="border-top: 1px solid black" class="mt-2 pt-2 pl-4">
                                <ul
                                  v-for="(phenotype, idxPhenotype) in item.raw.phenotypes"
                                  :key="idxPhenotype"
                                >
                                  <li>{{ phenotype }}</li>
                                </ul>
                              </div>
                            </v-expansion-panel-text>
                          </v-expansion-panel>
                        </v-expansion-panels>
                      </v-sheet>
                    </template>
                  </template>

                  <template #no-data>
                    <v-sheet class="pa-3 text-center font-italic border">
                      No PanelApp panels associated with gene.
                    </v-sheet>
                  </template>
                </v-data-iterator>
              </div>
              <div v-else class="text-grey font-italic">
                No PanelApp panels associated with gene.
              </div>

              <!-- == HPO Terms ===== -->
              <div class="text-subtitle-1 mt-3">
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

            <!--
            == OMIM Diseases ==================================================
          -->
            <div class="text-subtitle-1 mt-3">
              OMIM Diseases
              <small> ({{ geneInfo?.omim?.omimDiseases?.length ?? 0 }}) </small>
            </div>
            <div v-if="geneInfo?.omim?.omimDiseases?.length">
              <template v-for="(disease, idx) in geneInfo?.omim?.omimDiseases" :key="idx">
                <template v-if="idx > 0"> , </template>
                <template v-if="showTermLinks">
                  <a
                    :href="`https://www.omim.org/entry/${disease.label.split(':')[1]}`"
                    target="_blank"
                  >
                    <v-icon>mdi-launch</v-icon>
                    <span v-if="showTermIds"> [{{ disease.omimId }}] </span>
                    {{ disease.label }}
                  </a>
                </template>
                <template v-else>
                  <span v-if="showTermIds"> [{{ disease.omimId }}] </span>
                  {{ disease.label }}
                </template>
              </template>
            </div>
            <div v-else class="text-grey font-italic">No OMIM diseases found.</div>
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
          OMIM ({{ geneInfo?.omim?.omimDiseases?.length ?? 0 }}) &bullet; Orphanet ({{
            geneInfo?.orpha?.orphaDiseases?.length ?? 0
          }})
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
