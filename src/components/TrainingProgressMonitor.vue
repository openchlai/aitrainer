<template>
    <div class="training-progress-monitor">
        <h2>Training Progress</h2>
        <div v-if="isTraining">
            <p>Epoch: {{ currentEpoch }} / {{ totalEpochs }}</p>
            <p>Loss: {{ currentLoss.toFixed(4) }}</p>
            <p>Accuracy: {{ (currentAccuracy * 100).toFixed(2) }}%</p>
            <progress :value="progress" max="100"></progress>
        </div>
        <div v-else>
            <p>Training not started.</p>
        </div>
    </div>
</template>

<script setup>
    import { ref } from 'vue';

    const isTraining = ref(false);
    const currentEpoch = ref(0);
    const totalEpochs = ref(10);
    const currentLoss = ref(0);
    const currentAccuracy = ref(0);
    const progress = ref(0);

    // Mock function to simulate training progress
    const startTraining = () => {
        isTraining.value = true;
        currentEpoch.value = 0;
        currentLoss.value = 0.5;
        currentAccuracy.value = 0.5;
        progress.value = 0;

        const interval = setInterval(() => {
            if (currentEpoch.value < totalEpochs.value) {
                currentEpoch.value++;
                currentLoss.value -= 0.05; // Simulate decreasing loss
                currentAccuracy.value += 0.05; // Simulate increasing accuracy
                progress.value = (currentEpoch.value / totalEpochs.value) * 100;
            } else {
                clearInterval(interval);
                isTraining.value = false;
            }
        }, 1000);
    };

    // Start the mock training process
    startTraining();
</script>

<style scoped>
    .training-progress-monitor {
        padding: 20px;
    }

    progress {
        width: 100%;
        height: 20px;
        margin-top: 10px;
    }
</style>
