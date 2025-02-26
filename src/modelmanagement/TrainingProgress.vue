<template>
    <div>
        <h2>Training Progress</h2>
        <ul>
            <li v-for="epoch in progress" :key="epoch.epoch">Epoch {{ epoch.epoch }}: Loss {{ epoch.loss }}, Accuracy {{
                epoch.accuracy }}%</li>
        </ul>
    </div>
</template>

<script setup>
    import { ref } from 'vue';

    const progress = ref([
        { epoch: 1, loss: 0.25, accuracy: 85 },
        { epoch: 2, loss: 0.15, accuracy: 90 },
    ]);
</script>
