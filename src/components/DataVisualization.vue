<script setup>
    import { ref, onMounted } from 'vue';
    import { Chart } from 'chart.js';

    const chartRef = ref(null);
    const chartInstance = ref(null);

    onMounted(() => {
        const ctx = chartRef.value.getContext('2d');
        chartInstance.value = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Epoch 1', 'Epoch 2', 'Epoch 3', 'Epoch 4', 'Epoch 5'],
                datasets: [
                    {
                        label: 'Loss',
                        data: [0.5, 0.4, 0.3, 0.2, 0.1],
                        borderColor: 'blue',
                        fill: false,
                    },
                ],
            },
        });
    });
</script>

<template>
    <div>
        <h2>Training Progress</h2>
        <canvas ref="chartRef" width="400" height="200"></canvas>
    </div>
</template>
