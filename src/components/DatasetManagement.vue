<template>
  <div class="dataset-management">
    <h2>Dataset Management</h2>
    
    <!-- Extraction Filter -->
    <div class="filter-container">
      <label for="startDate">From:</label>
      <input type="date" v-model="startDate" class="date-picker" />
      
      <label for="endDate">To:</label>
      <input type="date" v-model="endDate" class="date-picker" />
      
      <label for="extractLanguage">Language:</label>
      <select v-model="extractLanguage" class="filter-dropdown">
        <option value="">All Languages</option>
        <option value="English">English</option>
        <option value="Swahili">Swahili</option>
        <option value="Sheng">Sheng</option>
      </select>
      
      <button class="extract-btn" @click="extractDataset">Extract Transcribed Dataset</button>
    </div>

    <br><br>

    <!-- Search & Filtering Criteria -->
    <div class="filters">
      <label for="searchLanguage">Filter by Language:</label>
      <select v-model="selectedLanguage" class="filter-dropdown">
        <option value="">All Languages</option>
        <option value="English">English</option>
        <option value="Swahili">Swahili</option>
        <option value="Sheng">Sheng</option>
      </select>
    </div>

    <br><br>

    <input type="text" v-model="searchQuery" placeholder="Search dataset..." class="search-bar" />
    
    <div class="dataset-grid">
      <div v-for="dataset in filteredDatasets" :key="dataset.id" class="dataset-card">
        <h3>{{ dataset.name }}</h3>
        <p><strong>Language:</strong> {{ dataset.language }}</p>
        <p><strong>Extracted:</strong> {{ dataset.date }}</p>
        <div class="card-actions">
          <button @click="viewDataset(dataset)">View</button>
          <button @click="downloadDataset(dataset.id)">Download</button>
          <button class="delete-btn" @click="deleteDataset(dataset.id)">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      startDate: "",
      endDate: "",
      extractLanguage: "", // Used for dataset extraction filter
      selectedLanguage: "", // Used for search filter
      searchQuery: "",
      datasets: []
    };
  },
  computed: {
    filteredDatasets() {
      return this.datasets.filter(dataset =>
        dataset.name.toLowerCase().includes(this.searchQuery.toLowerCase()) &&
        (!this.selectedLanguage || dataset.language === this.selectedLanguage) // Filters by search criteria
      );
    }
  },
  methods: {
    async fetchDatasets() {
      try {
        const response = await axios.get('/api/datasets');
        this.datasets = response.data;
      } catch (error) {
        console.error("Error fetching datasets:", error);
      }
    },
    async extractDataset() {
      try {
        const response = await axios.post('/api/extract', {
          startDate: this.startDate,
          endDate: this.endDate,
          language: this.extractLanguage // Only for extraction
        });
        this.datasets.unshift(response.data);
      } catch (error) {
        console.error("Error extracting dataset:", error);
      }
    },
    viewDataset(dataset) {
      alert(`Viewing details for ${dataset.name}`);
    },
    async downloadDataset(id) {
      try {
        const response = await axios.get(`/api/dataset/${id}/download`, {
          responseType: 'blob'
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `dataset_${id}.zip`);
        document.body.appendChild(link);
        link.click();
      } catch (error) {
        console.error("Error downloading dataset:", error);
      }
    },
    async deleteDataset(id) {
      try {
        await axios.delete(`/api/dataset/${id}`);
        this.datasets = this.datasets.filter(dataset => dataset.id !== id);
      } catch (error) {
        console.error("Error deleting dataset:", error);
      }
    }
  },
  mounted() {
    this.fetchDatasets();
  }
};
</script>

<style scoped>
.dataset-management {
  padding: 20px;
  background: #121212;
  color: white;
}

.extract-btn {
  background: #007bff;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 10px;
}

.filters {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-bottom: 15px;
}

.filter-container {
  display: flex;
  justify-content: center;
  gap: 10px;
  align-items: center;
  margin-bottom: 10px;
}

.filter-dropdown {
  padding: 8px;
  border-radius: 5px;
  border: 1px solid gray;
  background: #1a1a1a;
  color: white;
  width: auto;
}

.date-picker {
  padding: 8px;
  border-radius: 5px;
  border: 1px solid gray;
  background: #1a1a1a;
  color: white;
}

.search-bar {
  width: 100%;
  padding: 8px;
  margin-bottom: 15px;
  background: #1a1a1a;
  color: white;
  border: 1px solid gray;
  border-radius: 5px;
}

.dataset-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.dataset-card {
  background: #1a1a1a;
  padding: 15px;
  border-radius: 10px;
  width: 250px;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.1);
  transition: transform 0.2s;
}

.dataset-card:hover {
  transform: scale(1.05);
}

.card-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

button {
  padding: 8px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.delete-btn {
  background: red;
  color: white;
}
</style>
