<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import isEqual from 'lodash.isequal'

import { copy } from '@/api/utils'
import { StoreState } from '@/stores/misc'
import { useVariantAcmgRatingStore } from '@/stores/variantAcmgRating'
import { useVariantInfoStore } from '@/stores/variantInfo'

const props = defineProps({
  smallVariant: Object
})

const acmgRatingStore = useVariantAcmgRatingStore()
const variantInfoStore = useVariantInfoStore()

const emptyAcmgRatingTemplate = {
  pvs1: 0,
  ps1: 0,
  ps2: 0,
  ps3: 0,
  ps4: 0,
  pm1: 0,
  pm2: 0,
  pm3: 0,
  pm4: 0,
  pm5: 0,
  pm6: 0,
  pp1: 0,
  pp2: 0,
  pp3: 0,
  pp4: 0,
  pp5: 0,
  ba1: 0,
  bs1: 0,
  bs2: 0,
  bs3: 0,
  bs4: 0,
  bp1: 0,
  bp2: 0,
  bp3: 0,
  bp4: 0,
  bp5: 0,
  bp6: 0,
  bp7: 0,
  class_auto: 3,
  class_override: null
}

const acmgRatingToSubmit = ref({ ...emptyAcmgRatingTemplate })
const acmgRatingConflicting = ref(false)

const unsetAcmgRating = () => {
  acmgRatingToSubmit.value = { ...emptyAcmgRatingTemplate }
}

const resetAcmgRating = () => {
  if (acmgRatingStore.acmgRating) {
    acmgRatingToSubmit.value.pvs1 = acmgRatingStore.acmgRating.pvs1
    acmgRatingToSubmit.value.ps1 = acmgRatingStore.acmgRating.ps1
    acmgRatingToSubmit.value.ps2 = acmgRatingStore.acmgRating.ps2
    acmgRatingToSubmit.value.ps3 = acmgRatingStore.acmgRating.ps3
    acmgRatingToSubmit.value.ps4 = acmgRatingStore.acmgRating.ps4
    acmgRatingToSubmit.value.pm1 = acmgRatingStore.acmgRating.pm1
    acmgRatingToSubmit.value.pm2 = acmgRatingStore.acmgRating.pm2
    acmgRatingToSubmit.value.pm3 = acmgRatingStore.acmgRating.pm3
    acmgRatingToSubmit.value.pm4 = acmgRatingStore.acmgRating.pm4
    acmgRatingToSubmit.value.pm5 = acmgRatingStore.acmgRating.pm5
    acmgRatingToSubmit.value.pm6 = acmgRatingStore.acmgRating.pm6
    acmgRatingToSubmit.value.pp1 = acmgRatingStore.acmgRating.pp1
    acmgRatingToSubmit.value.pp2 = acmgRatingStore.acmgRating.pp2
    acmgRatingToSubmit.value.pp3 = acmgRatingStore.acmgRating.pp3
    acmgRatingToSubmit.value.pp4 = acmgRatingStore.acmgRating.pp4
    acmgRatingToSubmit.value.pp5 = acmgRatingStore.acmgRating.pp5
    acmgRatingToSubmit.value.ba1 = acmgRatingStore.acmgRating.ba1
    acmgRatingToSubmit.value.bs1 = acmgRatingStore.acmgRating.bs1
    acmgRatingToSubmit.value.bs2 = acmgRatingStore.acmgRating.bs2
    acmgRatingToSubmit.value.bs3 = acmgRatingStore.acmgRating.bs3
    acmgRatingToSubmit.value.bs4 = acmgRatingStore.acmgRating.bs4
    acmgRatingToSubmit.value.bp1 = acmgRatingStore.acmgRating.bp1
    acmgRatingToSubmit.value.bp2 = acmgRatingStore.acmgRating.bp2
    acmgRatingToSubmit.value.bp3 = acmgRatingStore.acmgRating.bp3
    acmgRatingToSubmit.value.bp4 = acmgRatingStore.acmgRating.bp4
    acmgRatingToSubmit.value.bp5 = acmgRatingStore.acmgRating.bp5
    acmgRatingToSubmit.value.bp6 = acmgRatingStore.acmgRating.bp6
    acmgRatingToSubmit.value.bp7 = acmgRatingStore.acmgRating.bp7
    acmgRatingToSubmit.value.class_auto = acmgRatingStore.acmgRating.class_auto
    acmgRatingToSubmit.value.class_override = acmgRatingStore.acmgRating.class_override
  } else {
    unsetAcmgRating()
  }
}

