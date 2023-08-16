import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Ref } from 'vue'

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const geneData: Ref<JSON | null> = ref(null)
  const apiValue: Ref<string | null> = ref(null)

  function increment() {
    count.value++
  }

  function setGeneData(data: JSON) {
    geneData.value = data
  }

  const fetchApiValue = async () => {
    console.log('fetchApiValue')
    const response = await fetch('/api/hello', {
      method: 'GET'
    })
    if (response.ok) {
      console.log(response)
      const data = await response.json()
      console.log(data)
      apiValue.value = JSON.stringify(data)
    } else {
      console.error(response)
      return Promise.reject(response)
    }
  }

  return { count, increment, geneData, apiValue, fetchApiValue, setGeneData }
})
