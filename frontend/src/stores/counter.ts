import { ref, computed } from 'vue'
import type { Ref } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }

  const apiValue: Ref<string | null> = ref(null)
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

  return { count, doubleCount, increment, apiValue, fetchApiValue }
})
