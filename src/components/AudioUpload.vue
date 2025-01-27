<script setup>
    import { ref } from 'vue';

    const files = ref([]);

    const handleFileUpload = (event) => {
        files.value = Array.from(event.target.files);
    };
</script>

<template>
    <div>
        <h2>Upload Audio Files</h2>
        <input type="file" multiple @change="handleFileUpload" accept="audio/*" />
        <ul>
            <li v-for="file in files" :key="file.name">{{ file.name }}</li>
        </ul>
    </div>
</template>
