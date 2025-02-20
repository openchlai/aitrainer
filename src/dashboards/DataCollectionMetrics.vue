<template>
    <div class="metrics-container">
        <h2>Data Collection & Preparation Metrics</h2>
        <p class="goal-text">
            Goal: Ensure high-quality, diverse, and well-structured data for training.
        </p>

        <div class="charts">
            <!-- Total Audio Files Collected -->
            <div class="chart-container">
                <h3>Total Audio Files Collected 📊</h3>
                <GChart type="ColumnChart" :data="audioFilesData" :options="barChartOptions" />
            </div>

            <!-- Dataset Diversity Score (Expanded) -->
            <div class="chart-container">
                <h3>Dataset Diversity Score 🎭</h3>
                <GChart type="PieChart" :data="diversityData" :options="pieChartOptions" />
            </div>

            <!-- Audio Length Distribution (Grouped) -->
            <div class="chart-container">
                <h3>Audio Length Distribution ⏳</h3>
                <GChart type="Histogram" :data="audioLengthData" :options="histogramOptions" />
            </div>

            <!-- Missing Transcriptions % (Count + Percentage) -->
            <div class="chart-container">
                <h3>Missing Transcriptions % ⚠️</h3>
                <GChart type="PieChart" :data="missingTranscriptionsData" :options="pieChartOptions" />
            </div>

            <!-- Audio Format Consistency (Count Per Format) -->
            <div class="chart-container">
                <h3>Audio Format Consistency 🎵</h3>
                <GChart type="BarChart" :data="formatConsistencyData" :options="barChartOptions" />
            </div>

            <!-- Evaluation Results Chart -->
            <div class="chart-container">
                <h3>Evaluation Results 📊</h3>
                <GChart type="ColumnChart" :data="evaluationData" :options="barChartOptions" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { GChart } from "vue-google-charts";
import apiClient from '../utils/axios.js'

const evaluationData = ref([
    ["Category", "Count", { role: "annotation" }],
    ["Dual Speaker", 0, "0"],
    ["Speaker Overlap", 0, "0"],
    ["Background Noise", 0, "0"],
    ["Prolonged Silence", 0, "0"],
    ["Not Normal Speech Rate", 0, "0"],
    ["Echo Noise", 0, "0"],
    ["Incomplete Sentence", 0, "0"]
]);

const audioFilesData = ref([
    ["Dataset", "Files Collected"],
    ["Training", 5000],
    ["Validation", 1000],
    ["Testing", 800]
]);

const diversityData = ref([
    ["Category", "Percentage"],
    ["Male", 40],
    ["Female", 50],
    ["Children", 10],
    ["Noisy Background", 20],
    ["Quiet Environment", 80],
    ["English", 60],
    ["Other Languages", 40]
]);
const audioLengthData = ref([
    ["Length (Seconds)", "Number of Files"],
    ["0-5s", 1200],
    ["5-10s", 1800],
    ["10-20s", 1500],
    ["20-30s", 900],
    ["30s+", 400]
]);

// 🔹 Missing Transcriptions % (Count + Percentage)
const missingTranscriptionsData = ref([
    ["Status", "Percentage"],
    ["Transcribed (6200)", 92],
    ["Missing (500)", 8]
]);

// 🔹 Audio Format Consistency (Count Per Format)
const formatConsistencyData = ref([
    ["Format", "Files"],
    ["WAV", 4900],
    ["MP3", 1000],
    ["Other", 300]
]);


// Chart Styles
const barChartOptions = {
    legend: { position: "none" },
    colors: ["#4285F4"]
};

const pieChartOptions = {
    pieHole: 0.4,
    colors: ["#34A853", "#EA4335", "#FBBC05", "#3366CC", "#FF9900"]
};

const histogramOptions = {
    legend: { position: "none" },
    colors: ["#FF9900"]
};

const fetchEvaluationData = async () => {
    try {
        const response = await apiClient.get("/transcriptions/evaluation-statistics/");
        const data = response.data;
        const totalEvaluations = data.total_evaluations || 1; // Avoid division by zero

        evaluationData.value = [
            ["Category", "Count", { role: "annotation" }],
            ["Dual Speaker", data.dual_speaker_count, `${data.dual_speaker_count} / ${totalEvaluations}`],
            ["Speaker Overlap", data.speaker_overlap_count, `${data.speaker_overlap_count} / ${totalEvaluations}`],
            ["Background Noise", data.background_noise_count, `${data.background_noise_count} / ${totalEvaluations}`],
            ["Prolonged Silence", data.prolonged_silence_count, `${data.prolonged_silence_count} / ${totalEvaluations}`],
            ["Not Normal Speech Rate", data.not_normal_speech_rate_count, `${data.not_normal_speech_rate_count} / ${totalEvaluations}`],
            ["Echo Noise", data.echo_noise_count, `${data.echo_noise_count} / ${totalEvaluations}`],
        ];
    } catch (error) {
        console.error("Error fetching evaluation data:", error);
    }
};

onMounted(() => {
    fetchEvaluationData();
});

</script>

<style>
.goal-text {
    font-size: 14px;
    color: #555;
    margin-bottom: 10px;
}
</style>
