<template>
  <div class="transcription-screen">
    <!-- Header with Pie Charts -->
    <div class="header">
      <div class="chart-container">
        <canvas ref="goodBadChart"></canvas>
      </div>

      <!-- ✅ Wrapper for Heading & Audio Player -->
      <div class="audio-header">
        <h3>Case {{ caseStore.selectedCase?.case_id }}: {{ caseStore.selectedCase?.main_category }}</h3>
        <audio controls class="audio-player">
          <source :src="audioSrc" type="audio/wav" /> <!-- 🔥 You will set the actual source here -->
          Your browser does not support the audio element.
        </audio>
        <p class="audio-description">
          <strong>Narrative:</strong> {{ caseStore.selectedCase?.narrative }}
        </p>
      </div>

      <div class="chart-container">
        <canvas ref="transcriptionChart"></canvas>
      </div>
    </div>

    <!-- Tabs -->
    <div class="tabs">
      <button :class="{ active: activeTab === 'not-transcribed' }" @click="activeTab = 'not-transcribed'">
        Not Transcribed ({{ notTranscribed.length }})
      </button>
      <button :class="{ active: activeTab === 'transcribed' }" @click="activeTab = 'transcribed'">
        Transcribed ({{ transcribed.length }})
      </button>
      <button :class="{ active: activeTab === 'rejected' }" @click="activeTab = 'rejected'">
        Rejected ({{ rejected.length }})
      </button>
    </div>

    <!-- Sort Dropdown -->
    <div class="sort">
      <label for="sort">Sort By:</label>
      <select id="sort" v-model="sortBy">
        <option value="newest">Newest</option>
        <option value="oldest">Oldest</option>
      </select>
    </div>

    <!-- Chunk Cards -->
    <div class="audio-list">
      <div v-for="(chunk, index) in filteredChunks" :key="chunk.id" class="audio-card">
        <p>{{ "chunk_"+ chunk.order }}</p>
        <button class="transcribe-btn" @click="openTranscribingScreen(index, activeTab)">
          Transcribe
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { useCaseStore } from '../stores/caseStore.js'
import Chart from 'chart.js/auto'

const route = useRoute()
const router = useRouter()
const caseStore = useCaseStore()
const audioId = route.params.audioId

const notTranscribed = ref([])
const transcribed = ref([])
const rejected = ref([])

const activeTab = ref('not-transcribed')
const sortBy = ref('oldest')

const goodBadChart = ref(null)
const transcriptionChart = ref(null)

onMounted(async () => {
  await fetchChunks()
  await nextTick()
  drawCharts()
})

// ✅ **Fetch separate lists and store in Pinia**
async function fetchChunks() {
  try {
    const [untranscribedRes, transcribedRes, rejectedRes] = await Promise.all([
      axios.get(`http://127.0.0.1:8000/api/transcription/api/audio-files/${audioId}/chunks/untranscribed/`),
      axios.get(`http://127.0.0.1:8000/api/transcription/api/audio-files/${audioId}/chunks/transcribed/`),
      axios.get(`http://127.0.0.1:8000/api/transcription/api/audio-files/${audioId}/chunks/rejected/`)
    ])

    notTranscribed.value = untranscribedRes.data
    transcribed.value = transcribedRes.data
    rejected.value = rejectedRes.data

    caseStore.setNotTranscribed(notTranscribed.value)
    caseStore.setTranscribed(transcribed.value)
    caseStore.setRejected(rejected.value)
  } catch (error) {
    console.error('Error fetching audio chunks:', error)
  }
}

// ✅ **Pass correct list when opening TranscribingScreen**
function openTranscribingScreen(startIndex, listType) {
  router.push({
    name: 'TranscribingScreen',
    params: { startIndex: startIndex.toString(), listType }
  })
}
 const API_BASE_URL = 'http://127.0.0.1:8000'

  // Build the audio src
const audioSrc = computed(() => {
    if (!caseStore.selectedCase?.audio_file) return ''
    return `${API_BASE_URL}${caseStore.selectedCase?.audio_file.audio_file}`
  })

console.log(audioSrc)

// ✅ **Compute filtered list**
const filteredChunks = computed(() => {
  let list = []
  if (activeTab.value === 'not-transcribed') list = notTranscribed.value
  else if (activeTab.value === 'transcribed') list = transcribed.value
  else if (activeTab.value === 'rejected') list = rejected.value
  return sortBy.value === 'newest' ? [...list].reverse() : [...list]
})

// ✅ **Draw Pie Charts**
function drawCharts() {
  const totalChunks = notTranscribed.value.length + transcribed.value.length + rejected.value.length
  const goodChunks = transcribed.value.length
  const badChunks = rejected.value.length
  const transcribedChunks = transcribed.value.length
  const untranscribedChunks = notTranscribed.value.length

  // Good vs Bad Pie Chart
  new Chart(goodBadChart.value, {
    type: 'pie',
    data: {
      labels: ['Good (Valid Transcriptions)', 'Bad (Rejected)'],
      datasets: [{
        data: [goodChunks, badChunks],
        backgroundColor: ['#28a745', '#dc3545']
      }]
    }
  })

  // Transcribed vs Untranscribed vs Rejected Pie Chart
  new Chart(transcriptionChart.value, {
    type: 'pie',
    data: {
      labels: ['Transcribed', 'Untranscribed', 'Rejected'],
      datasets: [{
        data: [transcribedChunks, untranscribedChunks, badChunks],
        backgroundColor: ['#007bff', '#ffc107', '#dc3545']
      }]
    }
  })
}
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: top;
}

.chart-container {
  width: 200px;
  height: 200px;
  background-color: #7fd8e5;
  color: #000;
  border-radius: 15px;
}

.audio-header {
  display: flex;
  flex-direction: column; /* Stack the heading above the audio player */
  align-items: center; /* Center content horizontally */
  justify-content: center; /* Center content vertically */
  width: 100%; /* Ensure it expands fully */
  max-width: 100%; /* Prevents unnecessary shrinking */
  gap: 8px; /* Space between heading and audio */
  margin-bottom: 15px;
}

.audio-description {
  max-width: 600px; /* 🔥 Limit width to 600px */
  display: -webkit-box;
  -webkit-line-clamp: 2; /* 🔥 Safari & Chrome */
  -webkit-box-orient: vertical;
  line-clamp: 2; /* ✅ Standard property */
  box-orient: vertical;
  overflow: hidden; /* Hide overflow */
  text-overflow: ellipsis; /* Adds '...' when text is truncated */
  font-size: 14px;
  font-style: italic; /* 🔥 Italics */
  text-align: center;
  line-height: 1.4; /* Adjust for better spacing */
  max-height: 2.8em; /* Ensures it doesn't expand beyond two lines */
}



.audio-player {
  width: 100%; /* Make the audio player take full width */
  max-width: 600px; /* Adjust the max width to fit the layout */
}


.transcription-screen {
  background: #222;
  color: white;
  padding: 20px;
  text-align: center;
}

/* Tabs */
.tabs {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-bottom: 20px;
}

.tabs button {
  padding: 10px 20px;
  background: gray;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}

.tabs .active {
  background: purple;
  color: white;
}

/* Sort dropdown */
.sort {
  margin-bottom: 20px;
}

/* Audio cards */
.audio-list {
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
}

.audio-card {
  background: white;
  color: black;
  padding: 10px;
  border-radius: 5px;
  width: 150px;
  text-align: center;
}

.transcribe-btn {
  background: #3b5998;
  color: white;
  padding: 5px 10px;
  border: none;
  cursor: pointer;
  margin-top: 5px;
}
</style>
