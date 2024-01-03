<!--
This component displays related literature using the PubTator 3 API.
-->
<script setup lang="ts">
import { DateTime } from 'luxon'
import { onMounted, ref, watch } from 'vue'

import DocsLink from '@/components/DocsLink.vue'
import { StoreState } from '@/stores/misc'
import {
  type Annotation,
  type AnnotationLocation,
  AnnotationType,
  usePubtatorStore
} from '@/stores/pubtator'

/** Interface for this component's */
export interface Props {
  geneInfo: any
}

/** This component's props. */
const props = defineProps<Props>()

/** The PubTator store. */
const pubtatorStore = usePubtatorStore()

/** Any error message to display. */
const errorMessage = ref<string | undefined>(undefined)

/** Mapping from annotation type to VChip color. */
const TYPE_TO_CHIP_COLOR: { [key: string]: string } = {
  [AnnotationType.Disease]: 'orange',
  [AnnotationType.Gene]: '#8B2595',
  [AnnotationType.Chemical]: 'green',
  [AnnotationType.Species]: 'blue',
  [AnnotationType.Variant]: 'red',
  [AnnotationType.CellLine]: 'teal'
}

/** Mapping from annotation type to raw CSS color. */
const TYPE_TO_RAW_COLOR: { [key: string]: string } = {
  [AnnotationType.Disease]: '#FFF2E0',
  [AnnotationType.Gene]: '#C9B7CB',
  [AnnotationType.Chemical]: '#E9F5EA',
  [AnnotationType.Species]: '#E4F2FE',
  [AnnotationType.Variant]: '#FEE8E7',
  [AnnotationType.CellLine]: '#E0FDFD'
}

/** Helper that returns `Annotation.text` if name is just a number or empty. */
const annotationName = (annotation: Annotation) => {
  if (!annotation?.name?.length || annotation.name.match(/^\d+$/)) {
    return annotation.text
  }
  return annotation.name
}

/** Extract and normalize annotation from passage. */
const extractPassageAnnotations = (passage: any): Annotation[] => {
  const result: Annotation[] = []
  for (const annotation of passage.annotations) {
    result.push({
      type: annotation.infons.type as AnnotationType,
      name: annotation.infons.name,
      text: annotation.text,
      locations: annotation.locations as AnnotationLocation[]
    })
  }
  return result
}

/** Extract and normalize annotations from abstract. */
const extractAnnotations = (abstract: any): Annotation[] => {
  const seen: Set<string> = new Set()
  const annotations: Annotation[] = []
  for (const passage of abstract?.passages ?? []) {
    for (const annotation of extractPassageAnnotations(passage)) {
      if (seen.has(annotation.name ?? annotation.text ?? '')) {
        continue
      }
      annotations.push(annotation)
      seen.add(annotation.name ?? annotation.text ?? '')
    }
  }
  return annotations
}

/** Load the information from PubTator 3 API via local proxy. */
const loadPubTator = async () => {
  try {
    await pubtatorStore.initialize(props.geneInfo?.hgnc?.symbol)
  } catch (e) {
    errorMessage.value = `Error loading PubTator 3 data: ${e}`
  }
}

/** Local type for storing Location and annotation, location on top level. */
interface LocationAnnotation {
  /** The location of the annotation. */
  location: AnnotationLocation
  /** The annotation. */
  annotation: Annotation
}

/** Returns "inner" HTML with highlighting for annotation. */
const highlight = (text: string, annotations: Annotation[], baseOffset: number): string => {
  // get list of all annotations
  const locationAnnotations: LocationAnnotation[] = []
  for (const annotation of annotations) {
    for (const location of annotation.locations) {
      locationAnnotations.push({
        location: location,
        annotation: annotation
      })
    }
  }
  locationAnnotations.sort((a, b) => a.location.offset - b.location.offset)

  // now process all annotations
  const arr: string[] = []
  let prevEnd = 0
  for (const locationAnnotation of locationAnnotations) {
    if (prevEnd > locationAnnotation.location.offset) {
      continue // skip overlapping annotations
    }

    // push text before annotation
    const textStart = prevEnd
    const textEnd = locationAnnotation.location.offset
    if (textStart != textEnd) {
      arr.push(text.slice(textStart - baseOffset, textEnd - baseOffset))
    }

    // push annotation
    const annoStart = locationAnnotation.location.offset
    const annoEnd = locationAnnotation.location.offset + locationAnnotation.location.length
    arr.push(
      `<span style="background-color: ${TYPE_TO_RAW_COLOR[locationAnnotation.annotation.type]};">`
    )
    arr.push(text.slice(annoStart - baseOffset, annoEnd - baseOffset))
    arr.push('</span>')

    prevEnd = annoEnd
  }

  // push remaining text
  if (prevEnd < text.length) {
    arr.push(text.slice(prevEnd - baseOffset))
  }

  return arr.join('')
}

