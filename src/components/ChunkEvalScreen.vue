<template>
    <div class="audio-screen">
        <div class="top-bar">
            <p>{{ currentIndex + 1 }} / {{ totalChunks }}</p>
            <h2>Evaluating Chunk {{ currentIndex }}</h2>
        </div>

        <div class="audio-container">
            <audio ref="audioPlayer" class="audio-player" controls>
                <source :src="audioSrc" type="audio/wav" />
                Your browser does not support the audio element.
            </audio>

            <div class="playback-buttons">
                <button @click="playChunk" :disabled="isPlaying">Play</button>
                <button @click="pauseChunk" :disabled="!isPlaying">Pause</button>
                <button @click="resetChunk">Reset</button>
                <button @click="skipChunk(-5)">-5s</button>
                <button @click="skipChunk(5)">+5s</button>
            </div>

            <div class="current-time">
                Time: {{ currentTime.toFixed(2) }}s / {{ currentChunk.duration || 0 }}s
            </div>
        </div>

        <div class="evaluation-box">
            <div v-for="(item, key) in evaluationOptions" :key="key" class="radio-group">
                <label>{{ item.label }}</label>
                <div class="radio-buttons">
                    <label>
                        <input type="radio" :value="true" v-model="evaluation_payload[key]" /> Yes
                    </label>
                    <label>
                        <input type="radio" :value="false" v-model="evaluation_payload[key]" /> No
                    </label>
                </div>
            </div>
        </div>

        <div class="action-buttons">
            <button @click="goPrevious" :disabled="currentIndex === 0">Previous</button>
            <button @click="saveEvaluation" class="save-button">Save Evaluation</button>
            <button @click="goNext" :disabled="currentIndex === totalChunks - 1">Next</button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick, reactive } from 'vue';
import { useRoute } from 'vue-router';
import apiClient from '@/utils/axios';
import { useCaseStore } from '../stores/caseStore.js';
import { useToast } from 'vue-toastification';

const toast = useToast();
const caseStore = useCaseStore();
const route = useRoute();

const currentIndex = ref(0);
const audioPlayer = ref(null);
const isPlaying = ref(false);
const currentTime = ref(0);

const evaluationOptions = {
    dual_speaker: { label: "Dual Speaker" },
    speaker_overlap: { label: "Speaker Overlap" },
    background_noise: { label: "Background Noise" },
    prolonged_silence: { label: "Prolonged Silence" },
    not_normal_speech_rate: { label: "Not Normal Speech Rate" },
    echo_noise: { label: "Echo Noise" },
    incomplete_sentence: { label: "Incomplete Sentence" },
};

const evaluation_payload = reactive({});

for (const key in evaluationOptions) {
    evaluation_payload[key] = false;
}

const audioList = computed(() => caseStore.audioList);
const currentChunk = computed(() => audioList.value[currentIndex.value] || {});
const totalChunks = computed(() => audioList.value.length);
const audioSrc = computed(() => currentChunk.value.chunk_file || '');

let evaluationStartTime = null;

onMounted(() => {
    const absoluteIndex = parseInt(route.params.absoluteIndex);
    if (audioList.value && audioList.value.length > absoluteIndex) {
        currentIndex.value = Number.isNaN(absoluteIndex) ? 0 : absoluteIndex;
        evaluationStartTime = new Date(); // Capture start time
    } else {
        console.log(audioList.value.length);
        console.error("Invalid audio index or audio list not loaded.");
    }
});

watch(currentChunk, async () => {
    isPlaying.value = false;
    currentTime.value = 0;
    for (const key in evaluation_payload) {
        evaluation_payload[key] = false;
    }
    await nextTick();
    if (audioPlayer.value) {
        audioPlayer.value.load();
    }
    evaluationStartTime = new Date(); // reset start time on chunk change
});

watch(audioPlayer, (player) => {
    if (!player) return;
    player.ontimeupdate = () => {
        currentTime.value = player.currentTime;
    };
    player.onplay = () => {
        isPlaying.value = true;
    };
    player.onpause = () => {
        isPlaying.value = false;
    };
});

function playChunk() {
    if (audioPlayer.value) audioPlayer.value.play();
}

function pauseChunk() {
    if (audioPlayer.value) audioPlayer.value.pause();
}

function resetChunk() {
    if (!audioPlayer.value) return;
    audioPlayer.value.currentTime = 0;
    isPlaying.value = false;
    audioPlayer.value.pause();
}

function skipChunk(seconds) {
    if (!audioPlayer.value) return;
    const newTime = audioPlayer.value.currentTime + seconds;
    const duration = audioPlayer.value.duration || 0;
    audioPlayer.value.currentTime = Math.min(Math.max(newTime, 0), duration);
}

async function saveEvaluation() {
    if (!currentChunk.value.unique_id) return;

    const evaluationEndTime = new Date();
    const evaluationDuration = new Date(evaluationEndTime - evaluationStartTime);

    const payload = {
        ...evaluation_payload,
        is_evaluated: true,
        evaluation_start: evaluationStartTime.toISOString(),
        evaluation_end: evaluationEndTime.toISOString(),
        evaluation_duration: evaluationDuration.toISOString().substr(11, 8), // Format duration as HH:MM:SS
    };

    try {
        const resp = await apiClient.post(`/transcriptions/audio-chunks/${currentChunk.value.unique_id}/evaluate/`, payload);
        if (resp.data.created) {
            console.log(resp.data.evaluation);
            toast.success(`Chunk ${currentIndex.value} saved successfully! Evaluation ID: ${resp.data}`);
        } else {
            toast.success(`Chunk ${currentIndex.value} updated successfully! Evaluation ID: ${resp.data}`);
        }
    } catch (err) {
        console.error('Error saving evaluation:', err);
        toast.error(`Could not save evaluation for chunk ${currentIndex.value}. Please try again.`);
    }
}

function goNext() {
    if (currentIndex.value < audioList.value.length - 1) {
        currentIndex.value++;
    }
}

function goPrevious() {
    if (currentIndex.value > 0) {
        currentIndex.value--;
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
    display: inline-block;
    margin-bottom: 5px;
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

.radio-group {
    margin-bottom: 8px; /* Space between radio groups */
}

.radio-buttons {
    display: inline-flex;  /* Arrange radio buttons horizontally */
    gap: 10px; /* Space between Yes/No buttons */
    margin-left: 10px; /* Indent the radio buttons */
}

.radio-buttons label {
    display: inline-block; /* Makes labels behave like inline elements */
}
</style>