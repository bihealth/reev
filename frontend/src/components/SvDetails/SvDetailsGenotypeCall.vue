<script setup lang="ts">
import { computed, type ComputedRef } from 'vue'

import { displayName } from '@/lib/utils'

const props = defineProps({
  currentSvRecord: Object
})

const GT_FIELDS = Object.freeze({
  quality: { label: 'genotype quality' },
  genotype: { label: 'genotype call' },
  paired_end_cov: { label: 'total read pairs' },
  paired_end_var: { label: 'variant read pairs' },
  split_read_cov: { label: 'total split-reads' },
  split_read_var: { label: 'variant split reads' },
  point_count: { label: 'number of bins/targets' },
  average_normalized_cov: { label: 'average normalized coverage' },
  average_mapping_quality: { label: 'average mapping quality' },
  matched_gt_criteria: {
    label: 'matched genotype criteria',
    fmt: (arr: any) => arr.join(', ')
  },
  effective_genotype: { label: 'effective genotype' }
})

const identity = (x: any) => x

const allKeys: ComputedRef<any[]> = computed(() => {
  if (!props.currentSvRecord?.payload?.call_info) {
    return []
  }

  let tmp: any = []
  for (let call_info of Object.values(props.currentSvRecord.payload.call_info) as any) {
    tmp = tmp.concat(
      Object.entries(call_info)
        .filter(([, value]) => value !== null)
        .map(([key]) => key)
    )
  }
  let result = Array.from(new Set(tmp))
  result.sort()
  return result
})
</script>

<template>
  <div class="card">
    <table class="table table-striped table-hover" v-if="currentSvRecord">
      <thead>
        <tr>
          <th>Sample</th>

          <template v-for="(_, sample) in currentSvRecord.payload.call_info" :key="sample">
            <th>
              {{ displayName(sample as any) }}
            </th>
          </template>
        </tr>
      </thead>
      <tbody>
        <tr v-for="key in allKeys" :key="key">
          <th>{{ GT_FIELDS[key as keyof typeof GT_FIELDS]?.label ?? key }}</th>
          <td v-for="genotype in currentSvRecord.payload.call_info" :key="genotype">
            <div v-if="key === 'matched_gt_criteria'">
              {{ (GT_FIELDS.matched_gt_criteria?.fmt)(genotype[key]) }}
            </div>
            <div v-else>
              {{ identity(genotype[key]) }}
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
