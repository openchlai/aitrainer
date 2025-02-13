<template>
    <div class="dashboard">
        <h1 class="text-xl font-bold">AI Project Metrics Dashboard</h1>

        <div class="charts">
            <!-- WER Over Time (Line Chart) -->
            <div class="chart-container">
                <h2>Word Error Rate (WER) Over Time</h2>
                <GChart type="LineChart" :data="werData" :options="lineChartOptions" />
            </div>

            <!-- BLEU Scores by Language (Bar Chart) -->
            <div class="chart-container">
                <h2>BLEU Scores by Language</h2>
                <GChart type="BarChart" :data="translationData" :options="barChartOptions" />
            </div>

            <!-- Case Classification Accuracy (Pie Chart) -->
            <div class="chart-container">
                <h2>Case Classification Accuracy</h2>
                <GChart type="PieChart" :data="triageData" :options="pieChartOptions" />
            </div>

            <!-- Model Performance (Column Chart) -->
            <div class="chart-container">
                <h2>AI Model Performance</h2>
                <GChart type="ColumnChart" :data="modelPerformanceData" :options="columnChartOptions" />
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
            // Word Error Rate (WER) Over Time
            const werData = ref([
                ["Month", "WER (%)"],
                ["Jan", 15],
                ["Feb", 13],
                ["Mar", 10],
                ["Apr", 9],
                ["May", 7],
            ]);

            const lineChartOptions = {
                title: "Word Error Rate (WER) Over Time",
                curveType: "function",
                legend: { position: "bottom" },
            };

            // BLEU Scores by Language
            const translationData = ref([
                ["Language", "BLEU Score"],
                ["English", 85],
                ["French", 78],
                ["Spanish", 82],
                ["German", 76],
                ["Chinese", 70],
            ]);

            const barChartOptions = {
                title: "BLEU Scores by Language",
                chartArea: { width: "50%" },
                hAxis: { title: "BLEU Score", minValue: 0 },
                vAxis: { title: "Language" },
            };

            // Case Classification Accuracy
            const triageData = ref([
                ["Category", "Percentage"],
                ["Correct Cases", 90],
                ["Misclassified", 10],
            ]);

            const pieChartOptions = {
                title: "Case Classification Accuracy",
                pieHole: 0.4,
            };

            // AI Model Performance
            const modelPerformanceData = ref([
                ["Metric", "Model 1", "Model 2"],
                ["Accuracy", 90, 88],
                ["Precision", 85, 83],
                ["Recall", 88, 85],
                ["F1-score", 87, 84],
            ]);

            const columnChartOptions = {
                title: "AI Model Performance",
                chartArea: { width: "60%" },
                hAxis: { title: "Metric" },
                vAxis: { title: "Score" },
                legend: { position: "top" },
            };

            return {
                werData,
                lineChartOptions,
                translationData,
                barChartOptions,
                triageData,
                pieChartOptions,
                modelPerformanceData,
                columnChartOptions,
            };
        },
    });
</script>

<style>
    .dashboard {
        max-width: 900px;
        margin: auto;
        text-align: center;
    }

    .charts {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
    }

    .chart-container {
        width: 45%;
        margin-bottom: 20px;
    }
</style>
