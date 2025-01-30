<script setup>
    import { ref, onMounted, watch } from 'vue';
    import axios from 'axios';

    const transcriptionRequests = ref([]);
    const selectedAudio = ref(null);
    const transcriptionText = ref("");
    const audioPlayer = ref(null);
    const isPlaying = ref(false);
    const currentTime = ref(0);

    const fetchRequests = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/transcription/case-records');
            transcriptionRequests.value = response.data;
        } catch (error) {
            console.error("Error fetching transcription requests:", error);
        }
    };

    const loadTranscription = (request) => {
        selectedAudio.value = request;
        transcriptionText.value = ""; // Reset transcription text when loading a new request
        currentTime.value = 0; // Reset current time on new audio
        isPlaying.value = false; // Ensure audio is paused initially
    };

    const playAudio = () => {
        if (audioPlayer.value) {
            audioPlayer.value.play();
            isPlaying.value = true;
        }
    };

    const pauseAudio = () => {
        if (audioPlayer.value) {
            audioPlayer.value.pause();
            isPlaying.value = false;
        }
    };

    const resetAudio = () => {
        if (audioPlayer.value) {
            audioPlayer.value.currentTime = 0;
            isPlaying.value = false;
            transcriptionText.value = ""; // Reset transcription when resetting audio
        }
    };

    watch(audioPlayer, (newPlayer) => {
        if (newPlayer) {
            newPlayer.ontimeupdate = () => {
                currentTime.value = newPlayer.currentTime;
            };
        }
    });

    onMounted(fetchRequests);
</script>

<template>
    <div class="container">
        <h1 class="title">Transcription Requests</h1>
        <ul class="request-list">
            <li v-for="request in transcriptionRequests" :key="request.unique_id" class="request-item">
                <div class="request-header">
                    <span class="request-title">{{ request.case_id }} - {{ request.narrative }}</span>
                    <button @click="loadTranscription(request)" class="transcribe-button">Transcribe</button>
                </div>
            </li>
        </ul>

        <div v-if="selectedAudio" class="transcription-container">
            <h2 class="transcription-title">Transcribing Case: {{ selectedAudio.case_id }}</h2>

            <!-- Audio Player with controls -->
            <audio ref="audioPlayer" controls class="audio-player">
                <source :src="selectedAudio.audio_url" type="audio/mp3" />
                Your browser does not support the audio element.
            </audio>

            <!-- Playback Control Buttons -->
            <div class="audio-controls">
                <button @click="playAudio" :disabled="isPlaying" class="play-button">Play</button>
                <button @click="pauseAudio" :disabled="!isPlaying" class="pause-button">Pause</button>
                <button @click="resetAudio" class="reset-button">Reset</button>
            </div>

            <!-- Transcription Input Field -->
            <textarea v-model="transcriptionText" class="transcription-textarea" rows="6"
                placeholder="Enter transcription here..."></textarea>

            <!-- Display current playback time -->
            <p class="current-time">Current Time: {{ currentTime.toFixed(2) }} seconds</p>
            <button @click="submitTranscription" class="transcribe-button">Submit Transcription</button>
        </div>
    </div>
</template>

<style scoped>
    .container {
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
        background-color: #644040;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .title {
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 20px;
        text-align: center;
        color: black;
    }

    .request-list {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .request-item {
        padding: 10px;
        border-bottom: 1px solid #ddd;
        color: black;
    }

    .request-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: black;
    }

    .request-title {
        font-size: 18px;
        font-weight: 500;
        color: black;
    }

    .transcribe-button {
        padding: 5px 10px;
        background-color: #007bff;
        color: black;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    .transcribe-button:hover {
        background-color: #0056b3;
    }

    .transcription-container {
        margin-top: 20px;
        color: black;
    }

    .transcription-title {
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 10px;
        color: black;
    }

    .audio-player {
        width: 100%;
        margin-bottom: 10px;
    }

    .audio-controls {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
    }

    .play-button,
    .pause-button,
    .reset-button {
        padding: 8px 15px;
        background-color: #28a745;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    .play-button:disabled,
    .pause-button:disabled,
    .reset-button:disabled {
        background-color: #ddd;
        cursor: not-allowed;
    }

    .play-button:hover:not(:disabled),
    .pause-button:hover:not(:disabled),
    .reset-button:hover:not(:disabled) {
        background-color: #218838;
    }

    .transcription-textarea {
        width: 100%;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 16px;
        color: black;
    }

    .current-time {
        font-size: 14px;
        color: black;
        margin-top: 10px;
    }
</style>
