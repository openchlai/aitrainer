<script>
import { ref } from "vue";
import axios from "axios";

import TranscriptionList from "./TranscriptionList.vue";

export default {
    components: {
        TranscriptionList,
    },
    setup() {
        const audioFile = ref(null);
        const audioURL = ref("");
        const transcript = ref("");

        const handleFileUpload = async (event) => {
            const file = event.target.files[0];
            if (file) {
                audioURL.value = URL.createObjectURL(file);
                audioFile.value = file;
            }
        };

        const transcribeAudio = async () => {
            if (!audioFile.value) {
                alert("Please upload an audio file.");
                return;
            }

            const formData = new FormData();
            formData.append("audio_file", audioFile.value);

            try {
                const response = await axios.post("http://127.0.0.1:8000/api/transcription/transcribe/", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });

                transcript.value = response.data.model_transcript;
            } catch (error) {
                console.error("Transcription failed:", error);
            }
        };

        return {
            audioFile,
            audioURL,
            transcript,
            handleFileUpload,
            transcribeAudio,
        };
    },
};
</script>

<template>
    <TranscriptionList />
    <div class="container">
        <h2>Upload & Transcribe Audio</h2>


        <input type="file" @change="handleFileUpload" accept="audio/*" />

        <div v-if="audioURL">
            <audio :src="audioURL" controls></audio>
            <button @click="transcribeAudio">Transcribe</button>
        </div>

        <div v-if="transcript">
            <h3>Transcription</h3>
            <p>{{ transcript }}</p>
        </div>
    </div>
</template>

<style scoped>
.container {
    max-width: 600px;
    margin: 20px auto;
    padding: 20px;
    background: white;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    text-align: center;
}

input {
    margin-bottom: 15px;
}

button {
    background: #007bff;
    color: white;
    padding: 10px;
    border: none;
    cursor: pointer;
    border-radius: 5px;
}

button:hover {
    background: #0056b3;
}
</style>
