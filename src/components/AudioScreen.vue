<!-- views/TranscribingScreen.vue -->
<template>
  <div class="audio-screen">
    <!-- Top Bar -->
    <div class="top-bar">
      <!-- Show chunk index + total -->
      <p>{{ currentIndex + 1 }} / {{ totalAudios }}</p>
      <h2>
        Evaluating Audio {{ currentAudio.id }}
      </h2>
    </div>

    <!-- Audio Player -->
    <div class="audio-container">
      <audio ref="audioPlayer" class="audio-player" controls>
        <source :src="audioSrc" type="audio/wav" />
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
        / {{ currentAudio.duration || 0 }}s
      </div>
    </div>

    <!-- Transcription Textarea -->
    <!-- <div class="transcription-box">
      <label for="transcription">Transcription:</label>
      <textarea id="transcription" ref="transcriptionInput" v-model="transcriptionText" rows="5"
        @keydown.enter.prevent="handleEnterKey"></textarea>
    </div> -->

    <!-- Action Buttons -->
    <div class="action-buttons">
      <button @click="goPrevious" :disabled="currentIndex === 0">
        Previous
      </button>
      <button @click="disapproveAudio" :disabled="currentAudio.is_evaluated === false" class="reject-button">
        Disapprove
      </button>
      <button @click="approveAudio" :disabled="currentAudio.is_evaluated === true" class="save-button">
        Approve
      </button>
      <button @click="goNext" :disabled="currentIndex === totalAudios - 1">
        Next
      </button>
    </div>

    <!-- Modal for "Save and go Next?" -->
    <!-- <div v-if="showApproveDialog" class="modal-overlay" @click.self="cancelDialog">
      <div class="modal">
        <p>Save and go next?</p>
        <div>
          <button @click="cancelDialog">Cancel</button>
          <button ref="yesButton" @click="approveAndNext">Yes</button>
        </div>
      </div>
    </div> -->
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

// const audioListFromStore = route.params.audioList

// The typed text
// const transcriptionText = ref('')
const showApproveDialog = ref(false)
// const showRejectDialog = ref(false)
const yesButton = ref(null);

// On mount, parse the :startIndex from route
onMounted(() => {
  console.log(route.params.startIndex)
  const idx = parseInt(route.params.startIndex, 10)
  console.log(idx)
  currentIndex.value = Number.isNaN(idx) ? 0 : idx
})



const audioList = computed(() => caseStore.audioList)

const currentAudio = computed(() => audioList.value[currentIndex.value] || {})

// A computed property for the total # of chunks
const totalAudios = computed(() => audioList.value.length)
console.log('Current Audio:', currentAudio.value)
console.log('audioList:', audioList.value.length)

// transcriptionText.value = currentAudio.value.true_transcription || ''

// Build the audio src
const audioSrc = computed(() => {
  if (!currentAudio.value.audio_file) return ''
  console.log(currentAudio.value.audio_file)
  return currentAudio.value.audio_file
})

// Whenever we switch chunks, reset playback & text
watch(currentAudio, async () => {
  // transcriptionText.value = currentAudio.value.true_transcription || ''
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

// Watch for when the dialog is shown & auto-focus the "Yes" button
watch(showApproveDialog, async (newValue) => {
  if (newValue) {
    await nextTick(); // Ensure the button is rendered before focusing
    if (yesButton.value) {
      yesButton.value.focus();
    }
  }
});
// watch(showRejectDialog, async (newValue) => {
//   if (newValue) {
//     await nextTick(); // Ensure the button is rendered before focusing
//     if (yesButton.value) {
//       yesButton.value.focus();
//     }
//   }
// });

// Save chunk
async function approveAudio() {
  if (!currentAudio.value.id) return
  try {
    const resp = await axios.patch(
      `${API_BASE_URL}/api/transcriptions/cleaned-audio-files/${currentAudio.value.id}/toggle_evaluated/`,
    )
    console.log(resp.data.message)

    // Update store chunk to reflect changes
    // currentAudio.value.true_transcription = transcriptionText.value
    currentAudio.value.is_evaluated = true

    alert('Transcription saved successfully!')
  } catch (err) {
    console.error('Error saving transcription:', err)
    alert('Could not save transcription.')
  }
}

// Reject chunk
async function disapproveAudio() {
  if (!currentAudio.value.id) return
  try {
    const resp = await axios.patch(
      `${API_BASE_URL}/api/transcriptions/cleaned-audio-files/${currentAudio.value.id}/toggle_evaluated/`,
    )
    console.log(resp.data.message)

    currentAudio.value.is_evaluated = false
    // showRejectDialog.value = false
    alert('Audio Disapproved.')
  } catch (err) {
    console.error('Error disapproving audio:', err)
    alert('Could not disapporve audio.')
  }
}

// Navigation
function goNext() {
  if (currentIndex.value < audioList.value.length - 1) {
    currentIndex.value++
  }
}
function goPrevious() {
  if (currentIndex.value > 0) {
    currentIndex.value--
  }
}

// function confirmNext(){
//   showApproveDialog.value = true
// }

// function confirmRejection() {
//   showRejectDialog.value = true
// }

// If user presses Enter, ask "Save and go next?"
// function handleEnterKey() {
//   if (!transcriptionText.value.trim()) return
//   showApproveDialog.value = true
// // }
// async function approveAndNext() {
//   showApproveDialog.value = false
//   await approveAudio()
//   goNext()
// }
// function cancelDialog() {
//   showApproveDialog.value = false
//   showRejectDialog.value = false
// }
</script>

<style scoped>
.audio-screen {
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
  justify-content: space-between;
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
.save-button:disabled {
  cursor: not-allowed;
  background: #b2debd;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: white;
  padding: 20px;
  border-radius: 8px;
  display: block;
  width: 200px;
}

.modal p {
  margin-bottom: 16px;
}

.modal div {
  display: flex;
  justify-content: space-between;

}
</style>