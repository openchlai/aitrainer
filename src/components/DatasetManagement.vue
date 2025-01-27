<template>
    <div class="dataset-management">
        <h2>Dataset Management</h2>
        <input type="file" @change="handleFileUpload" accept=".csv, .json" />
        <div v-if="dataset.length">
            <h3>Dataset Preview</h3>
            <table>
                <thead>
                    <tr>
                        <th v-for="(header, index) in headers" :key="index">{{ header }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(row, rowIndex) in dataset.slice(0, 5)" :key="rowIndex">
                        <td v-for="(cell, cellIndex) in row" :key="cellIndex">{{ cell }}</td>
                    </tr>
                </tbody>
            </table>
            <button @click="editDataset">Edit Dataset</button>
        </div>
    </div>
</template>

<script setup>
    import { ref } from 'vue';

    const dataset = ref([]);
    const headers = ref([]);

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target.result;
                if (file.name.endsWith('.csv')) {
                    parseCSV(content);
                } else if (file.name.endsWith('.json')) {
                    parseJSON(content);
                }
            };
            reader.readAsText(file);
        }
    };

    const parseCSV = (content) => {
        const lines = content.split('\n');
        headers.value = lines[0].split(',');
        dataset.value = lines.slice(1).map((line) => line.split(','));
    };

    const parseJSON = (content) => {
        const jsonData = JSON.parse(content);
        headers.value = Object.keys(jsonData[0]);
        dataset.value = jsonData.map((item) => Object.values(item));
    };

    const editDataset = () => {
        // Implement dataset editing functionality here
        alert('Dataset editing functionality is not yet implemented.');
    };
</script>

<style scoped>
    .dataset-management {
        padding: 20px;
    }

    input[type="file"] {
        margin-bottom: 20px;
    }

    table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 20px;
    }

    th,
    td {
        border: 1px solid #ddd;
        padding: 8px;
    }

    th {
        background-color: #f2f2f2;
    }

    button {
        padding: 10px 20px;
        background-color: #42b983;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    button:hover {
        background-color: #369870;
    }
</style>
