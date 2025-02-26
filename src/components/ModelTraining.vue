<script setup>
import { ref } from 'vue';
import * as tf from '@tensorflow/tfjs';

// Reactive state variables
const epochs = ref(10);
const batchSize = ref(32);
const trainingStatus = ref('Not started');
const lossValues = ref([]);
const model = ref(null);
const isTraining = ref(false);
const stopRequested = ref(false);
let trainingHistory;

// Function to load and preprocess data from API
const loadData = async () => {
    try {
        const response = await fetch('https://your-api-endpoint/data'); // Replace with actual API endpoint
        const jsonData = await response.json();
        
        // Validate JSON data structure
        if (!jsonData.features || !jsonData.labels) {
            throw new Error("Invalid data format");
        }

        // Convert JSON data into tensors
        const xs = tf.tensor2d(jsonData.features);
        const ys = tf.tensor2d(jsonData.labels);
        
        return { xs, ys };
    } catch (error) {
        console.error('Error loading data:', error);
        return { xs: null, ys: null };
    }
};

// Function to create and compile the model
const createModel = (inputShape) => {
    const newModel = tf.sequential();
    newModel.add(tf.layers.dense({ units: 10, inputShape: [inputShape], activation: 'relu' }));
    newModel.add(tf.layers.dense({ units: 1 }));
    newModel.compile({ optimizer: 'adam', loss: 'meanSquaredError' });
    return newModel;
};

// Function to train the model with pause, resume, and stop options
const trainModel = async () => {
    trainingStatus.value = 'Training...';
    isTraining.value = true;
    stopRequested.value = false;

    const { xs, ys } = await loadData();
    if (!xs || !ys) {
        trainingStatus.value = "Data loading failed!";
        return;
    }

    model.value = createModel(xs.shape[1]); // Ensure input shape is correct

    for (let epoch = 0; epoch < epochs.value; epoch++) {
        if (stopRequested.value) {
            trainingStatus.value = 'Training stopped';
            isTraining.value = false;
            return;
        }

        while (!isTraining.value) {
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        const history = await model.value.fit(xs, ys, {
            batchSize: batchSize.value,
            epochs: 1,
        });

        lossValues.value.push(history.history.loss[0]);
        console.log(`Epoch ${epoch + 1}: Loss = ${history.history.loss[0]}`);
    }

    trainingStatus.value = 'Training complete!';
    isTraining.value = false;
};

const pauseTraining = () => {
    if (isTraining.value) {
        isTraining.value = false;
        trainingStatus.value = 'Training paused';
    }
};

const resumeTraining = () => {
    if (!isTraining.value) {
        isTraining.value = true;
        trainingStatus.value = 'Training resumed';
    }
};

const stopTraining = () => {
    stopRequested.value = true;
};

const saveModel = async () => {
    if (model.value) {
        await model.value.save('localstorage://my-trained-model');
        alert('Model saved successfully!');
    }
};
</script>

<template>
    <div>
        <h2>Model Training</h2>
        <label>Epochs:</label>
        <input type="number" v-model="epochs" min="1" />
        <label>Batch Size:</label>
        <input type="number" v-model="batchSize" min="1" />
        <br /><br />

        <button @click="trainModel" :disabled="isTraining">Start Training</button>
        <button @click="pauseTraining" :disabled="!isTraining">Pause</button>
        <button @click="resumeTraining" :disabled="isTraining">Resume</button>
        <button @click="stopTraining" :disabled="!isTraining">Stop</button>
        <button @click="saveModel" :disabled="!model">Save Model</button>

        <p>{{ trainingStatus }}</p>

        <div v-if="lossValues.length">
            <h3>Training Loss</h3>
            <ul>
                <li v-for="(loss, index) in lossValues" :key="index">Epoch {{ index + 1 }}: {{ loss }}</li>
            </ul>
        </div>
    </div>
</template>

<style scoped>
button {
    margin: 5px;
    padding: 10px 15px;
    font-size: 16px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

button:disabled {
    background-color: gray;
    cursor: not-allowed;
}

input {
    margin: 5px;
    padding: 5px;
}
</style>
