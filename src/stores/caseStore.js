import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCaseStore = defineStore('caseStore', () => {
  const audioList = ref([]) // Reactive state

  const setAudioList = (chunks) => {
    audioList.value = chunks
  }

  return {
    audioList,
    setAudioList
  }
})
