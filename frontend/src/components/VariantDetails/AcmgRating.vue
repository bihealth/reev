<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import isEqual from 'lodash.isequal'

import { StoreState } from '@/stores/misc'
import { useVariantAcmgRatingStore } from '@/stores/variantAcmgRating'

const props = defineProps({
  smallVariant: Object
})

const acmgRatingStore = useVariantAcmgRatingStore()

const emptyAcmgRatingTemplate: any = {
  pvs1: false,
  ps1: false,
  ps2: false,
  ps3: false,
  ps4: false,
  pm1: false,
  pm2: false,
  pm3: false,
  pm4: false,
  pm5: false,
  pm6: false,
  pp1: false,
  pp2: false,
  pp3: false,
  pp4: false,
  pp5: false,
  ba1: false,
  bs1: false,
  bs2: false,
  bs3: false,
  bs4: false,
  bp1: false,
  bp2: false,
  bp3: false,
  bp4: false,
  bp5: false,
  bp6: false,
  bp7: false,
  // class_auto: 3,
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
    // acmgRatingToSubmit.value.class_auto = acmgRatingStore.acmgRating.class_auto
    acmgRatingToSubmit.value.class_override = acmgRatingStore.acmgRating.class_override
  } else {
    unsetAcmgRating()
  }
}

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
  if (isEqual(acmgRatingToSubmit, emptyAcmgRatingTemplate)) {
    // IS empty and SHOULD be empty, so no update needed
    return
  } else {
    // Submit ACMG rating to ClinVar
    await acmgRatingStore.submitAcmgRating(props.smallVariant, acmgRatingToSubmit.value)
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

const acmgCriteriaInfo = {
  pathogenic: {
    'very-strong-evidence': {
      name: 'Very Strong Evidence',
      criteria: [
        {
          name: 'PVS1',
          id: 'pvs1',
          description:
            'Null variant (nonsense, frameshift, canonical ±1 or 2 splice sites, initiation codon, single or multi-exon deletion) in a gene where LOF is a known mechanism of disease',
          hint: 'null variant'
        }
      ]
    },
    'strong-evidence': {
      name: 'Strong Evidence',
      criteria: [
        {
          name: 'PS1',
          id: 'ps1',
          description:
            'Same amino acid change as a previously established pathogenic variant regardless of nucleotide change',
          hint: 'literature: this AA exchange'
        },
        {
          name: 'PS2',
          id: 'ps2',
          description:
            'De novo (both maternity and paternity confirmed) in a patient with the disease and no family history',
          hint: 'confirmed de novo'
        },
        {
          name: 'PS3',
          id: 'ps3',
          description:
            'Well-established in vitro or in vivo functional studies supportive of a damaging effect on the gene or gene product',
          hint: 'supported by functional studies'
        },
        {
          name: 'PS4',
          id: 'ps4',
          description:
            'The prevalence of the variant in affected individuals is significantly increased compared with the prevalence in controls',
          hint: 'prevalende in disease controls'
        }
      ]
    },
    'moderate-evidence': {
      name: 'Moderate Evidence',
      criteria: [
        {
          name: 'PM1',
          id: 'pm1',
          description:
            'Located in a mutational hot spot and/or critical and well-established functional domain (e.g., active site of an enzyme) without benign variation',
          hint: 'variant in horspot (missense)'
        },
        {
          name: 'PM2',
          id: 'pm2',
          description:
            'Absent from controls (or at extremely low frequency if recessive) in Exome Sequencing Project, 1000 Genomes Project, or Exome Aggregation Consortium',
          hint: 'rare in 1:20.000 in ExAC'
        },
        {
          name: 'PM3',
          id: 'pm3',
          description: 'For recessive disorders, detected in trans with a pathogenic variant',
          hint: 'AR: trans with known pathogenic'
        },
        {
          name: 'PM4',
          id: 'pm4',
          description:
            'Protein length changes as a result of in-frame deletions/insertions in a nonrepeat region or stop-loss variants',
          hint: 'protein length change'
        },
        {
          name: 'PM5',
          id: 'pm5',
          description:
            'Novel missense change at an amino acid residue where a different missense change determined to be pathogenic has been seen before',
          hint: 'literature: AA exchange same pos'
        },
        {
          name: 'PM6',
          id: 'pm6',
          description: 'Assumed de novo, but without confirmation of paternity and maternity',
          hint: 'assumed de novo'
        }
      ]
    },
    'supporting-evidence': {
      name: 'Supporting Evidence',
      criteria: [
        {
          name: 'PP1',
          id: 'pp1',
          description:
            'Cosegregation with disease in multiple affected family members in a gene definitively known to cause the disease',
          hint: 'cosegregates in family'
        },
        {
          name: 'PP2',
          id: 'pp2',
          description:
            'Missense variant in a gene that has a low rate of benign missense variation and in which missense variants are a common mechanism of disease',
          hint: 'few missense in gene'
        },
        {
          name: 'PP3',
          id: 'pp3',
          description:
            'Multiple lines of computational evidence support a deleterious effect on the gene or gene product (conservation, evolutionary, splicing impact, etc.)',
          hint: 'predicted pathogenic'
        },
        {
          name: 'PP4',
          id: 'pp4',
          description:
            "Patient's phenotype or family history is highly specific for a disease with a single genetic etiology",
          hint: 'phenotype/pedigree match gene'
        },
        {
          name: 'PP5',
          id: 'pp5',
          description:
            'Reputable source recently reports variant as pathogenic, but the evidence is not available to the laboratoryto perform an independent evaluation',
          hint: 'reliable source: pathogenic'
        }
      ]
    }
  },
  benign: {
    'standalone-evidence': {
      name: 'Standalone Evidence',
      criteria: [
        {
          name: 'BA1',
          id: 'ba1',
          description:
            'Allele frequency is >5% in Exome Sequencing Project, 1000 Genomes Project, or Exome Aggregation Consortium',
          hint: 'allele frequency > 5%'
        }
      ]
    },
    'strong-evidence': {
      name: 'Strong Evidence',
      criteria: [
        {
          name: 'BS1',
          id: 'bs1',
          description: 'Allele frequency is greater than expected for disorder',
          hint: 'disease: allele freq. too high'
        },
        {
          name: 'BS2',
          id: 'bs2',
          description:
            'Observed in a healthy adult individual for a recessive (homozygous), dominant (heterozygous), or X-linked (hemizygous) disorder, with full penetrance expected at an early age',
          hint: 'observed in healthy individual'
        },
        {
          name: 'BS3',
          id: 'bs3',
          description:
            'Well-established in vitro or in vivo functional studies show no damaging effect on protein function or splicing',
          hint: 'functional studies: benign'
        },
        {
          name: 'BS4',
          id: 'bs4',
          description: 'Lack of segregation in affected members of a family',
          hint: 'lack of segregation'
        }
      ]
    },
    'supporting evidence': {
      name: 'Supporting Evidence',
      criteria: [
        {
          name: 'BP1',
          id: 'bp1',
          description:
            'Missense variant in a gene for which primarily truncating variants are known to cause disease',
          hint: 'missense in gene with truncating'
        },
        {
          name: 'BP2',
          id: 'bp2',
          description:
            'Observed in trans with a pathogenic variant for a fully penetrant dominant gene/disorder or observed in cis with a pathogenic variant in any inheritance pattern',
          hint: 'other variant is causative'
        },
        {
          name: 'BP3',
          id: 'bp3',
          description:
            'In-frame deletions/insertions in a repetitive region without a known function',
          hint: 'in-frame del/ins in repeat'
        },
        {
          name: 'BP4',
          id: 'bp4',
          description:
            'Multiple lines of computational evidence suggest no impact on gene or gene product (conservation, evolutionary,splicing impact, etc.)',
          hint: 'predicted benign'
        },
        {
          name: 'BP5',
          id: 'bp5',
          description: 'Variant found in a case with an alternate molecular basis for disease',
          hint: 'other variant is causative'
        },
        {
          name: 'BP6',
          id: 'bp6',
          description:
            'Reputable source recently reports variant as benign, but the evidence is not available to the laboratory to perform an independent evaluation',
          hint: 'reliable source: benign'
        },
        {
          name: 'BP7',
          id: 'bp7',
          description:
            'A synonymous (silent) variant for which splicing prediction algorithms predict no impact to the splice consensus sequence nor the creation of a new splice site AND the nucleotide is not highly conserved',
          hint: 'synonymous: no splice effect'
        }
      ]
    }
  }
}
</script>

<template>
  <v-row>
    <v-col cols="12" md="4">
      <div>
        <h3><strong>Pathogenic:</strong></h3>
      </div>
      <div v-for="(criteriaType, criteriaKey) in acmgCriteriaInfo.pathogenic" :key="criteriaKey">
        <div>
          <strong style="font-variant: small-caps" class="text-small text-muted text-capitalize">
            {{ criteriaType.name }}
          </strong>
        </div>
        <div v-for="(criteria, criterionKey) in criteriaType.criteria" :key="criterionKey">
          <div>
            <div class="form-check form-check-inline" :title="criteria.description">
              <v-switch
                color="primary"
                :label="criteria.name"
                :model-value="acmgRatingToSubmit[criteria.id]"
                @update:model-value="acmgRatingToSubmit[criteria.id] = $event"
                :hint="criteria.hint"
              ></v-switch>
            </div>
          </div>
        </div>
      </div>
    </v-col>
    <v-col cols="12" md="4">
      <div>
        <h3><strong>Benign:</strong></h3>
      </div>
      <div v-for="(criteriaType, criteriaKey) in acmgCriteriaInfo.benign" :key="criteriaKey">
        <div>
          <strong style="font-variant: small-caps" class="text-small text-muted text-capitalize">
            {{ criteriaType.name }}
          </strong>
        </div>
        <div v-for="(criteria, criteriaKey) in criteriaType.criteria" :key="criteriaKey">
          <div>
            <div :title="criteria.description">
              <v-switch
                color="primary"
                :label="criteria.name"
                :model-value="acmgRatingToSubmit[criteria.id]"
                @update:model-value="acmgRatingToSubmit[criteria.id] = $event"
                :hint="criteria.hint"
              ></v-switch>
            </div>
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
        <v-btn @click="unsetAcmgRating()"> Clear </v-btn>
        <v-btn @click="resetAcmgRating()"> Reset </v-btn>
        <v-btn prepend-icon="mdi-star-check" @click="onSubmitAcmgRating()">
          Submit to ClinVar
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
