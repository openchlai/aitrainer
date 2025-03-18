<template>
    <div class="dashboard-container ">
      <header class="dashboard-header">
        <h1 class="text-2xl font-bold mb-4">AI Project Metrics Dashboard</h1>
        
        <!-- Pipeline Stage Selection -->
        <div class="stage-selector">
          <label for="stage-select" class="mr-2 font-medium">Pipeline Stage:</label>
          <select 
            id="stage-select" 
            v-model="selectedStage"
            class="select-input"
          >
            <option v-for="(stage, key) in pipelineStages" :key="key" :value="key">
              {{ stage.name }}
            </option>
          </select>
        </div>
      </header>
  
      <!-- Stage Description -->
      <div class="stage-description mb-6">
        <h2 class="text-lg font-semibold mb-2">{{ pipelineStages[selectedStage].name }}</h2>
        <p class="text-gray-600">{{ getStageDescription(selectedStage) }}</p>
      </div>
  
      <!-- Main Content Area -->
      <div class="dashboard-content">
        <component :is="currentComponent" />
      </div>
    </div>
  </template>
  
  <script>
  import { defineComponent, ref, computed } from "vue";
  import DataCollectionMetrics from "@/dashboards/DataCollectionMetrics.vue";
  import DataPreprocessingMetrics from "@/dashboards/DataPreprocessingMetrics.vue";
  import ModelTrainingMetrics from "@/dashboards/ModelTrainingMetrics.vue";
  import ModelEvaluationMetrics from "@/dashboards/ModelEvaluationMetrics.vue";
  import ModelDeploymentMetrics from "@/dashboards/ModelDeploymentMetrics.vue";
  import ContinuosImprovements from "../dashboards/ContinuosImprovements.vue"; // Maintained original spelling
  import LeaderBoards from "../dashboards/LeaderBoards.vue";
  
  export default defineComponent({
    components: {
      DataCollectionMetrics,
      DataPreprocessingMetrics,
      ModelTrainingMetrics,
      ModelEvaluationMetrics,
      ModelDeploymentMetrics,
      ContinuosImprovements, // Maintained original component name
      LeaderBoards,
    },
    setup() {
      const selectedStage = ref("dataCollection");
  
      // Define available pipeline stages with descriptions
      const pipelineStages = {
        dataCollection: { 
          name: "Data Collection & Preparation", 
          component: "DataCollectionMetrics" 
        },
        dataPreprocessing: { 
          name: "Data Preprocessing & Feature Extraction", 
          component: "DataPreprocessingMetrics" 
        },
        modelTraining: { 
          name: "Model Training & Fine-Tuning", 
          component: "ModelTrainingMetrics" 
        },
        modelEvaluation: { 
          name: "Model Evaluation", 
          component: "ModelEvaluationMetrics" 
        },
        modelDeployment: { 
          name: "Model Deployment & Inference", 
          component: "ModelDeploymentMetrics" 
        },
        continousIprovments: { // Maintained original spelling in key
          name: "Continuous Improvements", 
          component: "ContinuosImprovements" // Match the actual component name
        },
        leaderBoards: { 
          name: "Leader Boards", 
          component: "LeaderBoards" 
        },
      };
  
      // Stage descriptions
      const getStageDescription = (stage) => {
        const descriptions = {
          dataCollection: "Metrics related to data gathering, labeling, and initial dataset preparation.",
          dataPreprocessing: "Metrics for data cleaning, normalization, and feature engineering processes.",
          modelTraining: "Performance metrics during model training, including loss curves and hyperparameter tuning.",
          modelEvaluation: "Model accuracy, precision, recall, and other evaluation metrics across test datasets.",
          modelDeployment: "Inference latency, throughput, and resource utilization in production.",
          continousIprovments: "Ongoing model updates, drift detection, and feedback loop metrics.",
          leaderBoards: "Comparative performance metrics across different model versions and approaches."
        };
        return descriptions[stage] || "";
      };
  
      // Dynamically load the selected component
      const currentComponent = computed(() => pipelineStages[selectedStage.value].component);
  
      return {
        selectedStage,
        pipelineStages,
        currentComponent,
        getStageDescription
      };
    }
  });
  </script>
  
  <style>
  .dashboard-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1.5rem;
    background-color: #f9fafb;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    color: #6366f1;
  }
  
  .dashboard-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .stage-selector {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    justify-content: center;
    width: 100%;
    max-width: 500px;
  }
  
  .select-input {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    border-radius: 0.375rem;
    border: 1px solid #d1d5db;
    background-color: white;
    min-width: 250px;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  
  .select-input:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
  }
  
  .stage-description {
    text-align: center;
    max-width: 700px;
    margin: 0 auto;
  }
  
  .dashboard-content {
    background-color: white;
    border-radius: 0.375rem;
    padding: 1.5rem;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  }
  
  /* Responsive styles */
  @media screen and (min-width: 768px) {
    .dashboard-header {
      flex-direction: row;
      justify-content: space-between;
    }
    
    .stage-selector {
      justify-content: flex-end;
    }
  }
  
  @media screen and (max-width: 767px) {
    .dashboard-header h1 {
      margin-bottom: 1rem;
    }
    
    .select-input {
      width: 100%;
    }
  }
  
  @media screen and (max-width: 480px) {
    .dashboard-container {
      padding: 1rem;
    }
    
    .dashboard-content {
      padding: 1rem;
    }
  }
  </style>