const acmgRatingSubmitted = computed(() => {
  if (!acmgRatingStore.acmgRating) {
    return false
  }
  return (
    acmgRatingToSubmit.value.pvs1 === acmgRatingStore.acmgRating.pvs1 &&
    acmgRatingToSubmit.value.ps1 === acmgRatingStore.acmgRating.ps1 &&
    acmgRatingToSubmit.value.ps2 === acmgRatingStore.acmgRating.ps2 &&
    acmgRatingToSubmit.value.ps3 === acmgRatingStore.acmgRating.ps3 &&
    acmgRatingToSubmit.value.ps4 === acmgRatingStore.acmgRating.ps4 &&
    acmgRatingToSubmit.value.pm1 === acmgRatingStore.acmgRating.pm1 &&
    acmgRatingToSubmit.value.pm2 === acmgRatingStore.acmgRating.pm2 &&
    acmgRatingToSubmit.value.pm3 === acmgRatingStore.acmgRating.pm3 &&
    acmgRatingToSubmit.value.pm4 === acmgRatingStore.acmgRating.pm4 &&
    acmgRatingToSubmit.value.pm5 === acmgRatingStore.acmgRating.pm5 &&
    acmgRatingToSubmit.value.pm6 === acmgRatingStore.acmgRating.pm6 &&
    acmgRatingToSubmit.value.pp1 === acmgRatingStore.acmgRating.pp1 &&
    acmgRatingToSubmit.value.pp2 === acmgRatingStore.acmgRating.pp2 &&
    acmgRatingToSubmit.value.pp3 === acmgRatingStore.acmgRating.pp3 &&
    acmgRatingToSubmit.value.pp4 === acmgRatingStore.acmgRating.pp4 &&
    acmgRatingToSubmit.value.pp5 === acmgRatingStore.acmgRating.pp5 &&
    acmgRatingToSubmit.value.ba1 === acmgRatingStore.acmgRating.ba1 &&
    acmgRatingToSubmit.value.bs1 === acmgRatingStore.acmgRating.bs1 &&
    acmgRatingToSubmit.value.bs2 === acmgRatingStore.acmgRating.bs2 &&
    acmgRatingToSubmit.value.bs3 === acmgRatingStore.acmgRating.bs3 &&
    acmgRatingToSubmit.value.bs4 === acmgRatingStore.acmgRating.bs4 &&
    acmgRatingToSubmit.value.bp1 === acmgRatingStore.acmgRating.bp1 &&
    acmgRatingToSubmit.value.bp2 === acmgRatingStore.acmgRating.bp2 &&
    acmgRatingToSubmit.value.bp3 === acmgRatingStore.acmgRating.bp3 &&
    acmgRatingToSubmit.value.bp4 === acmgRatingStore.acmgRating.bp4 &&
    acmgRatingToSubmit.value.bp5 === acmgRatingStore.acmgRating.bp5 &&
    acmgRatingToSubmit.value.bp6 === acmgRatingStore.acmgRating.bp6 &&
    acmgRatingToSubmit.value.bp7 === acmgRatingStore.acmgRating.bp7 &&
    acmgRatingToSubmit.value.class_override === acmgRatingStore.acmgRating.class_override
  )
})

const updateAcmgClass = (acmgClass: number, isConflicting: boolean) => {
  acmgRatingToSubmit.value.class_auto = acmgClass
  acmgRatingConflicting.value = isConflicting
}

