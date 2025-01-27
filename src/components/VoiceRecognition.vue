<script setup>
    import { ref } from 'vue';

    const transcript = ref('');
    const transcriptionLog = ref([]);
    const isRecording = ref(false);

    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
        let newText = event.results[event.results.length - 1][0].transcript;

        // Append new transcription instead of overwriting
        transcript.value += ' ' + newText;
    };

    const startListening = () => {
        isRecording.value = true;
        recognition.start();
    };

    const stopListening = () => {
        isRecording.value = false;
        recognition.stop();
        if (transcript.value.trim()) {
            const logEntry = { text: transcript.value, timestamp: new Date().toLocaleTimeString() };
            transcriptionLog.value.unshift(logEntry); // Add new logs at the top

            // Log transcription to the console
            console.log(`[${logEntry.timestamp}] Transcription:`, logEntry.text);

            transcript.value = ''; // Clear current transcript after logging
        }
    };
</script>

<template>
    <div class="container">
        <h2>Real-time Voice Recognition</h2>

        <div class="controls">
            <button @click="startListening" :disabled="isRecording" class="start-btn">
                🎤 Start Recording
            </button>
            <button @click="stopListening" :disabled="!isRecording" class="stop-btn">
                ⏹️ Stop
            </button>
        </div>

        <div class="transcription">
            <p><strong>Current Transcription:</strong> {{ transcript || 'Waiting for speech...' }}</p>
        </div>

        <div class="log">
            <h3>Transcription Log</h3>
            <ul>
                <li v-for="(log, index) in transcriptionLog" :key="index">
                    <span class="timestamp">[{{ log.timestamp }}]</span> {{ log.text }}
                </li>
            </ul>
        </div>
    </div>
</template>

<style scoped>
    .container {
        max-width: 600px;
        margin: 20px auto;
        padding: 20px;
        background: #ffffff;
        box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
        border-radius: 8px;
        text-align: center;
    }

    h2 {
        color: #333;
    }

    .controls {
        margin-bottom: 15px;
    }

    button {
        font-size: 16px;
        padding: 10px 15px;
        margin: 5px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .start-btn {
        background: #28a745;
        color: white;
    }

    .stop-btn {
        background: #dc3545;
        color: white;
    }

    button:disabled {
        background: #ccc;
        cursor: not-allowed;
    }

    .transcription {
        margin: 15px 0;
        font-size: 18px;
        color: #444;
        padding: 10px;
        background: #f9f9f9;
        border-radius: 5px;
    }

    .log {
        margin-top: 20px;
        text-align: left;
    }

    .log h3 {
        border-bottom: 2px solid #ddd;
        padding-bottom: 5px;
    }

    ul {
        list-style: none;
        padding: 0;
    }

    li {
        background: #f1f1f1;
        margin: 5px 0;
        padding: 10px;
        border-radius: 5px;
    }

    .timestamp {
        font-weight: bold;
        color: #007bff;
    }
</style>
