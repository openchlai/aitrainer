import { defineStore } from 'pinia'

export const useProjectStore = defineStore('project', {
  state: () => ({
    currentProjectId: null,
    currentProjectName: null,
  }),
  
  getters: {
    hasSelectedProject: (state) => !!state.currentProjectId,
    projectName: (state) => state.currentProjectName || 'No Project Selected',
  },
  
  actions: {
    setProject(id, name = null) {
      this.currentProjectId = id;
      this.currentProjectName = name;
      
      // Optionally save to localStorage for persistence across page reloads
      localStorage.setItem('currentProjectId', id);
      if (name) localStorage.setItem('currentProjectName', name);
    },
    
    clearProject() {
      this.currentProjectId = null;
      this.currentProjectName = null;
      
      // Clear from localStorage
      localStorage.removeItem('currentProjectId');
      localStorage.removeItem('currentProjectName');
    },
    
    // Initialize from localStorage if available (call in your App.vue setup)
    initializeFromStorage() {
      const id = localStorage.getItem('currentProjectId');
      const name = localStorage.getItem('currentProjectName');
      
      if (id) {
        this.currentProjectId = id;
        this.currentProjectName = name;
      }
    }
  },
  
  // For automatic persistence, you can use pinia-plugin-persistedstate
  // This requires installing the plugin: npm install pinia-plugin-persistedstate
  /* 
  persist: {
    key: 'project-store',
    storage: localStorage,
  },
  */
});