<template>
  <div class="metrics-container">
    <h2>Model Training & Fine-Tuning Metrics</h2>
    <p class="goal-text">
      Goal: Track the Whisper model's learning process and efficiency in real-time.
    </p>

    <!-- Session Selection -->
    <div class="session-selection">
      <label for="session-select">Select Training Session:</label>
      <select id="session-select" v-model="selectedSessionId" @change="handleSessionChange" :disabled="loading">
        <option value="" disabled>Select a session</option>
        <option v-for="session in sessions" :key="session.unique_id" :value="session.unique_id">
          {{ session.model_name }} ({{ formatDate(session.created_at) }})
        </option>
      </select>
      <div v-if="loading" class="loading-indicator">Loading data...</div>
    </div>

    <div v-if="selectedSessionId" class="charts">
      <!-- Training Loss -->
      <div class="chart-container">
        <div class="chart-header">
          <h3>Training Loss 📉</h3>
          <div class="info-button" @click.stop="toggleInfoTooltip('trainingLoss')">?</div>
        </div>
        <div class="info-tooltip" v-if="tooltips.trainingLoss">
          <p>This graph shows how well the model is learning over time. The loss value indicates how many mistakes the model is making—lower numbers are better.</p>
          <p>As training progresses (moving right on the graph), you should ideally see this line trending downward, which means the model is getting better at its task.</p>
          <p>Occasional small spikes are normal, but the overall trend should be downward. If the line flattens out completely, it means the model has stopped improving.</p>
        </div>
        <div class="data-point">Step {{ currentStep }}: {{ currentLoss }}</div>
        <GChart type="LineChart" :data="trainingLossData" :options="lossChartOptions" />
      </div>

      <!-- Gradient Normalization -->
      <div class="chart-container">
        <div class="chart-header">
          <h3>Gradient Normalization 📊</h3>
          <div class="info-button" @click.stop="toggleInfoTooltip('gradNorm')">?</div>
        </div>
        <div class="info-tooltip" v-if="tooltips.gradNorm">
          <p>This graph displays the strength of the adjustments being made to the model during training. Think of it as how big the "corrections" are that the model receives after each batch of data.</p>
          <p>Higher values mean larger adjustments are being made. Early in training, these values are typically larger and should gradually decrease as the model converges toward a solution.</p>
          <p>Extremely large or wildly fluctuating values could indicate instability in training.</p>
        </div>
        <div class="data-point">Step {{ currentStep }}: {{ currentGradNorm }}</div>
        <GChart type="LineChart" :data="gradNormData" :options="gradNormChartOptions" />
      </div>

      <!-- Learning Rate -->
      <div class="chart-container">
        <div class="chart-header">
          <h3>Learning Rate 📈</h3>
          <div class="info-button" @click.stop="toggleInfoTooltip('learningRate')">?</div>
        </div>
        <div class="info-tooltip" v-if="tooltips.learningRate">
          <p>This shows how quickly the model is allowed to make adjustments based on what it learns. Higher values mean bigger, faster changes; lower values mean more cautious, smaller adjustments.</p>
          <p>You'll typically see this start low, increase during a "warm-up" period, and then gradually decrease. This controlled reduction helps the model make precise adjustments as it gets closer to its optimal performance.</p>
        </div>
        <div class="data-point">Step {{ currentStep }}: {{ currentLearningRate }}</div>
        <GChart type="LineChart" :data="learningRateData" :options="learningRateChartOptions" />
      </div>

      <!-- Evaluation Loss -->
      <div class="chart-container">
        <div class="chart-header">
          <h3>Evaluation Loss 🔍</h3>
          <div class="info-button" @click.stop="toggleInfoTooltip('evalLoss')">?</div>
        </div>
        <div class="info-tooltip" v-if="tooltips.evalLoss">
          <p>This graph reveals how well the model performs on data it wasn't trained on. It's the true test of whether your model is actually learning useful patterns or just memorizing its training data.</p>
          <p>Lower values mean better performance. Ideally, this should decrease alongside training loss.</p>
          <p>If training loss goes down but evaluation loss goes up, your model might be overfitting—becoming too specialized to the training data and performing poorly on new data.</p>
        </div>
        <div class="data-point">Step {{ currentEvalStep }}: {{ currentEvalLoss }}</div>
        <GChart type="LineChart" :data="evalLossData" :options="evalLossChartOptions" />
      </div>

      <!-- Evaluation WER -->
      <div class="chart-container">
        <div class="chart-header">
          <h3>Word Error Rate (WER) % 🔠</h3>
          <div class="info-button" @click.stop="toggleInfoTooltip('evalWer')">?</div>
        </div>
        <div class="info-tooltip" v-if="tooltips.evalWer">
          <p>This shows the Word Error Rate—a direct measure of speech recognition accuracy. It represents the percentage of words the model gets wrong when transcribing speech. Lower is better!</p>
          <p>This is the most important metric for a speech recognition model as it directly measures real-world performance.</p>
          <p>A declining WER means your model is getting better at correctly transcribing Swahili speech, which is the ultimate goal of your training.</p>
        </div>
        <div class="data-point">Step {{ currentEvalStep }}: {{ currentEvalWer }}%</div>
        <GChart type="LineChart" :data="evalWerData" :options="evalWerChartOptions" />
      </div>
    </div>

    <div v-if="!selectedSessionId && !loading" class="no-session-message">
      Please select a training session to view metrics
    </div>

    <div class="update-info">
      <span>Last updated: {{ lastUpdated ? formatDateTime(lastUpdated) : 'Never' }}</span>
      <button @click="updateData" :disabled="loading || !selectedSessionId">
        Refresh Now
      </button>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed, onMounted, onUnmounted, watch } from "vue";
