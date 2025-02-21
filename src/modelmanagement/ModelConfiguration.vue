<template>
    <div class="model-selection">
        <h2>Select a Model</h2>

        <div v-for="(model, index) in models" :key="index" class="model-card" @click="openModal(model)">
            <h3>{{ model.name }}</h3>
            <p>{{ model.description }}</p>
        </div>

        <!-- Model Configuration Modal (Wizard) -->
        <div v-if="isModalOpen" class="modal-overlay" @click.self="closeModal">
            <div class="modal-content">
                <div class="wizard-container">
                    <h2>{{ selectedModel.name }} - Configuration Wizard</h2>

                    <!-- Step 1: Select Dataset Group -->
                    <div v-if="step === 1" class="wizard-step">
                        <h3>Select Dataset Group</h3>
                        <select v-model="selectedGroup" class="dataset-select">
                            <option value="group1">Group 1 - Interviews</option>
                            <option value="group2">Group 2 - Podcasts</option>
                        </select>
                        <button @click="nextStep" class="next-btn">Next</button>
                    </div>

                    <!-- Step 2: Configure Hyperparameters -->
                    <div v-if="step === 2" class="wizard-step">
                        <h3>Configure Hyperparameters</h3>
                        <label for="learning-rate">Learning Rate:</label>
                        <input type="number" v-model="learningRate" step="0.0001" min="0.0001" max="0.1"
                            class="input-field" />

                        <label for="batch-size">Batch Size:</label>
                        <input type="number" v-model="batchSize" min="1" max="64" class="input-field" />

                        <label for="epochs">Epochs:</label>
                        <input type="number" v-model="epochs" min="1" max="100" class="input-field" />

                        <button @click="previousStep" class="prev-btn">Previous</button>
                        <button @click="nextStep" class="next-btn">Next</button>
                    </div>

                    <!-- Step 3: Preprocessing Options -->
                    <div v-if="step === 3" class="wizard-step">
                        <h3>Preprocessing Options</h3>
                        <label for="normalize">Normalize Audio:</label>
                        <input type="checkbox" v-model="normalizeAudio" class="input-checkbox" />

                        <label for="noise-reduction">Apply Noise Reduction:</label>
                        <input type="checkbox" v-model="noiseReduction" class="input-checkbox" />

                        <button @click="previousStep" class="prev-btn">Previous</button>
                        <button @click="nextStep" class="next-btn">Next</button>
                    </div>

                    <!-- Step 4: Training Options -->
                    <div v-if="step === 4" class="wizard-step">
                        <h3>Training Options</h3>
                        <label for="optimizer">Optimizer:</label>
                        <select v-model="optimizer" class="input-field">
                            <option value="adam">Adam</option>
                            <option value="sgd">SGD</option>
                        </select>

                        <label for="resume-training">Resume Training:</label>
                        <input type="checkbox" v-model="resumeTraining" class="input-checkbox" />

                        <button @click="previousStep" class="prev-btn">Previous</button>
                        <button @click="nextStep" class="next-btn">Next</button>
                    </div>

                    <!-- Step 5: Summary & Start Training -->
                    <div v-if="step === 5" class="wizard-step">
                        <h3>Summary & Start Training</h3>
                        <p><strong>Model:</strong> {{ selectedModel.name }}</p>
                        <p><strong>Dataset Group:</strong> {{ selectedGroup }}</p>
                        <p><strong>Learning Rate:</strong> {{ learningRate }}</p>
                        <p><strong>Batch Size:</strong> {{ batchSize }}</p>
                        <p><strong>Epochs:</strong> {{ epochs }}</p>
                        <p><strong>Preprocessing:</strong> Normalize - {{ normalizeAudio }}, Noise Reduction - {{
                            noiseReduction }}</p>
                        <p><strong>Optimizer:</strong> {{ optimizer }}</p>
                        <p><strong>Resume Training:</strong> {{ resumeTraining }}</p>

                        <button @click="previousStep" class="prev-btn">Previous</button>
                        <button @click="startTraining" class="next-btn">Start Training</button>
                    </div>

                    <!-- Training Status -->
                    <div v-if="isTraining">
                        <p>Status: Training in progress...</p>
                        <progress :value="trainingProgress" max="100"></progress>
                        <p>{{ trainingProgress }}%</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref } from 'vue';

    const models = [
        { name: 'Whisper Base', description: 'Pre-trained Whisper model for transcription.' },
        { name: 'Whisper Fine-tune', description: 'Fine-tuned Whisper model for specialized tasks.' },
    ];

    const selectedModel = ref(null);
    const isModalOpen = ref(false);
    const step = ref(1);
    const selectedGroup = ref('group1');
    const learningRate = ref(0.001);
    const batchSize = ref(16);
    const epochs = ref(10);
    const normalizeAudio = ref(true);
    const noiseReduction = ref(false);
    const optimizer = ref('adam');
    const resumeTraining = ref(false);
    const isTraining = ref(false);
    const trainingProgress = ref(0);

    const openModal = (model) => {
        selectedModel.value = model;
        isModalOpen.value = true;
    };

    const closeModal = () => {
        isModalOpen.value = false;
    };

    const nextStep = () => {
        if (step.value < 5) {
            step.value += 1;
        }
    };

    const previousStep = () => {
        if (step.value > 1) {
            step.value -= 1;
        }
    };

    const startTraining = () => {
        isTraining.value = true;
        const interval = setInterval(() => {
            if (trainingProgress.value < 100) {
                trainingProgress.value += 10;
            } else {
                clearInterval(interval);
                isTraining.value = false;
                alert('Training Completed!');
            }
        }, 1000);
    };
</script>

<style scoped>
    .model-selection {
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: #2c2f36;
        color: #f5f5f5;
        padding: 20px;
    }

    .model-card {
        background-color: #444;
        padding: 20px;
        margin: 10px;
        border-radius: 8px;
        cursor: pointer;
        text-align: center;
    }

    .model-card:hover {
        background-color: #555;
    }

    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .modal-content {
        background-color: #2c2f36;
        padding: 20px;
        border-radius: 8px;
        max-width: 800px;
        width: 100%;
    }

    .wizard-container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
    }

    .wizard-step {
        display: none;
    }

    .wizard-step {
        display: block;
    }

    input,
    select,
    button {
        width: 100%;
        padding: 10px;
        margin: 10px 0;
        border-radius: 4px;
        border: 1px solid #444;
        background-color: #3c4146;
        color: #f5f5f5;
    }

    input[type="checkbox"] {
        width: auto;
    }

    button {
        background-color: #007bff;
        color: white;
        border: none;
        cursor: pointer;
        transition: background-color 0.3s;
    }

    button:disabled {
        background-color: #666;
    }

    button:hover {
        background-color: #0056b3;
    }

    .prev-btn {
        background-color: #f0ad4e;
    }

    .next-btn {
        background-color: #28a745;
    }

    input[type="number"] {
        width: auto;
        display: inline-block;
    }

    input[type="checkbox"] {
        display: inline-block;
        width: auto;
    }
</style>
