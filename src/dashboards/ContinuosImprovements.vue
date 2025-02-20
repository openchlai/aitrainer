<template>
    <div class="metrics-container">
        <h2>Continuous Monitoring & Model Retraining Metrics</h2>
        <p class="goal-text">
            Goal: Maintain model accuracy and adapt to new data.
        </p>

        <div class="charts">
            <!-- WER Drift Over Time -->
            <div class="chart-container">
                <h3>WER Drift Over Time 📈</h3>
                <GChart type="LineChart" :data="werDriftData" :options="lineChartOptions" />
            </div>

            <!-- Data Distribution Shift -->
            <div class="chart-container">
                <h3>Data Distribution Shift 📊</h3>
                <GChart type="LineChart" :data="distributionShiftData" :options="lineChartOptions" />
            </div>

            <!-- Retraining Improvement -->
            <div class="chart-container">
                <h3>Retraining Improvement % 🔄</h3>
                <GChart type="BarChart" :data="retrainingImprovementData" :options="barChartOptions" />
            </div>

            <!-- Error Report Frequency -->
            <div class="chart-container">
                <h3>Error Report Frequency 🛠️</h3>
                <GChart type="LineChart" :data="errorReportData" :options="lineChartOptions" />
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
            // Sample Monitoring & Retraining Metrics Data
            const monitoringMetrics = [
                { epoch: 1, wer_drift: 15, data_shift: 0.1, retrain_improvement: 5, error_reports: 5 },
                { epoch: 2, wer_drift: 18, data_shift: 0.15, retrain_improvement: 8, error_reports: 4 },
                { epoch: 3, wer_drift: 20, data_shift: 0.18, retrain_improvement: 10, error_reports: 3 },
                { epoch: 4, wer_drift: 22, data_shift: 0.2, retrain_improvement: 15, error_reports: 6 },
                { epoch: 5, wer_drift: 23, data_shift: 0.25, retrain_improvement: 18, error_reports: 7 }
            ];

            // 🔹 WER Drift Over Time
            const werDriftData = ref([
                ["Epoch", "WER Drift (%)"],
                ...monitoringMetrics.map(({ epoch, wer_drift }) => [epoch, wer_drift])
            ]);

            // 🔹 Data Distribution Shift
            const distributionShiftData = ref([
                ["Epoch", "Data Distribution Shift (%)"],
                ...monitoringMetrics.map(({ epoch, data_shift }) => [epoch, data_shift])
            ]);

            // 🔹 Retraining Improvement
            const retrainingImprovementData = ref([
                ["Epoch", "Retraining Improvement (%)"],
                ...monitoringMetrics.map(({ epoch, retrain_improvement }) => [epoch, retrain_improvement])
            ]);

            // 🔹 Error Report Frequency
            const errorReportData = ref([
                ["Epoch", "Error Reports Frequency"],
                ...monitoringMetrics.map(({ epoch, error_reports }) => [epoch, error_reports])
            ]);

            // Chart Styles
            const lineChartOptions = {
                curveType: "function",
                legend: { position: "bottom" },
                hAxis: { title: "Epoch" },
                vAxis: { title: "Value" },
                colors: ["#FF5733"]
            };

            const barChartOptions = {
                legend: { position: "none" },
                hAxis: { title: "Epoch" },
                vAxis: { title: "Improvement %" },
                colors: ["#00C853"]
            };

            return {
                werDriftData,
                distributionShiftData,
                retrainingImprovementData,
                errorReportData,
                lineChartOptions,
                barChartOptions
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
