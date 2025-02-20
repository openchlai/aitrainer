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
        </div>
    </div>
</template>

<script>
    import { defineComponent, ref } from "vue";
    import { GChart } from "vue-google-charts";

    export default defineComponent({
        components: { GChart },
        setup() {
            // 🔹 Total Audio Files Collected (Training, Validation, Testing)
            const audioFilesData = ref([
                ["Dataset", "Files Collected"],
                ["Training", 5000],
                ["Validation", 1000],
                ["Testing", 800]
            ]);

            // 🔹 Dataset Diversity (Expanded: Gender, Accent, Noise Levels, Language)
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

            // 🔹 Audio Length Distribution (Grouped Bins)
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

            return {
                audioFilesData,
                diversityData,
                audioLengthData,
                missingTranscriptionsData,
                formatConsistencyData,
                barChartOptions,
                pieChartOptions,
                histogramOptions
            };
        }
    });
</script>

<style>
    /* @import "../styles.css"; */

    .goal-text {
        font-size: 14px;
        color: #555;
        margin-bottom: 10px;
    }
</style>