const calculateAcmgRating = computed(() => {
  var computedClassAuto = acmgRatingToSubmit.value.class_auto
  const pvs = acmgRatingToSubmit.value.pvs1
  const ps =
    acmgRatingToSubmit.value.ps1 +
    acmgRatingToSubmit.value.ps2 +
    acmgRatingToSubmit.value.ps3 +
    acmgRatingToSubmit.value.ps4
  const pm =
    acmgRatingToSubmit.value.pm1 +
    acmgRatingToSubmit.value.pm2 +
    acmgRatingToSubmit.value.pm3 +
    acmgRatingToSubmit.value.pm4 +
    acmgRatingToSubmit.value.pm5 +
    acmgRatingToSubmit.value.pm6
  const pp =
    acmgRatingToSubmit.value.pp1 +
    acmgRatingToSubmit.value.pp2 +
    acmgRatingToSubmit.value.pp3 +
    acmgRatingToSubmit.value.pp4 +
    acmgRatingToSubmit.value.pp5
  const ba = acmgRatingToSubmit.value.ba1
  const bs =
    acmgRatingToSubmit.value.bs1 +
    acmgRatingToSubmit.value.bs2 +
    acmgRatingToSubmit.value.bs3 +
    acmgRatingToSubmit.value.bs4
  const bp =
    acmgRatingToSubmit.value.bp1 +
    acmgRatingToSubmit.value.bp2 +
    acmgRatingToSubmit.value.bp3 +
    acmgRatingToSubmit.value.bp4 +
    acmgRatingToSubmit.value.bp5 +
    acmgRatingToSubmit.value.bp6 +
    acmgRatingToSubmit.value.bp7
  const isPathogenic =
    (pvs === 1 && (ps >= 1 || pm >= 2 || (pm === 1 && pp === 1) || pp >= 2)) ||
    ps >= 2 ||
    (ps === 1 && (pm >= 3 || (pm >= 2 && pp >= 2) || (pm === 1 && pp >= 4)))
  const isLikelyPathogenic =
    (pvs === 1 && pm === 1) ||
    (ps === 1 && pm >= 1 && pm <= 2) ||
    (ps === 1 && pp >= 2) ||
    pm >= 3 ||
    (pm === 2 && pp >= 2) ||
    (pm === 1 && pp >= 4)
  const isLikelyBenign = (bs >= 1 && bp >= 1) || bp >= 2
  const isBenign = ba > 0 || bs >= 2
  const isConflicting = (isPathogenic || isLikelyPathogenic) && (isBenign || isLikelyBenign)
  computedClassAuto = 3
  if (isPathogenic) {
    computedClassAuto = 5
  } else if (isLikelyPathogenic) {
    computedClassAuto = 4
  } else if (isBenign) {
    computedClassAuto = 1
  } else if (isLikelyBenign) {
    computedClassAuto = 2
  }
  if (isConflicting) {
    computedClassAuto = 3
    updateAcmgClass(computedClassAuto, true)
  } else {
    updateAcmgClass(computedClassAuto, false)
  }
  return computedClassAuto
})

const convertEmptyToNull = (classOverride: any) => {
  if (classOverride === '' || classOverride === null) {
    acmgRatingToSubmit.value.class_override = null
  } else {
    acmgRatingToSubmit.value.class_override = classOverride
  }
}

const onSubmitAcmgRating = async () => {
  const acmgRatingToSubmitNoAuto = copy(acmgRatingToSubmit.value)
  delete acmgRatingToSubmitNoAuto['class_auto']
  const acmgRatingToSubmitEmpty = isEqual(acmgRatingToSubmitNoAuto, emptyAcmgRatingTemplate)
  if (acmgRatingStore.acmgRating && acmgRatingToSubmitEmpty) {
    // IS not empty but SHOULD be empty, so delete the ACMG rating
    await acmgRatingStore.deleteAcmgRating()
  } else if (!acmgRatingStore.acmgRating && acmgRatingToSubmitEmpty) {
    // IS empty and SHOULD be empty, so no update needed
    acmgRatingToSubmit.value = copy(emptyAcmgRatingTemplate)
  } else if (acmgRatingStore.acmgRating && !acmgRatingToSubmitEmpty) {
    // IS not empty and SHOULD not be empty, so update the ACMG rating
    await acmgRatingStore.updateAcmgRating(acmgRatingToSubmit.value)
  } else if (!acmgRatingStore.acmgRating && !acmgRatingToSubmitEmpty) {
    // IS empty but SHOULD not be empty, so create the ACMG rating
    await acmgRatingStore.createAcmgRating(variantInfoStore.smallVariant, acmgRatingToSubmit.value)
  }
}

