<template>
    <div class="metrics-container">
        <h2>Model Evaluation Metrics</h2>
        <p class="goal-text">
            Goal: Measure model accuracy and robustness on unseen data.
        </p>

        <div class="charts">
            <!-- Validation Loss vs. Training Loss -->
            <div class="chart-container">
                <h3>Validation Loss vs. Training Loss 🔄</h3>
                <GChart type="LineChart" :data="lossComparisonData" :options="lineChartOptions" />
            </div>

            <!-- WER/CER on Test Set -->
            <div class="chart-container">
                <h3>WER/CER on Test Set 📊</h3>
                <GChart type="LineChart" :data="werCerTestData" :options="lineChartOptions" />
            </div>

            <!-- Speaker Variation Performance -->
            <div class="chart-container">
                <h3>Speaker Variation Performance 🎭</h3>
                <GChart type="BarChart" :data="speakerPerformanceData" :options="barChartOptions" />
            </div>

            <!-- Processing Latency per Sample -->
            <div class="chart-container">
                <h3>Processing Latency per Sample ⏱️</h3>
                <GChart type="BarChart" :data="latencyData" :options="barChartOptions" />
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
            // Sample Evaluation Data
            const evaluationMetrics = [
                { epoch: 1, train_loss: 0.8, val_loss: 0.9, wer: 30, cer: 20, latency: 200 },
                { epoch: 2, train_loss: 0.6, val_loss: 0.7, wer: 25, cer: 18, latency: 180 },
                { epoch: 3, train_loss: 0.5, val_loss: 0.6, wer: 20, cer: 15, latency: 160 },
                { epoch: 4, train_loss: 0.4, val_loss: 0.5, wer: 18, cer: 13, latency: 140 },
                { epoch: 5, train_loss: 0.3, val_loss: 0.4, wer: 15, cer: 10, latency: 120 }
            ];

            const speakerPerformance = [
                ["Speaker Group", "WER (%)"],
                ["Native Accent", 10],
                ["Non-Native Accent", 20],
                ["Children", 25],
                ["Elderly", 30],
                ["Noisy Environment", 35]
            ];

            // 🔹 Validation Loss vs. Training Loss
            const lossComparisonData = ref([
                ["Epoch", "Training Loss", "Validation Loss"],
                ...evaluationMetrics.map(({ epoch, train_loss, val_loss }) => [epoch, train_loss, val_loss])
            ]);

            // 🔹 WER/CER on Test Set
            const werCerTestData = ref([
                ["Epoch", "WER (%)", "CER (%)"],
                ...evaluationMetrics.map(({ epoch, wer, cer }) => [epoch, wer, cer])
            ]);

            // 🔹 Speaker Variation Performance
            const speakerPerformanceData = ref(speakerPerformance);

            // 🔹 Processing Latency per Sample
            const latencyData = ref([
                ["Epoch", "Latency (ms)"],
                ...evaluationMetrics.map(({ epoch, latency }) => [epoch, latency])
            ]);

            // Chart Styles
            const lineChartOptions = {
                curveType: "function",
                legend: { position: "bottom" },
                hAxis: { title: "Epoch" },
                vAxis: { title: "Value" },
                colors: ["#4285F4", "#EA4335"]
            };

            const barChartOptions = {
                legend: { position: "none" },
                hAxis: { title: "Category" },
                vAxis: { title: "Value" },
                colors: ["#34A853"]
            };

            return {
                lossComparisonData,
                werCerTestData,
                speakerPerformanceData,
                latencyData,
                lineChartOptions,
                barChartOptions
            };
        }
    });
</script>

<style>


    .goal-text {
        font-size: 14px;
        color: #555;
        margin-bottom: 10px;
    }
</style>
