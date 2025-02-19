<template>
    <div class="audio-screen">
        <!-- Top Bar -->
        <div class="top-bar">
            <!-- Show chunk index + total -->
            <p>{{ currentIndex + 1 }} / {{ totalChunks }}</p>
            <h2>Evaluating Chunk {{ currentChunk.id }}</h2>
        </div>

        <!-- Chunk Player -->
        <div class="audio-container">
            <audio ref="audioPlayer" class="audio-player" controls>
                <source :src="audioSrc" type="audio/wav" />
                Your browser does not support the audio element.
            </audio>

            <!-- Playback Controls -->
            <div class="playback-buttons">
                <button @click="playChunk" :disabled="isPlaying">Play</button>
                <button @click="pauseChunk" :disabled="!isPlaying">Pause</button>
                <button @click="resetChunk">Reset</button>
                <button @click="skipChunk(-5)">-5s</button>
                <button @click="skipChunk(5)">+5s</button>
            </div>

            <!-- Current Time Display -->
            <div class="current-time">
                Time: {{ currentTime.toFixed(2) }}s / {{ currentChunk.duration || 0 }}s
            </div>
        </div>

        <!-- Evaluation Checkboxes -->
        <div class="evaluation-box">
            <label>
                <input type="checkbox" v-model="evaluation_payload.single_speaker" /> Single Speaker
            </label>
            <label>
                <input type="checkbox" v-model="evaluation_payload.speaker_overlap" /> Speaker Overlap
            </label>
            <label>
                <input type="checkbox" v-model="evaluation_payload.background_noise" /> Background Noise
            </label>
            <label>
                <input type="checkbox" v-model="evaluation_payload.prolonged_silence" /> Prolonged Silence
            </label>
            <label>
                <input type="checkbox" v-model="evaluation_payload.Not_Speech_Rate" /> Not Speech Rate
            </label>
            <label>
                <input type="checkbox" v-model="evaluation_payload.echo_noise" /> Echo Noise
            </label>
        </div>

        <!-- Save Button -->
        <div class="action-buttons">
            <button @click="goPrevious" :disabled="currentIndex === 0">Previous</button>
            <button @click="saveEvaluation" class="save-button">Save Evaluation</button>
            <button @click="goNext" :disabled="currentIndex === totalChunks - 1">Next</button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import apiClient from '@/utils/axios'

// Pinia store
import { useCaseStore } from '../stores/caseStore.js'
import { useToast } from 'vue-toastification';

const toast = useToast();


const caseStore = useCaseStore()
const route = useRoute()

// The base API if needed
// const API_BASE_URL = 'http://127.0.0.1:8000'

// The current chunk index in the store’s list
const currentIndex = ref(0)

// Chunk playback
const audioPlayer = ref(null)
const isPlaying = ref(false)
const currentTime = ref(0)

// Evaluation data
    const evaluation_payload = ref({
    
    single_speaker: false,
    speaker_overlap: false,
    background_noise: false,
    prolonged_silence: false,
    Not_Speech_Rate: false,
    echo_noise: false,
})

// On mount, parse the :startIndex from route
onMounted(() => {
    const idx = parseInt(route.params.startIndex, 10)
    currentIndex.value = Number.isNaN(idx) ? 0 : idx
})

const audioList = computed(() => caseStore.audioList)
const currentChunk = computed(() => audioList.value[currentIndex.value] || {})
const totalChunks = computed(() => audioList.value.length)

// Build the audio src
const audioSrc = computed(() => {
    if (!currentChunk.value.chunk_file) return ''
    return currentChunk.value.chunk_file
})

// Whenever we switch chunks, reset playback & evaluation data
watch(currentChunk, async () => {
    isPlaying.value = false
    currentTime.value = 0
    evaluation_payload.value = {
        single_speaker: false,
        speaker_overlap: false,
        background_noise: false,
        prolonged_silence: false,
        Not_Speech_Rate: false,
        echo_noise: false,
    }

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
function playChunk() {
    if (audioPlayer.value) audioPlayer.value.play()
}
function pauseChunk() {
    if (audioPlayer.value) audioPlayer.value.pause()
}
function resetChunk() {
    if (!audioPlayer.value) return
    audioPlayer.value.currentTime = 0
    isPlaying.value = false
    audioPlayer.value.pause()
}
function skipChunk(seconds) {
    if (!audioPlayer.value) return
    const newTime = audioPlayer.value.currentTime + seconds
    const duration = audioPlayer.value.duration || 0
    audioPlayer.value.currentTime = Math.min(Math.max(newTime, 0), duration)
}

// Save evaluation
async function saveEvaluation() {
    if (!currentChunk.value.id) return;

    const payload = {
        ...evaluation_payload.value,
        is_evaluated: true,
    };

    try {
        const resp = await apiClient.post(`/transcriptions/evaluation-results/`, payload);

        // Handle the response
        if (resp.data.created) {
            toast.success(`Chunk ${currentChunk.value.id} saved successfully! Evaluation ID: ${resp.data.evaluation_id}`);
            // goNext();
        } else {
            toast.success(`Chunk ${currentChunk.value.id} updated successfully! Evaluation ID: ${resp.data.evaluation_id}`);
            // goNext();
        }
    } catch (err) {
        console.error('Error saving evaluation:', err);
        toast.error(`Could not save evaluation for chunk ${currentChunk.value.id}. Please try again.`);
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

/* Chunk container */
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

/* Evaluation Checkboxes */
.evaluation-box {
    background: white;
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 8px;
    border: 1px solid #ccc;
}

.evaluation-box label {
    display: block;
    margin-bottom: 8px;
}

/* Action Buttons */
.action-buttons {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 12px;
}

.save-button {
    background: #28a745;
    color: white;
}

.save-button:disabled {
    cursor: not-allowed;
    background: #b2debd;
}
</style>