import { GChart } from "vue-google-charts";
import apiClient from '../utils/axios.js';

export default defineComponent({
  components: { GChart },
  setup() {
    // State variables
    const sessions = ref([]);
    const selectedSessionId = ref("");
    const loading = ref(false);
    const lastUpdated = ref(null);

    // Tooltip state
    const tooltips = ref({
      trainingLoss: false,
      gradNorm: false,
      learningRate: false,
      evalLoss: false,
      evalWer: false
    });

    // Function to toggle tooltip visibility
    const toggleInfoTooltip = (tooltipId) => {
      // Close all other tooltips
      Object.keys(tooltips.value).forEach(key => {
        if (key !== tooltipId) tooltips.value[key] = false;
      });
      // Toggle the selected tooltip
      tooltips.value[tooltipId] = !tooltips.value[tooltipId];
    };

    // Click outside to close tooltips
    const closeAllTooltips = (event) => {
      // If the click is not on an info button, close all tooltips
      if (!event.target.classList.contains('info-button')) {
        Object.keys(tooltips.value).forEach(key => {
          tooltips.value[key] = false;
        });
      }
    };

    // Data for each chart
    const trainingLossData = ref([["Step", "Loss"]]);
    const gradNormData = ref([["Step", "Gradient Norm"]]);
    const learningRateData = ref([["Step", "Learning Rate"]]);
    const evalLossData = ref([["Step", "Evaluation Loss"]]);
    const evalWerData = ref([["Step", "WER (%)"]]);
    
    // Current values for display
    const currentStep = ref("N/A");
    const currentLoss = ref("N/A");
    const currentGradNorm = ref("N/A");
    const currentLearningRate = ref("N/A");
    const currentEvalStep = ref("N/A");
    const currentEvalLoss = ref("N/A");
    const currentEvalWer = ref("N/A");
    
    // Store the timer reference
    let updateTimer = null;

    // Create chart options with specific y-axis titles
    const createChartOptions = (yAxisTitle, currentStepValue) => {
      return {
        curveType: "function",
        legend: { position: "bottom" },
        hAxis: { 
          title: "Step",
          format: '0',  // Display as integers
          gridlines: { count: 6 }
        },
        vAxis: { 
          title: yAxisTitle,
        },
        colors: ["#4285F4"],
        animation: {
          startup: true,
          duration: 1000,
          easing: 'out'
        },
        interpolateNulls: true, // Try to connect points even with missing data
        pointSize: 6, // Make data points more visible
        pointShape: 'circle',
        // Add vertical line for current step (if available)
        ...(currentStepValue !== "N/A" ? {
          annotations: {
            vertical: [{
              value: currentStepValue,
              color: '#EA4335',
              strokeWidth: 2,
              opacity: 0.5,
              textStyle: {
                color: '#EA4335',
                fontSize: 10
              }
            }]
          }
        } : {})
      };
    };

    // Computed chart options with current step indicators
    const lossChartOptions = computed(() => createChartOptions("Loss", currentStep.value));
    const gradNormChartOptions = computed(() => createChartOptions("Gradient Norm", currentStep.value));
    const learningRateChartOptions = computed(() => createChartOptions("Learning Rate", currentStep.value));
    const evalLossChartOptions = computed(() => createChartOptions("Evaluation Loss", currentEvalStep.value));
    const evalWerChartOptions = computed(() => createChartOptions("WER (%)", currentEvalStep.value));
    

    // Format date for display in dropdown
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    };

    // Format date and time for last updated display
    const formatDateTime = (date) => {
      return date.toLocaleString();
    };

    // Function to fetch available sessions
    const fetchSessions = async () => {
      loading.value = true;
      try {
        // Use the endpoint for sessions (adjust if needed)
        const response = await apiClient.get("/train/sessions/");
        
        const data = response.data;
        sessions.value = data;
        
        // If there are sessions and none selected yet, select the most recent one
        if (data.length > 0 && !selectedSessionId.value) {
          // Sort by created_at in descending order and pick the first one
          const sortedSessions = [...data].sort((a, b) => 
            new Date(b.created_at) - new Date(a.created_at)
          );
          selectedSessionId.value = sortedSessions[0].unique_id;
          handleSessionChange();
        }
      } catch (error) {
        console.error('Failed to fetch sessions:', error);
      } finally {
        loading.value = false;
      }
    };

    // Function to fetch training progress data
    const fetchTrainingProgress = async () => {
      if (!selectedSessionId.value) return;
      
      loading.value = true;
      try {
        const response = await apiClient.get(`/train/sessions/${selectedSessionId.value}/progress/`);
        
        const data = response.data;
        
        // Sort data by step to ensure chronological order
        data.sort((a, b) => a.step - b.step);
        
        // Update chart data
        trainingLossData.value = [
          ["Step", "Loss"],
          ...data.map(item => [item.step, item.loss])
        ];
        
        gradNormData.value = [
          ["Step", "Gradient Norm"],
          ...data.map(item => [item.step, item.grad_norm])
        ];
        
        learningRateData.value = [
          ["Step", "Learning Rate"],
          ...data.map(item => [item.step, item.learning_rate])
        ];
        
        // Update current values if data exists
        if (data.length > 0) {
          const latestData = data[data.length - 1];
          currentStep.value = latestData.step;
          currentLoss.value = latestData.loss.toFixed(6);
          currentGradNorm.value = latestData.grad_norm.toFixed(5);
          currentLearningRate.value = latestData.learning_rate.toExponential(8);
        }
        
      } catch (error) {
        console.error('Failed to fetch training progress:', error);
      } finally {
        loading.value = false;
      }
    };

    // Function to fetch evaluation data
    const fetchEvaluationData = async () => {
      if (!selectedSessionId.value) return;
      
      loading.value = true;
      try {
        const response = await apiClient.get(`/train/sessions/${selectedSessionId.value}/evaluation/`);
        
        const data = response.data;
        
        // Sort data by step to ensure chronological order
        data.sort((a, b) => a.step - b.step);
        
        // Update chart data
        evalLossData.value = [
          ["Step", "Evaluation Loss"],
          ...data.map(item => [item.step, item.eval_loss])
        ];
        
        evalWerData.value = [
          ["Step", "WER (%)"],
          ...data.map(item => [item.step, item.eval_wer])
        ];
        
        // Update current values if data exists
        if (data.length > 0) {
          const latestData = data[data.length - 1];
          currentEvalStep.value = latestData.step;
          currentEvalLoss.value = latestData.eval_loss.toFixed(4);
          currentEvalWer.value = latestData.eval_wer.toFixed(2);
        }
        
      } catch (error) {
        console.error('Failed to fetch evaluation data:', error);
      } finally {
        loading.value = false;
      }
    };

    // Handle session change
    const handleSessionChange = () => {
      // Reset charts and current values
      trainingLossData.value = [["Step", "Loss"]];
      gradNormData.value = [["Step", "Gradient Norm"]];
      learningRateData.value = [["Step", "Learning Rate"]];
      evalLossData.value = [["Step", "Evaluation Loss"]];
      evalWerData.value = [["Step", "WER (%)"]];
      
      currentStep.value = "N/A";
      currentLoss.value = "N/A";
      currentGradNorm.value = "N/A";
      currentLearningRate.value = "N/A";
      currentEvalStep.value = "N/A";
      currentEvalLoss.value = "N/A";
      currentEvalWer.value = "N/A";
      
      // Fetch new data
      if (selectedSessionId.value) {
        updateData();
      }
    };

    // Function to update all data
    const updateData = async () => {
      if (!selectedSessionId.value) return;
      
      await Promise.all([
        fetchTrainingProgress(),
        fetchEvaluationData()
      ]);
      
      lastUpdated.value = new Date();
    };

    // Set up the component
    onMounted(() => {
      // Initial fetch of sessions
      fetchSessions();
      
      // Set up timer to fetch data every minute
      updateTimer = setInterval(() => {
        if (selectedSessionId.value) {
          updateData();
        }
      }, 60000); // 60000ms = 1 minute

      // Add document click listener to close tooltips
      document.addEventListener('click', closeAllTooltips);
    });

    // Clean up when component is destroyed
    onUnmounted(() => {
      if (updateTimer) {
        clearInterval(updateTimer);
      }
      
      // Remove document click listener
      document.removeEventListener('click', closeAllTooltips);
    });

    return {
      sessions,
      selectedSessionId,
      loading,
      lastUpdated,
      trainingLossData,
      gradNormData,
      learningRateData,
      evalLossData,
      evalWerData,
      currentStep,
      currentLoss,
      currentGradNorm,
      currentLearningRate,
      currentEvalStep,
      currentEvalLoss,
      currentEvalWer,
      lossChartOptions,
      gradNormChartOptions,
      learningRateChartOptions,
      evalLossChartOptions,
      evalWerChartOptions,
      tooltips,
      toggleInfoTooltip,
      formatDate,
      formatDateTime,
      handleSessionChange,
      updateData
    };
  }
});
</script>

