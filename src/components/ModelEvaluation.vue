<template>
    <div class="model-evaluation">
        <h2>Model Evaluation</h2>

        <!-- File Upload for Test Data -->
        <div class="input-group">
            <label for="test-data">Upload Test Data:</label>
            <input type="file" id="test-data" @change="handleFileUpload" accept=".csv, .json" />
        </div>

        <!-- Evaluation Metrics Display -->
        <div v-if="evaluationMetrics">
            <h3>Evaluation Metrics</h3>
            <ul>
                <li v-for="(value, key) in evaluationMetrics" :key="key">
                    {{ key }}: {{ value }}
                </li>
            </ul>
        </div>

        <!-- Evaluate Button -->
        <button @click="evaluateModel" :disabled="!testData">Evaluate Model</button>
    </div>
</template>

<script setup>
    import { ref } from 'vue';

    const testData = ref(null);
    const evaluationMetrics = ref(null);

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target.result;
                if (file.name.endsWith('.csv')) {
                    testData.value = parseCSV(content);
                } else if (file.name.endsWith('.json')) {
                    testData.value = JSON.parse(content);
                }
            };
            reader.readAsText(file);
        }
    };

    const parseCSV = (content) => {
        const lines = content.split('\n');
        const headers = lines[0].split(',');
        return lines.slice(1).map((line) => {
            const data = line.split(',');
            return headers.reduce((obj, header, index) => {
                obj[header] = data[index];
                return obj;
            }, {});
        });
    };

    const evaluateModel = () => {
        if (!testData.value) {
            alert('Please upload test data before evaluating.');
            return;
        }

        // Mock evaluation logic
        // Replace this with actual model evaluation logic
        evaluationMetrics.value = {
            Accuracy: '95%',
            Precision: '93%',
            Recall: '92%',
            'F1 Score': '92.5%',
        };
    };
</script>

<style scoped>
    .model-evaluation {
        padding: 20px;
    }

    .input-group {
        margin-bottom: 15px;
    }

    label {
        display: block;
        margin-bottom: 5px;
    }

    input[type="file"] {
        width: 100%;
        padding: 8px;
        box-sizing: border-box;
    }

    button {
        padding: 10px 20px;
        background-color: #42b983;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    button:disabled {
        background-color: #ccc;
        cursor: not-allowed;
    }

    button:hover:enabled {
        background-color: #369870;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    li {
        background: #f9f9f9;
        margin: 5px 0;
        padding: 10px;
        border-radius: 4px;
    }
</style>
