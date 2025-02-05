<!-- views/TranscribingScreen.vue -->
<template>
    <div class="transcription-screen">
      <!-- Top Bar -->
      <div class="top-bar">
        <!-- Show chunk index + total -->
        <h2>
          Transcribing Chunk
          {{ currentIndex + 1 }} / {{ totalChunks }}
        </h2>
        <!-- Also show the case's narrative from the store -->
        <p class="narration">
          <strong>Narration:</strong>
          {{ caseStore.selectedCase?.narrative }}
        </p>
      </div>
  
      <!-- Audio Player -->
      <div class="audio-container">
        <audio ref="audioPlayer" class="audio-player" controls>
          <source
            :src="audioSrc"
            type="audio/wav"
          />
          Your browser does not support the audio element.
        </audio>
  
        <!-- Playback Controls -->
        <div class="playback-buttons">
          <button @click="playAudio" :disabled="isPlaying">Play</button>
          <button @click="pauseAudio" :disabled="!isPlaying">Pause</button>
          <button @click="resetAudio">Reset</button>
          <button @click="skipAudio(-5)">-5s</button>
          <button @click="skipAudio(5)">+5s</button>
        </div>
  
        <!-- Current Time Display -->
        <div class="current-time">
          Time: {{ currentTime.toFixed(2) }}s
          / {{ currentChunk.duration || 0 }}s
        </div>
      </div>
  
      <!-- Transcription Textarea -->
      <div class="transcription-box">
        <label for="transcription">Transcription:</label>
        <textarea
          id="transcription"
          ref="transcriptionInput"
          v-model="transcriptionText"
          rows="5"
          @keydown.enter.prevent="handleEnterKey"
        ></textarea>
      </div>
  
      <!-- Action Buttons -->
      <div class="action-buttons">
        <button @click="goPrevious" :disabled="currentIndex === 0">
          Previous
        </button>
        <button 
        @click="rejectChunk"
        :disabled="currentChunk.is_rejected === true" 
        class="reject-button">
          Reject
        </button>
        <button @click="saveChunk" class="save-button">
          Save
        </button>
        <button
          @click="goNext"
          :disabled="currentIndex === totalChunks - 1"
        >
          Next
        </button>
      </div>
  
      <!-- Modal for "Save and go Next?" -->
      <div
        v-if="showSaveDialog"
        class="modal-overlay"
        @click.self="cancelDialog"
      >
        <div class="modal">
          <p>Save and go next?</p>
          <button @click="saveAndNext">Yes</button>
          <button @click="cancelDialog">Cancel</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, watch, onMounted, nextTick } from 'vue'
  import { useRoute } from 'vue-router'
  import axios from 'axios'
  
  // Pinia store
  import { useCaseStore } from '../stores/caseStore.js'
  
  const caseStore = useCaseStore()
  const route = useRoute()
  
  // The base API if needed
  const API_BASE_URL = 'http://127.0.0.1:8000'
  
  // The current chunk index in the store’s list
  const currentIndex = ref(0)
  
  // Audio playback
  const audioPlayer = ref(null)
  const isPlaying = ref(false)
  const currentTime = ref(0)
  
  const listType = route.params.listType

  // The typed text
  const transcriptionText = ref('')
  const showSaveDialog = ref(false)
  
  // On mount, parse the :startIndex from route
  onMounted(() => {
    const idx = parseInt(route.params.startIndex, 10)
    currentIndex.value = Number.isNaN(idx) ? 0 : idx
  })
  

  
  const activeList = computed(() => {
    if (listType === 'not-transcribed') return caseStore.notTranscribed
    if (listType === 'transcribed') return caseStore.transcribed
    if (listType === 'rejected') return caseStore.rejected
    return []
  })

  const currentChunk = computed(() => activeList.value[currentIndex.value] || {})

  // A computed property for the total # of chunks
  const totalChunks = computed(() =>  activeList.value.length)
  console.log('Current chunk:', currentChunk.value)
  console.log('ActiveList:', activeList.value.length)

  
  // Build the audio src
  const audioSrc = computed(() => {
    if (!currentChunk.value.chunk_file) return ''
    return `${API_BASE_URL}${currentChunk.value.chunk_file}`
  })
  
  // Whenever we switch chunks, reset playback & text
  watch(currentChunk, async () => {
    transcriptionText.value = currentChunk.value.true_transcription || ''
    isPlaying.value = false
    currentTime.value = 0
  
    await nextTick()
    if (audioPlayer.value) {
      audioPlayer.value.load()
    }
  })
  
  // Watch audioPlayer to update currentTime
  watch(audioPlayer, (player) => {
    if (!player) return
  
    player.ontimeupdate = () => {
      currentTime.value = player.currentTime
    }
    player.onplay = () => {
      isPlaying.value = true
    }
    player.onpause = () => {
      isPlaying.value = false
    }
  })
  
  // Playback methods
  function playAudio() {
    if (audioPlayer.value) audioPlayer.value.play()
  }
  function pauseAudio() {
    if (audioPlayer.value) audioPlayer.value.pause()
  }
  function resetAudio() {
    if (!audioPlayer.value) return
    audioPlayer.value.currentTime = 0
    isPlaying.value = false
    audioPlayer.value.pause()
  }
  function skipAudio(seconds) {
    if (!audioPlayer.value) return
    const newTime = audioPlayer.value.currentTime + seconds
    const duration = audioPlayer.value.duration || 0
    audioPlayer.value.currentTime = Math.min(Math.max(newTime, 0), duration)
  }
  
  // Save chunk
  async function saveChunk() {
    if (!currentChunk.value.id) return
    try {
      const body = {
        true_transcription: transcriptionText.value,
        is_rejected: false
      }
      const resp = await axios.post(
        `${API_BASE_URL}/api/transcription/api/chunks/${currentChunk.value.id}/update-transcription/`,
        body
      )
      console.log(resp.data.message)
  
      // Update store chunk to reflect changes
      currentChunk.value.true_transcription = transcriptionText.value
      currentChunk.value.is_rejected = false
  
      alert('Transcription saved successfully!')
    } catch (err) {
      console.error('Error saving transcription:', err)
      alert('Could not save transcription.')
    }
  }
  
  // Reject chunk
  async function rejectChunk() {
    if (!currentChunk.value.id) return
    try {
      const resp = await axios.post(
        `${API_BASE_URL}/api/transcription/api/chunks/${currentChunk.value.id}/update-rejection/`,
        { is_rejected: true }
      )
      console.log(resp.data.message)
  
      currentChunk.value.is_rejected = true
  
      alert('Chunk rejected successfully.')
    } catch (err) {
      console.error('Error rejecting chunk:', err)
      alert('Could not reject chunk.')
    }
  }
  
  // Navigation
  function goNext() {
    if (currentIndex.value < activeList.value.length - 1) {
      currentIndex.value++
    }
  }
  function goPrevious() {
    if (currentIndex.value > 0) {
      currentIndex.value--
    }
  }
  
  // If user presses Enter, ask "Save and go next?"
  function handleEnterKey() {
    if (!transcriptionText.value.trim()) return
    showSaveDialog.value = true
  }
  async function saveAndNext() {
    showSaveDialog.value = false
    await saveChunk()
    goNext()
  }
  function cancelDialog() {
    showSaveDialog.value = false
  }
  </script>
  
  <style scoped>
  .transcription-screen {
    padding: 20px;
    background: #f0f0f0;
    color: #333;
    width: 700px;
    margin: 0 auto;
    border-radius: 8px;
  }
  
  /* Top Bar */
  .top-bar {
    margin-bottom: 10px;
  }
  .top-bar h2 {
    margin: 0;
  }
  .narration {
    margin: 4px 0 12px;
    font-style: italic;
  }
  
  /* Audio container */
  .audio-container {
    background: white;
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 8px;
    border: 1px solid #ccc;
  }
  .audio-player {
    width: 100%;
    outline: none;
  }
  .playback-buttons {
    margin-top: 8px;
  }
  .playback-buttons button {
    margin-right: 6px;
  }
  .current-time {
    margin-top: 8px;
    font-size: 0.9em;
    color: #555;
  }
  
  /* Transcription */
  .transcription-box {
    margin-bottom: 10px;
  }
  #transcription {
    width: 100%;
    font-family: inherit;
    padding: 8px;
    box-sizing: border-box;
  }
  
  /* Action Buttons */
  .action-buttons {
    display: flex;
    gap: 10px;
    margin-bottom: 12px;
  }
  .reject-button {
    background: #ff0019;
    color: white;
      opacity: 0.7;
    }
    .reject-button:disabled {
      cursor: not-allowed;
      background: #e9a5ac;
  }
  .save-button {
    background: #28a745;
    color: white;
  }
  
  /* Modal */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.45);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .modal {
    background: white;
    padding: 20px;
    border-radius: 8px;
  }
  .modal p {
    margin-bottom: 16px;
  }
  </style>
  