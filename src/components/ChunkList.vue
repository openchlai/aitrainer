<template>
    <div class="chunk-list-screen">
        <div class="statistics">
            <h2>Chunk Evaluation Progress</h2>
            <div class="progress-bar">
                <div class="progress-evaluated" :style="{ width: evaluatedPercentage + '%' }"></div>
                <div class="progress-unevaluated" :style="{ width: unevaluatedPercentage + '%' }"></div>
            </div>
            <div class="progress-labels">
                <span>Evaluated: {{ statistics.total_evaluated_chunks }} ({{ evaluatedPercentage }}%)</span>
                <span>Unevaluated: {{ statistics.total_unevaluated_chunks }} ({{ unevaluatedPercentage }}%)</span>
            </div>
        </div>
        <!-- Sort Dropdown -->
        <div class="sort">
            <label for="sort">Sort By:</label>
            <select id="sort" v-model="sortBy">
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
            </select>
        </div>
        <!-- Pagination Controls -->
        <div class="pagination">
            <button @click="prevPage" :disabled="currentPage === 1">Previous</button>
            <span>Page {{ currentPage }} of {{ totalPages }}</span>
            <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
            <span>Total: {{ totalChunks }}</span>
        </div>
        <!-- Audio Cards -->
        <div class="audio-list">
            <div v-for="(audio, index) in paginatedChunks" :key="audio.id" class="audio-card">
                <!-- Checkmark for evaluated chunks -->
                <div v-if="audio.is_evaluated" class="checkmark">✓</div>
                <p>{{ "chunk_" + getAbsoluteIndex(index) }}</p>
                <button class="review-btn" @click="openAudioPlayerScreen(index)">
                    Review
                </button>
            </div>
        </div>

        <!-- Pagination Controls -->
        <div class="pagination">
            <button @click="prevPage" :disabled="currentPage === 1">Previous</button>
            <span>Page {{ currentPage }} of {{ totalPages }}</span>
            <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
            <span>Total: {{ totalChunks }}</span>
        </div>
        <!-- Error Message (if any) -->
        <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from 'vue'
import { useCaseStore } from '../stores/caseStore.js'
import { useRouter } from 'vue-router'
import apiClient from '../utils/axios.js'

const availablechunks = ref([])
const totalChunks = computed(() => availablechunks.value.length)
const sortBy = ref('oldest')
const errorMessage = ref('')  // To hold any error message
const caseStore = useCaseStore()
const router = useRouter()
const currentPage = ref(1) // Current page number
const itemsPerPage = 50 // Number of items per page

// Fetch chunks on mount
onMounted(async () => {
    await fetchchunks()
    await fetch_statistics()
    await nextTick()
})

// Fetch statistics
async function fetch_statistics() {
    try {
        const response = await apiClient.get('/transcriptions/chunk-statistics/')
        statistics.value = response.data
    } catch (error) {
        console.error('Error fetching statistics:', error)
    }
}

// Function to fetch audio data
async function fetchchunks() {
    try {
        const response = await apiClient.get('/transcriptions/audio-chunks/')
        availablechunks.value = response.data
        caseStore.setAudioList(availablechunks.value)
        errorMessage.value = ''  // Clear any previous error message
    } catch (error) {
        console.error('Error fetching chunks:', error)
        errorMessage.value = 'Failed to load audio files. Please try again later.'
    }
}

// Computed property to sort chunks based on user selection
const sortedchunks = computed(() => {
    return availablechunks.value.sort((a, b) => {
        if (sortBy.value === 'newest') {
            return new Date(b.created_at) - new Date(a.created_at)
        } else {
            return new Date(a.created_at) - new Date(b.created_at)
        }
    })
})

// Computed property to get paginated chunks
const paginatedChunks = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    const end = start + itemsPerPage
    return sortedchunks.value.slice(start, end)
})

// Computed property to calculate total pages
const totalPages = computed(() => {
    return Math.ceil(sortedchunks.value.length / itemsPerPage)
})

// Function to go to the next page
function nextPage() {
    if (currentPage.value < totalPages.value) {
        currentPage.value++
    }
}

// Function to go to the previous page
function prevPage() {
    if (currentPage.value > 1) {
        currentPage.value--
    }
}

function openAudioPlayerScreen(relativeIndex) {
    const start = (currentPage.value - 1) * itemsPerPage;
    const absoluteIndex = start + relativeIndex;

    router.push({
        name: 'ChunkEvaluationScreen',
        params: { absoluteIndex: absoluteIndex.toString() }
    });
}

const statistics = ref({
    total_chunks: 0,
    total_evaluated_chunks: 0,
    total_unevaluated_chunks: 0,
})

// Computed properties for percentages
const evaluatedPercentage = computed(() => {
    if (statistics.value.total_chunks === 0) return 0
    return ((statistics.value.total_evaluated_chunks / statistics.value.total_chunks) * 100).toFixed(2)
})

const unevaluatedPercentage = computed(() => {
    if (statistics.value.total_chunks === 0) return 0
    return ((statistics.value.total_unevaluated_chunks / statistics.value.total_chunks) * 100).toFixed(2)
})

function getAbsoluteIndex(relativeIndex) {
    return (currentPage.value - 1) * itemsPerPage + relativeIndex;
}
</script>

<style scoped>
.chunk-list-screen {
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

/* Pagination */
.pagination {
    margin-top: 20px;
    margin-bottom: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
}

.pagination button {
    background: #3b5998;
    color: white;
    padding: 5px 10px;
    border: none;
    cursor: pointer;
}

.pagination button:disabled {
    background: #ccc;
    cursor: not-allowed;
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

.statistics {
    margin: 5px;
    padding:5px;
    /* background: #f0f0f0; */
    border-radius: 8px;
    text-align: center;
}

.progress-bar {
    width: 100%;
    height: 20px;
    /* background: #e0e0e0; */
    border-radius: 10px;
    overflow: hidden;
    display: flex;
}

.progress-evaluated {
    height: 100%;
    background: #4caf50;
    /* Green for evaluated */
    transition: width 0.3s ease;
}

.progress-unevaluated {
    height: 100%;
    background: #d7f3dc;
    /* Red for unevaluated */
    transition: width 0.3s ease;
}

.progress-labels {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    font-size: 14px;
    color: #ffffff;
}
</style>
