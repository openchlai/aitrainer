<template>
    <div class="dashboard">
        <h1 class="text-xl font-bold">AI Project Metrics Dashboard</h1>

        <!-- Pipeline Stage Selection -->
        <div class="select-container">
            <label for="stage-select">Select Pipeline Stage:</label>
            <select id="stage-select" v-model="selectedStage">
                <option v-for="(stage, key) in pipelineStages" :key="key" :value="key">
                    {{ stage.name }}
                </option>
            </select>
        </div>

        <!-- Dynamic Component Rendering -->
        <component :is="currentComponent" />
    </div>
</template>

<script>
    import { defineComponent, ref, computed } from "vue";
    import DataCollectionMetrics from "@/dashboards/DataCollectionMetrics.vue";
    import DataPreprocessingMetrics from "@/dashboards/DataPreprocessingMetrics.vue";
    import ModelTrainingMetrics from "@/dashboards/ModelTrainingMetrics.vue";
    import ModelEvaluationMetrics from "@/dashboards/ModelEvaluationMetrics.vue";
    import ModelDeploymentMetrics from "@/dashboards/ModelDeploymentMetrics.vue";
    import ContinuosImprovements from "../dashboards/ContinuosImprovements.vue";
    import LeaderBoards from "../dashboards/LeaderBoards.vue";

    export default defineComponent({
        components: {
            DataCollectionMetrics,
            DataPreprocessingMetrics,
            ModelTrainingMetrics,
            ModelEvaluationMetrics,
            ModelDeploymentMetrics,
            ContinuosImprovements,
            LeaderBoards,
        },
        setup() {
            const selectedStage = ref("dataCollection");

            // Define available pipeline stages
            const pipelineStages = {
                dataCollection: { name: "Data Collection & Preparation", component: "DataCollectionMetrics" },
                dataPreprocessing: { name: "Data Preprocessing & Feature Extraction", component: "DataPreprocessingMetrics" },
                modelTraining: { name: "Model Training & Fine-Tuning", component: "ModelTrainingMetrics" },
                modelEvaluation: { name: "Model Evaluation", component: "ModelEvaluationMetrics" },
                modelDeployment: { name: "Model Deployment & Inference", component: "ModelDeploymentMetrics" },
                continousIprovments: { name: "Continuos Improvements", component: "ContinuosImprovements" },
                leaderBoards: { name: "Leader Boards", component: "LeaderBoards" },

            };

            // Dynamically load the selected component
            const currentComponent = computed(() => pipelineStages[selectedStage.value].component);

            return {
                selectedStage,
                pipelineStages,
                currentComponent
            };
        }
    });
</script>

<style>
    .dashboard {
        max-width: 1000px;
        margin: auto;
        text-align: center;
        padding: 20px;
    }

    .select-container {
        margin: 20px 0;
    }

    select {
        padding: 10px;
        font-size: 16px;
        border-radius: 5px;
        border: 1px solid #ccc;
    }
</style>
