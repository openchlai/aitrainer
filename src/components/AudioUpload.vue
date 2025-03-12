<template>
    <div class="audio-uploader">
        <h2>Upload Audio Files</h2>
        
        <!-- Drag and drop upload zone -->
        <div 
            class="drag-drop-zone" 
            :class="{ 'active': isDragging }"
            @dragenter.prevent="isDragging = true"
            @dragover.prevent="isDragging = true" 
            @dragleave.prevent="isDragging = false"
            @drop.prevent="handleFileDrop"
        >
            <div class="upload-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
            </div>
            <h3>Drag and drop file(s) to upload, or:</h3>
            <div class="button-group">
                <label for="file-input" class="select-button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="12" y1="18" x2="12" y2="12"></line>
                        <line x1="9" y1="15" x2="15" y2="15"></line>
                    </svg>
                    Select File(s)
                </label>
                <input 
                    type="file" 
                    id="file-input" 
                    multiple 
                    @change="handleFileUpload" 
                    accept="audio/*" 
                    class="file-input" 
                />
                
                <label for="folder-input" class="select-button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                    </svg>
                    Select Folder
                </label>
                <input 
                    type="file" 
                    id="folder-input" 
                    webkitdirectory directory 
                    multiple 
                    @change="handleFileUpload" 
                    class="file-input" 
                />
            </div>
        </div>
        
        <!-- Upload button and progress section -->
        <div v-if="files.length > 0" class="upload-actions">
            <button 
                class="upload-button" 
                @click="uploadFiles" 
                :disabled="isUploading"
            >
                {{ isUploading ? 'Uploading...' : 'Upload Selected Files' }}
            </button>
            
            <button 
                class="cancel-button" 
                @click="resetUpload" 
                :disabled="isUploading"
            >
                Cancel
            </button>
        </div>
        
        <!-- Progress section -->
        <div v-if="isUploading || uploadComplete" class="progress-section">
            <div class="upload-progress">
                <div class="progress-bar-container">
                    <div 
                        class="progress-bar-fill" 
                        :style="{ width: `${uploadProgress}%` }"
                        :class="{ 'complete': uploadComplete, 'success': uploadSuccess, 'failure': uploadComplete && !uploadSuccess }"
                    ></div>
                </div>
                <div class="progress-text">
                    <span>{{ uploadProgress }}%</span>
                    <span class="upload-message">{{ uploadMessage }}</span>
                </div>
            </div>
            
            <!-- Results section -->
            <div v-if="uploadComplete" class="upload-results">
                <div v-if="uploadSuccess" class="success-message">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    <span>{{ uploadResults.success }} files uploaded successfully</span>
                </div>
                <div v-if="uploadResults.failed > 0" class="error-message">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    <span>{{ uploadResults.failed }} files failed to upload</span>
                </div>
            </div>
        </div>
        
        <!-- File list -->
        <div v-if="files.length > 0" class="file-list-container">
            <h3>Selected Files ({{ files.length }})</h3>
            <p class="total-size">Total size: {{ formatFileSize(totalSize) }}</p>
            <ul class="file-list">
                <li v-for="file in files" :key="file.name" class="file-item">
                    <div class="file-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M17.5 22h.5c.5 0 1-.2 1.4-.6.4-.4.6-.9.6-1.4V7.5L14.5 2H6c-.5 0-1 .2-1.4.6C4.2 3 4 3.5 4 4v3"></path>
                            <path d="M14 2v6h6"></path>
                            <circle cx="10" cy="16" r="6"></circle>
                            <path d="M8 16c0-2 1-3 2-3s2 1 2 3-1 3-2 3-2-1-2-3z"></path>
                        </svg>
                    </div>
                    <div class="file-info">
                        <span class="file-name">{{ file.name }}</span>
                        <span class="file-size">{{ formatFileSize(file.size) }}</span>
                    </div>
                    <button class="remove-file" @click="removeFile(file)">×</button>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import apiClient from '@/utils/axios';
import { useProjectStore } from '@/stores/project';

