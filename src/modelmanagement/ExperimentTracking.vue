<template>
    <div>
        <h2>Experiment Tracking</h2>
        <ul>
            <li v-for="exp in experiments" :key="exp.id">Run {{ exp.id }} - Accuracy: {{ exp.accuracy }}%</li>
        </ul>
    </div>
</template>

<script setup>
    import { ref } from 'vue';

    const experiments = ref([
        { id: 1, accuracy: 90 },
        { id: 2, accuracy: 92 },
    ]);
</script>
