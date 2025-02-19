import { createRouter, createWebHistory } from "vue-router";
import DashboardOverview from "../components/DashboardOverview.vue";
import { jwtDecode } from "jwt-decode";



const routes = [
  {
    path: "/",
    name: "home",
    component: DashboardOverview, // No auth required
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../components/userAuth.vue"),
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: () => import("../components/MainDashboard.vue"),
    meta: { requiresAuth: false },
  },
  {
    path: "/deployment",
    name: "deployment",
    component: () => import("../components/ModelDeploymentInterface.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/feedback",
    name: "feedback",
    component: () => import("../components/UserFeedbackCollections.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: '/transcribing/:startIndex/:listType',
    name: 'TranscribingScreen',
    component: () => import('../components/AudioScreen.vue'),
    meta: { requiresAuth: true },
  },
  { path: '/pre-eval/',
    name: 'PreEvaluationScreen',
    component: () => import('../components/AudioList.vue'),
    meta: { requiresAuth: true },
  },
  { path: '/pre-eval/evaluate/:startIndex',
    name: 'AudioEvaluationScreen',
    component: () => import('../components/AudioScreen.vue'),
    meta: { requiresAuth: true },
  },
  { path: '/post-eval/',
    name: 'PostEvaluationScreen',
    component: () => import('../components/ChunkList.vue'),
    meta: { requiresAuth: true },
  },
  { path: '/post-eval/evaluate/:absoluteIndex',
    name: 'ChunkEvaluationScreen',
    component: () => import('../components/ChunkEvalScreen.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: "/model-configuration",
    name: "model-configuration",
    component: () => import("../components/ModelConfiguration.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/training-progress",
    name: "training-progress",
    component: () => import("../components/TrainingProgressMonitor.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/model-evaluation",
    name: "model-evaluation",
    component: () => import("../components/ModelEvaluation.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/transcription",
    name: "transcription",
    component: () => import("../components/BatchUploader.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/model-training",
    name: "model-training",
    component: () => import("../components/ModelTraining.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/transcription/:audioId",
    name: "TranscriptionScreen",
    component: () => import("../components/TranscriptionScreen.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/transcribing/:startIndex/:listType",
    name: "TranscribingScreen",
    component: () => import("@/components/TranscriptionScreen.vue"),
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory("/"),
  routes,
});

// Navigation Guard for Authentication
router.beforeEach((to, from, next) => {
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

  if (to.meta.requiresAuth && !isAuthenticated) {
    next("/login");
  } else if (to.path === "/login" && isAuthenticated) {
    next("/dashboard");
  } else {
    next();
  }
});


export default router;