// Load information on mount.
onMounted(loadPubTator)
// Load information when the gene symbol changes.
watch(() => props.geneInfo?.hgnc?.symbol, loadPubTator)
</script>

<template>
  <!-- no HGNC symbol => display loader -->
  <template v-if="!geneInfo?.hgnc?.symbol">
    <v-skeleton-loader class="mt-3 mx-auto border" type="heading,subtitle,text,text" />
  </template>

  <!-- otherwise, display actual card -->
  <template v-else>
    <v-card class="mt-3">
      <v-card-title class="pb-0 pr-2">
        Literature
        <DocsLink anchor="literature" />
      </v-card-title>
      <v-card-subtitle class="text-overline"> Top 10 from PubTator 3 </v-card-subtitle>
      <v-card-text class="pt-3">
        <v-alert v-if="errorMessage" type="error" dismissible>
          {{ errorMessage }}
        </v-alert>
        <div
          v-if="!errorMessage && pubtatorStore.storeState !== StoreState.Active"
          class="text-center"
        >
          <v-progress-circular indeterminate />
        </div>
        <div v-else>
          <div
            v-for="(pmid, idx) in pubtatorStore.pmids"
            :key="pmid"
            :class="{ 'mt-3 pt-3 border-top': idx > 0 }"
          >
            <span>
              #{{ idx + 1 }}
              &middot;
              <a
                :href="`https://pubmed.ncbi.nlm.nih.gov/${pubtatorStore.searchResults[pmid]?.abstract.pmid}/`"
                target="_blank"
              >
                {{ pubtatorStore.searchResults[pmid]?.abstract.pmid }}
                <small><v-icon>mdi-launch</v-icon></small>
              </a>
              &middot;
              {{ pubtatorStore.searchResults[pmid]?.abstract.journal }}
              &middot;
              {{
                DateTime.fromISO(pubtatorStore.searchResults[pmid]?.abstract.date).toFormat(
                  'yyyy/MM/dd'
                )
              }}
            </span>

            <div
              v-for="passage in pubtatorStore.searchResults[pmid]?.abstract.passages"
              :key="passage.offset"
            >
              <div v-if="passage.infons.type === 'title'">
                <div class="text-h6">
                  <!-- eslint-disable vue/no-v-html -->
                  <span
                    v-html="
                      highlight(passage.text, extractPassageAnnotations(passage), passage.offset)
                    "
                  />
                  <!-- eslint-enable -->
                </div>
                <div class="text-body-2 text-grey-darken-1">
                  {{ pubtatorStore.searchResults[pmid]?.abstract?.authors.join(', ') }}
                </div>
              </div>
              <div v-else-if="passage.infons.type === 'abstract'">
                <div class="text-body-2">
                  <!-- eslint-disable vue/no-v-html -->
                  <span
                    v-html="
                      highlight(passage.text, extractPassageAnnotations(passage), passage.offset)
                    "
                  />
                  <!-- eslint-enable -->
                </div>
              </div>
            </div>

            <div v-if="extractAnnotations(pubtatorStore.searchResults[pmid]?.abstract).length > 0">
              <template
                v-for="(annotation, idxInner) in extractAnnotations(
                  pubtatorStore.searchResults[pmid]?.abstract
                )"
                :key="idxInner"
              >
                <v-chip
                  rounded="xl"
                  :text="annotationName(annotation)"
                  :title="`'${annotation.text}' (${annotation.type})`"
                  :color="TYPE_TO_CHIP_COLOR[annotation.type]"
                  class="mt-3"
                  :class="{ 'ml-1': idxInner > 0 }"
                />
              </template>
            </div>
          </div>
        </div>
      </v-card-text>

      <v-card-actions>
        <v-btn
          :href="`https://www.ncbi.nlm.nih.gov/research/pubtator3/docsum?text=@GENE_${geneInfo?.hgnc?.symbol}`"
          target="_blank"
          prepend-icon="mdi-launch"
        >
          PubTator 3
        </v-btn>
      </v-card-actions>
    </v-card>
  </template>
</template>

<style scoped>
.border-top {
  border-top: 1px solid #bbb;
}
</style>