<style scoped>
.metrics-container {
  font-family: Arial, sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h2 {
  color: #333;
  text-align: center;
  margin-bottom: 10px;
}

.goal-text {
  font-size: 14px;
  color: #555;
  text-align: center;
  margin-bottom: 20px;
}

.session-selection {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

select {
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid #ddd;
  background-color: white;
  min-width: 300px;
  font-size: 14px;
}

.session-selection label {
  font-size: 14px;
  color: #666;
}

.session-selection select {
  font-size: 14px;
  color: #333;
}

.loading-indicator {
  font-size: 14px;
  color: #666;
  margin-left: 10px;
}

.charts {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.chart-container {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 15px;
  transition: transform 0.3s ease;
  position: relative;
}

.chart-container:hover {
  transform: translateY(-5px);
}

.chart-header {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  margin-bottom: 15px;
}

.chart-header h3 {
  margin: 0;
  color: #444;
  font-size: 16px;
}

.info-button {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #4285F4;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  font-size: 14px;
  cursor: pointer;
  margin-left: 10px;
  user-select: none;
}

.info-button:hover {
  background-color: #3367d6;
}

.info-tooltip {
  position: absolute;
  top: 40px;
  right: 10px;
  left: 10px;
  width: calc(100% - 20px);
  background-color: white;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 12px 16px;
  z-index: 100;
  font-size: 13px;
  line-height: 1.5;
  color: #333;
  text-align: left;
}

.info-tooltip p {
  margin: 8px 0;
}

.info-tooltip p:first-child {
  margin-top: 0;
}

.info-tooltip p:last-child {
  margin-bottom: 0;
}

.data-point {
  position: absolute;
  top: 15px;
  right: 15px;
  background-color: #f0f8ff;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  color: #4285F4;
  font-weight: bold;
}

.no-session-message {
  text-align: center;
  padding: 40px;
  background-color: #fff;
  border-radius: 8px;
  margin-bottom: 20px;
  color: #666;
}

.update-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #666;
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

button {
  background-color: #4285F4;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  background-color: #3367d6;
}

@media (max-width: 768px) {
  .charts {
    grid-template-columns: 1fr;
  }
  
  .session-selection {
    flex-direction: column;
  }
}
</style>