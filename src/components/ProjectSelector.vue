<template>
  <div class="project-selector">
    <div class="header-actions">
      <h2>Select a Project</h2>
      <button class="create-btn" @click="showCreateForm = true">Create New Project</button>
    </div>
    
    <div v-if="loading" class="loading">
      Loading projects...
    </div>
    
    <div v-else-if="error" class="error">
      {{ error }}
    </div>
    
    <div v-else-if="projects.length === 0" class="no-projects">
      <p>You don't have any projects yet.</p>
      <button class="create-btn" @click="showCreateForm = true">Create Your First Project</button>
    </div>
    
    <div v-else class="projects-list">
      <div 
        v-for="project in projects" 
        :key="project.id" 
        class="project-item"
        :class="{ active: projectStore.currentProjectId === project.id }"
        @click="selectProject(project)"
      >
        <h3>{{ project.name }}</h3>
        <p v-if="project.description">{{ project.description }}</p>
      </div>
    </div>
    
    <!-- Create Project Modal -->
    <div v-if="showCreateForm" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Create New Project</h3>
          <button class="close-btn" @click="showCreateForm = false">&times;</button>
        </div>
        <form @submit.prevent="createProject">
          <div class="form-group">
            <label for="projectName">Project Name*</label>
            <input 
              id="projectName" 
              v-model="newProject.name" 
              type="text" 
              required 
              placeholder="Enter project name"
            />
          </div>
          
          <div class="form-group">
            <label for="projectDescription">Description</label>
            <textarea 
              id="projectDescription" 
              v-model="newProject.description" 
              rows="4" 
              placeholder="Enter project description"
            ></textarea>
          </div>
          
          <div class="modal-actions">
            <button type="button" class="cancel-btn" @click="showCreateForm = false">Cancel</button>
            <button 
              type="submit" 
              class="submit-btn" 
              :disabled="creatingProject || !newProject.name"
            >
              {{ creatingProject ? 'Creating...' : 'Create Project' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useProjectStore } from '@/stores/project';
import apiClient from '@/utils/axios';

const projectStore = useProjectStore();
const router = useRouter();

const projects = ref([]);
const loading = ref(true);
const error = ref(null);
const showCreateForm = ref(false);
const creatingProject = ref(false);

// New project form data
const newProject = reactive({
  name: '',
  description: ''
});

// Fetch available projects
const fetchProjects = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const response = await apiClient.get('transcriptions/projects/');
    projects.value = response.data;
  } catch (err) {
    console.error('Failed to fetch projects:', err);
    error.value = 'Failed to load projects. Please try again.';
  } finally {
    loading.value = false;
  }
};

// Select a project and store in Pinia
const selectProject = async (project) => {
  try {
    // Optionally, you could make an API call to set the active project on the backend
    // await apiClient.post('transcriptions/projects/select', { projectId: project.id });
    
    // Store in Pinia
    projectStore.setProject(project.unique_id, project.name);
    
    // Redirect to dashboard or previous page
    router.push('/dashboard');
  } catch (err) {
    console.error('Error selecting project:', err);
    error.value = 'Failed to select project. Please try again.';
  }
};

// Create a new project
const createProject = async () => {
  if (!newProject.name.trim()) return;
  
  creatingProject.value = true;
  error.value = null;
  
  try {
    // API call to create a new project
    const response = await apiClient.post('transcriptions/projects/', {
      name: newProject.name,
      description: newProject.description || ''
    });
    
    // Add new project to the list
    projects.value.push(response.data);
    
    // Auto-select the newly created project
    selectProject(response.data);
    
    // Reset form and close modal
    newProject.name = '';
    newProject.description = '';
    showCreateForm.value = false;
    
  } catch (err) {
    console.error('Failed to create project:', err);
    error.value = 'Failed to create project. Please try again.';
  } finally {
    creatingProject.value = false;
  }
};

// Reset form when modal is closed
const resetForm = () => {
  newProject.name = '';
  newProject.description = '';
};

onMounted(() => {
  fetchProjects();
});
</script>

<style scoped>
.project-selector {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.create-btn {
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.create-btn:hover {
  background-color: #43a047;
}

.projects-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.project-item {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 15px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.project-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.project-item.active {
  border-color: #4caf50;
  background-color: rgba(76, 175, 80, 0.1);
}

.loading, .error, .no-projects {
  text-align: center;
  margin: 40px 0;
}

.error {
  color: #f44336;
}

.no-projects {
  padding: 40px 0;
}

.no-projects button {
  margin-top: 20px;
}

/* Modal styles */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.modal-content {
  background-color: rgb(90, 86, 86);
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.modal-header {
  padding: 15px 20px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #757575;
}

.form-group {
  padding: 15px 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

.form-group input, 
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 14px;
}

.form-group textarea {
  resize: vertical;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  padding: 15px 20px;
  border-top: 1px solid #e0e0e0;
  gap: 10px;
}

.cancel-btn {
  background-color: #f5f5f5;
  border: 1px solid #e0e0e0;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.submit-btn {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.submit-btn:disabled {
  background-color: #a5d6a7;
  cursor: not-allowed;
}
</style>