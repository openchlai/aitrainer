<template>
    <div>
        <h2>Model Deployment</h2>
        <p>Deployment Status: {{ status }}</p>
        <button @click="deployModel">Deploy Model</button>
    </div>
</template>

<script setup>
    import { ref } from 'vue';

    const status = ref("Not Deployed");

    const deployModel = () => {
        status.value = "Deployed";
    };
</script>
