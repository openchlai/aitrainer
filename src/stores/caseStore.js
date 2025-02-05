// stores/caseStore.js
import { defineStore } from 'pinia'

export const useCaseStore = defineStore('caseStore', {
  state: () => ({
    selectedCase: null,  // The entire case record chosen from the dashboard
    notTranscribed: [],        // Merged chunk list
    transcribed: [],        // Merged chunk list
    rejected: [],        // Merged chunk list
  }),
  actions: {
    setSelectedCase(caseData) {
      this.selectedCase = caseData
    },
    setNotTranscribed(chunks) {
      this.notTranscribed = chunks
    },
    setTranscribed(chunks) {
      this.transcribed = chunks
    },
    setRejected(chunks) {
      this.rejected = chunks
    },
  }
})
