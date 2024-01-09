<script setup lang="ts">
import { titleCase } from 'title-case'
import { computed, ref } from 'vue'

import type { HpoTerm } from '@/api/viguno'
import DocsLink from '@/components/DocsLink.vue'
import CadaRanking from '@/components/GeneDetails/ConditionsCard/CadaRanking.vue'
import { extractDbnsfpMimDiseaseId, transformDbnsfpMimDiseaseId } from '@/lib/utils'

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

// -- code for PanelApp conditions -------------------------------------------

/** Enumeration for PanelApp confidence levels. */
enum PanelAppConfidenceLevel {
  Green = 'CONFIDENCE_LEVEL_GREEN',
  Amber = 'CONFIDENCE_LEVEL_AMBER',
  Red = 'CONFIDENCE_LEVEL_RED'
}

/** Compare `PanelAppConfidenceLevel` in a sort-compatible way */
const comparePanelAppConfidenceLevel = (
  lhs: PanelAppConfidenceLevel,
  rhs: PanelAppConfidenceLevel
): number => {
  switch (lhs) {
    case PanelAppConfidenceLevel.Green:
      switch (rhs) {
        case PanelAppConfidenceLevel.Green:
          return 0
        case PanelAppConfidenceLevel.Amber:
        case PanelAppConfidenceLevel.Red:
          return -1
      }
    case PanelAppConfidenceLevel.Amber:
      switch (rhs) {
        case PanelAppConfidenceLevel.Green:
          return 1
        case PanelAppConfidenceLevel.Amber:
          return 0
        case PanelAppConfidenceLevel.Red:
          return -1
      }
    case PanelAppConfidenceLevel.Red:
      switch (rhs) {
        case PanelAppConfidenceLevel.Green:
        case PanelAppConfidenceLevel.Amber:
          return 1
        case PanelAppConfidenceLevel.Red:
          return 0
      }
  }
}

/** Return label for `PanelAppConfidenceLevel`. */
const confidenceLabel = (level: PanelAppConfidenceLevel): string => {
  switch (level) {
    case PanelAppConfidenceLevel.Green:
      return 'green'
    case PanelAppConfidenceLevel.Amber:
      return 'amber'
    case PanelAppConfidenceLevel.Red:
      return 'red'
  }
}

/**
 * Representation of a PanelApp.
 */
interface PanelAppCondition {
  panelId: number
  title: string
  confidence: PanelAppConfidenceLevel
}

/**
 * Return list of PanelApp conditions with reduced redundancy.
 *
 * Note that proper redundancy removal can only be done with proper named
 * entity normalization which is on our TODO list.
 */
const panelAppConditions = computed<PanelAppCondition[]>(() => {
  if (!props.geneInfo?.panelapp) {
    return []
  }

  // seen conditions
  const seen = new Map<string, PanelAppCondition>()

  /** Normalize phenotype name. */
  const normalizeName = (name: string): string => {
    const match = [...name.matchAll(/\{(.*)\}/g)]
    let result: string
    if (match.length) {
      result = match[0][1]
    } else {
      result = name
    }

    result = result
      .replace(/,? \d{6,6}$/, '')
      .replace(/,? MONDO:\d{6,6}/, '')
      .replace(/,? O?MIM:\d{6,6}/, '')
      .replace(/,? \(\d{6,6}\)/, '')

    return result
  }

  // Collect phenotypes by panel in a somewhat non-redundant way.
  for (const entry of props.geneInfo.panelapp) {
    if (entry.phenotypes?.length) {
      const phenotype = normalizeName(entry.phenotypes[0])
      const seenEntry = seen.get(phenotype.toLowerCase())
      let entryOverridesSeen = true
      if (seenEntry) {
        entryOverridesSeen =
          comparePanelAppConfidenceLevel(entry.confidenceLevel, seenEntry.confidence) < 0
      }
      if (entryOverridesSeen) {
        seen.set(phenotype.toLowerCase(), {
          panelId: entry.panel?.id,
          title: phenotype,
          confidence: entry.confidenceLevel
        })
      }
    }
  }

  // Obtain list of conditions, sorted by confidence level.
  const result = Array.from(seen.values())
  result.sort((lhs, rhs) => {
    const tmp = comparePanelAppConfidenceLevel(lhs.confidence, rhs.confidence)
    if (tmp == 0) {
      return lhs.title.localeCompare(rhs.title)
    } else {
      return tmp
    }
  })

  return result
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
                    :href="`https://www.omim.org/entry/${extractDbnsfpMimDiseaseId(disease)}`"
                    target="_blank"
                  >
                    <v-icon>mdi-launch</v-icon>
                    {{ transformDbnsfpMimDiseaseId(disease, showTermIds) }}
                  </a>
                </template>
                <template v-else>
                  {{ transformDbnsfpMimDiseaseId(disease, showTermIds) }}
                </template>
              </template>
            </div>
            <div v-else class="text-grey font-italic">No OMIM diseases annotated in dbNSFP.</div>

            <!--
            == PanelApp Conditions ============================================
          -->
            <div class="text-subtitle-1 mt-3">
              PanelApp Conditions
              <small> ({{ panelAppConditions.length }}) </small>
            </div>
            <div v-if="panelAppConditions.length > 0">
              <template v-for="(condition, idx) in panelAppConditions" :key="idx">
                <template v-if="idx > 0"> , </template>
                <template v-if="showTermLinks">
                  <a
                    :href="`https://panelapp.genomicsengland.co.uk/panels/${condition.panelId}/`"
                    target="_blank"
                  >
                    <v-icon>mdi-launch</v-icon>
                    {{ condition.title }}
                    <small> ({{ confidenceLabel(condition.confidence) }}) </small>
                  </a>
                </template>
                <template v-else>
                  {{ condition.title }}
                  <small> ({{ confidenceLabel(condition.confidence) }}) </small>
                </template>
              </template>
            </div>
            <div v-else class="text-grey font-italic">No PanelApp conditions found.</div>
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
