import { createRouter, createWebHistory } from "vue-router";
import DashboardOverview from "../components/DashboardOverview.vue";

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
    component: () => import('../components/AudioScreen.vue')
  },
  { path: '/pre-eval/',
    name: 'PreEvaluationScreen',
    component: () => import('../components/AudioList.vue')
  },
  { path: '/pre-eval/evaluate/:startIndex',
    name: 'AudioEvaluationScreen',
    component: () => import('../components/AudioScreen.vue')
  },
  { path: '/post-eval/',
    name: 'PostEvaluationScreen',
    component: () => import('../components/ChunkList.vue')
  },
  { path: '/post-eval/evaluate/:startIndex',
    name: 'ChunkEvaluationScreen',
    component: () => import('../components/ChunkEvalScreen.vue')
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
  const isAuthenticated = !!localStorage.getItem("access_token");

  if (to.meta.requiresAuth && !isAuthenticated) {
    next("/login"); // Redirect to login if not authenticated
  } else if (to.path === "/login" && isAuthenticated) {
    next("/dashboard"); // Prevent logged-in users from accessing login page
  } else {
    next(); // Proceed normally
  }
});

export default router;
