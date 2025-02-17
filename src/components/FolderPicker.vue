<template>
    <div class="folder-picker">
        <h2>Select a Folder to Process Audio Files</h2>

        <input type="file" webkitdirectory directory @change="handleFolderSelection" />

        <button @click="submitFolder" :disabled="fileList.length === 0">Process Audio Files</button>

        <p v-if="message" class="message">{{ message }}</p>
    </div>
</template>

<script>
    import { ref } from "vue";
    import apiClient from "@/utils/axios.js";

    export default {
        setup() {
            const fileList = ref([]);
            const message = ref("");

            const handleFolderSelection = (event) => {
                const files = Array.from(event.target.files);
                fileList.value = files; // Store actual file objects
            };

            const submitFolder = async () => {
                try {
                    if (fileList.value.length === 0) {
                        message.value = "No files selected.";
                        return;
                    }

                    const formData = new FormData();
                    fileList.value.forEach(file => {
                        formData.append("files", file); // Attach each file
                    });

                    const response = await apiClient.post("/transcriptions/process-audio/", formData, {
                        headers: { "Content-Type": "multipart/form-data" }
                    });

                    message.value = response.data.message;
                } catch (error) {
                    message.value = error.response?.data?.error || "Error processing files.";
                }
            };

            return {
                fileList,
                message,
                handleFolderSelection,
                submitFolder,
            };
        },
    };
</script>

<style scoped>
    .folder-picker {
        text-align: center;
        margin: 20px;
    }

    input {
        display: block;
        margin: 10px auto;
    }

    button {
        background-color: #007bff;
        color: white;
        padding: 10px;
        border: none;
        cursor: pointer;
    }

    .message {
        margin-top: 10px;
        color: green;
    }
</style>