const files = ref([]);
const isUploading = ref(false);
const uploadProgress = ref(0);
const uploadComplete = ref(false);
const uploadSuccess = ref(false);
const uploadMessage = ref('');
const uploadResults = ref({ success: 0, failed: 0 });
const isDragging = ref(false);

const projectStore = useProjectStore();

// Computed property for total file size
const totalSize = computed(() => {
    return files.value.reduce((total, file) => total + file.size, 0);
});

// Format file size for display
const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const filterAudioFiles = (fileList) => {
    return Array.from(fileList).filter(file => 
        file.type.startsWith('audio/') || 
        file.name.endsWith('.mp3') || 
        file.name.endsWith('.wav') ||
        file.name.endsWith('.m4a') ||
        file.name.endsWith('.ogg') ||
        file.name.endsWith('.flac')
    );
};

const handleFileUpload = (event) => {
    const audioFiles = filterAudioFiles(event.target.files);
    files.value = [...files.value, ...audioFiles];
    // Reset upload states when new files are selected
    uploadProgress.value = 0;
    uploadComplete.value = false;
    uploadMessage.value = '';
};

const handleFileDrop = (event) => {
    isDragging.value = false;
    event.preventDefault();
    
    let droppedFiles = [];
    
    // Handle items (for folders and files)
    if (event.dataTransfer.items) {
        droppedFiles = Array.from(event.dataTransfer.files);
    } else {
        droppedFiles = Array.from(event.dataTransfer.files);
    }
    
    const audioFiles = filterAudioFiles(droppedFiles);
    files.value = [...files.value, ...audioFiles];
    
    // Reset upload states
    uploadProgress.value = 0;
    uploadComplete.value = false;
    uploadMessage.value = '';
};

const removeFile = (file) => {
    const index = files.value.indexOf(file);
    if (index !== -1) {
        files.value.splice(index, 1);
    }
};

const uploadFiles = async () => {
    if (files.value.length === 0 || isUploading.value) return;
    
    isUploading.value = true;
    uploadProgress.value = 0;
    uploadComplete.value = false;
    uploadMessage.value = 'Preparing files for upload...';
    
    try {
        // Create form data for upload
        const formData = new FormData();
        
        // Add project ID if available
        if (projectStore.currentProjectId) {
            formData.append('project_id', projectStore.currentProjectId);
        }
        
        // Add all files to form data
        files.value.forEach(file => {
            formData.append('files', file); // Using 'files' field name that worked
        });
        
        // Make API call to upload endpoint
        uploadMessage.value = 'Uploading files...';
        const response = await apiClient.post('/transcriptions/upload/audio/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: (progressEvent) => {
                if (progressEvent.loaded && progressEvent.total) {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    uploadProgress.value = percentCompleted;
                }
            }
        });
        
        // Handle successful upload
        uploadComplete.value = true;
        uploadSuccess.value = true;
        uploadMessage.value = 'Upload completed successfully!';
        uploadResults.value.success = files.value.length;
        uploadResults.value.failed = 0;
        
        // Optionally handle specific response data
        if (response.data && response.data.message) {
            uploadMessage.value = response.data.message;
        }
        
    } catch (error) {
        console.error('Upload failed:', error);
        console.error('Response data:', error.response?.data);
        
        // Handle upload failure
        uploadComplete.value = true;
        uploadSuccess.value = false;
        uploadMessage.value = 'Upload failed. Please try again.';
        uploadResults.value.failed = files.value.length;
        
        // Extract more details from error if available
        if (error.response && error.response.data) {
            if (error.response.data.error) {
                uploadMessage.value = `Error: ${error.response.data.error}`;
            } else if (error.response.data.message) {
                uploadMessage.value = error.response.data.message;
            }
            
            // If server returned partial success info
            if (error.response.data.successful_count !== undefined) {
                uploadResults.value.success = error.response.data.successful_count;
                uploadResults.value.failed = files.value.length - error.response.data.successful_count;
            }
        }
    } finally {
        isUploading.value = false;
    }
};

