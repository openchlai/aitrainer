<template>
    <div class="audio-list-screen">
        <!-- Sort Dropdown -->
        <div class="sort">
            <label for="sort">Sort By:</label>
            <select id="sort" v-model="sortBy">
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
            </select>
        </div>
        <!-- <FolderPicker /> -->
        <p> <span style="background-color: green; border-radius: 50%;"> ✓ </span>Indicates chunk has been Transcribed</p>
        <!-- Audio Cards -->
        <div class="audio-list">
            <div v-for="(audio, index) in availableAudios" :key="audio.id" class="audio-card">
                <div v-if="audio.feature_text!==null" class="checkmark">✓</div>
                <p>{{ "audio_" + index }}</p>
                <button class="review-btn" @click="openAudioPlayerScreen(index)">
                    Transcribe
                </button>
            </div>
        </div>
        <!-- Error Message (if any) -->
        <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from 'vue'
import apiClient from "@/utils/axios"
import { useCaseStore } from '../stores/caseStore.js'
    import { useRouter } from 'vue-router'
// import FolderPicker from './FolderPicker.vue'

const availableAudios = ref([])
const sortBy = ref('oldest')
const errorMessage = ref('')  // To hold any error message
const caseStore = useCaseStore()
const router = useRouter()

// Fetch audios on mount
onMounted(async () => {
    await fetchAudios()
    await nextTick()
})

// Function to fetch audio data
async function fetchAudios() {
    try {
        const response = await apiClient.get('/transcriptions/transcribable/')
        availableAudios.value = response.data.chunks_for_transcription
        caseStore.setAudioList(availableAudios.value)
        errorMessage.value = ''  // Clear any previous error message
    } catch (error) {
        console.error('Error fetching audios:', error)
        errorMessage.value = 'Failed to load audio files. Please try again later.'
    }
}

// // Computed property to sort audios based on user selection
// const sortedAudios = computed(() => {
//     return availableAudios.value.sort((a, b) => {
//         if (sortBy.value === 'newest') {
//             return new Date(b.created_at) - new Date(a.created_at)  // Assuming there's a 'created_at' field
//         } else {
//             return new Date(a.created_at) - new Date(b.created_at)
//         }
//     })
// })

// Function to open audio player screen
function openAudioPlayerScreen(startIndex) {
    console.log(startIndex.toString())
    router.push({
        name: 'ChunkTranscribingScreen',
        params: { startIndex: startIndex.toString() }
    })
}
</script>

<style scoped>
.audio-list-screen {
    background: #222;
    color: white;
    padding: 20px;
    text-align: center;
}

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

.review-btn {
    background: #3b5998;
    color: white;
    padding: 5px 10px;
    border: none;
    cursor: pointer;
    margin-top: 5px;
}

.error-message {
    color: red;
    font-size: 16px;
    margin-top: 20px;
}

/* Checkmark */
.checkmark {
    /* position: absolute; */
    top: 5px;
    right: 5px;
    background: green;
    color: white;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
}
</style>
