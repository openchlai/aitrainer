// stores/caseStore.js
import { defineStore } from 'pinia'

export const useCaseStore = defineStore('caseStore', {
  state: () => ({
    audioList: [],        // Active audio list to be used

  }),
  actions: {
    setAudioList(chunks) {
      this.audioList = chunks
    },
  }
})
