<template>
    <div class="metrics-container">
        <h2>Model Deployment & Inference Metrics</h2>
        <p class="goal-text">
            Goal: Ensure fast and accurate real-world performance.
        </p>

        <div class="charts">
            <!-- Real-time Inference Latency -->
            <div class="chart-container">
                <h3>Real-time Inference Latency ⚡</h3>
                <GChart type="LineChart" :data="latencyData" :options="lineChartOptions" />
            </div>

            <!-- Throughput -->
            <div class="chart-container">
                <h3>Throughput 🚀</h3>
                <GChart type="LineChart" :data="throughputData" :options="lineChartOptions" />
            </div>

            <!-- Memory Usage -->
            <div class="chart-container">
                <h3>Memory Usage 🖥️</h3>
                <GChart type="LineChart" :data="memoryUsageData" :options="lineChartOptions" />
            </div>

            <!-- API Response Success Rate -->
            <div class="chart-container">
                <h3>API Response Success Rate 🌍</h3>
                <GChart type="LineChart" :data="apiSuccessData" :options="lineChartOptions" />
            </div>

            <!-- User Feedback Rating -->
            <div class="chart-container">
                <h3>User Feedback Rating ⭐</h3>
                <GChart type="BarChart" :data="feedbackData" :options="barChartOptions" />
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
            // Sample Deployment Metrics Data
            const deploymentMetrics = [
                { epoch: 1, latency: 150, throughput: 50, memory: 75, success_rate: 95, feedback: 4.5 },
                { epoch: 2, latency: 140, throughput: 55, memory: 70, success_rate: 97, feedback: 4.7 },
                { epoch: 3, latency: 130, throughput: 60, memory: 65, success_rate: 98, feedback: 4.8 },
                { epoch: 4, latency: 120, throughput: 65, memory: 60, success_rate: 99, feedback: 4.9 },
                { epoch: 5, latency: 110, throughput: 70, memory: 55, success_rate: 99, feedback: 5.0 }
            ];

            // 🔹 Real-time Inference Latency
            const latencyData = ref([
                ["Epoch", "Latency (ms)"],
                ...deploymentMetrics.map(({ epoch, latency }) => [epoch, latency])
            ]);

            // 🔹 Throughput
            const throughputData = ref([
                ["Epoch", "Throughput (requests/s)"],
                ...deploymentMetrics.map(({ epoch, throughput }) => [epoch, throughput])
            ]);

            // 🔹 Memory Usage
            const memoryUsageData = ref([
                ["Epoch", "Memory Usage (%)"],
                ...deploymentMetrics.map(({ epoch, memory }) => [epoch, memory])
            ]);

            // 🔹 API Response Success Rate
            const apiSuccessData = ref([
                ["Epoch", "Success Rate (%)"],
                ...deploymentMetrics.map(({ epoch, success_rate }) => [epoch, success_rate])
            ]);

            // 🔹 User Feedback Rating
            const feedbackData = ref([
                ["Epoch", "User Feedback Rating"],
                ...deploymentMetrics.map(({ epoch, feedback }) => [epoch, feedback])
            ]);

            // Chart Styles
            const lineChartOptions = {
                curveType: "function",
                legend: { position: "bottom" },
                hAxis: { title: "Epoch" },
                vAxis: { title: "Value" },
                colors: ["#4285F4"]
            };

            const barChartOptions = {
                legend: { position: "none" },
                hAxis: { title: "Epoch" },
                vAxis: { title: "Feedback Rating" },
                colors: ["#34A853"]
            };

            return {
                latencyData,
                throughputData,
                memoryUsageData,
                apiSuccessData,
                feedbackData,
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
