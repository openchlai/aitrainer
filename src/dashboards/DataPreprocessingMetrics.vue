<template>
    <div class="metrics-container">
        <h2>Data Preprocessing & Feature Extraction Metrics</h2>
        <p class="goal-text">
            Goal: Ensure clean and properly formatted data for model training.
        </p>

        <div class="charts">
            <!-- Silence Removal Accuracy -->
            <div class="chart-container">
                <h3>Silence Removal Accuracy % 🎙️</h3>
                <GChart type="PieChart" :data="silenceRemovalData" :options="pieChartOptions" />
            </div>

            <!-- Resampling Success Rate -->
            <div class="chart-container">
                <h3>Resampling Success Rate % 🔄</h3>
                <GChart type="BarChart" :data="resamplingData" :options="barChartOptions" />
            </div>

            <!-- Feature Extraction Completion -->
            <div class="chart-container">
                <h3>Feature Extraction Completion % 📈</h3>
                <GChart type="PieChart" :data="featureExtractionData" :options="pieChartOptions" />
            </div>

            <!-- Spectrogram Size Consistency -->
            <div class="chart-container">
                <h3>Spectrogram Size Consistency % 📏</h3>
                <GChart type="LineChart" :data="spectrogramSizeData" :options="lineChartOptions" />
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
            // 🔹 Silence Removal Accuracy %
            const silenceRemovalData = ref([
                ["Category", "Percentage"],
                ["Correctly Trimmed", 95],
                ["Over-trimmed", 3],
                ["Under-trimmed", 2]
            ]);

            // 🔹 Resampling Success Rate %
            const resamplingData = ref([
                ["Format", "Success Rate %"],
                ["16 kHz", 98],
                ["24 kHz", 90],
                ["44.1 kHz", 85]
            ]);

            // 🔹 Feature Extraction Completion %
            const featureExtractionData = ref([
                ["Status", "Percentage"],
                ["Successful", 97],
                ["Failed", 3]
            ]);

            // 🔹 Spectrogram Size Consistency %
            const spectrogramSizeData = ref([
                ["Sample Index", "Width", "Height"],
                [1, 128, 256],
                [2, 128, 256],
                [3, 128, 256],
                [4, 130, 258], // Slight variation
                [5, 128, 256]
            ]);

            // Chart Styles
            const pieChartOptions = {
                pieHole: 0.4,
                colors: ["#34A853", "#EA4335", "#FBBC05"]
            };

            const barChartOptions = {
                legend: { position: "none" },
                colors: ["#4285F4"]
            };

            const lineChartOptions = {
                curveType: "function",
                legend: { position: "bottom" },
                hAxis: { title: "Sample Index" },
                vAxis: { title: "Size (pixels)" },
                colors: ["#FF9900", "#3366CC"]
            };

            return {
                silenceRemovalData,
                resamplingData,
                featureExtractionData,
                spectrogramSizeData,
                pieChartOptions,
                barChartOptions,
                lineChartOptions
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
