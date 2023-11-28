<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'

import { separateIt as sepIt } from '@/lib/utils'

const props = defineProps<{
  varAnnos: any
}>()

/** Return the conservation records. */
const ucscConservation = computed(() => {
  if (props.varAnnos?.ucsc_conservation?.length) {
    return props.varAnnos?.ucsc_conservation[0].records
  } else {
    return []
  }
})

const transcriptIds = computed(() => {
  let res: string[] = ucscConservation.value.map(({ enstId }: any) => enstId)
  res = [...new Set(res)]
  res.sort()
  return res
})

const consInfo: any = computed(() => {
  const seen = new Set()
  const res: any = {}
  for (const { chrom, enstId, start, stop, alignment } of ucscConservation.value) {
    const key = `${enstId}-${chrom}-${enstId}-${start}-${stop}`
    if (!seen.has(key)) {
      seen.add(key)
      if (!(enstId in res)) {
        res[enstId] = []
      }
      res[enstId].push({ chrom, start, stop, alignment })
    }
  }

  for (const key in res) {
    res[key].sort((a: any, b: any) => a.start - b.start)
  }

  return res
})

const selectedTranscript = ref('')

const initSelectedTranscript = () => {
  if (transcriptIds.value?.length) {
    if (
      !selectedTranscript.value ||
      (transcriptIds.value || []).includes(selectedTranscript.value)
    ) {
      selectedTranscript.value = transcriptIds.value[0]
    }
  }
}

watch(() => props.varAnnos, initSelectedTranscript)
onMounted(initSelectedTranscript)
</script>

<template>
  <v-card>
    <v-card-title>Conservation</v-card-title>
    <v-divider />
    <v-card-text>
      <div v-if="ucscConservation.length">
        <div class="float-right">
          <select v-model="selectedTranscript">
            <option v-for="transcript in transcriptIds" :key="transcript" :value="transcript">
              {{ transcript }}
            </option>
          </select>
        </div>
        <p>The following shows UCSC 100 vertebrate conservation.</p>
        <pre><b><u>  chr  start      end          |  alignment                                                                                           </u></b>
<template v-for="row in consInfo[selectedTranscript]">{{ row.chrom.padStart(5) }} {{ sepIt(row.start, ',').padStart(11) }}-{{ sepIt(row.stop, ',').padEnd(11) }}  |  {{ row.alignment }}
</template></pre>
      </div>
      <div v-else class="text-muted text-center font-italic" />
    </v-card-text>
  </v-card>
</template>
