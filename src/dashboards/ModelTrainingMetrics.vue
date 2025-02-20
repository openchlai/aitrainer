<template>
    <div class="metrics-container">
        <h2>Model Training & Fine-Tuning Metrics</h2>
        <p class="goal-text">
            Goal: Evaluate the Whisper model's learning process and efficiency.
        </p>

        <div class="charts">
            <!-- Loss Function (CTC Loss) -->
            <div class="chart-container">
                <h3>Loss Function (CTC Loss) 📉</h3>
                <GChart type="LineChart" :data="lossData" :options="lineChartOptions" />
            </div>

            <!-- Word Error Rate (WER) -->
            <div class="chart-container">
                <h3>Word Error Rate (WER) % 📝</h3>
                <GChart type="LineChart" :data="werData" :options="lineChartOptions" />
            </div>

            <!-- Character Error Rate (CER) -->
            <div class="chart-container">
                <h3>Character Error Rate (CER) % 🔠</h3>
                <GChart type="LineChart" :data="cerData" :options="lineChartOptions" />
            </div>

            <!-- Training Time per Epoch -->
            <div class="chart-container">
                <h3>Training Time per Epoch ⏳</h3>
                <GChart type="BarChart" :data="trainTimeData" :options="barChartOptions" />
            </div>

            <!-- GPU Utilization -->
            <div class="chart-container">
                <h3>GPU Utilization % ⚡</h3>
                <GChart type="PieChart" :data="gpuData" :options="pieChartOptions" />
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
            // Sample Model Training Data
            const trainingMetrics = [
                { epoch: 1, loss: 0.8, wer: 35, cer: 25, train_time: 15, gpu_util: 70 },
                { epoch: 2, loss: 0.6, wer: 30, cer: 20, train_time: 14, gpu_util: 75 },
                { epoch: 3, loss: 0.5, wer: 25, cer: 18, train_time: 13, gpu_util: 80 },
                { epoch: 4, loss: 0.4, wer: 20, cer: 15, train_time: 12, gpu_util: 85 },
                { epoch: 5, loss: 0.3, wer: 15, cer: 10, train_time: 11, gpu_util: 90 }
            ];

            // 🔹 Loss Function (CTC Loss)
            const lossData = ref([
                ["Epoch", "CTC Loss"],
                ...trainingMetrics.map(({ epoch, loss }) => [epoch, loss])
            ]);

            // 🔹 Word Error Rate (WER) %
            const werData = ref([
                ["Epoch", "WER (%)"],
                ...trainingMetrics.map(({ epoch, wer }) => [epoch, wer])
            ]);

            // 🔹 Character Error Rate (CER) %
            const cerData = ref([
                ["Epoch", "CER (%)"],
                ...trainingMetrics.map(({ epoch, cer }) => [epoch, cer])
            ]);

            // 🔹 Training Time per Epoch
            const trainTimeData = ref([
                ["Epoch", "Training Time (s)"],
                ...trainingMetrics.map(({ epoch, train_time }) => [epoch, train_time])
            ]);

            // 🔹 GPU Utilization %
            const gpuData = ref([
                ["GPU Utilization", "Percentage"],
                ["Used", trainingMetrics[trainingMetrics.length - 1].gpu_util], // Latest GPU usage
                ["Available", 100 - trainingMetrics[trainingMetrics.length - 1].gpu_util]
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
                vAxis: { title: "Training Time (s)" },
                colors: ["#34A853"]
            };

            const pieChartOptions = {
                pieHole: 0.4,
                legend: "none",
                colors: ["#EA4335", "#CCCCCC"]
            };

            return {
                lossData,
                werData,
                cerData,
                trainTimeData,
                gpuData,
                lineChartOptions,
                barChartOptions,
                pieChartOptions
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
