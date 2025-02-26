<template>
    <div>
        <h2>Training Results</h2>
        <p>Final Model Accuracy: {{ results.accuracy }}%</p>
        <button @click="downloadModel">Download Model</button>
    </div>
</template>

<script setup>
    import { ref } from 'vue';

    const results = ref({ accuracy: 92 });

    const downloadModel = () => {
        window.location.href = "/api/download-model";
    };
</script>
