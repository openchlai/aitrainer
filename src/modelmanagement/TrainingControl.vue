<template>
    <div>
        <h2>Training Control</h2>
        <button @click="startTraining">Start Training</button>
        <button @click="pauseTraining">Pause</button>
        <button @click="stopTraining">Stop</button>
    </div>
</template>

<script setup>
    const startTraining = () => console.log("Training started");
    const pauseTraining = () => console.log("Training paused");
    const stopTraining = () => console.log("Training stopped");
</script>
