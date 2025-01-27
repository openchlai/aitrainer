<template>
    <div class="model-configuration">
        <h2>Model Configuration</h2>

        <!-- Model Selection -->
        <div class="input-group">
            <label for="model">Select Model:</label>
            <select id="model" v-model="selectedModel">
                <option v-for="model in models" :key="model.id" :value="model.name">
                    {{ model.name }}
                </option>
            </select>
        </div>

        <!-- Hyperparameter: Learning Rate -->
        <div class="input-group">
            <label for="learning-rate">Learning Rate:</label>
            <input type="number" id="learning-rate" v-model.number="learningRate" step="0.0001" min="0" />
        </div>

        <!-- Hyperparameter: Batch Size -->
        <div class="input-group">
            <label for="batch-size">Batch Size:</label>
            <input type="number" id="batch-size" v-model.number="batchSize" min="1" />
        </div>

        <!-- Hyperparameter: Number of Epochs -->
        <div class="input-group">
            <label for="epochs">Number of Epochs:</label>
            <input type="number" id="epochs" v-model.number="epochs" min="1" />
        </div>

        <!-- Submit Button -->
        <button @click="submitConfiguration">Start Training</button>
    </div>
</template>

<script setup>
    import { ref } from 'vue';

    // Sample model options
    const models = [
        { id: 1, name: 'Model A' },
        { id: 2, name: 'Model B' },
        { id: 3, name: 'Model C' },
    ];

    // Reactive state for form inputs
    const selectedModel = ref(models[0].name);
    const learningRate = ref(0.001);
    const batchSize = ref(32);
    const epochs = ref(10);

    const submitConfiguration = () => {
        const configuration = {
            model: selectedModel.value,
            learningRate: learningRate.value,
            batchSize: batchSize.value,
            epochs: epochs.value,
        };
        // Emit the configuration to the parent component or handle it as needed
        console.log('Model Configuration:', configuration);
    };
</script>

<style scoped>
    .model-configuration {
        padding: 20px;
    }

    .input-group {
        margin-bottom: 15px;
    }

    label {
        display: block;
        margin-bottom: 5px;
    }

    input,
    select {
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

    button:hover {
        background-color: #369870;
    }
</style>
