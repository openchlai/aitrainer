<template>
    <div class="dashboard-container">

        <!-- 📊 Overall Progress Statistics -->
        <div v-if="statistics" class="stats-container">
            <div class="stat-box">
                <h3>Total Chunks</h3>
                <p>{{ statistics.total_chunks }}</p>
            </div>
            <div class="stat-box">
                <h3>Transcribed</h3>
                <p>{{ statistics.transcribed_chunks }}</p>
            </div>
            <div class="stat-box">
                <h3>Untranscribed</h3>
                <p>{{ statistics.untranscribed_chunks }}</p>
            </div>
            <div class="stat-box rejected">
                <h3>Rejected</h3>
                <p>{{ statistics.rejected_chunks }}</p>
            </div>
        </div>

        <!-- 📉 Progress Bar -->
        <div class="progress-bar-container" v-if="statistics">
            <div class="progress-bar">
                <div class="progress transcribed" :style="{ width: transcribedPercentage + '%' }"></div>
                <div class="progress rejected" :style="{ width: rejectedPercentage + '%' }"></div>
            </div>
            <p>
                <span class="green-text">{{ transcribedPercentage.toFixed(1) }}% Transcribed</span> | <span
                    class="red-text">{{ rejectedPercentage.toFixed(1) }}% Rejected</span>
            </p>

        </div>
        <h2>Select Case to Transcribe</h2>

        <!-- 📋 Cases Table -->
        <div class="table-container">
            <!-- 📌 Pagination Controls -->
            <div class="pagination">
                <button @click="prevPage" :disabled="currentPage === 1">Prev</button>
                <span>Page {{ currentPage }} of {{ totalPages }}</span>
                <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>#</th> <!-- ✅ New Number Column -->
                        <th>Case Id</th>
                        <th>Transcribed / Total</th>
                        <th>Total Audio Time (s)</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(caseItem, index) in paginatedCases" :key="index">
                        <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td> <!-- ✅ Numbering -->
                        <td>{{ caseItem.case_id }}</td>
                        <td>
                            {{ caseItem.audio_file.transcribed_chunks }} /
                            {{ caseItem.audio_file.total_chunks }}
                        </td>
                        <td>{{ caseItem.audio_file.duration }} s</td>
                        <td>
                            <button class="open-btn" @click="openTranscription(caseItem)">
                                Open
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>

            <!-- 📌 Pagination Controls (Bottom) -->
            <div class="pagination">
                <button @click="prevPage" :disabled="currentPage === 1">Prev</button>
                <span>Page {{ currentPage }} of {{ totalPages }}</span>
                <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useCaseStore } from '../stores/caseStore.js'

const router = useRouter()
const transcriptionRequests = ref([])
const statistics = ref(null)

const caseStore = useCaseStore()

// ✅ Fetch transcription requests from API
const fetchRequests = async () => {
    try {
        const response = await axios.get('http://127.0.0.1:8000/api/transcription/case-records')
        transcriptionRequests.value = response.data
    } catch (error) {
        console.error('Error fetching transcription requests:', error)
    }
}

// ✅ Fetch overall transcription statistics
const fetchStatistics = async () => {
    try {
        const response = await axios.get('http://127.0.0.1:8000/api/transcription/api/chunk-statistics/')
        statistics.value = response.data
    } catch (error) {
        console.error('Error fetching transcription statistics:', error)
    }
}

// ✅ Compute percentage values for progress bar
const transcribedPercentage = computed(() => {
    if (!statistics.value) return 0
    return (statistics.value.transcribed_chunks / statistics.value.total_chunks) * 100
})

const rejectedPercentage = computed(() => {
    if (!statistics.value) return 0
    return (statistics.value.rejected_chunks / statistics.value.total_chunks) * 100
})

// ✅ Store case details in Pinia & navigate to transcription screen
function openTranscription(caseItem) {
    caseStore.setSelectedCase(caseItem)
    console.log("Opening transcription for case:", caseItem.case_id);
    router.push({
        name: 'TranscriptionScreen',
        params: {
            audioId: caseItem.audio_file.id
        }
    })
}

// 📌 Pagination Variables
const currentPage = ref(1);
const itemsPerPage = 10; // Number of items per page

// 📌 Compute Total Pages
const totalPages = computed(() => {
    return Math.ceil(transcriptionRequests.value.length / itemsPerPage);
});

// 📌 Get Paginated Data
const paginatedCases = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return transcriptionRequests.value.slice(start, end);
});

// 📌 Pagination Controls
const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value++;
    }
};

const prevPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--;
    }
};


// ✅ Fetch data on mount
onMounted(() => {
    fetchRequests()
    fetchStatistics()
})
</script>

<style scoped>
.green-text {
    color: #28a745;
    /* Green */
    font-weight: bold;
}

.table-container {
    padding: 20px;
    text-align: center;
}

/* 📌 Pagination Controls */
.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    margin: 15px 0;
}

.pagination button {
    background: #131b2d;
    color: white;
    padding: 5px 10px;
    border-radius: 5px;
    border: none;
    cursor: pointer;
}

.pagination button:disabled {
    background: #d1c8c8;
    cursor: not-allowed;
}

/* 📌 Table Styling */
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

.red-text {
    color: #dc3545;
    /* Red */
    font-weight: bold;
}

.dashboard-container {
    padding: 20px;
}

/* 📊 Stats Section */
.stats-container {
    display: flex;
    justify-content: space-around;
    margin-bottom: 20px;
}

.stat-box {
    background: #5e5b5b;
    padding: 15px;
    border-radius: 8px;
    text-align: center;
    width: 150px;
}

.stat-box h3 {
    font-size: 16px;
    margin-bottom: 5px;
}

.stat-box p {
    font-size: 20px;
    font-weight: bold;
}

.stat-box.rejected {
    background: #ffe6e6;
    color: #d9534f;
}

/* 📉 Progress Bar */
.progress-bar-container {
    text-align: center;
    margin-bottom: 20px;
}

.progress-bar {
    height: 20px;
    width: 100%;
    background: #ddd;
    border-radius: 10px;
    overflow: hidden;
    display: flex;
}

.progress {
    height: 100%;
}

.transcribed {
    background: #28a745;
}

.rejected {
    background: #dc3545;
}

/* 📋 Table Styling */
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