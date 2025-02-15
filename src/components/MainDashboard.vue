<template>
    <div class="dashboard">
        <h1 class="text-xl font-bold">AI Project Metrics Dashboard</h1>

        <div class="charts">
            <!-- WER Over Time (Line Chart) -->
            <div class="chart-container">
                <h2>Word Error Rate (WER) Over Time</h2>
                <GChart type="LineChart" :data="werData" :options="lineChartOptions" />
            </div>

            <!-- Loss Over Time (Line Chart) -->
            <div class="chart-container">
                <h2>Loss Over Time</h2>
                <GChart type="LineChart" :data="lossData" :options="lineChartOptions" />
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
            // Evaluation Metrics Data from JSON
            const evalMetrics = [
                { epoch: 0.434, eval_loss: 0.584, eval_wer: 37.75 },
                { epoch: 0.868, eval_loss: 0.584, eval_wer: 37.75 },
                { epoch: 1.302, eval_loss: 0.484, eval_wer: 32.02 },
                { epoch: 1.736, eval_loss: 0.465, eval_wer: 31.16 },
                { epoch: 2.170, eval_loss: 0.449, eval_wer: 29.91 }
            ];

            // Prepare WER Data for Chart
            const werData = ref([
                ["Epoch", "WER (%)"],
                ...evalMetrics.map(({ epoch, eval_wer }) => [epoch.toFixed(2), eval_wer])
            ]);

            // Prepare Loss Data for Chart
            const lossData = ref([
                ["Epoch", "Loss"],
                ...evalMetrics.map(({ epoch, eval_loss }) => [epoch.toFixed(2), eval_loss])
            ]);

            const lineChartOptions = {
                curveType: "function",
                legend: { position: "bottom" },
                hAxis: { title: "Epoch" },
                vAxis: { title: "Value" }
            };

            return {
                werData,
                lossData,
                lineChartOptions
            };
        }
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
