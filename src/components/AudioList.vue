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
        <!-- Audio Cards -->
        <div class="audio-list">
            <div v-for="(audio, index) in sortedAudios" :key="audio.id" class="audio-card">
                <p>{{ "audio_" + audio.id }}</p>
                <button class="review-btn" @click="openAudioPlayerScreen(index)">
                    Review
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
import axios from 'axios'
import { useCaseStore } from '../stores/caseStore.js'
import { useRouter } from 'vue-router'

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
        const response = await axios.get('http://127.0.0.1:8000/api/transcriptions/cleaned-audio-files/?pending=true')
        availableAudios.value = response.data
        caseStore.setAudioList(availableAudios.value)
        errorMessage.value = ''  // Clear any previous error message
    } catch (error) {
        console.error('Error fetching audios:', error)
        errorMessage.value = 'Failed to load audio files. Please try again later.'
    }
}

// Computed property to sort audios based on user selection
const sortedAudios = computed(() => {
    return availableAudios.value.sort((a, b) => {
        if (sortBy.value === 'newest') {
            return new Date(b.created_at) - new Date(a.created_at)  // Assuming there's a 'created_at' field
        } else {
            return new Date(a.created_at) - new Date(b.created_at)
        }
    })
})

// Function to open audio player screen
function openAudioPlayerScreen(startIndex) {
    console.log(startIndex.toString())
    router.push({
        name: 'AudioEvaluationScreen',
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
</style>
