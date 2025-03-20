import { createRouter, createWebHistory } from "vue-router";
import DashboardOverview from "../components/MainDashboard.vue";
import { jwtDecode } from "jwt-decode";
import DatasetManagement from '@/modelmanagement/DatasetManagement.vue';
import ModelConfiguration from '@/modelmanagement/ModelConfiguration.vue';
import TrainingControl from '@/modelmanagement/TrainingControl.vue';
import TrainingProgress from '@/modelmanagement/TrainingProgress.vue';
import ModelEvaluation from '@/modelmanagement/ModelEvaluation.vue';
import Results from '@/modelmanagement/ResultsPage.vue';
import ExperimentTracking from '@/modelmanagement/ExperimentTracking.vue';
import ModelDeployment from '@/modelmanagement/ModelDeployment.vue';
import { useProjectStore } from "@/stores/project"; // Import the project store

// Add ProjectSelector component
const ProjectSelector = () => import("../components/ProjectSelector.vue");

const routes = [
  {
    path: "/",
    name: "home",
    component: DashboardOverview,
    meta: { requiresProject: false }, // No project required for home
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../components/userAuth.vue"),
    meta: { requiresProject: false }, // No project required for login
  },
  {
    path: "/project-selection",
    name: "project-selection",
    component: ProjectSelector,
    meta: { requiresAuth: true, requiresProject: false }, // Auth required but no project
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: () => import("../components/MainDashboard.vue"),
    meta: { requiresAuth: false, requiresProject: true }, // Project required for dashboard
  },
  {
    path: "/deployment",
    name: "deployment",
    component: () => import("../components/ModelDeploymentInterface.vue"),
    meta: { requiresAuth: true, requiresProject: true },
  },
  {
    path: "/feedback",
    name: "feedback",
    component: () => import("../components/UserFeedbackCollections.vue"),
    meta: { requiresAuth: true, requiresProject: true },
  },
  {
    path: '/audio-upload',
    name: 'RawAudioUpload',
    component: () => import('../components/AudioUpload.vue'),
    meta: { requiresAuth: true, requiresProject: true },
  },
  {
    path: '/transcribing/:startIndex/:listType',
    name: 'TranscribingScreen',
    component: () => import('../components/AudioScreen.vue'),
    meta: { requiresAuth: true, requiresProject: true },
  },
  {
    path: '/pre-eval/',
    name: 'PreEvaluationScreen',
    component: () => import('../components/AudioList.vue'),
    meta: { requiresAuth: true, requiresProject: true },
  },
  {
    path: '/pre-eval/evaluate/:startIndex',
    name: 'AudioEvaluationScreen',
    component: () => import('../components/AudioScreen.vue'),
    meta: { requiresAuth: true, requiresProject: true },
  },
  {
    path: '/post-eval/',
    name: 'PostEvaluationScreen',
    component: () => import('../components/ChunkList.vue'),
    meta: { requiresAuth: true, requiresProject: true },
  },
  {
    path: '/post-eval/evaluate/:absoluteIndex',
    name: 'ChunkEvaluationScreen',
    component: () => import('../components/ChunkEvalScreen.vue'),
    meta: { requiresAuth: true, requiresProject: true },
  },
  
  {
    path: "/training-progress",
    name: "training-progress",
    component: () => import("../components/TrainingProgressMonitor.vue"),
    meta: { requiresAuth: true, requiresProject: true },
  },
  {
    path: "/model-evaluation",
    name: "model-evaluation",
    component: () => import("../components/ModelEvaluation.vue"),
    meta: { requiresAuth: true, requiresProject: true },
  },
  {
    path: "/transcription",
    name: "transcription",
    component: () => import("../components/BatchUploader.vue"),
    meta: { requiresAuth: true, requiresProject: true },
  },
  {
    path: "/model-training",
    name: "model-training",
    component: () => import("../components/ModelTraining.vue"),
    meta: { requiresAuth: true, requiresProject: true },
  },
  {
    path: "/manual-transcription/",
    name: "TranscribableList",
    component: () => import("../components/TranscribableList.vue"),
    meta: { requiresAuth: true, requiresProject: true },
  },
  { 
    path: '/manual-transcription/transcribe/:startIndex',
    name: 'ChunkTranscribingScreen',
    component: () => import('../components/TranscribingScreen.vue'),
    meta: { requiresAuth: true, requiresProject: true },
  },
  { 
    path: '/dataset-management', 
    component: DatasetManagement,
    meta: { requiresAuth: true, requiresProject: true },
  },
  { 
    path: '/model-configuration', 
    component: ModelConfiguration,
    meta: { requiresAuth: true, requiresProject: true },
  },
  { 
    path: '/training-control', 
    component: TrainingControl,
    meta: { requiresAuth: true, requiresProject: true },
  },
  { 
    path: '/training-progress', 
    component: TrainingProgress,
    meta: { requiresAuth: true, requiresProject: true },
  },
  { 
    path: '/model-evaluation', 
    component: ModelEvaluation,
    meta: { requiresAuth: true, requiresProject: true },
  },
  { 
    path: '/results', 
    component: Results,
    meta: { requiresAuth: true, requiresProject: true },
  },
  { 
    path: '/experiment-tracking', 
    component: ExperimentTracking,
    meta: { requiresAuth: true, requiresProject: true },
  },
  { 
    path: '/model-deployment', 
    component: ModelDeployment,
    meta: { requiresAuth: true, requiresProject: true },
  },
];

const router = createRouter({
  history: createWebHistory("/"),
  routes,
});

// Navigation Guard for Authentication and Project Selection
router.beforeEach((to, from, next) => {
  // Authentication check
  const token = localStorage.getItem("access_token");
  let isAuthenticated = false;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      const now = Date.now() / 1000; // Convert to seconds
      if (decoded.exp > now) {
        isAuthenticated = true;
      } else {
        localStorage.removeItem("access_token"); // Remove expired token
      }
    } catch (error) {
      console.error("Invalid token:", error);
      localStorage.removeItem("access_token"); // Remove invalid token
    }
  }

  // Initialize project store and check for project selection
  const projectStore = useProjectStore();
  if (isAuthenticated && !projectStore.hasSelectedProject) {
    projectStore.initializeFromStorage();
  }

  // Redirect logic based on auth and project requirements
  if (to.meta.requiresAuth && !isAuthenticated) {
    // Not authenticated -> redirect to login
    next("/login");
  } else if (to.path === "/login" && isAuthenticated) {
    // Already authenticated and trying to access login -> redirect to dashboard
    next("/dashboard");
  } else if (to.meta.requiresProject && !projectStore.hasSelectedProject && isAuthenticated) {
    // Authenticated but no project selected for a route that requires one
    console.log("No project selected, redirecting to project selection");
    next("/project-selection");
  } else {
    // All checks passed or no checks required -> proceed
    next();
  }
});

export default router;