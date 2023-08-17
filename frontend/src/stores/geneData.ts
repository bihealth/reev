/** Store for gene details.
 *
 * This includes the data retrieved from the APIs.
 *
 */

import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Ref } from 'vue'

export const useGeneDataStore = defineStore('geneData', () => {
  // The retrieved gene data
  const geneData: Ref<JSON | null> = ref(null)

  // Load stored geneData from localStorage when the store initializes
  if (localStorage.getItem('geneData')) {
    geneData.value = JSON.parse(localStorage.getItem('geneData')!)
  }

  function setGeneData(data: JSON) {
    geneData.value = data
    // Store geneData in localStorage when it's updated
    localStorage.setItem('geneData', JSON.stringify(data))
  }

  return { geneData, setGeneData }
})