const resetUpload = () => {
    files.value = [];
    uploadProgress.value = 0;
    uploadComplete.value = false;
    uploadMessage.value = '';
    uploadResults.value = { success: 0, failed: 0 };
};
</script>

<style scoped>
.audio-uploader {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    font-family: Arial, sans-serif;
}

.drag-drop-zone {
    border: 2px dashed #ccc;
    border-radius: 8px;
    padding: 40px 20px;
    text-align: center;
    margin-bottom: 20px;
    transition: all 0.3s ease;
    background-color: #ffffff;
    cursor: pointer;
}

.drag-drop-zone.active {
    border-color: #6b4d88;
    background-color: rgba(147, 51, 234, 0.1);
}

.upload-icon {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background-color: rgba(147, 51, 234, 0.1);
    margin-bottom: 16px;
}

.upload-icon svg {
    color: #9333ea;
}

.drag-drop-zone h3 {
    color: #9333ea;
    margin-bottom: 20px;
    font-weight: 500;
}

.button-group {
    display: flex;
    justify-content: center;
    gap: 16px;
    margin-top: 20px;
}

.select-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 10px 16px;
    background-color: rgb(115, 195, 201);
    border: 1px solid #ddd;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s ease;
}

.select-button:hover {
    border-color: #9333ea;
    background-color: rgba(147, 51, 234, 0.05);
}

.select-button svg {
    color: #555;
}

.file-input {
    display: none;
}

.upload-actions {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
}

.upload-button {
    background-color: #4caf50;
    color: white;
    border: none;
    padding: 10px 16px;
    border-radius: 4px;
    cursor: pointer;
    flex: 1;
}

.cancel-button {
    background-color: #f5f5f5;
    color: #333;
    border: 1px solid #ddd;
    padding: 10px 16px;
    border-radius: 4px;
    cursor: pointer;
}

.upload-button:hover {
    background-color: #45a049;
}

.upload-button:disabled, .cancel-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.progress-section {
    margin: 20px 0;
}

.upload-progress {
    margin-bottom: 15px;
}

.progress-bar-container {
    height: 8px;
    background-color: #f1f1f1;
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 5px;
}

.progress-bar-fill {
    height: 100%;
    background-color: #2196F3;
    width: 0;
    transition: width 0.3s;
}

.progress-bar-fill.complete.success {
    background-color: #4CAF50;
}

.progress-bar-fill.failure {
    background-color: #F44336;
}

.progress-text {
    display: flex;
    justify-content: space-between;
    color: #666;
    font-size: 0.9em;
}

.upload-message {
    font-style: italic;
}

.upload-results {
    margin-top: 15px;
    padding: 15px;
    background-color: #947171;
    border-radius: 4px;
    border: 1px solid #eee;
}

.success-message, .error-message {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
}

.success-message svg {
    color: #4CAF50;
    margin-right: 10px;
}

.error-message svg {
    color: #F44336;
    margin-right: 10px;
}

.file-list-container {
    margin-top: 20px;
    padding: 15px;
    border: 1px solid #eee;
    border-radius: 4px;
    background-color: #968484;
}

.file-list-container h3 {
    margin-top: 0;
    margin-bottom: 10px;
}

.total-size {
    color: #666;
    margin-bottom: 15px;
    font-size: 0.9em;
}

.file-list {
    list-style: none;
    padding: 0;
    margin: 0;
    max-height: 300px;
    overflow-y: auto;
}

.file-item {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    border-bottom: 1px solid #eee;
    background-color: rgb(175, 93, 93);
    border-radius: 4px;
    margin-bottom: 4px;
}

.file-item:last-child {
    margin-bottom: 0;
}

.file-icon {
    margin-right: 10px;
    color: #2196F3;
}

.file-info {
    display: flex;
    flex-direction: column;
    flex: 1;
}

.file-name {
    font-weight: 500;
    word-break: break-all;
}

.file-size {
    font-size: 0.8em;
    color: #666;
}

.remove-file {
    background: none;
    border: none;
    color: #999;
    font-size: 20px;
    cursor: pointer;
    padding: 0 5px;
}

.remove-file:hover {
    color: #f44336;
}
</style>