watch(
  () => [props.smallVariant, acmgRatingStore.storeState],
  async () => {
    if (props.smallVariant && acmgRatingStore.storeState === StoreState.Active) {
      await acmgRatingStore.retrieveAcmgRating(props.smallVariant)
      resetAcmgRating()
    }
  }
)

onMounted(async () => {
  if (props.smallVariant) {
    await acmgRatingStore.retrieveAcmgRating(props.smallVariant)
    resetAcmgRating()
  }
})
</script>

<template>
  {{ acmgRatingToSubmit }}
  <v-row>
    <v-col cols="12" md="4">
      <div>
        <div>
          <h3>Pathogenic:</h3>
        </div>
      </div>
      <div>
        <div>
          <strong style="font-variant: small-caps" class="text-small text-muted text-capitalize">
            Very Strong Evidence
          </strong>
        </div>
      </div>
      <div>
        <div>
          <div
            class="form-check form-check-inline"
            title="Null variant (nonsense, frameshift, canonical ±1 or 2 splice sites, initiation codon, single or multi-exon deletion) in a gene where LOF is a known mechanism of disease"
          >
            <v-switch
              color="primary"
              label="PVS1"
              v-model="acmgRatingToSubmit.pvs1"
              hint="null variant"
            ></v-switch>
          </div>
        </div>
      </div>
      <div>
        <div>
          <strong style="font-variant: small-caps" class="text-small text-muted text-capitalize">
            Strong Evidence
          </strong>
        </div>
      </div>
      <div>
        <div>
          <div
            class="form-check form-check-inline"
            title="Same amino acid change as a previously established pathogenic variant regardless of nucleotide change"
          >
            <v-switch
              color="primary"
              label="PS1"
              v-model="acmgRatingToSubmit.ps1"
              hint="literature: this AA exchange"
            ></v-switch>
          </div>
        </div>
      </div>
      <div>
        <div>
          <div
            class="form-check form-check-inline"
            title="De novo (both maternity and paternity confirmed) in a patient with the disease and no family history"
          >
            <v-switch
              color="primary"
              label="PS2"
              v-model="acmgRatingToSubmit.ps2"
              hint="confirmed de novo"
            ></v-switch>
          </div>
        </div>
      </div>
      <div>
        <div>
          <div
            class="form-check form-check-inline"
            title="Well-established in vitro or in vivo functional studies supportive of a damaging effect on the gene or gene product"
          >
            <v-switch
              color="primary"
              label="PS3"
              v-model="acmgRatingToSubmit.ps3"
              hint="supported by functional studies"
            ></v-switch>
          </div>
        </div>
      </div>
      <div>
        <div>
          <div
            class="form-check form-check-inline"
            title="The prevalence of the variant in affected individuals is significantly increased compared with the prevalence in controls"
          >
            <v-switch
              color="primary"
              label="PS4"
              v-model="acmgRatingToSubmit.ps4"
              hint="prevalende in disease controls"
            ></v-switch>
          </div>
        </div>
      </div>
      <div>
        <div>
          <strong style="font-variant: small-caps" class="text-small text-muted text-capitalize">
            Moderate Evidence
          </strong>
        </div>
      </div>
      <div>
        <div>
          <div
            class="form-check form-check-inline"
            title="Located in a mutational hot spot and/or critical and well-established functional domain (e.g., active site of an enzyme) without benign variation"
          >
            <v-switch
              color="primary"
              label="PM1"
              v-model="acmgRatingToSubmit.pm1"
              hint="variant in horspot (missense)"
            ></v-switch>
          </div>
        </div>
      </div>
      <div>
        <div>
          <div
            class="form-check form-check-inline"
            title="Absent from controls (or at extremely low frequency if recessive) in Exome Sequencing Project, 1000 Genomes Project, or Exome Aggregation Consortium"
          >
            <v-switch
              color="primary"
              label="PM2"
              v-model="acmgRatingToSubmit.pm2"
              hint="rare in 1:20.000 in ExAC"
            ></v-switch>
          </div>
        </div>
      </div>
      <div>
        <div>
          <div
            class="form-check form-check-inline"
            title="For recessive disorders, detected in trans with a pathogenic variant"
          >
            <v-switch
              color="primary"
              label="PM3"
              v-model="acmgRatingToSubmit.pm3"
              hint="AR: trans with known pathogenic"
            ></v-switch>
          </div>
        </div>
      </div>
      <div>
        <div>
          <div
            class="form-check form-check-inline"
            title="Protein length changes as a result of in-frame deletions/insertions in a nonrepeat region or stop-loss variants"
          >
            <v-switch
              color="primary"
              label="PM4"
              v-model="acmgRatingToSubmit.pm4"
              hint="protein length change"
            ></v-switch>
          </div>
        </div>
      </div>
      <div>
        <div>
          <div
            class="form-check form-check-inline"
            title="Novel missense change at an amino acid residue where a different missense change determined to be pathogenic has been seen before"
          >
            <v-switch
              color="primary"
              label="PM5"
              v-model="acmgRatingToSubmit.pm5"
              hint="literature: AA exchange same pos"
            ></v-switch>
          </div>
        </div>
      </div>
      <div>
        <div>
          <div
            class="form-check form-check-inline"
            title="Assumed de novo, but without confirmation of paternity and maternity"
          >
            <v-switch
              color="primary"
              label="PM6"
              v-model="acmgRatingToSubmit.pm6"
              hint="assumed de novo"
            ></v-switch>
          </div>
        </div>
      </div>
      <div>
        <div>
          <strong style="font-variant: small-caps" class="text-small text-muted text-capitalize">
            Supporting Evidence
          </strong>
        </div>
      </div>
      <div>
        <div>
          <div
            class="form-check form-check-inline"
            title="Cosegregation with disease in multiple affected family members in a gene definitively known to cause the disease"
          >
            <v-switch
              color="primary"
              label="PP1"
              v-model="acmgRatingToSubmit.pp1"
              hint="cosegregates in family"
            ></v-switch>
          </div>
        </div>
      </div>
      <div>
        <div>
          <div
            class="form-check form-check-inline"
            title="Missense variant in a gene that has a low rate of benign missense variation and in which missense variants are a common mechanism of disease"
          >
            <v-switch
              color="primary"
              label="PP2"
              v-model="acmgRatingToSubmit.pp2"
              hint="few missense in gene"
            ></v-switch>
          </div>
        </div>
      </div>
      <div>
        <div>
          <div
            class="form-check form-check-inline"
            title="Multiple lines of computational evidence support a deleterious effect on the gene or gene product (conservation, evolutionary, splicing impact, etc.)"
          >
            <v-switch
              color="primary"
              label="PP3"
              v-model="acmgRatingToSubmit.pp3"
              hint="predicted pathogenic"
            ></v-switch>
          </div>
        </div>
      </div>
      <div>
        <div>
          <div
            class="form-check form-check-inline"
            title="Patient's phenotype or family history is highly specific for a disease with a single genetic etiology"
          >
            <v-switch
              color="primary"
              label="PP4"
              v-model="acmgRatingToSubmit.pp4"
              hint="phenotype/pedigree match gene"
            ></v-switch>
          </div>
        </div>
      </div>
      <div>
        <div>
          <div
            class="form-check form-check-inline"
            title="Reputable source recently reports variant as pathogenic, but the evidence is not available to the laboratoryto perform an independent evaluation"
          >
            <v-switch
              color="primary"
              label="PP5"
              v-model="acmgRatingToSubmit.pp5"
              hint="reliable source: pathogenic"
            ></v-switch>
          </div>
        </div>
      </div>
    </v-col>
    <v-col cols="12" md="4">
      <div>
        <div>
          <h3>Benign:</h3>
        </div>
      </div>
      <div>
        <div>
          <strong style="font-variant: small-caps" class="text-small text-muted text-capitalize">
            Standalone Evidence
          </strong>
        </div>
      </div>
      <div>
        <div>
          <div
            class="form-check form-check-inline"
            title="Allele frequency is >5% in Exome Sequencing Project, 1000 Genomes Project, or Exome Aggregation Consortium"
          >
            <v-switch
              color="primary"
              label="BA1"
              v-model="acmgRatingToSubmit.ba1"
              hint="allele frequency > 5%"
            ></v-switch>
          </div>
        </div>
      </div>
      <div>
        <div>
          <strong style="font-variant: small-caps" class="text-small text-muted text-capitalize">
            Strong Evidence
          </strong>
        </div>
      </div>
      <div>
        <div>
          <div
            class="form-check form-check-inline"
            title="Allele frequency is greater than expected for disorder"
          >
            <v-switch
              color="primary"
              label="BS1"
              v-model="acmgRatingToSubmit.bs1"
              hint="disease: allele freq. too high"
            ></v-switch>
          </div>
        </div>
      </div>
      <div>
        <div>
          <div
            class="form-check form-check-inline"
            title="Observed in a healthy adult individual for a recessive (homozygous), dominant (heterozygous), or X-linked (hemizygous) disorder, with full penetrance expected at an early age"
          >
            <v-switch
              color="primary"
              label="BS2"
              v-model="acmgRatingToSubmit.bs2"
              hint="observed in healthy individual"
            ></v-switch>
          </div>
        </div>
      </div>
      <div>
        <div>
          <div
            class="form-check form-check-inline"
            title="Well-established in vitro or in vivo functional studies show no damaging effect on protein function or splicing"
          >
            <v-switch
              color="primary"
              label="BS3"
              v-model="acmgRatingToSubmit.bs3"
              hint="functional studies: benign"
            ></v-switch>
          </div>
        </div>
      </div>
      <div>
        <div>
          <div
            class="form-check form-check-inline"
            title="Lack of segregation in affected members of a family"
          >
            <v-switch
              color="primary"
              label="BS4"
              v-model="acmgRatingToSubmit.bs4"
              hint="lack of segregation"
            ></v-switch>
          </div>
        </div>
      </div>
      <div>
        <div>
          <strong style="font-variant: small-caps" class="text-small text-muted text-capitalize">
            Supporting Evidence
          </strong>
        </div>
      </div>
      <div>
        <div>
          <div
            class="form-check form-check-inline"
            title="Missense variant in a gene for which primarily truncating variants are known to cause disease"
          >
            <v-switch
              color="primary"
              label="BP1"
              v-model="acmgRatingToSubmit.bp1"
              hint="missense in truncation gene"
            ></v-switch>
          </div>
        </div>
      </div>
      <div>
        <div>
          <div
            class="form-check form-check-inline"
            title="Observed in trans with a pathogenic variant for a fully penetrant dominant gene/disorder or observed in cis with a pathogenic variant in any inheritance pattern"
          >
            <v-switch
              color="primary"
              label="BP2"
              v-model="acmgRatingToSubmit.bp2"
              hint="other variant is causative"
            ></v-switch>
          </div>
        </div>
      </div>
      <div>
        <div>
          <div
            class="form-check form-check-inline"
            title="In-frame deletions/insertions in a repetitive region without a known function"
          >
            <v-switch
              color="primary"
              label="BP3"
              v-model="acmgRatingToSubmit.bp3"
              hint="in-frame indel in repeat"
            ></v-switch>
          </div>
        </div>
      </div>
      <div>
        <div>
          <div
            class="form-check form-check-inline"
            title="Multiple lines of computational evidence suggest no impact on gene or gene product (conservation, evolutionary, splicing impact, etc.)"
          >
            <v-switch
              color="primary"
              label="BP4"
              v-model="acmgRatingToSubmit.bp4"
              hint="prediction: benign"
            ></v-switch>
          </div>
        </div>
      </div>
      <div>
        <div>
          <div
            class="form-check form-check-inline"
            title="Variant found in a case with an alternate molecular basis for disease"
          >
            <v-switch
              color="primary"
              label="BP5"
              v-model="acmgRatingToSubmit.bp5"
              hint="different gene in other case"
            ></v-switch>
          </div>
        </div>
      </div>
      <div>
        <div>
          <div
            class="form-check form-check-inline"
            title="Reputable source recently reports variant as benign, but the evidence is not available to the laboratory to perform anindependent evaluation"
          >
            <v-switch
              color="primary"
              label="BP6"
              v-model="acmgRatingToSubmit.bp6"
              hint="reputable source: benign"
            ></v-switch>
          </div>
        </div>
      </div>
      <div>
        <div>
          <div
            class="form-check form-check-inline"
            title="A synonymous (silent) variant for which splicing prediction algorithms predict no impact to the splice consensussequence nor the creation of a new splice site AND the nucleotide is not highly conserved"
          >
            <v-switch
              color="primary"
              label="BP7"
              v-model="acmgRatingToSubmit.bp7"
              hint="silent, no splicing/conservation"
            ></v-switch>
          </div>
        </div>
      </div>
    </v-col>
    <v-col cols="12" md="4">
      <div title="Automatically determined ACMG class (Richards et al., 2015)">
        <div>
          <label for="acmg-class"><strong>ACMG classification</strong></label>
        </div>
        <h1>
          {{ calculateAcmgRating }}
        </h1>
      </div>
      <div title="Manually override the automatically determined class">
        <div>
          <label for="acmg-class-override"><strong>ACMG class override</strong></label>
        </div>
        <div style="margin-bottom: 12px">
          <v-text-field
            label="Label"
            variant="outlined"
            id="acmg-class-override"
            style="width: 135px; height: 50px"
            @change="convertEmptyToNull(acmgRatingToSubmit.class_override)"
            v-model.number="acmgRatingToSubmit.class_override"
          />
        </div>
      </div>
      <div>
        <div>
          <label for="acmg-class"><strong>Score explanation:</strong></label>
        </div>
      </div>
      <div>
        <div><strong class="text-muted mx-1">5</strong> pathogenic</div>
      </div>
      <div>
        <div><strong class="text-muted mx-1">4</strong> likely pathogenic</div>
      </div>
      <div>
        <div><strong class="text-muted mx-1">3</strong> uncertain significance</div>
      </div>
      <div>
        <div><strong class="text-muted mx-1">2</strong> likely benign</div>
      </div>
      <div>
        <div><strong class="text-muted mx-1">1</strong> benign</div>
      </div>
      <v-divider />

      <div class="button-group">
        <v-btn type="v-btn" class="btn btn-sm btn-secondary" @click="unsetAcmgRating()">
          Clear
        </v-btn>
        <v-btn type="v-btn" class="btn btn-sm btn-secondary" @click="resetAcmgRating()">
          Reset
        </v-btn>
        <v-btn
          type="submit"
          class="btn btn-sm"
          :class="
            acmgRatingConflicting
              ? 'btn-warning'
              : acmgRatingSubmitted
              ? 'btn-success'
              : 'btn-primary'
          "
          @click="onSubmitAcmgRating()"
        >
          <div v-if="acmgRatingConflicting">
            <v-icon>mdi-circle-outline</v-icon>
          </div>
          <div v-else-if="acmgRatingSubmitted">
            <v-icon>mdi-star-check-outline</v-icon>
          </div>
          <div else>
            <v-icon>mdi-star-check</v-icon>
          </div>
          Submit
        </v-btn>
      </div>
      <div v-if="acmgRatingConflicting">
        <div>
          <div>
            <v-icon>mdi-information</v-icon>
            <strong>Caution!</strong> Conflicting interpretation of variant.
          </div>
        </div>
      </div>
      <div>
        <div>
          <div>
            <v-icon>mdi-information</v-icon>
            Select all fulfilled criteria to get the classification following Richards
            <i>et al.</i> (2015). If necessary, you can also specify a manual override.
            <span class="badge badge-primary">Submit</span> indicates that there are changes not yet
            submitted, while <span class="badge badge-success">Submit</span> indicates that changes
            have been submitted or not made at all.
            <span class="badge badge-warning">Submit</span> indicates that there are conflicting
            variant interpretations. In that case, submission is possible, but not recommended.
            Press <span class="badge badge-secondary">Reset</span> to reset the form to the last
            submitted state. Press <span class="badge badge-secondary">Clear</span> and
            <span class="badge badge-primary">Submit</span> to delete ACMG rating.
          </div>
        </div>
      </div>
    </v-col>
  </v-row>
</template>

<style scoped>
#acmg-class-override {
  width: 135px;
  height: 50px;
  margin-bottom: 120px;
}

.button-group {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 12px;
}
</style>
