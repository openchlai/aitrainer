<template>
    <div class="chunk-list-screen">
        <!-- Statistics Progress Bar -->
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

        <!-- Tabs for Chunk Categories -->
        <div class="tabs">
            <button @click="currentTab = 'not_evaluated'" :class="{ active: currentTab === 'not_evaluated' }">Not
                Evaluated ({{ statistics.notEvaluatedChunks }})</button>
            <button @click="currentTab = 'one_evaluation'" :class="{ active: currentTab === 'one_evaluation' }">One
                Evaluation ({{ statistics.oneEvaluationChunks }})</button>
            <button @click="currentTab = 'two_evaluations'" :class="{ active: currentTab === 'two_evaluations' }">Two
                Evaluations ({{ statistics.twoEvaluationsChunks }})</button>
        </div>
        <div v-if="currentTab != 'not_evaluated'">
            <p> <span style="background-color: green; border-radius: 50%;"> ✓ </span> Indicates you have evaluated that
                chunk</p>
        </div>
        <!-- Pagination Controls -->
        <div class="pagination">
            <button @click="prevPage" :disabled="currentPage === 1">Previous</button>
            <span>Page {{ currentPage }} of {{ totalPages }}</span>
            <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
            <!-- <span>Total: {{ totalChunks }}</span> -->
        </div>

        <div>
            <div class="audio-list">
                <div v-for="(audio, index) in paginatedChunks" :key="audio.id" class="audio-card">
                    <!-- Checkmark for evaluated chunks -->
                    <div v-if="audio.evaluated_by_user" class="checkmark">✓</div>
                    <p>{{ "chunk_" + getAbsoluteIndex(index) }}</p>
                    <button class="review-btn" @click="openAudioPlayerScreen(index)">
                        Review
                    </button>
                </div>
            </div>
        </div>

        <!-- <div v-if="activeTab === 'one_evaluation'">
            <h2>Chunks with One Evaluation</h2>
            <div class="audio-list">
                <div v-for="(audio, index) in oneEvaluationChunks" :key="audio.id" class="audio-card">
                    <p>{{ "chunk_" + extractChunkNumber(audio.chunk_file) }}</p>
                    <button class="review-btn" @click="openAudioPlayerScreen(index)">
                        Review
                    </button>
                </div>
            </div>
        </div> -->

        <!-- <div v-if="activeTab === 'two_evaluations'">
            <h2>Chunks with Two Evaluations</h2>
            <div class="audio-list">
                <div v-for="(audio, index) in twoEvaluationsChunks" :key="audio.id" class="audio-card">
                    <p>{{ "chunk_" + extractChunkNumber(audio.chunk_file) }}</p>
                    <button class="review-btn" @click="openAudioPlayerScreen(index)">
                        Review
                    </button>
                </div>
            </div>
        </div> -->

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

const caseStore = useCaseStore()
const router = useRouter()

const notEvaluatedChunks = ref([])
const oneEvaluationChunks = ref([])
const twoEvaluationsChunks = ref([])

const currentTab = ref('not_evaluated') // Active tab
const sortBy = ref('oldest')
const errorMessage = ref('')
const currentPage = ref(1)
const itemsPerPage = 50

const statistics = ref({
    total_chunks: 0,
    total_evaluated_chunks: 0,
    total_unevaluated_chunks: 0,
    notEvaluatedChunks: 0,
    oneEvaluationChunks: 0,
    twoEvaluationsChunks: 0,
    evaluation_completion_rate: 0,
})

// Fetch chunks and statistics on mount
onMounted(async () => {
    await fetchChunks()
    await fetchStatistics()
    await nextTick()
})

// Fetch statistics
async function fetchStatistics() {
    try {
        const response = await apiClient.get('/transcriptions/chunk-statistics/')
        statistics.value = {
            total_chunks: response.data.total_chunks,
            total_evaluated_chunks: response.data.total_chunks - response.data.not_evaluated,
            total_unevaluated_chunks: response.data.not_evaluated,
            notEvaluatedChunks: response.data.not_evaluated,
            oneEvaluationChunks: response.data.one_evaluation,
            twoEvaluationsChunks: response.data.two_evaluations,
            evaluation_completion_rate: response.data.evaluation_completion_rate
        }
    } catch (error) {
        console.error('Error fetching statistics:', error)
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
            ;[array[i], array[j]] = [array[j], array[i]]  // Swap elements
    }
    return array
}

async function fetchChunks() {
    try {
        const response = await apiClient.get('/transcriptions/evaluation-categories/')

        // Shuffle manually using Fisher-Yates algorithm
        notEvaluatedChunks.value = shuffleArray(response.data.not_evaluated || [])
        oneEvaluationChunks.value = shuffleArray(response.data.one_evaluation || [])
        twoEvaluationsChunks.value = shuffleArray(response.data.two_evaluations || [])

        // caseStore.setAudioList([...notEvaluatedChunks.value, ...oneEvaluationChunks.value, ...twoEvaluationsChunks.value])
        errorMessage.value = ''
    } catch (error) {
        console.error('Error fetching chunks:', error)
        errorMessage.value = 'Failed to load audio files. Please try again later.'
    }
}


// Get chunks based on selected tab
const activeChunks = computed(() => {
    if (currentTab.value === 'not_evaluated') return notEvaluatedChunks.value
    if (currentTab.value === 'one_evaluation') return oneEvaluationChunks.value
    if (currentTab.value === 'two_evaluations') return twoEvaluationsChunks.value
    return []
})

// Computed property to get paginated chunks
const paginatedChunks = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    const end = start + itemsPerPage
    return activeChunks.value.slice(start, end)
})

// Computed property to calculate total pages
const totalPages = computed(() => {
    return Math.ceil(activeChunks.value.length / itemsPerPage)
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
    const start = (currentPage.value - 1) * itemsPerPage
    const absoluteIndex = start + relativeIndex

    caseStore.setAudioList(activeChunks.value)

    router.push({
        name: 'ChunkEvaluationScreen',
        params: { absoluteIndex: absoluteIndex.toString() }
    })
}

// Computed properties for progress bar percentages
const evaluatedPercentage = computed(() => {
    if (statistics.value.total_chunks === 0) return 0
    return ((statistics.value.total_evaluated_chunks / statistics.value.total_chunks) * 100).toFixed(2)
})

const unevaluatedPercentage = computed(() => {
    if (statistics.value.total_chunks === 0) return 0
    return ((statistics.value.total_unevaluated_chunks / statistics.value.total_chunks) * 100).toFixed(2)
})

function getAbsoluteIndex(relativeIndex) {
    return (currentPage.value - 1) * itemsPerPage + relativeIndex
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
    padding: 5px;
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

/* Tabs */
.tabs {
    display: flex;
    gap: 10px;
    justify-content: center;
    margin-bottom: 20px;
}

.tabs button {
    padding: 10px 20px;
    background: gray;
    border: none;
    cursor: pointer;
    border-radius: 5px;
}

.tabs .active {
    background: rgb(21, 169, 210);
    color: white;
}
</style>
