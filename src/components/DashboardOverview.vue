<template>
    <div class="dashboard-container">
      <h2>Select Action for Project</h2>
      <p>Choose the appropriate action for your project</p>
  
      <table>
        <thead>
          <tr>
            <th>Case Id</th>
            <th>Completed / Total Chunks</th>
            <th>Total Record Time (s)</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(caseItem, index) in transcriptionRequests" :key="index">
            <td>{{ caseItem.case_id }}</td>
            <td>
              {{ caseItem.audio_file.transcribed_chunks }} /
              {{ caseItem.audio_file.total_chunks }}
            </td>
            <td>{{ caseItem.audio_file.duration }} s</td>
            <td>
              <!-- Pass the entire caseItem to openTranscription -->
              <button
                class="open-btn"
                @click="openTranscription(caseItem)"
              >
                Open
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import axios from 'axios'
  
  // Import the store
  import { useCaseStore } from '../stores/caseStore.js'
  
  const router = useRouter()
  const transcriptionRequests = ref([])
  
  // Initialize the store
  const caseStore = useCaseStore()
  
  // Fetch transcription requests from API
  const fetchRequests = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/transcription/case-records')
      transcriptionRequests.value = response.data
    } catch (error) {
      console.error('Error fetching transcription requests:', error)
    }
  }
  
  onMounted(fetchRequests)
  
  // Save case data globally, then navigate
  function openTranscription(caseItem) {
    // Store the entire case object (including narrative) globally
    caseStore.setSelectedCase(caseItem)
  
    // Navigate to TranscriptionScreen, passing the audioId as a param
    router.push({
      name: 'TranscriptionScreen',
      params: {
        audioId: caseItem.audio_file.id
      }
    })
  }
  </script>
  
  <style scoped>
  .dashboard-container {
    padding: 20px;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
  }
  
  th,
  td {
    padding: 10px;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }
  
  .open-btn {
    background-color: #3b5998;
    color: white;
    padding: 5px 10px;
    border-radius: 5px;
    border: none;
    cursor: pointer;
  }
  
  .open-btn:hover {
    background-color: #2c3e50;
  }
  </style>
  